import type { LinkCardTodo } from "@/features/links/components/link-card/link-card";
import type { LinkListItem, LinkListTodo } from "@/features/links/types";

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

function formatDueLabel(reminderAt?: string | null): string | undefined {
  if (!reminderAt) return undefined;
  try {
    const date = new Date(reminderAt);
    if (Number.isNaN(date.getTime())) return undefined;
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${month}/${day} ${hours}:${minutes}`;
  } catch {
    return undefined;
  }
}

function mapTodo(todo: LinkListTodo): LinkCardTodo {
  const overdue =
    Boolean(todo.reminderAt) &&
    !todo.completedAt &&
    new Date(todo.reminderAt as string).getTime() < Date.now();

  return {
    id: String(todo.id),
    text: todo.title,
    done: Boolean(todo.completedAt),
    dueLabel: formatDueLabel(todo.reminderAt),
    overdue,
  };
}

type MappedLink = {
  id: number;
  domain: string;
  faviconUrl?: string;
  title: string;
  tags: string[];
  todos: LinkCardTodo[];
  remainingTodoCount: number;
};

function mapLinkListItem(item: LinkListItem): MappedLink {
  const domain = getDomainFromUrl(item.url);
  return {
    id: item.id,
    domain,
    faviconUrl: getFaviconUrl(item.url),
    title: item.title,
    tags: item.tags,
    todos: item.todos.slice(0, 2).map(mapTodo),
    remainingTodoCount: item.countMoreTodos,
  };
}

export { formatDueLabel, getDomainFromUrl, getFaviconUrl, mapLinkListItem, mapTodo };
export type { MappedLink };
