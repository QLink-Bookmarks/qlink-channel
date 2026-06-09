import * as React from "react";
import { Pressable, View } from "react-native";

import { Button } from "@/components/ui/button";
import { type DateValue } from "@/components/ui/date-picker";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  usePopoverContext,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { type TimeValue } from "@/components/ui/time-picker";
import {
  AiModelPickerList,
  type AiModelSelection,
  getProviderLabel,
} from "@/features/ai/components/ai-model-picker-list";
import { useRequestAiSummaryMutation } from "@/features/ai/mutations";
import { useAiProviderModelsQuery } from "@/features/ai/queries";
import { FolderPickerList } from "@/features/folders/components/folder-picker-list";
import { useFoldersQuery } from "@/features/folders/queries";
import {
  type TodoDraftEditorItem,
  TodoDraftListEditor,
} from "@/features/todos/components/todo-draft-list-editor";
import {
  type TodoEditorMode,
  type WeekdayValue,
} from "@/features/todos/components/todo-editor/todo-editor";
import {
  buildScheduleApiFields,
  isScheduleInPast,
  validateDraft,
} from "@/features/todos/lib/todo-schedule";
import { useClipboardFailureFeedback } from "@/lib/clipboard-feedback";
import { reportError } from "@/lib/error-reporting";
import { useDisplaySettings } from "@/stores/display-settings";
import { useQrScanStore } from "@/stores/qr-scan";
import { useToastStore } from "@/stores/toast-store";
import { useQueryClient } from "@tanstack/react-query";

import { useCreateLinkMutation } from "../mutations";
import type { CreateLinkTodoRequest } from "../types";

import * as Clipboard from "expo-clipboard";
import { type Href, useRouter } from "expo-router";
import { ChevronDown, ChevronLeft, FolderOpen, QrCode } from "lucide-react-native/icons";

type LinkCreateFormMode = "wide" | "mobile";
type MobileSheetStep = "form" | "folder-picker" | "ai-model-picker";

type FolderDraft = {
  id: string | null;
  label: string;
};

type LinkCreateFormProps = {
  mode: LinkCreateFormMode;
  open: boolean;
  onCancel: () => void;
  onSaved?: (id: number) => void;
};

const defaultFolder: FolderDraft = {
  id: null,
  label: "없음 - ✨ AI 생성으로 자동 분류해보세요",
};

const defaultFolderOptionValue = "__default-folder__";

