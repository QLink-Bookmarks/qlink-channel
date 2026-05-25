import { useMutation } from "@tanstack/react-query";

import { createTodo, deleteTodo, toggleTodoCompleted, updateTodo } from "./api";
import type { CompleteTodoRequest, CreateTodoRequest, UpdateTodoRequest } from "./types";

function useCreateTodoMutation() {
  return useMutation({
    mutationFn: (payload: CreateTodoRequest) => createTodo(payload),
  });
}

function useUpdateTodoMutation() {
  return useMutation({
    mutationFn: ({ payload, todoId }: { todoId: number | string; payload: UpdateTodoRequest }) =>
      updateTodo(todoId, payload),
  });
}

function useDeleteTodoMutation() {
  return useMutation({
    mutationFn: (todoId: number | string) => deleteTodo(todoId),
  });
}

function useToggleTodoCompletedMutation() {
  return useMutation({
    mutationFn: ({ payload, todoId }: { todoId: number | string; payload: CompleteTodoRequest }) =>
      toggleTodoCompleted(todoId, payload),
  });
}

export {
  useCreateTodoMutation,
  useDeleteTodoMutation,
  useToggleTodoCompletedMutation,
  useUpdateTodoMutation,
};
