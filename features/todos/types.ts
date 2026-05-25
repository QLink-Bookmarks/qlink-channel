type TodoRequest = {
  linkId: number;
  title: string;
  reminderAt?: string | null;
};

type CreateTodoRequest = TodoRequest;

type UpdateTodoRequest = TodoRequest;

type CompleteTodoRequest = {
  isCompleted: boolean;
};

type CreateTodoResponse = {
  success: boolean;
  data: {
    id: number;
  };
  error: {
    code: string;
    message: string;
    cause?: string | null;
    causeMessage?: string | null;
  } | null;
};

type UpdateTodoResponse = {
  success: boolean;
  data: {
    linkId: number;
    title: string;
    reminderAt?: string | null;
  };
  error: {
    code: string;
    message: string;
    cause?: string | null;
    causeMessage?: string | null;
  } | null;
};

type DeleteTodoResponse = {
  success: boolean;
  data: null;
  error: {
    code: string;
    message: string;
    cause?: string | null;
    causeMessage?: string | null;
  } | null;
};

type CompleteTodoResponse = {
  success: boolean;
  data: {
    completeAt?: string | null;
  } | null;
  error: {
    code: string;
    message: string;
    cause?: string | null;
    causeMessage?: string | null;
  } | null;
};

export type {
  CompleteTodoRequest,
  CompleteTodoResponse,
  CreateTodoRequest,
  CreateTodoResponse,
  DeleteTodoResponse,
  TodoRequest,
  UpdateTodoRequest,
  UpdateTodoResponse,
};
