import * as React from "react";
import { View } from "react-native";

import { Sheet } from "@/components/layout/sheet";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

import { useCreateFolderMutation } from "../mutations";

type CreateFolderDialogMode = "wide" | "mobile";

type CreateFolderDialogProps = {
  mode: CreateFolderDialogMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (folderId: number) => void;
};

function CreateFolderDialog({ mode, open, onOpenChange, onCreated }: CreateFolderDialogProps) {
  const [name, setName] = React.useState("");
  const [validationError, setValidationError] = React.useState<string | undefined>();
  const mutation = useCreateFolderMutation();
  const resetMutation = mutation.reset;

  React.useEffect(() => {
    if (!open) {
      setName("");
      setValidationError(undefined);
      resetMutation();
    }
  }, [open, resetMutation]);

  const handleSave = React.useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setValidationError("폴더 이름을 입력해주세요.");
      return;
    }

    try {
      const response = await mutation.mutateAsync({ name: trimmed });
      onOpenChange(false);
      onCreated?.(response.data.id);
    } catch (error) {
      console.log("folders:create:failed", error);
    }
  }, [mutation, name, onCreated, onOpenChange]);

  const body = (
    <View className="gap-4">
      <View className="gap-2">
        <Text className="text-sm font-semibold text-muted-foreground">폴더 이름</Text>
        <Input
          className="h-10 rounded-xl px-4 text-base"
          autoFocus
          maxLength={100}
          placeholder="예: 디자인 레퍼런스"
          value={name}
          onChangeText={(next) => {
            setName(next);
            if (validationError) {
              setValidationError(undefined);
            }
          }}
        />
        {validationError ? (
          <Text className="text-sm font-medium text-destructive">{validationError}</Text>
        ) : null}
        {mutation.error ? (
          <Text className="text-sm font-medium text-destructive">
            폴더 생성에 실패했어요. 잠시 후 다시 시도해주세요.
          </Text>
        ) : null}
      </View>
      <View className="flex-row justify-end gap-2">
        <Button
          className="h-10"
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
          <Text>저장</Text>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>새 폴더</DialogTitle>
          </DialogHeader>
          {body}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet
      open={open}
      fitContent
      onOpenChange={onOpenChange}
    >
      <View className="gap-3">
        <Text className="text-lg font-semibold text-foreground">새 폴더</Text>
        {body}
      </View>
    </Sheet>
  );
}

export { CreateFolderDialog };
export type { CreateFolderDialogMode, CreateFolderDialogProps };
