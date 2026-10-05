import { spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { Readable, Writable } from "node:stream";
import {
  ClientSideConnection,
  PROTOCOL_VERSION,
  ndJsonStream,
  type Client,
} from "@agentclientprotocol/sdk";

const BUZZ_ADAPTER = path.join(
  os.homedir(),
  "Library/Application Support/Buzz/node-tools/bin/claude-agent-acp",
);
const WORKDIR = path.join(os.tmpdir(), "ria-agentos-assistant");
const TURN_TIMEOUT_MS = 180_000;
const STDERR_TAIL = 4000;

export class AcpSetupError extends Error {
  constructor(
    message: string,
    readonly code: "not_installed" | "not_signed_in" | "failed",
  ) {
    super(message);
  }
}

export function acpCommand() {
  const configured = process.env.ASSISTANT_ACP_COMMAND?.trim();
  if (configured) return configured;
  return existsSync(BUZZ_ADAPTER) ? BUZZ_ADAPTER : null;
}

function subscriptionEnv() {
  const env = { ...process.env };
  delete env.ANTHROPIC_API_KEY;
  delete env.ANTHROPIC_AUTH_TOKEN;
  delete env.ANTHROPIC_BASE_URL;
  return env;
}

function isAuthError(error: unknown) {
  const text = JSON.stringify(error ?? "").toLowerCase();
  return (
    text.includes("auth_required") ||
    text.includes("authentication") ||
    text.includes("not logged in") ||
    text.includes("/login")
  );
}

export async function streamViaAcp({
  systemPrompt,
  prompt,
  model,
}: {
  systemPrompt: string;
  prompt: string;
  model: string;
}): Promise<ReadableStream<Uint8Array>> {
  const command = acpCommand();
  if (!command) {
    throw new AcpSetupError(
      "No ACP adapter found. Install @agentclientprotocol/claude-agent-acp or set ASSISTANT_ACP_COMMAND.",
      "not_installed",
    );
  }

  mkdirSync(WORKDIR, { recursive: true });
  const child = spawn(command, [], {
    cwd: WORKDIR,
    env: subscriptionEnv(),
    stdio: ["pipe", "pipe", "pipe"],
  });

  let stderr = "";
  child.stderr.on("data", (chunk: Buffer) => {
    stderr = (stderr + chunk.toString()).slice(-STDERR_TAIL);
  });

  const exited = new Promise<never>((_, reject) => {
    child.once("error", (error) =>
      reject(
        new AcpSetupError(
          `Could not start the ACP adapter (${error.message}).`,
          "not_installed",
        ),
      ),
    );
    child.once("exit", (code) =>
      reject(
        new AcpSetupError(
          `The ACP adapter exited early (code ${code}).`,
          "failed",
        ),
      ),
    );
  });
  exited.catch(() => {});

  let push: (text: string) => void = () => {};
  const client: Client = {
    sessionUpdate: async (notification) => {
      const update = notification.update;
      if (
        update.sessionUpdate === "agent_message_chunk" &&
        update.content.type === "text"
      ) {
        push(update.content.text);
      }
    },
    requestPermission: async () => ({ outcome: { outcome: "cancelled" } }),
  };

  const connection = new ClientSideConnection(
    () => client,
    ndJsonStream(
      Writable.toWeb(child.stdin) as WritableStream<Uint8Array>,
      Readable.toWeb(child.stdout) as ReadableStream<Uint8Array>,
    ),
  );

  let sessionId: string;
  try {
    await Promise.race([
      connection.initialize({
        protocolVersion: PROTOCOL_VERSION,
        clientCapabilities: {},
        clientInfo: { name: "ria-agentos", version: "1.0.0" },
      }),
      exited,
    ]);
    const session = await Promise.race([
      connection.newSession({
        cwd: WORKDIR,
        mcpServers: [],
        _meta: {
          systemPrompt,
          claudeCode: {
            options: {
              settingSources: [],
              tools: [],
              model,
            },
          },
        },
      }),
      exited,
    ]);
    sessionId = session.sessionId;
  } catch (error) {
    child.kill();
    if (error instanceof AcpSetupError) throw error;
    if (isAuthError(error)) {
      throw new AcpSetupError(
        "Claude Code isn't signed in on this machine. Run `claude` and use /login with your Max account.",
        "not_signed_in",
      );
    }
    console.error("ACP setup failed", error, stderr);
    throw new AcpSetupError("The ACP session could not be started.", "failed");
  }

  const encoder = new TextEncoder();
  let finished = false;

  return new ReadableStream<Uint8Array>({
    start(controller) {
      let wroteText = false;
      push = (text) => {
        if (finished) return;
        wroteText = true;
        controller.enqueue(encoder.encode(text));
      };
      const finish = (note?: string) => {
        if (finished) return;
        if (note) controller.enqueue(encoder.encode(note));
        finished = true;
        controller.close();
        child.kill();
      };
      const timer = setTimeout(() => {
        void connection.cancel({ sessionId }).catch(() => {});
        finish("\n\n(The assistant took too long and was stopped.)");
      }, TURN_TIMEOUT_MS);

      connection
        .prompt({ sessionId, prompt: [{ type: "text", text: prompt }] })
        .then((result) => {
          clearTimeout(timer);
          if (result.stopReason === "refusal") {
            finish("\n\nThe assistant declined to answer this request.");
          } else if (result.stopReason === "max_tokens") {
            finish("\n\n(Response cut off at the length limit.)");
          } else {
            finish();
          }
        })
        .catch((error) => {
          clearTimeout(timer);
          console.error("ACP prompt failed", error, stderr);
          finish(
            isAuthError(error)
              ? "Claude Code isn't signed in on this machine. Run `claude` and use /login with your Max account."
              : wroteText
                ? "\n\n(The response was interrupted. Try again.)"
                : "The assistant could not complete this request. Try again.",
          );
        });
    },
    cancel() {
      finished = true;
      void connection.cancel({ sessionId }).catch(() => {});
      child.kill();
    },
  });
}
