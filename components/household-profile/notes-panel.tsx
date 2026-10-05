"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/_ui/button";
import { Checkbox } from "@/components/_ui/checkbox";
import CountBadge from "@/components/_ui/count-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/_ui/dropdown-menu";
import Field from "@/components/_ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/_ui/select";
import Tag from "@/components/_ui/tag";
import OpenItemsList from "./open-items-list";
import { CURRENT_USER, type Household } from "@/data/households";
import { NOTE_CATEGORIES, type NoteCategory } from "@/data/notes";
import type { OpenItem } from "@/lib/open-items";
import {
  accountLabel,
  formatNoteTime,
  householdNoteEntries,
  noteTimestamp,
  type NoteEntry,
} from "@/lib/notes";
import { cn } from "@/lib/utils";
import { useHouseholdsStore } from "@/stores/households-store";
import ChevronDownIcon from "@/public/assets/images/_common/chevron-down.svg";

type View = "notes" | "open-items";

type NotesPanelProps = {
  household: Household;
  items: OpenItem[];
};

const PAGE_SIZE = 5;

const TEXTAREA_CLASS =
  "border-line-strong bg-secondary text-foreground placeholder:text-subtle focus-visible:border-ring ease-power3-out w-full resize-none rounded-lg border px-3 py-2.5 text-[14px] transition-[border-color] duration-150 outline-none";

export default function NotesPanel({ household, items }: NotesPanelProps) {
  const [view, setView] = useState<View>("notes");
  const [composing, setComposing] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const notes = useHouseholdsStore((state) => state.notes);
  const tasks = useHouseholdsStore((state) => state.tasks);
  const serviceRequests = useHouseholdsStore((state) => state.serviceRequests);
  const noteComments = useHouseholdsStore((state) => state.noteComments);
  const pinnedNoteIds = useHouseholdsStore((state) => state.pinnedNoteIds);

  const entries = householdNoteEntries(household.id, {
    notes,
    tasks,
    serviceRequests,
    comments: noteComments,
    pinnedIds: pinnedNoteIds,
  });
  const shown = entries.slice(0, visible);
  const remaining = entries.length - shown.length;

  return (
    <section
      aria-label={view === "notes" ? "Latest notes" : "Open items"}
      className="border-line-strong flex min-w-0 flex-col gap-4 rounded-xl border p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div
          role="group"
          aria-label="Show latest notes or open items"
          className="flex items-center gap-1"
        >
          <Button
            variant={view === "notes" ? "muted" : "ghost"}
            size="sm"
            aria-pressed={view === "notes"}
            onClick={() => setView("notes")}
            className="gap-1.5"
          >
            Latest notes
            <CountBadge>{entries.length}</CountBadge>
          </Button>
          <Button
            variant={view === "open-items" ? "muted" : "ghost"}
            size="sm"
            aria-pressed={view === "open-items"}
            onClick={() => setView("open-items")}
            className="gap-1.5"
          >
            Open items
            <CountBadge>{items.length}</CountBadge>
          </Button>
        </div>
        {view === "notes" && !composing && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setComposing(true)}
          >
            Add note
          </Button>
        )}
      </div>

      {view === "open-items" ? (
        <div className="flex flex-col gap-4">
          <p className="caption-style text-subtle">
            Unconfirmed, stale or overdue records to resolve before the next
            touchpoint.
          </p>
          <OpenItemsList items={items} />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {composing && (
            <NoteComposer
              household={household}
              onDone={() => {
                setComposing(false);
                setVisible((count) => Math.max(count, PAGE_SIZE));
              }}
            />
          )}
          {entries.length === 0 && !composing ? (
            <p className="caption-style text-subtle">
              No notes yet. Add one to capture calls, decisions and follow-ups.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {shown.map((entry) => (
                <NoteCard key={entry.id} entry={entry} household={household} />
              ))}
            </ul>
          )}
          {remaining > 0 && (
            <Button
              variant="subtle"
              size="sm"
              onClick={() => setVisible((count) => count + PAGE_SIZE)}
              className="self-center"
            >
              Show {Math.min(remaining, PAGE_SIZE)} older{" "}
              {Math.min(remaining, PAGE_SIZE) === 1 ? "note" : "notes"}
            </Button>
          )}
        </div>
      )}
    </section>
  );
}

