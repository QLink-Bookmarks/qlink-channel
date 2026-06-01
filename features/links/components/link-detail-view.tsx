import * as React from "react";
import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from "react-native";

import { Sheet } from "@/components/layout/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { FolderPickerList } from "@/features/folders/components/folder-picker-list";
import { formatWorkStatus } from "@/features/home/lib/link-card-mapper";
import { useDeleteLinkMutation, useUpdateLinkMutation } from "@/features/links/mutations";
import { getLinkDetailQueryKey } from "@/features/links/queries";
import type {
  LinkDetail,
  LinkDetailResponse,
  LinkTodo,
  UpdateLinkRequest,
} from "@/features/links/types";
import {
  type TodoDraftEditorItem,
  TodoDraftListEditor,
} from "@/features/todos/components/todo-draft-list-editor";
import { type WeekdayValue } from "@/features/todos/components/todo-editor/todo-editor";
import {
  useCreateTodoMutation,
  useDeleteTodoMutation,
  useToggleTodoCompletedMutation,
  useUpdateTodoMutation,
} from "@/features/todos/mutations";
import { reportError } from "@/lib/error-reporting";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

import * as Linking from "expo-linking";
import {
  AlarmClock,
  Ellipsis,
  ExternalLink,
  FolderOpen,
  Pencil,
  Share2,
  Star,
  Trash2,
  X,
} from "lucide-react-native/icons";

const defaultWeekdays: WeekdayValue[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function formatDateLabel(value?: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    month: "numeric",
    day: "numeric",
  }).format(date);
}

function formatReminderParts(value?: string | null) {
  if (!value) {
    return {
      dateLabel: "년-월-일",
      timeLabel: "오전 09:00",
    };
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      dateLabel: "년-월-일",
      timeLabel: "오전 09:00",
    };
  }

  return {
    dateLabel: new Intl.DateTimeFormat("ko-KR", {
      day: "numeric",
      month: "numeric",
    }).format(date),
    timeLabel: new Intl.DateTimeFormat("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date),
  };
}

function getTodoTitle(todo: LinkTodo) {
  return todo.title ?? todo.content ?? "할 일";
}

function getTodoDone(todo: LinkTodo) {
  return todo.done ?? todo.completed ?? Boolean(todo.completedAt);
}

function buildTodoDrafts(todos: LinkTodo[]): TodoDraftEditorItem[] {
  return todos.map((todo) => {
    const reminderParts = formatReminderParts(todo.reminderAt ?? todo.dueAt);

    return {
      dateLabel: reminderParts.dateLabel,
      id: todo.id,
      mode: (todo.reminderAt ?? todo.dueAt) ? "time" : "none",
      reminderAt: todo.reminderAt ?? todo.dueAt ?? null,
      selectedWeekdays: defaultWeekdays,
      timeLabel: reminderParts.timeLabel,
      title: getTodoTitle(todo),
    };
  });
}

function createEmptyTodoDraft(index: number): TodoDraftEditorItem {
  return {
    dateLabel: "년-월-일",
    id: `draft-${Date.now()}-${index}`,
    mode: "none",
    reminderAt: null,
    selectedWeekdays: defaultWeekdays,
    timeLabel: "오전 09:00",
    title: "",
  };
}

function DetailSection({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="text-sm font-semibold text-muted-foreground">{title}</Text>
        {action}
      </View>
      {children}
    </View>
  );
}

function DetailPlaceholder({ label }: { label: string }) {
  return (
    <View className="rounded-2xl border border-dashed border-border px-4 py-4">
      <Text className="text-sm font-medium text-muted-foreground">{label}</Text>
    </View>
  );
}

function buildUpdateLinkPayload(
  detail: LinkDetail,
  overrides: Partial<Pick<UpdateLinkRequest, "memo" | "summary" | "tags">> = {},
): UpdateLinkRequest {
  // TODO: Switch link detail field updates to PATCH /api/links/{id} when the server exposes partial update support.
  return {
    memo: overrides.memo ?? detail.memo,
    sourceType: detail.sourceType,
    summary: overrides.summary ?? detail.summary,
    tags: overrides.tags ?? detail.tags,
    title: detail.title,
    url: detail.url,
  };
}

