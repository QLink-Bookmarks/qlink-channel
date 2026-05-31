import * as React from "react";
import { Pressable, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
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
import { useClipboardFailureFeedback } from "@/lib/clipboard-feedback";
import { reportError } from "@/lib/error-reporting";
import { useQrScanStore } from "@/stores/qr-scan";
import { useToastStore } from "@/stores/toast-store";

import { useCreateLinkMutation } from "../mutations";
import type { CreateLinkTodoRequest } from "../types";

import * as Clipboard from "expo-clipboard";
import { type Href, useRouter } from "expo-router";
import { ChevronLeft, FolderOpen, QrCode, X } from "lucide-react-native/icons";

type LinkCreateFormMode = "wide" | "mobile";
type MobileSheetStep = "form" | "folder-picker" | "ai-provider-picker";

type FolderDraft = {
  id: string | null;
  label: string;
};

type AiProviderDraft = {
  id: string;
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

const aiProviderOptions: AiProviderDraft[] = [
  { id: "gemini", label: "Gemini (웹 로그인)" },
  { id: "openai", label: "OpenAI" },
  { id: "none", label: "사용 안 함" },
];
const defaultWeekdays: WeekdayValue[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function createInitialTodos(): TodoDraftEditorItem[] {
  return [];
}

function getFolderOptionValue(folderId: string | null) {
  return folderId ?? defaultFolderOptionValue;
}

function LinkCreateForm({ mode, open, onCancel, onSaved }: LinkCreateFormProps) {
  const router = useRouter();
  const pendingQrResult = useQrScanStore((state) => state.pendingResult);
  const clearQrResult = useQrScanStore((state) => state.clear);
  const createLinkMutation = useCreateLinkMutation();
  const resetMutation = createLinkMutation.reset;
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
  const [url, setUrl] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [memo, setMemo] = React.useState("");
  const [folder, setFolder] = React.useState<FolderDraft>(defaultFolder);
  const [aiProvider, setAiProvider] = React.useState<AiProviderDraft>(aiProviderOptions[0]);
  const [todos, setTodos] = React.useState<TodoDraftEditorItem[]>(createInitialTodos);
  const [errors, setErrors] = React.useState<{ url?: string; title?: string }>({});
  const [mobileSheetStep, setMobileSheetStep] = React.useState<MobileSheetStep>("form");

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
    setAiProvider(aiProviderOptions[0]);
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
        timeLabel: "오전 09:00",
        dateLabel: "년-월-일",
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

  const handlePickerPress = React.useCallback((picker: "time" | "day") => {
    // TODO: Open custom reminder picker.
    console.log(`link-create:${picker}-picker:todo`);
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

  const handleAiOrganize = React.useCallback(() => {
    // TODO: Call AI organization flow after provider and folder APIs are ready.
    console.log("link-create:ai-organize:todo", {
      url,
      title,
      folder,
      aiProvider,
      todos,
    });
  }, [aiProvider, folder, title, todos, url]);

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

    try {
      const todoPayload: CreateLinkTodoRequest[] = todos
        .map((todo) => todo.title.trim())
        .filter((trimmedTitle) => trimmedTitle.length > 0)
        .map((trimmedTitle) => ({ title: trimmedTitle, reminderAt: null }));

      const response = await createLinkMutation.mutateAsync({
        url: url.trim(),
        title: title.trim(),
        memo: memo.trim() || undefined,
        tags: [],
        sourceType: "INPUT",
        folderId: folder.id ? Number(folder.id) : null,
        todos: todoPayload,
      });

      resetForm();
      onSaved?.(response.data.id);
    } catch (error: unknown) {
      console.log("link-create:save-failed", error);
    }
  }, [createLinkMutation, folder.id, memo, onSaved, resetForm, title, todos, url, validate]);

  if (mode === "mobile") {
    const stepTitle = mobileSheetStep === "folder-picker" ? "폴더 선택" : "링크 추가";

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
          {mobileSheetStep === "form" ? (
            <Pressable
              className="size-10 items-center justify-center rounded-full active:bg-accent"
              onPress={handleCancel}
            >
              <Icon
                as={X}
                size={18}
                className="text-muted-foreground"
              />
            </Pressable>
          ) : (
            <View className="size-10" />
          )}
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
            {/* TODO: AI 요약 제공자 API와 실제 옵션이 정리되면 모바일 옵션 카드 복구 */}

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
        ) : (
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
          todos={todos}
          onAddTodo={handleAddTodo}
          onChangeTodoTitle={handleTodoTitleChange}
          onChangeTodoMode={handleTodoModeChange}
          onChangeTodoWeekdays={handleTodoWeekdaysChange}
          onRemoveTodo={handleRemoveTodo}
          onDatePress={() => handlePickerPress("day")}
          onTimePress={() => handlePickerPress("time")}
        />
      </View>

      {createLinkMutation.error ? (
        <Text className="text-sm font-medium text-destructive">
          링크 저장에 실패했습니다. 잠시 후 다시 시도해주세요.
        </Text>
      ) : null}

      <View className="flex-row justify-end gap-3 border-t border-border pt-5">
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
          variant="gradient"
          onPress={handleAiOrganize}
        >
          <Text>AI 정리</Text>
        </Button>
      </View>
    </View>
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