function NoteComposer({
  household,
  onDone,
}: {
  household: Household;
  onDone: () => void;
}) {
  const addNote = useHouseholdsStore((state) => state.addNote);
  const [category, setCategory] = useState<NoteCategory>("General information");
  const [accountIds, setAccountIds] = useState<string[]>([]);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bodyRef.current?.focus();
  }, []);

  function toggleAccount(id: string) {
    setAccountIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function save() {
    const text = body.trim();
    if (!text) {
      setError("Write the note before saving.");
      bodyRef.current?.focus();
      return;
    }
    addNote({
      id: `note-${household.id}-${Date.now()}`,
      householdId: household.id,
      author: CURRENT_USER.name,
      createdAt: noteTimestamp(new Date()),
      category,
      body: text,
      accountIds: household.accounts
        .map((account) => account.id)
        .filter((id) => accountIds.includes(id)),
    });
    onDone();
  }

  return (
    <form
      aria-label="New note"
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
      className="border-line-strong flex flex-col gap-4 rounded-lg border bg-white/2 p-3.5"
    >
      <Field
        label="Note"
        htmlFor="note-body"
        required
        error={error || undefined}
      >
        <textarea
          id="note-body"
          ref={bodyRef}
          value={body}
          onChange={(event) => {
            setBody(event.target.value);
            if (error) setError("");
          }}
          rows={4}
          placeholder="What happened, what was decided, and what happens next."
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "note-body-error" : undefined}
          className={TEXTAREA_CLASS}
        />
      </Field>
      <Field label="Category" htmlFor="note-category">
        <Select
          value={category}
          onValueChange={(value) => setCategory(value as NoteCategory)}
        >
          <SelectTrigger id="note-category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NOTE_CATEGORIES.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      {household.accounts.length > 0 && (
        <fieldset className="flex flex-col gap-2">
          <legend className="caption-style text-soft mb-2">
            Linked accounts
          </legend>
          {household.accounts.map((account) => (
            <label
              key={account.id}
              className="caption-style flex cursor-pointer items-center gap-2.5"
            >
              <Checkbox
                checked={accountIds.includes(account.id)}
                onCheckedChange={() => toggleAccount(account.id)}
              />
              <span className="text-foreground">{account.name}</span>
              <span className="text-subtle">{accountLabel(account)}</span>
            </label>
          ))}
        </fieldset>
      )}
      <div className="flex justify-end gap-2">
        <Button variant="subtle" size="sm" onClick={onDone}>
          Cancel
        </Button>
        <Button variant="primary" size="sm" type="submit">
          Save note
        </Button>
      </div>
    </form>
  );
}