function mergeLinkDetail(base: LinkDetail, incoming: Partial<LinkDetail>): LinkDetail {
  return {
    ...base,
    ...incoming,
    folderEmoji: incoming.folderEmoji ?? base.folderEmoji ?? null,
    folderName: incoming.folderName ?? base.folderName ?? null,
    memo: incoming.memo ?? base.memo ?? null,
    summary: incoming.summary ?? base.summary ?? null,
    tags: incoming.tags ?? base.tags ?? [],
    todos: incoming.todos ?? base.todos ?? [],
  };
}

function ActionButton({
  label,
  icon,
  variant = "outline",
  onPress,
}: {
  label: string;
  icon: React.ComponentProps<typeof Icon>["as"];
  variant?: React.ComponentProps<typeof Button>["variant"];
  onPress?: () => void;
}) {
  const iconClassName = variant === "gradient" ? "text-primary-foreground" : "text-foreground";

  return (
    <Button
      className="h-11 min-w-0 flex-1 self-auto rounded-2xl"
      variant={variant}
      onPress={onPress}
    >
      <View>
        <Icon
          as={icon}
          size={16}
          className={iconClassName}
        />
      </View>
      <Text>{label}</Text>
    </Button>
  );
}

function LinkDetailView({
  detail,
  mode,
  onClose,
  onDeleted,
}: {
  detail: LinkDetail;
  mode: "panel" | "screen";
  onClose?: () => void;
  onDeleted?: () => void;
}) {
  const queryClient = useQueryClient();
  const memoInputRef = React.useRef<TextInput>(null);
  const updateLinkMutation = useUpdateLinkMutation(detail.id);
  const deleteLinkMutation = useDeleteLinkMutation(detail.id);
  const createTodoMutation = useCreateTodoMutation();
  const updateTodoMutation = useUpdateTodoMutation();
  const deleteTodoMutation = useDeleteTodoMutation();
  const toggleTodoCompletedMutation = useToggleTodoCompletedMutation();
  const tags = React.useMemo(() => detail.tags ?? [], [detail.tags]);
  const todos = React.useMemo(() => detail.todos ?? [], [detail.todos]);
  const dueTodos = todos.filter((todo) => !getTodoDone(todo));
  const [isTagInputVisible, setIsTagInputVisible] = React.useState(false);
  const [tagDraft, setTagDraft] = React.useState("");
  const [isTagEditMode, setIsTagEditMode] = React.useState(false);
  const [pendingTagName, setPendingTagName] = React.useState<string | null>(null);
  const [isFolderMoveOpen, setIsFolderMoveOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isMemoEditing, setIsMemoEditing] = React.useState(false);
  const [memoDraft, setMemoDraft] = React.useState(detail.memo ?? "");
  const [isTodoEditorOpen, setIsTodoEditorOpen] = React.useState(false);
  const [pendingTodoIds, setPendingTodoIds] = React.useState<string[]>([]);
  const [todoDrafts, setTodoDrafts] = React.useState<TodoDraftEditorItem[]>(() =>
    buildTodoDrafts(todos),
  );
  const [todoEditorError, setTodoEditorError] = React.useState<string | null>(null);

  const workStatusMeta = React.useMemo(
    () => formatWorkStatus(detail.workStatus, detail.workModel),
    [detail.workModel, detail.workStatus],
  );

  const isTodoMutationPending =
    createTodoMutation.isPending || updateTodoMutation.isPending || deleteTodoMutation.isPending;
  const hasInvalidTodoDraft = todoDrafts.some((todo) => !todo.title.trim());

  React.useEffect(() => {
    setMemoDraft(detail.memo ?? "");
  }, [detail.memo]);

  React.useEffect(() => {
    if (!isTodoEditorOpen) {
      setTodoDrafts(buildTodoDrafts(todos));
      setTodoEditorError(null);
    }
  }, [isTodoEditorOpen, todos]);

  React.useEffect(() => {
    if (!isMemoEditing) {
      return;
    }

    const timeoutId = setTimeout(() => {
      memoInputRef.current?.focus();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [isMemoEditing]);

  const handleDetailUpdated = React.useCallback(
    (response: LinkDetailResponse) => {
      queryClient.setQueryData<LinkDetail>(getLinkDetailQueryKey(detail.id), (currentDetail) =>
        mergeLinkDetail(currentDetail ?? detail, response.data as Partial<LinkDetail>),
      );
    },
    [detail, queryClient],
  );

  const refreshDetail = React.useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: getLinkDetailQueryKey(detail.id),
    });
  }, [detail.id, queryClient]);

  const handleTodoCompletedChange = React.useCallback(
    async (todoId: number | string, checked: boolean) => {
      const todoKey = String(todoId);

      if (pendingTodoIds.includes(todoKey)) {
        return;
      }

      const queryKey = getLinkDetailQueryKey(detail.id);
      const previousDetail = queryClient.getQueryData<LinkDetail>(queryKey) ?? detail;

      setPendingTodoIds((currentIds) => [...currentIds, todoKey]);

      queryClient.setQueryData<LinkDetail>(queryKey, (currentDetail) => {
        const baseDetail = currentDetail ?? previousDetail;

        return {
          ...baseDetail,
          todos: (baseDetail.todos ?? []).map((todo) =>
            String(todo.id) === String(todoId)
              ? {
                  ...todo,
                  completed: checked,
                  completedAt: checked ? (todo.completedAt ?? new Date().toISOString()) : null,
                  done: checked,
                }
              : todo,
          ),
        };
      });

      try {
        const response = await toggleTodoCompletedMutation.mutateAsync({
          payload: { isCompleted: checked },
          todoId,
        });

        queryClient.setQueryData<LinkDetail>(queryKey, (currentDetail) => {
          const baseDetail = currentDetail ?? previousDetail;

          return {
            ...baseDetail,
            todos: (baseDetail.todos ?? []).map((todo) =>
              String(todo.id) === String(todoId)
                ? {
                    ...todo,
                    completed: checked,
                    completedAt: checked ? (response.data?.completeAt ?? null) : null,
                    done: checked,
                  }
                : todo,
            ),
          };
        });

        await refreshDetail();
      } catch (error: unknown) {
        queryClient.setQueryData(queryKey, previousDetail);
        reportError(error, {
          area: "link-detail-view:toggle-todo-completed",
          extra: { isCompleted: checked, linkId: detail.id, todoId },
        });
      } finally {
        setPendingTodoIds((currentIds) => currentIds.filter((id) => id !== todoKey));
      }
    },
    [detail, pendingTodoIds, queryClient, refreshDetail, toggleTodoCompletedMutation],
  );

  const handleOpenOriginal = React.useCallback(() => {
    if (process.env.EXPO_OS === "web") {
      globalThis.open?.(detail.url, "_blank", "noopener,noreferrer");
      return;
    }

    Linking.openURL(detail.url);
  }, [detail.url]);

  const handleShowTagInput = React.useCallback(() => {
    setIsTagInputVisible(true);
    setTagDraft("");
    setIsTagEditMode(false);
  }, []);

  const handleTagCreateBlur = React.useCallback(async () => {
    const nextTag = tagDraft.trim();
    setIsTagInputVisible(false);

    if (!nextTag) {
      setTagDraft("");
      return;
    }

    setPendingTagName(nextTag);

    try {
      const response = await updateLinkMutation.mutateAsync(
        buildUpdateLinkPayload(detail, {
          tags: [...tags, nextTag],
        }),
      );

      handleDetailUpdated(response);
    } catch (error: unknown) {
      reportError(error, {
        area: "link-detail-view:add-tag",
        extra: { linkId: detail.id, tag: nextTag },
      });
    } finally {
      setPendingTagName(null);
      setTagDraft("");
    }
  }, [detail, handleDetailUpdated, tagDraft, tags, updateLinkMutation]);

  const handleTagRemove = React.useCallback(
    async (tagToRemove: string) => {
      setPendingTagName(tagToRemove);

      try {
        const response = await updateLinkMutation.mutateAsync(
          buildUpdateLinkPayload(detail, {
            tags: tags.filter((tag) => tag !== tagToRemove),
          }),
        );

        handleDetailUpdated(response);
        if (tags.length <= 1) {
          setIsTagEditMode(false);
        }
      } catch (error: unknown) {
        reportError(error, {
          area: "link-detail-view:remove-tag",
          extra: { linkId: detail.id, tag: tagToRemove },
        });
      } finally {
        setPendingTagName(null);
      }
    },
    [detail, handleDetailUpdated, tags, updateLinkMutation],
  );

  const handleDeleteLink = React.useCallback(async () => {
    if (deleteLinkMutation.isPending) {
      return;
    }

    try {
      await deleteLinkMutation.mutateAsync();
      setIsDeleteDialogOpen(false);
      onDeleted?.();
    } catch (error: unknown) {
      reportError(error, {
        area: "link-detail-view:delete-link",
        extra: { linkId: detail.id },
      });
    }
  }, [deleteLinkMutation, detail.id, onDeleted]);

  const handleMemoEditStart = React.useCallback(() => {
    setMemoDraft(detail.memo ?? "");
    setIsMemoEditing(true);
  }, [detail.memo]);

  const handleMemoEditCancel = React.useCallback(() => {
    setMemoDraft(detail.memo ?? "");
    setIsMemoEditing(false);
  }, [detail.memo]);

  const handleMemoConfirm = React.useCallback(async () => {
    try {
      const response = await updateLinkMutation.mutateAsync(
        buildUpdateLinkPayload(detail, {
          memo: memoDraft.trim() ? memoDraft.trim() : null,
        }),
      );

      handleDetailUpdated(response);
      setMemoDraft(response.data.memo ?? "");
      setIsMemoEditing(false);
    } catch (error: unknown) {
      reportError(error, {
        area: "link-detail-view:update-memo",
        extra: { linkId: detail.id },
      });
    }
  }, [detail, handleDetailUpdated, memoDraft, updateLinkMutation]);

  const handleTodoEditorOpen = React.useCallback(() => {
    setTodoDrafts(buildTodoDrafts(todos));
    setTodoEditorError(null);
    setIsTodoEditorOpen(true);
  }, [todos]);

  const handleTodoEditorClose = React.useCallback(() => {
    if (isTodoMutationPending) {
      return;
    }

    setIsTodoEditorOpen(false);
    setTodoDrafts(buildTodoDrafts(todos));
    setTodoEditorError(null);
  }, [isTodoMutationPending, todos]);

  const handleAddTodoDraft = React.useCallback(() => {
    setTodoDrafts((currentDrafts) => [
      ...currentDrafts,
      createEmptyTodoDraft(currentDrafts.length),
    ]);
  }, []);

  const handleTodoDraftTitleChange = React.useCallback(
    (todoId: number | string, nextTitle: string) => {
      setTodoDrafts((currentDrafts) =>
        currentDrafts.map((todo) => (todo.id === todoId ? { ...todo, title: nextTitle } : todo)),
      );
    },
    [],
  );

  const handleTodoDraftModeChange = React.useCallback(
    (todoId: number | string, nextMode: TodoDraftEditorItem["mode"]) => {
      setTodoDrafts((currentDrafts) =>
        currentDrafts.map((todo) => (todo.id === todoId ? { ...todo, mode: nextMode } : todo)),
      );
    },
    [],
  );

  const handleTodoDraftWeekdaysChange = React.useCallback(
    (todoId: number | string, nextWeekdays: WeekdayValue[]) => {
      setTodoDrafts((currentDrafts) =>
        currentDrafts.map((todo) =>
          todo.id === todoId ? { ...todo, selectedWeekdays: nextWeekdays } : todo,
        ),
      );
    },
    [],
  );

  const handleTodoDraftRemove = React.useCallback((todoId: number | string) => {
    setTodoDrafts((currentDrafts) => currentDrafts.filter((todo) => todo.id !== todoId));
  }, []);

  const handleTodoPickerPress = React.useCallback(() => {
    // TODO: Persist reminderAt and recurring schedule after real date/time picker support is added.
    console.log("link-detail:todo-picker:todo");
  }, []);

  const handleTodoSave = React.useCallback(async () => {
    if (hasInvalidTodoDraft) {
      setTodoEditorError("할 일 제목을 모두 입력해주세요.");
      return;
    }

    setTodoEditorError(null);

    const originalTodosById = new Map(todos.map((todo) => [String(todo.id), todo]));
    const removedTodoIds = todos
      .filter((todo) => !todoDrafts.some((draft) => String(draft.id) === String(todo.id)))
      .map((todo) => todo.id);

    try {
      for (const todoId of removedTodoIds) {
        await deleteTodoMutation.mutateAsync(todoId);
      }

      for (const draft of todoDrafts) {
        const trimmedTitle = draft.title.trim();
        const originalTodo = originalTodosById.get(String(draft.id));

        if (originalTodo) {
          await updateTodoMutation.mutateAsync({
            payload: {
              linkId: detail.id,
              reminderAt: originalTodo.reminderAt ?? originalTodo.dueAt ?? null,
              title: trimmedTitle,
            },
            // TODO: Persist recurring weekday and custom reminder changes when the backend supports them.
            todoId: draft.id,
          });
          continue;
        }

        await createTodoMutation.mutateAsync({
          linkId: detail.id,
          reminderAt: null,
          title: trimmedTitle,
        });
      }

      await refreshDetail();
      setIsTodoEditorOpen(false);
    } catch (error: unknown) {
      setTodoEditorError("할 일 저장에 실패했습니다. 서버 응답을 확인해주세요.");
      reportError(error, {
        area: "link-detail-view:save-todos",
        extra: { linkId: detail.id },
      });
    }
  }, [
    createTodoMutation,
    deleteTodoMutation,
    detail.id,
    todos,
    hasInvalidTodoDraft,
    refreshDetail,
    todoDrafts,
    updateTodoMutation,
  ]);

  const tagRows = tags.map((tag) => (
    <Pressable
      key={tag}
      className="relative z-40"
      delayLongPress={300}
      hitSlop={8}
      onLongPress={() => setIsTagEditMode(true)}
    >
      <Badge
        className="px-3 py-1"
        variant="tag"
      >
        {pendingTagName === tag ? <ActivityIndicator size="small" /> : <Text>{tag}</Text>}
      </Badge>
      {isTagEditMode && pendingTagName !== tag ? (
        <Pressable
          className="absolute -right-2 -top-2 size-5 items-center justify-center rounded-full bg-foreground"
          onPress={() => handleTagRemove(tag)}
        >
          <Icon
            as={X}
            size={12}
            className="text-background"
          />
        </Pressable>
      ) : null}
    </Pressable>
  ));

  const memoAction = isMemoEditing ? (
    <View className="flex-row items-center gap-2">
      <Button
        className="h-8 rounded-xl px-3"
        disabled={updateLinkMutation.isPending}
        size="sm"
        variant="outline"
        onPress={handleMemoEditCancel}
      >
        <Text>취소</Text>
      </Button>
      <Button
        className="h-8 rounded-xl px-3"
        disabled={updateLinkMutation.isPending}
        size="sm"
        onPress={handleMemoConfirm}
      >
        <Text>{updateLinkMutation.isPending ? "저장 중..." : "확인"}</Text>
      </Button>
    </View>
  ) : (
    <Button
      className="h-8 rounded-xl px-3"
      size="sm"
      variant="outline"
      onPress={handleMemoEditStart}
    >
      <Icon
        as={Pencil}
        size={14}
        className="text-foreground"
      />
      <Text>{detail.memo ? "메모 수정" : "메모 추가"}</Text>
    </Button>
  );

  const todoEditorContent = (
    <View className="gap-4">
      <TodoDraftListEditor
        addLabel="할 일 추가"
        todos={todoDrafts}
        onAddTodo={handleAddTodoDraft}
        onChangeTodoTitle={handleTodoDraftTitleChange}
        onChangeTodoMode={handleTodoDraftModeChange}
        onChangeTodoWeekdays={handleTodoDraftWeekdaysChange}
        onRemoveTodo={handleTodoDraftRemove}
        onDatePress={handleTodoPickerPress}
        onTimePress={handleTodoPickerPress}
      />
      {todoEditorError ? (
        <Text className="text-sm font-medium text-destructive">{todoEditorError}</Text>
      ) : null}
      <View className="flex-row justify-end gap-3">
        <Button
          className="h-10"
          disabled={isTodoMutationPending}
          variant="outline"
          onPress={handleTodoEditorClose}
        >
          <Text>취소</Text>
        </Button>
        <Button
          className="h-10"
          disabled={isTodoMutationPending || hasInvalidTodoDraft}
          onPress={handleTodoSave}
        >
          <Text>{isTodoMutationPending ? "저장 중..." : "저장"}</Text>
        </Button>
      </View>
    </View>
  );

  return (
    <>
      <ScrollView
        className={cn("flex-1 bg-background", mode === "screen" && "flex-1")}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className={cn("relative gap-6 px-4 py-5", mode === "panel" && "px-5 py-5")}>
          {isTagEditMode && !isTagInputVisible ? (
            <Pressable
              className="absolute inset-0 z-20"
              onPress={() => setIsTagEditMode(false)}
            />
          ) : null}
          {mode === "panel" ? (
            <View className="flex-row items-start justify-between gap-3">
              <View className="min-w-0 flex-1 gap-1">
                <Text
                  className="text-xs text-muted-foreground"
                  numberOfLines={1}
                >
                  {detail.url}
                </Text>
                <Text className="text-2xl font-bold text-foreground">{detail.title}</Text>
                {workStatusMeta.label ? (
                  <Text
                    className={cn(
                      "text-xs font-semibold",
                      workStatusMeta.variant === "progress" && "text-primary",
                      workStatusMeta.variant === "error" && "text-destructive",
                      workStatusMeta.variant === "success" && "text-muted-foreground",
                    )}
                  >
                    {workStatusMeta.label}
                  </Text>
                ) : null}
              </View>
              <Pressable
                className="size-10 items-center justify-center rounded-2xl border border-border bg-card"
                onPress={onClose}
              >
                <Icon
                  as={X}
                  size={18}
                  className="text-muted-foreground"
                />
              </Pressable>
            </View>
          ) : (
            <View className="gap-1">
              <Text
                className="text-xs text-muted-foreground"
                numberOfLines={2}
              >
                {detail.url}
              </Text>
              <Text className="text-2xl font-bold text-foreground">{detail.title}</Text>
              {workStatusMeta.label ? (
                <Text
                  className={cn(
                    "text-xs font-semibold",
                    workStatusMeta.variant === "progress" && "text-primary",
                    workStatusMeta.variant === "error" && "text-destructive",
                    workStatusMeta.variant === "success" && "text-muted-foreground",
                  )}
                >
                  {workStatusMeta.label}
                </Text>
              ) : null}
            </View>
          )}

          <DetailSection title="한 줄 요약">
            {detail.summary ? (
              <Text className="text-base leading-5 text-foreground">{detail.summary}</Text>
            ) : (
              <DetailPlaceholder label="요약이 아직 없어요" />
            )}
          </DetailSection>

          <View className="relative z-30 gap-3">
            <View className="relative z-40 flex-row items-center gap-1">
              <Text className="text-sm font-semibold text-muted-foreground">태그</Text>
              <IconButton
                className="size-7"
                icon={Ellipsis}
                size="sm"
                variant="ghost"
                hitSlop={8}
                onPress={() => setIsTagEditMode(true)}
              />
            </View>
            <View className="relative z-40 flex-row flex-wrap items-center gap-2">
              {tagRows}
              {pendingTagName && !tags.includes(pendingTagName) ? (
                <Badge
                  className="px-3 py-1"
                  variant="tag"
                >
                  <ActivityIndicator size="small" />
                </Badge>
              ) : null}
              {isTagInputVisible ? (
                <View className="relative z-50 min-w-28 flex-row items-center gap-2 rounded-[10px] border border-border bg-surface-elevated px-3 py-1">
                  <Text className="text-xs font-medium text-muted-foreground">#</Text>
                  <Input
                    autoFocus
                    className="h-7 min-w-16 flex-1 border-0 bg-transparent px-0 py-0 text-sm"
                    value={tagDraft}
                    placeholder="태그"
                    onBlur={handleTagCreateBlur}
                    onChangeText={setTagDraft}
                  />
                </View>
              ) : (
                <Button
                  className="relative z-50 h-8 self-auto rounded-xl px-3"
                  size="sm"
                  variant="outline"
                  onPress={handleShowTagInput}
                >
                  <Text>+ 태그 추가</Text>
                </Button>
              )}
            </View>
          </View>

          <DetailSection title="폴더">
            {detail.folderName ? (
              <Badge
                className="gap-2 self-start px-3 py-1"
                variant="folder"
              >
                <Text>{detail.folderEmoji ?? "📭"}</Text>
                <Text>{detail.folderName}</Text>
              </Badge>
            ) : (
              <Badge
                className="self-start px-3 py-1"
                variant="folder"
              >
                <Text>📭 폴더 없음</Text>
              </Badge>
            )}
          </DetailSection>

          <DetailSection title={`할 일 ${dueTodos.length}개`}>
            <View className="gap-3">
              {todos.length ? (
                todos.map((todo) => {
                  const done = getTodoDone(todo);
                  const dueLabel = formatDateLabel(todo.reminderAt ?? todo.dueAt);

                  return (
                    <View
                      key={todo.id}
                      className="gap-3 rounded-2xl border border-border bg-card px-4 py-4"
                    >
                      <View className="flex-row items-start gap-3">
                        <Checkbox
                          checked={done}
                          disabled={pendingTodoIds.includes(String(todo.id))}
                          onCheckedChange={(checked) =>
                            handleTodoCompletedChange(todo.id, checked === true)
                          }
                          shape="round"
                        />
                        <View className="min-w-0 flex-1 gap-2">
                          <Text
                            className={cn(
                              "text-base font-medium",
                              done && "text-muted-foreground line-through",
                            )}
                          >
                            {getTodoTitle(todo)}
                          </Text>
                          {dueLabel ? (
                            <View className="flex-row items-center gap-1">
                              <Icon
                                as={AlarmClock}
                                size={14}
                                className="text-warning"
                              />
                              <Text className="text-sm font-medium text-warning">{dueLabel}</Text>
                            </View>
                          ) : null}
                        </View>
                      </View>
                    </View>
                  );
                })
              ) : (
                <EmptyState
                  className="rounded-2xl border border-dashed border-border px-4 py-6"
                  description="아직 연결된 할 일이 없다."
                  title="할 일 없음"
                />
              )}
              <Pressable
                className="items-center rounded-2xl border border-dashed border-border px-4 py-4"
                onPress={handleTodoEditorOpen}
              >
                <Text className="font-semibold text-muted-foreground">+ 할 일 추가 / 수정</Text>
              </Pressable>
            </View>
          </DetailSection>

          <DetailSection
            title="메모"
            action={memoAction}
          >
            {isMemoEditing ? (
              <Textarea
                ref={memoInputRef}
                className="min-h-28 rounded-2xl border-border bg-card px-4 py-4 text-base"
                value={memoDraft}
                placeholder="메모를 입력해주세요"
                variant="memo"
                onChangeText={setMemoDraft}
              />
            ) : detail.memo ? (
              <View className="rounded-2xl border border-border bg-card px-4 py-4">
                <Text className="text-base leading-5 text-foreground">{detail.memo}</Text>
              </View>
            ) : (
              <DetailPlaceholder label="메모가 아직 없어요" />
            )}
          </DetailSection>

          <View className="gap-3 pb-2">
            <View className="flex-row flex-wrap gap-3">
              <ActionButton
                icon={ExternalLink}
                label="원본 열기"
                variant="gradient"
                onPress={handleOpenOriginal}
              />
              <ActionButton
                icon={Star}
                label="바로가기 추가"
              />
            </View>
            <View className="flex-row flex-wrap gap-3">
              <ActionButton
                icon={FolderOpen}
                label="폴더 이동"
                onPress={() => setIsFolderMoveOpen(true)}
              />
              <ActionButton
                icon={Share2}
                label="공유"
              />
            </View>
            <ActionButton
              icon={Trash2}
              label="링크 삭제"
              onPress={() => setIsDeleteDialogOpen(true)}
            />
          </View>
        </View>
      </ScrollView>

      {mode === "panel" ? (
        <Dialog
          open={isFolderMoveOpen}
          onOpenChange={setIsFolderMoveOpen}
        >
          <DialogContent className="max-h-[80vh] max-w-md">
            <DialogHeader>
              <DialogTitle>폴더 이동</DialogTitle>
              <DialogDescription>이동할 폴더를 선택해주세요.</DialogDescription>
            </DialogHeader>
            <ScrollView
              className="flex-1"
              contentInsetAdjustmentBehavior="automatic"
              showsVerticalScrollIndicator={false}
            >
              <FolderPickerList
                noneOption={null}
                selectedFolderId={detail.folderId ?? null}
                onSelect={() => {
                  setIsFolderMoveOpen(false);
                }}
              />
            </ScrollView>
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet
          open={isFolderMoveOpen}
          fitContent
          onOpenChange={setIsFolderMoveOpen}
        >
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">폴더 이동</Text>
            <FolderPickerList
              noneOption={null}
              selectedFolderId={detail.folderId ?? null}
              onSelect={() => {
                setIsFolderMoveOpen(false);
              }}
            />
            <Button
              className="h-10 self-stretch"
              variant="outline"
              onPress={() => setIsFolderMoveOpen(false)}
            >
              <Text>닫기</Text>
            </Button>
          </View>
        </Sheet>
      )}

      {mode === "panel" ? (
        <Dialog
          open={isTodoEditorOpen}
          onOpenChange={(open) => {
            if (!open) {
              handleTodoEditorClose();
            } else {
              setIsTodoEditorOpen(true);
            }
          }}
        >
          <DialogContent className="max-h-[80vh] max-w-2xl">
            <DialogHeader>
              <DialogTitle>할 일 추가 / 수정</DialogTitle>
              <DialogDescription>
                반복 요일과 시간 설정 UI는 유지하지만, 현재 서버에서는 제목만 저장합니다.
              </DialogDescription>
            </DialogHeader>
            <ScrollView
              className="flex-1"
              contentInsetAdjustmentBehavior="automatic"
              showsVerticalScrollIndicator={false}
            >
              {todoEditorContent}
            </ScrollView>
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet
          open={isTodoEditorOpen}
          fitContent
          onOpenChange={(open) => {
            if (!open) {
              handleTodoEditorClose();
            } else {
              setIsTodoEditorOpen(true);
            }
          }}
        >
          <View className="gap-2">
            <Text className="text-lg font-semibold text-foreground">할 일 추가 / 수정</Text>
            <Text className="text-sm leading-6 text-muted-foreground">
              반복 요일과 시간 설정 UI는 유지하지만, 현재 서버에서는 제목만 저장합니다.
            </Text>
          </View>
          {todoEditorContent}
        </Sheet>
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>링크를 삭제할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              삭제하면 이 링크 상세를 다시 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row justify-center">
            <AlertDialogCancel className="native:px-3 flex-1 justify-center sm:flex-none">
              <Text className="text-center">취소</Text>
            </AlertDialogCancel>
            <AlertDialogAction
              className="native:px-3 flex-1 justify-center sm:flex-none"
              variant="destructive"
              onPress={handleDeleteLink}
            >
              <Text className="text-center">
                {deleteLinkMutation.isPending ? "삭제 중..." : "삭제"}
              </Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export { LinkDetailView };
