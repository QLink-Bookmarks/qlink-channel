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
import { type DateValue } from "@/components/ui/date-picker";
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
import { type TimeValue } from "@/components/ui/time-picker";
import { FolderPickerList } from "@/features/folders/components/folder-picker-list";
import { formatLinkStatus, formatSummaryModelLabel } from "@/features/home/lib/link-card-mapper";
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
import { TodoItem } from "@/features/todos/components/todo-item/todo-item";
import { formatReminderLabel } from "@/features/todos/lib/todo-list-helpers";
import {
  buildScheduleApiFields,
  isScheduleInPast,
  readScheduleFromTodo,
  validateDraft,
} from "@/features/todos/lib/todo-schedule";
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
  Ellipsis,
  ExternalLink,
  FolderOpen,
  Pencil,
  RefreshCw,
  Share2,
  Star,
  Trash2,
  X,
} from "lucide-react-native/icons";

const defaultWeekdays: WeekdayValue[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function getTodoTitle(todo: LinkTodo) {
  return todo.title ?? todo.content ?? "할 일";
}

function getTodoDone(todo: LinkTodo) {
  return todo.done ?? todo.completed ?? Boolean(todo.completedAt);
}

function buildTodoDrafts(todos: LinkTodo[]): TodoDraftEditorItem[] {
  return todos.map((todo) => {
    const schedule = readScheduleFromTodo({
      reminderAt: todo.reminderAt,
      dueAt: todo.dueAt,
      repeatUntil: todo.repeatUntil,
      repeatDays: todo.repeatDays ?? null,
      repeatTime: todo.repeatTime,
    });
    return {
      id: todo.id,
      mode: schedule.mode,
      date: schedule.date,
      time: schedule.time,
      selectedWeekdays: schedule.selectedWeekdays.length
        ? schedule.selectedWeekdays
        : defaultWeekdays,
      title: getTodoTitle(todo),
    };
  });
}

function createEmptyTodoDraft(index: number): TodoDraftEditorItem {
  return {
    id: `draft-${Date.now()}-${index}`,
    mode: "none",
    date: null,
    time: null,
    selectedWeekdays: defaultWeekdays,
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
  overrides: Partial<Pick<UpdateLinkRequest, "isFavorite" | "memo" | "summary" | "tags">> = {},
): UpdateLinkRequest {
  // TODO: Switch link detail field updates to PATCH /api/links/{id} when the server exposes partial update support.
  return {
    isFavorite: overrides.isFavorite ?? detail.isFavorite,
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
  iconClassName: iconClassNameOverride,
  onPress,
}: {
  label: string;
  icon: React.ComponentProps<typeof Icon>["as"];
  variant?: React.ComponentProps<typeof Button>["variant"];
  iconClassName?: string;
  onPress?: () => void;
}) {
  const iconClassName =
    iconClassNameOverride ??
    (variant === "gradient" ? "text-primary-foreground" : "text-foreground");

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

  const linkStatusMeta = React.useMemo(
    () => formatLinkStatus(detail.status, detail.workModel),
    [detail.status, detail.workModel],
  );
  const summaryModelLabel = React.useMemo(
    () => formatSummaryModelLabel(detail.status, detail.workModel),
    [detail.status, detail.workModel],
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

  const handleToggleFavorite = React.useCallback(async () => {
    try {
      const response = await updateLinkMutation.mutateAsync(
        buildUpdateLinkPayload(detail, {
          isFavorite: !detail.isFavorite,
        }),
      );
      handleDetailUpdated(response);
      await queryClient.invalidateQueries({ queryKey: ["links", "list"] });
    } catch (error: unknown) {
      reportError(error, {
        area: "link-detail-view:toggle-favorite",
        extra: { linkId: detail.id, next: !detail.isFavorite },
      });
    }
  }, [detail, handleDetailUpdated, queryClient, updateLinkMutation]);

  const handleDeleteLink = React.useCallback(async () => {
    if (deleteLinkMutation.isPending) {
      return;
    }

    try {
      await deleteLinkMutation.mutateAsync();
      setIsDeleteDialogOpen(false);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["links", "list"] }),
        queryClient.invalidateQueries({ queryKey: ["folders"] }),
      ]);
      onDeleted?.();
    } catch (error: unknown) {
      reportError(error, {
        area: "link-detail-view:delete-link",
        extra: { linkId: detail.id },
      });
    }
  }, [deleteLinkMutation, detail.id, onDeleted, queryClient]);

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

  const handleTodoDraftDateChange = React.useCallback(
    (todoId: number | string, nextDate: DateValue) => {
      setTodoDrafts((currentDrafts) =>
        currentDrafts.map((todo) =>
          todo.id === todoId ? { ...todo, date: nextDate, validationError: null } : todo,
        ),
      );
    },
    [],
  );

  const handleTodoDraftTimeChange = React.useCallback(
    (todoId: number | string, nextTime: TimeValue) => {
      setTodoDrafts((currentDrafts) =>
        currentDrafts.map((todo) =>
          todo.id === todoId ? { ...todo, time: nextTime, validationError: null } : todo,
        ),
      );
    },
    [],
  );

  const handleTodoSave = React.useCallback(async () => {
    if (hasInvalidTodoDraft) {
      setTodoEditorError("할 일 제목을 모두 입력해주세요.");
      return;
    }

    // Schedule validation: any todo with title that's in time/recurring mode must
    // have date + time (and recurring needs at least one weekday).
    let hasScheduleError = false;
    const nextDrafts = todoDrafts.map((draft) => {
      if (draft.title.trim().length === 0) return draft;
      const error = validateDraft(draft);
      if (error) hasScheduleError = true;
      return { ...draft, validationError: error };
    });
    if (hasScheduleError) {
      setTodoDrafts(nextDrafts);
      setTodoEditorError("필수 항목을 입력해주세요.");
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
        const schedule = buildScheduleApiFields(draft);

        if (originalTodo) {
          await updateTodoMutation.mutateAsync({
            payload: {
              linkId: detail.id,
              title: trimmedTitle,
              ...schedule,
            },
            todoId: draft.id,
          });
          continue;
        }

        await createTodoMutation.mutateAsync({
          linkId: detail.id,
          title: trimmedTitle,
          ...schedule,
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

  const decoratedTodoDrafts = React.useMemo(
    () => todoDrafts.map((todo) => ({ ...todo, isPast: isScheduleInPast(todo) })),
    [todoDrafts],
  );

  const overlayMode = mode === "panel" ? "wide" : "mobile";

  const todoEditorContent = (
    <View className="gap-4">
      <TodoDraftListEditor
        addLabel="할 일 추가"
        pickerMode={overlayMode}
        todos={decoratedTodoDrafts}
        onAddTodo={handleAddTodoDraft}
        onChangeTodoTitle={handleTodoDraftTitleChange}
        onChangeTodoMode={handleTodoDraftModeChange}
        onChangeTodoWeekdays={handleTodoDraftWeekdaysChange}
        onChangeTodoDate={handleTodoDraftDateChange}
        onChangeTodoTime={handleTodoDraftTimeChange}
        onRemoveTodo={handleTodoDraftRemove}
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
                {linkStatusMeta.label ? (
                  <Text
                    className={cn(
                      "text-xs font-semibold",
                      linkStatusMeta.variant === "progress" && "text-primary",
                      linkStatusMeta.variant === "error" && "text-destructive",
                      linkStatusMeta.variant === "success" && "text-muted-foreground",
                    )}
                  >
                    {linkStatusMeta.label}
                  </Text>
                ) : null}
              </View>
              <View className="flex-row items-center gap-2">
                <IconButton
                  icon={RefreshCw}
                  size="sm"
                  variant="ghost"
                  onPress={refreshDetail}
                />
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
            </View>
          ) : (
            <View className="flex-row items-start justify-between gap-3">
              <View className="min-w-0 flex-1 gap-1">
                <Text
                  className="text-xs text-muted-foreground"
                  numberOfLines={2}
                >
                  {detail.url}
                </Text>
                <Text className="text-2xl font-bold text-foreground">{detail.title}</Text>
                {linkStatusMeta.label ? (
                  <Text
                    className={cn(
                      "text-xs font-semibold",
                      linkStatusMeta.variant === "progress" && "text-primary",
                      linkStatusMeta.variant === "error" && "text-destructive",
                      linkStatusMeta.variant === "success" && "text-muted-foreground",
                    )}
                  >
                    {linkStatusMeta.label}
                  </Text>
                ) : null}
              </View>
              <IconButton
                icon={RefreshCw}
                size="sm"
                variant="ghost"
                onPress={refreshDetail}
              />
            </View>
          )}

          {summaryModelLabel ? (
            <Text className="-mt-2 text-sm font-medium text-muted-foreground">
              {summaryModelLabel}
            </Text>
          ) : null}

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
                  const reminderAt = todo.reminderAt ?? todo.dueAt ?? null;
                  const reminderMs = reminderAt ? new Date(reminderAt).getTime() : Number.NaN;
                  const overdue = !done && !Number.isNaN(reminderMs) && reminderMs < Date.now();
                  const reminderLabel = formatReminderLabel(reminderAt, {
                    withOverdueSuffix: overdue,
                  });

                  return (
                    <TodoItem
                      key={todo.id}
                      variant="display"
                      text={getTodoTitle(todo)}
                      done={done}
                      overdue={overdue}
                      reminderLabel={reminderLabel}
                      onToggle={(nextChecked) => handleTodoCompletedChange(todo.id, nextChecked)}
                    />
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
              {mode === "panel" ? (
                <ActionButton
                  icon={Star}
                  label={detail.isFavorite ? "바로가기 해제" : "바로가기 추가"}
                  iconClassName={detail.isFavorite ? "text-warning" : undefined}
                  onPress={handleToggleFavorite}
                />
              ) : null}
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
          <DialogContent className="max-h-[80vh] min-h-[24rem] min-w-[24rem] max-w-md">
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
          <DialogContent className="max-h-[80vh] max-w-3xl">
            <DialogHeader>
              <DialogTitle>할 일 추가 / 수정</DialogTitle>
              <DialogDescription>
                각 할 일에 시간 또는 반복 알림을 설정할 수 있어요.
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
              각 할 일에 시간 또는 반복 알림을 설정할 수 있어요.
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