function NoteCard({
  entry,
  household,
}: {
  entry: NoteEntry;
  household: Household;
}) {
  const togglePinnedNote = useHouseholdsStore(
    (state) => state.togglePinnedNote,
  );
  const deleteNote = useHouseholdsStore((state) => state.deleteNote);
  const addNoteComment = useHouseholdsStore((state) => state.addNoteComment);
  const openRequest = useHouseholdsStore((state) => state.openRequest);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [accountsOpen, setAccountsOpen] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [comment, setComment] = useState("");
  const [focusToken, setFocusToken] = useState(0);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const accounts = household.accounts.filter((account) =>
    entry.accountIds.includes(account.id),
  );
  const commentsId = `${entry.id}-comments`;
  const accountsId = `${entry.id}-accounts`;

  useEffect(() => {
    if (focusToken > 0) commentRef.current?.focus();
  }, [focusToken]);

  function postComment() {
    const text = comment.trim();
    if (!text) return;
    addNoteComment(entry.id, {
      id: `comment-${Date.now()}`,
      author: CURRENT_USER.name,
      createdAt: noteTimestamp(new Date()),
      body: text,
    });
    setComment("");
  }

  return (
    <li
      className={cn(
        "border-line-strong flex flex-col rounded-lg border",
        entry.pinned && "bg-white/2",
      )}
    >
      <article
        aria-label={`${entry.kind === "activity" ? "Activity" : "Note"} by ${entry.author}, ${formatNoteTime(entry.createdAt)}`}
        className="flex flex-col gap-3 p-3.5 text-[14px] leading-[1.45]"
      >
        <header className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
          <span className="flex items-center gap-2 font-medium">
            {entry.author}
            {entry.pinned && (
              <Tag tone="amber" size="sm">
                Pinned
              </Tag>
            )}
          </span>
          <time
            dateTime={entry.createdAt}
            className="caption-style text-subtle pt-0.5 tabular-nums"
          >
            {formatNoteTime(entry.createdAt)}
          </time>
        </header>
        {entry.activity ? (
          <p className="text-soft">
            The activity{" "}
            {entry.requestId ? (
              <Button
                variant="link"
                size="none"
                onClick={() => openRequest(entry.requestId as string)}
                className="text-[14px] leading-[1.45] font-medium whitespace-normal"
              >
                {entry.activity}
              </Button>
            ) : (
              <span className="text-foreground font-medium">
                {entry.activity}
              </span>
            )}{" "}
            was completed.
          </p>
        ) : (
          <p className="whitespace-pre-line">{entry.body}</p>
        )}
        {accountsOpen && accounts.length > 0 && (
          <ul
            id={accountsId}
            className="caption-style border-line-strong flex flex-col gap-2 rounded-md border px-3 py-2.5"
          >
            {accounts.map((account) => (
              <li key={account.id} className="flex flex-wrap gap-x-2 gap-y-1">
                <span className="text-foreground">{account.name}</span>
                <span className="text-subtle">{accountLabel(account)}</span>
              </li>
            ))}
          </ul>
        )}
      </article>

      <div className="border-line-strong flex flex-wrap items-center justify-between gap-2 border-t px-3.5 py-2">
        {confirmingDelete ? (
          <div className="caption-style flex w-full flex-wrap items-center justify-between gap-2">
            <span className="text-soft">
              Delete this note and its comments?
            </span>
            <span className="flex gap-2">
              <Button
                variant="subtle"
                size="sm"
                onClick={() => setConfirmingDelete(false)}
              >
                Keep
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => deleteNote(entry.id)}
              >
                Delete
              </Button>
            </span>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-1">
              <Tag tone="neutral" size="sm" className="mr-1">
                {entry.category}
              </Tag>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCommentsOpen(true);
                  setFocusToken((token) => token + 1);
                }}
              >
                Add comment
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1">
                    Actions
                    <ChevronDownIcon aria-hidden className="size-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onSelect={() => togglePinnedNote(entry.id)}>
                    {entry.pinned ? "Unpin" : "Pin to top"}
                  </DropdownMenuItem>
                  {entry.kind === "note" && (
                    <DropdownMenuItem
                      onSelect={() => setConfirmingDelete(true)}
                      className="text-danger"
                    >
                      Delete note
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {accounts.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                aria-expanded={accountsOpen}
                aria-controls={accountsOpen ? accountsId : undefined}
                onClick={() => setAccountsOpen((open) => !open)}
              >
                {accounts.length} linked{" "}
                {accounts.length === 1 ? "account" : "accounts"}
              </Button>
            )}
          </>
        )}
      </div>

      <div className="border-line-strong flex flex-col gap-3 border-t px-3.5 py-2">
        <Button
          variant="ghost"
          size="sm"
          aria-expanded={commentsOpen}
          aria-controls={commentsOpen ? commentsId : undefined}
          onClick={() => setCommentsOpen((open) => !open)}
          className="-ml-[9px] gap-1.5 self-start"
        >
          <ChevronDownIcon
            aria-hidden
            className={cn(
              "ease-power3-out size-3 transition-transform duration-150",
              !commentsOpen && "-rotate-90",
            )}
          />
          Comments ({entry.comments.length})
        </Button>
        {commentsOpen && (
          <div id={commentsId} className="flex flex-col gap-3 pb-1.5">
            {entry.comments.length > 0 && (
              <ul className="flex flex-col gap-3">
                {entry.comments.map((item) => (
                  <li
                    key={item.id}
                    className="border-line-strong flex flex-col gap-1 border-l-2 pl-3"
                  >
                    <span className="caption-style text-subtle">
                      <span className="text-foreground font-medium">
                        {item.author}
                      </span>{" "}
                      · {formatNoteTime(item.createdAt)}
                    </span>
                    <p className="text-[14px] leading-[1.45]">{item.body}</p>
                  </li>
                ))}
              </ul>
            )}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                postComment();
              }}
              className="flex flex-col gap-2"
            >
              <label htmlFor={`${entry.id}-comment`} className="sr-only">
                Add a comment
              </label>
              <textarea
                id={`${entry.id}-comment`}
                ref={commentRef}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={2}
                placeholder="Add a comment"
                className={TEXTAREA_CLASS}
              />
              <Button
                variant="secondary"
                size="sm"
                type="submit"
                disabled={!comment.trim()}
                className="self-end"
              >
                Post comment
              </Button>
            </form>
          </div>
        )}
      </div>
    </li>
  );
}