const defaultWeekdays: WeekdayValue[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const TITLE_MAX_LENGTH = 300;

function createInitialTodos(): TodoDraftEditorItem[] {
  return [];
}

function getFolderOptionValue(folderId: string | null) {
  return folderId ?? defaultFolderOptionValue;
}

function LinkCreateForm({ mode, open, onCancel, onSaved }: LinkCreateFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pendingQrResult = useQrScanStore((state) => state.pendingResult);
  const clearQrResult = useQrScanStore((state) => state.clear);
  const createLinkMutation = useCreateLinkMutation();
  const resetMutation = createLinkMutation.reset;
  const invalidateLinkQueries = React.useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["links", "list"] });
    void queryClient.invalidateQueries({ queryKey: ["folders"] });
  }, [queryClient]);
  const foldersQuery = useFoldersQuery({ size: 15 });
  const folderContents = foldersQuery.data?.contents;
  const folderOptions: FolderDraft[] = React.useMemo(() => {
    const apiFolders: FolderDraft[] = (folderContents ?? []).map((entry) => ({
      id: String(entry.id),
      label: entry.emoji ? `${entry.emoji} ${entry.name}` : entry.name,
    }));
    return [defaultFolder, ...apiFolders];
  }, [folderContents]);
  const clipboardFeedback = useClipboardFailureFeedback();
  const showToast = useToastStore((state) => state.showToast);
  const aiProvidersQuery = useAiProviderModelsQuery();
  const aiProviders = aiProvidersQuery.data;
  const defaultProvider = useDisplaySettings((state) => state.ai.defaultProvider);
  const defaultModel = useDisplaySettings((state) => state.ai.defaultModel);
  const requestAiSummaryMutation = useRequestAiSummaryMutation();
  const [url, setUrl] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [memo, setMemo] = React.useState("");
  const [folder, setFolder] = React.useState<FolderDraft>(defaultFolder);
  const [aiModel, setAiModel] = React.useState<AiModelSelection | null>(null);
  const [todos, setTodos] = React.useState<TodoDraftEditorItem[]>(createInitialTodos);
  const [errors, setErrors] = React.useState<{ url?: string; title?: string }>({});
  const [mobileSheetStep, setMobileSheetStep] = React.useState<MobileSheetStep>("form");

  React.useEffect(() => {
    if (aiModel || !aiProviders) {
      return;
    }
    const matchedProvider =
      aiProviders.find((provider) => provider.providerId === defaultProvider.id) ?? aiProviders[0];
    if (!matchedProvider) {
      return;
    }
    const matchedModel =
      matchedProvider.models.find((model) => model.id === defaultModel.id) ??
      matchedProvider.models[0];
    if (!matchedModel) {
      return;
    }
    setAiModel({
      modelId: matchedModel.id,
      modelLabel: matchedModel.model,
      providerLabel: getProviderLabel(matchedProvider),
      userProviderId: matchedModel.userProviderId,
    });
  }, [aiModel, aiProviders, defaultModel.id, defaultProvider.id]);

  const handleClipboardReadFailure = React.useCallback(
    (error: unknown) => {
      reportError(error, {
        area: "link-create-form:clipboard-read",
        extra: {
          mode,
        },
        level: "warning",
      });
      showToast({
        description: clipboardFeedback.description,
        dismissible: true,
        durationMs: 3000,
        showProgress: true,
        sourceKey: "link-create-clipboard",
        title: clipboardFeedback.title,
        variant: "warning",
      });
    },
    [clipboardFeedback.description, clipboardFeedback.title, mode, showToast],
  );

  const resetForm = React.useCallback(() => {
    setUrl("");
    setTitle("");
    setMemo("");
    setFolder(defaultFolder);
    setAiModel(null);
    setTodos(createInitialTodos());
    setErrors({});
    setMobileSheetStep("form");
    resetMutation();
  }, [resetMutation]);

  React.useEffect(() => {
    if (!open) {
      resetForm();
      return;
    }

    Clipboard.getStringAsync()
      .then((clipboardText) => {
        const nextUrl = clipboardText.trim();
        if (nextUrl) {
          setUrl(nextUrl);
        }
      })
      .catch((error: unknown) => {
        handleClipboardReadFailure(error);
      });
  }, [handleClipboardReadFailure, open, resetForm]);

  const handleCancel = React.useCallback(() => {
    resetForm();
    onCancel();
  }, [onCancel, resetForm]);

  const handleAddTodo = React.useCallback(() => {
    setTodos((currentTodos) => [
      ...currentTodos,
      {
        id: `${Date.now()}-${currentTodos.length}`,
        title: "",
        mode: "recurring",
        selectedWeekdays: defaultWeekdays,
        date: null,
        time: null,
      },
    ]);
  }, []);

  const handleTodoTitleChange = React.useCallback((todoId: string | number, nextTitle: string) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) => (todo.id === todoId ? { ...todo, title: nextTitle } : todo)),
    );
  }, []);

  const handleTodoModeChange = React.useCallback(
    (todoId: string | number, nextMode: TodoEditorMode) => {
      setTodos((currentTodos) =>
        currentTodos.map((todo) => (todo.id === todoId ? { ...todo, mode: nextMode } : todo)),
      );
    },
    [],
  );

  const handleTodoWeekdaysChange = React.useCallback(
    (todoId: string | number, nextWeekdays: WeekdayValue[]) => {
      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === todoId ? { ...todo, selectedWeekdays: nextWeekdays } : todo,
        ),
      );
    },
    [],
  );

  const handleRemoveTodo = React.useCallback((todoId: string | number) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== todoId));
  }, []);

  const handleTodoDateChange = React.useCallback((todoId: number | string, nextDate: DateValue) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId ? { ...todo, date: nextDate, validationError: null } : todo,
      ),
    );
  }, []);

  const handleTodoTimeChange = React.useCallback((todoId: number | string, nextTime: TimeValue) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId ? { ...todo, time: nextTime, validationError: null } : todo,
      ),
    );
  }, []);

  const handleScanQr = React.useCallback(() => {
    router.push("/qr-scan" as Href);
  }, [router]);

  React.useEffect(() => {
    if (!open || pendingQrResult == null) {
      return;
    }
    setUrl(pendingQrResult);
    clearQrResult();
  }, [clearQrResult, open, pendingQrResult]);

  const handleAiOrganize = React.useCallback(async () => {
    const trimmedUrl = url.trim();
    const trimmedTitle = title.trim();
    const nextErrors: { url?: string; title?: string } = {};

    if (!trimmedUrl) {
      nextErrors.url = "URL을 입력해주세요.";
    }

    if (trimmedTitle && trimmedTitle.length > TITLE_MAX_LENGTH) {
      nextErrors.title = `제목은 ${TITLE_MAX_LENGTH}자 이내로 입력해주세요.`;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (!aiModel) {
      showToast({
        description: "사용할 AI 모델을 먼저 선택해주세요.",
        dismissible: true,
        durationMs: 3000,
        sourceKey: "link-create-ai-model",
        title: "AI 모델이 필요해요",
        variant: "warning",
      });
      return;
    }

    setErrors({});

    try {
      const response = await requestAiSummaryMutation.mutateAsync({
        folderId: folder.id ? Number(folder.id) : null,
        modelId: aiModel.modelId,
        title: trimmedTitle ? trimmedTitle : null,
        url: trimmedUrl,
        userProviderId: aiModel.userProviderId,
      });

      showToast({
        description: "AI 정리 요청이 접수되었어요.",
        dismissible: true,
        durationMs: 3000,
        sourceKey: "link-create-ai-organize",
        title: "AI 정리 시작",
        variant: "success",
      });

      invalidateLinkQueries();
      resetForm();
      onCancel();
      // Surface the newly-queued link so the user can watch it move through G → A.
      const newLinkId = response.data?.id;
      if (newLinkId != null) {
        if (onSaved) {
          onSaved(newLinkId);
        } else if (mode === "wide") {
          router.replace(`/links?linkId=${newLinkId}` as Href);
        } else {
          router.push(`/links/${newLinkId}` as Href);
        }
      }
    } catch (error: unknown) {
      reportError(error, {
        area: "link-create-form:ai-organize",
        extra: { mode },
      });
      showToast({
        description: "AI 정리 요청에 실패했어요. 잠시 후 다시 시도해주세요.",
        dismissible: true,
        durationMs: 3000,
        sourceKey: "link-create-ai-organize",
        title: "AI 정리 실패",
        variant: "warning",
      });
    }
  }, [
    aiModel,
    folder.id,
    invalidateLinkQueries,
    mode,
    onCancel,
    onSaved,
    requestAiSummaryMutation,
    resetForm,
    router,
    showToast,
    title,
    url,
  ]);

  const validate = React.useCallback(() => {
    const nextErrors: { url?: string; title?: string } = {};

    if (!url.trim()) {
      nextErrors.url = "URL을 입력해주세요.";
    }

    if (!title.trim()) {
      nextErrors.title = "제목을 입력해주세요.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }, [title, url]);

  const handleSave = React.useCallback(async () => {
    if (!validate()) {
      return;
    }

    // Validate todo schedules. Non-empty todos whose mode is "time" or
    // "recurring" must have both date and time. Show inline errors and abort.
    const todosWithTitles = todos.filter((todo) => todo.title.trim().length > 0);
    let hasScheduleError = false;
    const nextTodos = todos.map((todo) => {
      const hasTitle = todo.title.trim().length > 0;
      const scheduleError = hasTitle ? validateDraft(todo) : null;
      if (scheduleError) hasScheduleError = true;
      return { ...todo, validationError: scheduleError };
    });
    if (hasScheduleError) {
      setTodos(nextTodos);
      return;
    }

    try {
      const todoPayload: CreateLinkTodoRequest[] = todosWithTitles.map((todo) => {
        const trimmedTitle = todo.title.trim();
        const schedule = buildScheduleApiFields(todo);
        return { title: trimmedTitle, ...schedule };
      });

      const response = await createLinkMutation.mutateAsync({
        url: url.trim(),
        title: title.trim(),
        memo: memo.trim() || undefined,
        tags: [],
        sourceType: "INPUT",
        folderId: folder.id ? Number(folder.id) : null,
        todos: todoPayload,
      });

      invalidateLinkQueries();
      resetForm();
      onSaved?.(response.data.id);
    } catch (error: unknown) {
      console.log("link-create:save-failed", error);
    }
  }, [
    createLinkMutation,
    folder.id,
    invalidateLinkQueries,
    memo,
    onSaved,
    resetForm,
    title,
    todos,
    url,
    validate,
  ]);

  const aiModelLabel = aiModel
    ? `${aiModel.providerLabel} · ${aiModel.modelLabel}`
    : defaultModel.model
      ? defaultModel.model
      : "기본 모델 사용";

  const decoratedTodos = React.useMemo(
    () => todos.map((todo) => ({ ...todo, isPast: isScheduleInPast(todo) })),
    [todos],
  );

  if (mode === "mobile") {
    const stepTitle =
      mobileSheetStep === "folder-picker"
        ? "폴더 선택"
        : mobileSheetStep === "ai-model-picker"
          ? "AI 제공자 모델"
          : "링크 추가";

    return (
      <View className="gap-5">
        <View className="flex-row items-center justify-between gap-3">
          <View className="w-10 items-start">
            {mobileSheetStep !== "form" ? (
              <Pressable
                className="size-10 items-center justify-center rounded-full active:bg-accent"
                onPress={() => setMobileSheetStep("form")}
              >
                <Icon
                  as={ChevronLeft}
                  size={18}
                  className="text-foreground"
                />
              </Pressable>
            ) : null}
          </View>
          <Text className="flex-1 text-center text-xl font-bold text-primary">{stepTitle}</Text>
          {/* The Sheet's own X handles dismiss on the form step — don't render a second X. */}
          <View className="size-10" />
        </View>

        {mobileSheetStep === "form" ? (
          <>
            <View className="flex-row items-start gap-2">
              <View className="min-w-0 flex-1">
                <FieldError error={errors.url}>
                  <Input
                    className="h-10 rounded-2xl border-primary/30 bg-background px-5 text-lg"
                    value={url}
                    autoCapitalize="none"
                    keyboardType="url"
                    placeholder="https://..."
                    onChangeText={setUrl}
                  />
                </FieldError>
              </View>
              <Button
                className="h-10 shrink-0 flex-row items-center gap-1 rounded-2xl bg-primary px-2.5"
                onPress={handleScanQr}
              >
                <Icon
                  as={QrCode}
                  size={14}
                  className="text-primary-foreground"
                />
                <Text className="text-xs font-semibold text-primary-foreground">QR</Text>
              </Button>
            </View>

            <View className="gap-2">
              <Text className="px-1 text-sm font-semibold text-muted-foreground">링크 제목</Text>
              <FieldError error={errors.title}>
                <Input
                  className="h-10 rounded-xl border-primary/30 bg-background"
                  value={title}
                  maxLength={300}
                  placeholder="AI 생성으로 자동 정리해보세요"
                  onChangeText={setTitle}
                />
              </FieldError>
            </View>

            <View className="flex-row gap-3">
              <Button
                className="h-10 flex-1 rounded-2xl"
                disabled={createLinkMutation.isPending}
                onPress={handleSave}
              >
                <Text>저장</Text>
              </Button>
              <Button
                className="h-10 flex-1 rounded-2xl"
                variant="gradient"
                onPress={handleAiOrganize}
              >
                <Text>AI 정리</Text>
              </Button>
            </View>

            <MobileOptionCard
              eyebrow="폴더"
              icon="✨"
              label={folder.id ? folder.label : "AI 자동 분류"}
              onPress={() => setMobileSheetStep("folder-picker")}
            />
            <MobileOptionCard
              eyebrow="AI 제공자 모델"
              icon="🤖"
              label={aiModelLabel}
              onPress={() => setMobileSheetStep("ai-model-picker")}
            />

            {createLinkMutation.error ? (
              <Text className="text-sm font-medium text-destructive">
                링크 저장에 실패했습니다. 잠시 후 다시 시도해주세요.
              </Text>
            ) : null}

            <Button
              className="self-center bg-transparent shadow-none"
              variant="ghost"
              onPress={handleCancel}
            >
              <Text className="text-base font-semibold text-muted-foreground">취소</Text>
            </Button>
          </>
        ) : mobileSheetStep === "folder-picker" ? (
          <FolderPickerList
            selectedFolderId={folder.id ? Number(folder.id) : null}
            onSelect={(selection) => {
              setFolder({
                id: selection.id == null ? null : String(selection.id),
                label:
                  selection.id == null
                    ? defaultFolder.label
                    : selection.emoji
                      ? `${selection.emoji} ${selection.label}`
                      : selection.label,
              });
              setMobileSheetStep("form");
            }}
          />
        ) : (
          <AiModelPickerList
            selectedModelId={aiModel?.modelId ?? defaultModel.id ?? null}
            onSelect={(selection) => {
              setAiModel(selection);
              setMobileSheetStep("form");
            }}
          />
        )}
      </View>
    );
  }

  return (
    <View className="gap-5">
      <View className="gap-2">
        <View className="flex-row items-center gap-2">
          <Text className="text-sm font-semibold text-muted-foreground">URL</Text>
          <Text className="text-sm font-semibold text-muted-foreground">📋 클립보드 자동 감지</Text>
        </View>
        <FieldError error={errors.url}>
          <Input
            className="h-10 rounded-xl px-4 text-lg"
            value={url}
            autoCapitalize="none"
            keyboardType="url"
            placeholder="https://www.example.com"
            onChangeText={setUrl}
          />
        </FieldError>
      </View>

      <View className="gap-2">
        <Text className="text-sm font-semibold text-muted-foreground">제목</Text>
        <FieldError error={errors.title}>
          <Input
            className="h-10 rounded-xl px-4 text-lg"
            value={title}
            maxLength={300}
            placeholder="AI 생성으로 자동 정리해보세요"
            onChangeText={setTitle}
          />
        </FieldError>
      </View>

      <View className="flex-row gap-4">
        <View className="min-w-0 flex-1 gap-2">
          <Text className="text-sm font-semibold text-muted-foreground">폴더</Text>
          <Select
            value={{
              label: folder.label,
              value: getFolderOptionValue(folder.id),
            }}
            onValueChange={(nextOption) => {
              const nextFolder =
                folderOptions.find(
                  (option) => getFolderOptionValue(option.id) === nextOption?.value,
                ) ?? defaultFolder;
              setFolder(nextFolder);
            }}
          >
            <SelectTrigger className="h-10 w-full rounded-xl px-4">
              <View className="min-w-0 flex-1 flex-row items-center gap-2">
                <Icon
                  as={FolderOpen}
                  size={18}
                  className="text-primary"
                />
                <Text
                  className="min-w-0 flex-1 text-sm font-medium leading-5"
                  numberOfLines={1}
                >
                  {folder.label}
                </Text>
              </View>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {folderOptions.map((option) => (
                  <SelectItem
                    key={getFolderOptionValue(option.id)}
                    value={getFolderOptionValue(option.id)}
                    label={option.label}
                  />
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </View>
        <View className="min-w-0 flex-1 gap-2">
          <Text className="text-sm font-semibold text-muted-foreground">메모 (선택)</Text>
          <Textarea
            className="scrollbar-none h-10 min-h-10 rounded-xl py-2.5 text-base web:resize-none"
            value={memo}
            numberOfLines={1}
            placeholder="간단한 메모"
            scrollEnabled={false}
            onChangeText={setMemo}
          />
        </View>
      </View>

      {/* TODO: AI 요약 제공자 API와 실제 옵션이 정리되면 와이드 전용 선택 UI 복구 */}

      <View className="gap-3">
        <Text className="text-sm font-semibold text-muted-foreground">
          ✅ 할 일 (선택, 여러 개 가능)
        </Text>
        <TodoDraftListEditor
          addLabel="할 일 추가"
          pickerMode={mode}
          todos={decoratedTodos}
          onAddTodo={handleAddTodo}
          onChangeTodoTitle={handleTodoTitleChange}
          onChangeTodoMode={handleTodoModeChange}
          onChangeTodoWeekdays={handleTodoWeekdaysChange}
          onChangeTodoDate={handleTodoDateChange}
          onChangeTodoTime={handleTodoTimeChange}
          onRemoveTodo={handleRemoveTodo}
        />
      </View>

      {createLinkMutation.error ? (
        <Text className="text-sm font-medium text-destructive">
          링크 저장에 실패했습니다. 잠시 후 다시 시도해주세요.
        </Text>
      ) : null}

      <View className="flex-row items-center justify-end gap-3 border-t border-border pt-5">
        <Button
          className="h-10"
          variant="outline"
          onPress={handleCancel}
        >
          <Text>취소</Text>
        </Button>
        <Button
          className="h-10"
          disabled={createLinkMutation.isPending}
          onPress={handleSave}
        >
          <Text>저장</Text>
        </Button>
        <Button
          className="h-10"
          disabled={requestAiSummaryMutation.isPending}
          variant="gradient"
          onPress={handleAiOrganize}
        >
          <Text>AI 정리</Text>
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="h-10 flex-row items-center gap-1 rounded-2xl px-3"
              variant="outline"
            >
              <Text className="text-sm font-semibold">{aiModelLabel}</Text>
              <Icon
                as={ChevronDown}
                size={14}
                className="text-foreground"
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            side="bottom"
            className="max-h-[60vh] w-80 overflow-y-auto p-3"
          >
            <AiModelPickerListWithClose
              selectedModelId={aiModel?.modelId ?? defaultModel.id ?? null}
              onSelect={setAiModel}
            />
          </PopoverContent>
        </Popover>
      </View>
    </View>
  );
}

function AiModelPickerListWithClose({
  selectedModelId,
  onSelect,
}: {
  selectedModelId: number | null;
  onSelect: (selection: AiModelSelection) => void;
}) {
  const popoverContext = usePopoverContext();

  return (
    <AiModelPickerList
      selectedModelId={selectedModelId}
      onSelect={(selection) => {
        onSelect(selection);
        popoverContext.onOpenChange(false);
      }}
    />
  );
}

function FieldError({ children, error }: { children: React.ReactNode; error?: string }) {
  return (
    <View className="gap-1">
      {children}
      {error ? <Text className="text-sm font-medium text-destructive">{error}</Text> : null}
    </View>
  );
}

function MobileOptionCard({
  eyebrow,
  icon,
  label,
  onPress,
}: {
  eyebrow: string;
  icon: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-background px-4 py-3">
      <View className="min-w-0 flex-1 gap-1.5">
        <Text className="text-sm font-semibold text-muted-foreground">{eyebrow}</Text>
        <View className="min-w-0 flex-row items-center gap-1.5">
          <Text>{icon}</Text>
          <Text
            className="min-w-0 flex-1 text-base font-bold text-foreground"
            numberOfLines={1}
          >
            {label}
          </Text>
        </View>
      </View>
      <Button
        className="h-10 rounded-2xl border-primary px-4"
        variant="outline"
        onPress={onPress}
      >
        <Text className="text-sm font-bold text-primary">변경</Text>
      </Button>
    </View>
  );
}

export { LinkCreateForm };
export type { LinkCreateFormMode };
