import { isAxiosError } from "axios";

function getPostErrorStatus(error: unknown): number | undefined {
  return isAxiosError(error) ? error.response?.status : undefined;
}

// The generic post table backs both announcements and feedback, so reading a post
// the current user has no access to (e.g. someone else's feedback) returns 403.
function isPostForbidden(error: unknown): boolean {
  return getPostErrorStatus(error) === 403;
}

function isPostNotFound(error: unknown): boolean {
  return getPostErrorStatus(error) === 404;
}

function getApiErrorMessage(error: unknown): string | undefined {
  if (!isAxiosError(error)) {
    return undefined;
  }
  const data = error.response?.data;
  if (!data || typeof data !== "object" || !("error" in data)) {
    return undefined;
  }
  const detail = (data as { error?: unknown }).error;
  if (!detail || typeof detail !== "object" || !("message" in detail)) {
    return undefined;
  }
  const message = (detail as { message?: unknown }).message;
  return typeof message === "string" && message.trim() ? message : undefined;
}

function formatPostDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

export { formatPostDate, getApiErrorMessage, getPostErrorStatus, isPostForbidden, isPostNotFound };
