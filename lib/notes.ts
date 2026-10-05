import type { Account } from "@/data/households";
import type { Note, NoteComment } from "@/data/notes";
import type { ServiceRequest } from "@/data/service-requests";
import type { Task } from "@/data/tasks";
import { TODAY, addDays, formatDate } from "@/lib/households";

export type NoteEntry = {
  id: string;
  kind: "note" | "activity";
  author: string;
  createdAt: string;
  category: string;
  body?: string;
  activity?: string;
  requestId?: string;
  accountIds: string[];
  pinned: boolean;
  comments: NoteComment[];
};

type EntrySources = {
  notes: Note[];
  tasks: Task[];
  serviceRequests: ServiceRequest[];
  comments: Record<string, NoteComment[]>;
  pinnedIds: string[];
};

export function householdNoteEntries(
  householdId: string,
  { notes, tasks, serviceRequests, comments, pinnedIds }: EntrySources,
): NoteEntry[] {
  const entries: Omit<NoteEntry, "pinned" | "comments">[] = [
    ...notes
      .filter((note) => note.householdId === householdId)
      .map((note) => ({
        id: note.id,
        kind: "note" as const,
        author: note.author,
        createdAt: note.createdAt,
        category: note.category,
        body: note.body,
        accountIds: note.accountIds,
      })),
    ...tasks
      .filter(
        (task) =>
          task.householdId === householdId &&
          task.status === "done" &&
          task.completedAt,
      )
      .map((task) => ({
        id: `activity-task-${task.id}`,
        kind: "activity" as const,
        author: task.assignee,
        createdAt: task.completedAt as string,
        category: "Task",
        activity: task.title,
        requestId: task.requestId,
        accountIds: [],
      })),
    ...serviceRequests
      .filter(
        (request) =>
          request.householdId === householdId &&
          request.status === "Done" &&
          request.completedOn,
      )
      .map((request) => ({
        id: `activity-request-${request.id}`,
        kind: "activity" as const,
        author: request.verifiedBy ?? request.owner,
        createdAt: request.completedOn as string,
        category: "Service request",
        activity: `SR-${request.number} ${request.title}`,
        requestId: request.id,
        accountIds: [],
      })),
  ];

  return entries
    .map((entry) => ({
      ...entry,
      pinned: pinnedIds.includes(entry.id),
      comments: comments[entry.id] ?? [],
    }))
    .sort((a, b) =>
      a.pinned === b.pinned
        ? b.createdAt.localeCompare(a.createdAt)
        : a.pinned
          ? -1
          : 1,
    );
}

function formatClock(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

export function formatNoteTime(stamp: string) {
  const [date, time] = stamp.split("T");
  const day =
    date === TODAY
      ? "Today"
      : date === addDays(TODAY, -1)
        ? "Yesterday"
        : formatDate(date);
  return time ? `${day} at ${formatClock(time)}` : day;
}

export function noteTimestamp(now: Date) {
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${TODAY}T${hours}:${minutes}`;
}

export function accountLabel(account: Account) {
  return `${account.registration} · ${account.custodian} •••• ${account.numberLast4}`;
}
