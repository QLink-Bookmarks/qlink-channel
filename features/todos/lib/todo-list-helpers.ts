import type { TodoListItem } from "../types";

type TodoFilter = "all" | "incomplete" | "upcoming" | "overdue" | "completed";

type TodoBucket = "overdue" | "upcoming" | "completed";

function getDomainFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function getFaviconUrl(url: string): string | undefined {
  const domain = getDomainFromUrl(url);
  if (!domain || domain === url) {
    return undefined;
  }
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

function getTodoBucket(todo: TodoListItem, nowMs: number): TodoBucket {
  if (todo.completedAt) {
    return "completed";
  }
  if (todo.reminderAt) {
    const reminderMs = new Date(todo.reminderAt).getTime();
    if (!Number.isNaN(reminderMs) && reminderMs < nowMs) {
      return "overdue";
    }
  }
  return "upcoming";
}

function isOverdue(todo: TodoListItem, nowMs: number): boolean {
  if (todo.completedAt || !todo.reminderAt) {
    return false;
  }
  const reminderMs = new Date(todo.reminderAt).getTime();
  return !Number.isNaN(reminderMs) && reminderMs < nowMs;
}

function formatReminderLabel(
  reminderAt?: string | null,
  options?: { withOverdueSuffix?: boolean },
): string | null {
  if (!reminderAt) {
    return null;
  }
  const date = new Date(reminderAt);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const base = `${month}/${day} ${hours}:${minutes}`;
  const overdue = options?.withOverdueSuffix && date.getTime() < Date.now();
  return overdue ? `${base} (지남)` : base;
}

function filterTodos(todos: TodoListItem[], filter: TodoFilter, nowMs: number): TodoListItem[] {
  return todos.filter((todo) => {
    const bucket = getTodoBucket(todo, nowMs);
    switch (filter) {
      case "all":
        return true;
      case "incomplete":
        return bucket !== "completed";
      case "upcoming":
        return bucket === "upcoming";
      case "overdue":
        return bucket === "overdue";
      case "completed":
        return bucket === "completed";
      default:
        return true;
    }
  });
}

function countTodosByFilter(todos: TodoListItem[], nowMs: number): Record<TodoFilter, number> {
  const counts: Record<TodoFilter, number> = {
    all: todos.length,
    incomplete: 0,
    upcoming: 0,
    overdue: 0,
    completed: 0,
  };
  for (const todo of todos) {
    const bucket = getTodoBucket(todo, nowMs);
    counts[bucket] += 1;
    if (bucket !== "completed") {
      counts.incomplete += 1;
    }
  }
  return counts;
}

function groupTodosByLink(
  todos: TodoListItem[],
): { linkId: number; linkTitle: string; linkUrl: string; todos: TodoListItem[] }[] {
  const map = new Map<
    number,
    { linkId: number; linkTitle: string; linkUrl: string; todos: TodoListItem[] }
  >();
  for (const todo of todos) {
    const existing = map.get(todo.linkId);
    if (existing) {
      existing.todos.push(todo);
    } else {
      map.set(todo.linkId, {
        linkId: todo.linkId,
        linkTitle: todo.linkTitle,
        linkUrl: todo.linkUrl,
        todos: [todo],
      });
    }
  }
  return Array.from(map.values());
}

export {
  countTodosByFilter,
  filterTodos,
  formatReminderLabel,
  getDomainFromUrl,
  getFaviconUrl,
  getTodoBucket,
  groupTodosByLink,
  isOverdue,
};
export type { TodoBucket, TodoFilter };
