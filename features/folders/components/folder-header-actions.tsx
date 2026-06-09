import * as React from "react";
import { View } from "react-native";

import { Sheet } from "@/components/layout/sheet";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { Text } from "@/components/ui/text";

import type { Folder } from "../types";
import type { CreateFolderDialogMode } from "./create-folder-dialog";
import { EditFolderDialog } from "./create-folder-dialog";

import { Pencil, Send } from "lucide-react-native/icons";

type FolderHeaderActionsProps = {
  mode: CreateFolderDialogMode;
  folder: Folder;
};

function FolderHeaderActions({ mode, folder }: FolderHeaderActionsProps) {
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isShareOpen, setIsShareOpen] = React.useState(false);

  return (
    <>
      <View className="flex-row items-center gap-1">
        <IconButton
          accessibilityLabel="폴더 수정"
          icon={Pencil}
          size="sm"
          onPress={() => setIsEditOpen(true)}
        />
        {folder.isShared ? (
          <IconButton
            accessibilityLabel="폴더 공유"
            icon={Send}
            size="sm"
            onPress={() => setIsShareOpen(true)}
          />
        ) : null}
      </View>

      <EditFolderDialog
        folder={folder}
        mode={mode}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <ShareFolderPlaceholder
        folder={folder}
        mode={mode}
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
      />
    </>
  );
}

function ShareFolderPlaceholder({
  mode,
  open,
  folder,
  onOpenChange,
}: {
  mode: CreateFolderDialogMode;
  open: boolean;
  folder: Folder;
  onOpenChange: (open: boolean) => void;
}) {
  const body = (
    <View className="gap-4">
      <View className="gap-1">
        <Text className="text-base font-semibold text-foreground">{folder.name}</Text>
        <Text className="text-sm text-muted-foreground">
          공유 링크 생성과 멤버 초대 기능이 여기에 연결될 예정이에요.
        </Text>
      </View>
      <View className="flex-row justify-end">
        <Button
          className="h-10"
          variant="outline"
          onPress={() => onOpenChange(false)}
        >
          <Text>닫기</Text>
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
            <DialogTitle>폴더 공유</DialogTitle>
            <DialogDescription>공유 폴더 초대 기능을 준비 중이에요.</DialogDescription>
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
        <Text className="text-lg font-semibold text-foreground">폴더 공유</Text>
        {body}
      </View>
    </Sheet>
  );
}

export { FolderHeaderActions };
export type { FolderHeaderActionsProps };
