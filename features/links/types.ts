type SourceType = "INPUT" | "QR";

type LinkStatus = "G" | "A" | "F" | "C";

type RepeatDay = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

type CreateLinkTodoRequest = {
  title: string;
  reminderAt?: string | null;
  repeatUntil?: string | null;
  repeatDays?: RepeatDay[] | null;
  repeatTime?: string | null;
  repeatTimezone?: string | null;
};

type CreateLinkRequest = {
  url: string;
  title: string;
  summary?: string;
  tags: string[];
  memo?: string;
  thumbnailUrl?: string;
  sourceType: SourceType;
  folderId?: number | null;
  todos: CreateLinkTodoRequest[];
};

type UpdateLinkRequest = {
  url: string;
  title: string;
  summary?: string | null;
  tags: string[];
  memo?: string | null;
  sourceType: SourceType;
};

type SetLinkFavoriteRequest = {
  isFavorite: boolean;
};

type SetLinkFavoriteResponse = ApiEnvelope<null>;

type CreateLinkResponse = {
  success: boolean;
  data: {
    id: number;
  };
};

type LinkTodo = {
  id: number | string;
  title?: string | null;
  content?: string | null;
  done?: boolean | null;
  completed?: boolean | null;
  completedAt?: string | null;
  reminderAt?: string | null;
  dueAt?: string | null;
  repeatUntil?: string | null;
  repeatDays?: RepeatDay[] | null;
  repeatTime?: string | null;
};

type LinkDetail = {
  id: number;
  url: string;
  title: string;
  summary?: string | null;
  tags: string[];
  memo?: string | null;
  sourceType: SourceType;
  createdAt: string;
  folderId?: number | null;
  folderEmoji?: string | null;
  folderName?: string | null;
  todos: LinkTodo[];
  workModel?: string | null;
  status?: LinkStatus | null;
  isFavorite: boolean;
};

type ApiEnvelope<TData> = {
  success: boolean;
  data: TData;
  error: {
    code: string;
    message: string;
    cause?: string | null;
    causeMessage?: string | null;
  } | null;
};

type LinkDetailResponse = ApiEnvelope<LinkDetail>;
type DeleteLinkResponse = ApiEnvelope<null>;

type LinkListTodo = {
  id: number;
  title: string;
  completedAt?: string | null;
  reminderAt?: string | null;
};

type LinkListItem = {
  id: number;
  folderId?: number | null;
  folderName?: string | null;
  folderEmoji?: string | null;
  url: string;
  title: string;
  tags: string[];
  createdAt: string;
  todos: LinkListTodo[];
  countMoreTodos: number;
  workModel?: string | null;
  status?: LinkStatus | null;
  isFavorite: boolean;
};

type LinkScrollResponse = {
  isEmpty: boolean;
  contents: LinkListItem[];
  nextCursor: string | null;
  hasNext: boolean;
};

type GetLinksResponse = ApiEnvelope<LinkScrollResponse>;

type LinkOrder = "latest" | "earliest" | "laxico" | "similar";

type GetLinksParams = {
  query?: string;
  folderId?: number;
  order?: LinkOrder;
  cursor?: string;
  size?: number;
  isFavorite?: boolean;
};

export type {
  ApiEnvelope,
  CreateLinkRequest,
  CreateLinkResponse,
  CreateLinkTodoRequest,
  DeleteLinkResponse,
  RepeatDay,
  GetLinksParams,
  GetLinksResponse,
  LinkDetail,
  LinkDetailResponse,
  LinkListItem,
  LinkListTodo,
  LinkOrder,
  LinkScrollResponse,
  LinkStatus,
  LinkTodo,
  SetLinkFavoriteRequest,
  SetLinkFavoriteResponse,
  SourceType,
  UpdateLinkRequest,
};
