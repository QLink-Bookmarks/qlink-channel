import * as React from "react";
import { ActivityIndicator, View } from "react-native";

import { Sheet } from "@/components/layout/sheet";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorMessage } from "@/features/posts/lib";
import { useCreatePostMutation } from "@/features/posts/mutations";
import { reportError } from "@/lib/error-reporting";
import { useToastStore } from "@/stores/toast-store";

type AnnouncementEditorMode = "wide" | "mobile";

const TITLE_MAX_LENGTH = 100;

function AnnouncementEditor({
  mode,
  open,
  onOpenChange,
}: {
  mode: AnnouncementEditorMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [title, setTitle] = React.useState("");
  const [contents, setContents] = React.useState("");
  const [titleError, setTitleError] = React.useState<string | undefined>();
  const [contentsError, setContentsError] = React.useState<string | undefined>();
  const mutation = useCreatePostMutation();
  const resetMutation = mutation.reset;
  const showToast = useToastStore((state) => state.showToast);

  React.useEffect(() => {
    if (!open) {
      setTitle("");
      setContents("");
      setTitleError(undefined);
      setContentsError(undefined);
      resetMutation();
    }
  }, [open, resetMutation]);

  const handleSave = React.useCallback(async () => {
    const trimmedTitle = title.trim();
    const trimmedContents = contents.trim();
    let hasError = false;
    if (!trimmedTitle) {
      setTitleError("제목을 입력해주세요.");
      hasError = true;
    } else if (trimmedTitle.length > TITLE_MAX_LENGTH) {
      setTitleError(`제목은 ${TITLE_MAX_LENGTH}자까지 입력할 수 있어요.`);
      hasError = true;
    }
    if (!trimmedContents) {
      setContentsError("내용을 입력해주세요.");
      hasError = true;
    }
    if (hasError) {
      return;
    }

    try {
      await mutation.mutateAsync({
        title: trimmedTitle,
        contents: trimmedContents,
        type: "ANNOUNCEMENT",
        imageUrls: [],
      });
      onOpenChange(false);
      showToast({
        title: "공지사항이 등록됐어요",
        variant: "success",
        sourceKey: "announcement-create",
        dismissible: true,
        durationMs: 3000,
      });
    } catch (error) {
      reportError(error, { area: "announcements:create" });
    }
  }, [contents, mutation, onOpenChange, showToast, title]);

  const body = (
    <View className="gap-4">
      <View className="gap-2">
        <Text className="text-sm font-semibold text-muted-foreground">제목</Text>
        <Input
          className="h-10 rounded-xl px-4 text-base"
          autoFocus
          maxLength={TITLE_MAX_LENGTH}
          placeholder="공지 제목을 입력해주세요"
          value={title}
          onChangeText={(next) => {
            setTitle(next);
            if (titleError) {
              setTitleError(undefined);
            }
          }}
        />
        {titleError ? (
          <Text className="text-sm font-medium text-destructive">{titleError}</Text>
        ) : null}
      </View>
      <View className="gap-2">
        <Text className="text-sm font-semibold text-muted-foreground">내용</Text>
        <Textarea
          className="min-h-40 rounded-xl bg-card px-4 py-3 text-base dark:bg-card"
          placeholder="공지 내용을 입력해주세요"
          value={contents}
          onChangeText={(next) => {
            setContents(next);
            if (contentsError) {
              setContentsError(undefined);
            }
          }}
        />
        {contentsError ? (
          <Text className="text-sm font-medium text-destructive">{contentsError}</Text>
        ) : null}
      </View>
      {mutation.error ? (
        <Text className="text-sm font-medium text-destructive">
          {getApiErrorMessage(mutation.error) ??
            "공지사항 등록에 실패했어요. 잠시 후 다시 시도해주세요."}
        </Text>
      ) : null}
      <View className="flex-row justify-end gap-2">
        <Button
          className="h-10"
          disabled={mutation.isPending}
          variant="outline"
          onPress={() => onOpenChange(false)}
        >
          <Text>취소</Text>
        </Button>
        <Button
          className="h-10"
          disabled={mutation.isPending}
          onPress={handleSave}
        >
          {mutation.isPending ? <ActivityIndicator size="small" /> : null}
          <Text>등록</Text>
        </Button>
      </View>
    </View>
  );

  if (mode === "wide") {
    return (
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >
        <DialogContent className="w-[42rem] max-w-[90vw] sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>새 공지사항</DialogTitle>
          </DialogHeader>
          {body}
        </DialogContent>
      </Dialog>
    );
  }

  if (!open) {
    return null;
  }

  return (
    <Sheet
      open={open}
      fitContent
      onOpenChange={onOpenChange}
    >
      <View className="gap-3">
        <Text className="text-lg font-semibold text-foreground">새 공지사항</Text>
        {body}
      </View>
    </Sheet>
  );
}

export { AnnouncementEditor };
export type { AnnouncementEditorMode };
