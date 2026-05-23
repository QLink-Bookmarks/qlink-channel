import * as React from "react";
import { Pressable, View } from "react-native";

import { Sheet } from "@/components/layout/sheet";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import {
  TodoEditor,
  type TodoEditorMode,
} from "@/features/todos/components/todo-editor/todo-editor";
import { cn } from "@/lib/utils";

import { useCreateLinkMutation } from "../mutations";

import * as Clipboard from "expo-clipboard";
import { ChevronDown, FolderOpen, Plus, Sparkles } from "lucide-react-native/icons";

type LinkCreateFormMode = "wide" | "mobile";

type TodoDraft = {
  id: string;
  title: string;
  mode: TodoEditorMode;
};

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

const folderOptions: FolderDraft[] = [
  defaultFolder,
  { id: "dev", label: "개발" },
  { id: "design", label: "디자인 레퍼런스" },
];

const aiProviderOptions: AiProviderDraft[] = [
  { id: "gemini", label: "Gemini (웹 로그인)" },
  { id: "openai", label: "OpenAI" },
  { id: "none", label: "사용 안 함" },
];

function createInitialTodos(): TodoDraft[] {
  return [];
}

function LinkCreateForm({ mode, open, onCancel, onSaved }: LinkCreateFormProps) {
  const createLinkMutation = useCreateLinkMutation();
  const resetMutation = createLinkMutation.reset;
  const [url, setUrl] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [memo, setMemo] = React.useState("");
  const [folder, setFolder] = React.useState<FolderDraft>(defaultFolder);
  const [aiProvider, setAiProvider] = React.useState<AiProviderDraft>(aiProviderOptions[0]);
  const [todos, setTodos] = React.useState<TodoDraft[]>(createInitialTodos);
  const [errors, setErrors] = React.useState<{ url?: string; title?: string }>({});
  const [folderSheetOpen, setFolderSheetOpen] = React.useState(false);
  const [aiProviderSheetOpen, setAiProviderSheetOpen] = React.useState(false);

  const resetForm = React.useCallback(() => {
    setUrl("");
    setTitle("");
    setMemo("");
    setFolder(defaultFolder);
    setAiProvider(aiProviderOptions[0]);
    setTodos(createInitialTodos());
    setErrors({});
    setFolderSheetOpen(false);
    setAiProviderSheetOpen(false);
    resetMutation();
  }, [resetMutation]);

  React.useEffect(() => {
    if (!open) {
      resetForm();
      return;
    }

    // TODO: Replace with real folder initial-load API.
    console.log("link-create:load-folders:todo");

    Clipboard.getStringAsync()
      .then((clipboardText) => {
        const nextUrl = clipboardText.trim();
        if (nextUrl) {
          setUrl(nextUrl);
        }
      })
      .catch((error: unknown) => {
        console.log("link-create:clipboard-read-failed", error);
      });
  }, [open, resetForm]);

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
      },
    ]);
  }, []);

  const handleTodoTitleChange = React.useCallback((todoId: string, nextTitle: string) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) => (todo.id === todoId ? { ...todo, title: nextTitle } : todo)),
    );
  }, []);

  const handleTodoModeChange = React.useCallback((todoId: string, nextMode: TodoEditorMode) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) => (todo.id === todoId ? { ...todo, mode: nextMode } : todo)),
    );
  }, []);

  const handleRemoveTodo = React.useCallback((todoId: string) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== todoId));
  }, []);

  const handlePickerPress = React.useCallback((picker: "time" | "day") => {
    // TODO: Open custom reminder picker.
    console.log(`link-create:${picker}-picker:todo`);
  }, []);

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
      const response = await createLinkMutation.mutateAsync({
        url: url.trim(),
        title: title.trim(),
        ...(memo.trim() ? { memo: memo.trim() } : {}),
        tags: [],
        sourceType: "INPUT",
      });

      resetForm();
      onSaved?.(response.data.id);
    } catch (error: unknown) {
      console.log("link-create:save-failed", error);
    }
  }, [createLinkMutation, memo, onSaved, resetForm, title, url, validate]);

  if (mode === "mobile") {
    return (
      <>
        <View className="gap-4">
          <Text className="text-2xl font-bold text-primary">링크 추가</Text>
          <FieldError error={errors.url}>
            <Input
              className="h-16 rounded-2xl border-primary/30 bg-background px-5 text-lg"
              value={url}
              autoCapitalize="none"
              keyboardType="url"
              placeholder="https://..."
              onChangeText={setUrl}
            />
          </FieldError>

          <View className="gap-2">
            <Text className="px-1 text-sm font-semibold text-muted-foreground">링크 제목</Text>
            <FieldError error={errors.title}>
              <Input
                className="h-12 rounded-xl border-primary/30 bg-background"
                value={title}
                maxLength={300}
                placeholder="AI 생성으로 자동 정리해보세요"
                onChangeText={setTitle}
              />
            </FieldError>
          </View>

          <View className="flex-row gap-3">
            <Button
              className="h-14 flex-1 rounded-2xl"
              disabled={createLinkMutation.isPending}
              onPress={handleSave}
            >
              <Text>저장</Text>
            </Button>
            <Button
              className="h-14 flex-1 rounded-2xl"
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
            onPress={() => setFolderSheetOpen(true)}
          />
          <MobileOptionCard
            eyebrow="AI 요약 제공자"
            icon="🟦"
            label={aiProvider.label}
            onPress={() => setAiProviderSheetOpen(true)}
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
        </View>

        <OptionSheet
          open={folderSheetOpen}
          title="폴더 선택"
          options={folderOptions}
          selectedId={folder.id}
          onSelect={(nextFolder) => {
            setFolder(nextFolder);
            setFolderSheetOpen(false);
          }}
          onOpenChange={setFolderSheetOpen}
        />
        <OptionSheet
          open={aiProviderSheetOpen}
          title="AI 요약 제공자"
          options={aiProviderOptions}
          selectedId={aiProvider.id}
          onSelect={(nextProvider) => {
            setAiProvider(nextProvider);
            setAiProviderSheetOpen(false);
          }}
          onOpenChange={setAiProviderSheetOpen}
        />
      </>
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
            className="h-14 rounded-xl px-4 text-lg"
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
            className="h-14 rounded-xl px-4 text-lg"
            value={title}
            maxLength={300}
            placeholder="AI 생성으로 자동 정리해보세요"
            onChangeText={setTitle}
          />
        </FieldError>
      </View>

      <View className="flex-row gap-4">
        <View className="flex-1 gap-2">
          <Text className="text-sm font-semibold text-muted-foreground">폴더</Text>
          <Pressable className="h-14 flex-row items-center justify-between rounded-xl border border-input bg-background px-4 shadow-sm shadow-black/5">
            <View className="min-w-0 flex-1 flex-row items-center gap-2">
              <Icon
                as={FolderOpen}
                size={18}
                className="text-primary"
              />
              <Text
                className="min-w-0 flex-1 text-base font-medium"
                numberOfLines={1}
              >
                {folder.label}
              </Text>
            </View>
            <Icon
              as={ChevronDown}
              size={18}
              className="text-muted-foreground"
            />
          </Pressable>
        </View>
        <View className="flex-1 gap-2">
          <Text className="text-sm font-semibold text-muted-foreground">메모 (선택)</Text>
          <Textarea
            className="min-h-14 rounded-xl py-4 text-base"
            value={memo}
            numberOfLines={1}
            placeholder="간단한 메모"
            onChangeText={setMemo}
          />
        </View>
      </View>

      <View className="gap-3">
        <Text className="text-sm font-semibold text-muted-foreground">
          ✅ 할 일 (선택, 여러 개 가능)
        </Text>
        {todos.map((todo, index) => (
          <TodoEditor
            key={todo.id}
            index={index + 1}
            value={todo.title}
            mode={todo.mode}
            onChangeText={(nextTitle) => handleTodoTitleChange(todo.id, nextTitle)}
            onModeChange={(nextMode) => handleTodoModeChange(todo.id, nextMode)}
            onRemove={() => handleRemoveTodo(todo.id)}
            onDatePress={() => handlePickerPress("day")}
            onTimePress={() => handlePickerPress("time")}
          />
        ))}
        <Pressable
          className="h-14 flex-row items-center justify-center gap-2 rounded-xl border border-dashed border-border"
          onPress={handleAddTodo}
        >
          <Icon
            as={Plus}
            size={18}
            className="text-muted-foreground"
          />
          <Text className="font-semibold text-muted-foreground">할 일 추가</Text>
        </Pressable>
      </View>

      {createLinkMutation.error ? (
        <Text className="text-sm font-medium text-destructive">
          링크 저장에 실패했습니다. 잠시 후 다시 시도해주세요.
        </Text>
      ) : null}

      <View className="flex-row justify-end gap-3 border-t border-border pt-5">
        <Button
          className="h-12"
          variant="outline"
          onPress={handleCancel}
        >
          <Text>취소</Text>
        </Button>
        <Button
          className="h-12"
          disabled={createLinkMutation.isPending}
          onPress={handleSave}
        >
          <Text>저장</Text>
        </Button>
        <Button
          className="h-12"
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
    <View className="flex-row items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-background px-5 py-4">
      <View className="min-w-0 flex-1 gap-2">
        <Text className="text-sm font-semibold text-muted-foreground">{eyebrow}</Text>
        <View className="min-w-0 flex-row items-center gap-2">
          <Text>{icon}</Text>
          <Text
            className="min-w-0 flex-1 text-lg font-bold text-foreground"
            numberOfLines={1}
          >
            {label}
          </Text>
        </View>
      </View>
      <Button
        className="h-12 rounded-full border-primary px-5"
        variant="outline"
        onPress={onPress}
      >
        <Text className="font-bold text-primary">변경</Text>
      </Button>
    </View>
  );
}

function OptionSheet<TOption extends { id: string | null; label: string }>({
  open,
  title,
  options,
  selectedId,
  onSelect,
  onOpenChange,
}: {
  open: boolean;
  title: string;
  options: TOption[];
  selectedId: string | null;
  onSelect: (option: TOption) => void;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet
      open={open}
      snapPoints={["34%"]}
      title={title}
      onOpenChange={onOpenChange}
    >
      <View className="gap-2">
        {options.map((option) => {
          const selected = option.id === selectedId;

          return (
            <Pressable
              key={option.id ?? "none"}
              className={cn(
                "flex-row items-center justify-between rounded-xl border border-border bg-card px-4 py-3",
                selected && "border-primary bg-accent",
              )}
              onPress={() => onSelect(option)}
            >
              <Text
                className={cn("font-semibold", selected && "text-accent-foreground")}
                numberOfLines={1}
              >
                {option.label}
              </Text>
              {selected ? (
                <Icon
                  as={Sparkles}
                  size={18}
                  className="text-primary"
                />
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </Sheet>
  );
}

export { LinkCreateForm };
export type { LinkCreateFormMode };
