import type {
  LinkCardStatusVariant,
  LinkCardTodo,
} from "@/features/links/components/link-card/link-card";
import type { LinkListItem, LinkListTodo, LinkStatus } from "@/features/links/types";

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
  statusLabel: string | null;
  statusVariant: LinkCardStatusVariant;
  summaryModelLabel: string | null;
};

/**
 * Returns the in-progress / failed status meta. A (success) is intentionally not surfaced here —
 * successful AI runs are shown via summaryModelLabel ("요약 모델 - {workModel}") next to the title.
 */
function formatLinkStatus(
  status: LinkStatus | null | undefined,
  workModel: string | null | undefined,
): { label: string | null; variant: LinkCardStatusVariant } {
  switch (status) {
    case "G":
      return { label: "AI 생성 중...", variant: "progress" };
    case "F":
      return {
        label: workModel ? `${workModel} 생성 실패` : "AI 생성 실패",
        variant: "error",
      };
    default:
      return { label: null, variant: null };
  }
}

function formatSummaryModelLabel(
  status: LinkStatus | null | undefined,
  workModel: string | null | undefined,
): string | null {
  if (status !== "A" || !workModel) {
    return null;
  }
  return `요약 모델 - ${workModel}`;
}

function mapLinkListItem(item: LinkListItem): MappedLink {
  const domain = getDomainFromUrl(item.url);
  const { label, variant } = formatLinkStatus(item.status, item.workModel);
  return {
    id: item.id,
    domain,
    faviconUrl: getFaviconUrl(item.url),
    title: item.title,
    tags: item.tags,
    todos: item.todos.slice(0, 2).map(mapTodo),
    remainingTodoCount: item.countMoreTodos,
    statusLabel: label,
    statusVariant: variant,
    summaryModelLabel: formatSummaryModelLabel(item.status, item.workModel),
  };
}

export {
  formatDueLabel,
  formatLinkStatus,
  formatSummaryModelLabel,
  getDomainFromUrl,
  getFaviconUrl,
  mapLinkListItem,
  mapTodo,
};
export type { MappedLink };
