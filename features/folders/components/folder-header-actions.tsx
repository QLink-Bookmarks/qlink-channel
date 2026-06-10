import * as React from "react";
import { View } from "react-native";

import { Sheet } from "@/components/layout/sheet";
import { ActivityIndicator } from "@/components/ui/activity-indicator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useMyProfileQuery } from "@/features/account/queries";

import { useCreateFolderInvitationMutation } from "../mutations";
import type { Folder } from "../types";
import type { CreateFolderDialogMode } from "./create-folder-dialog";
import { EditFolderDialog } from "./create-folder-dialog";

import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { ChevronLeft, Copy, Pencil, Send } from "lucide-react-native/icons";

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
  const myProfileQuery = useMyProfileQuery();
  const isOwner = folder.ownerId != null && myProfileQuery.data?.id === folder.ownerId;
  const [view, setView] = React.useState<"overview" | "invite">("overview");
  const [durationDays, setDurationDays] = React.useState("");
  const [invitationUrl, setInvitationUrl] = React.useState("");
  const invitationMutation = useCreateFolderInvitationMutation();
  const resetInvitationMutation = invitationMutation.reset;

  React.useEffect(() => {
    if (!open) {
      setView("overview");
      setDurationDays("");
      setInvitationUrl("");
      resetInvitationMutation();
    }
  }, [open, resetInvitationMutation]);

  const handleDurationDaysChange = React.useCallback((next: string) => {
    const digits = next.replace(/\D/g, "");

    if (!digits) {
      setDurationDays("");
      return;
    }

    const parsed = Number(digits);
    if (Number.isSafeInteger(parsed) && parsed > 0) {
      setDurationDays(String(parsed));
    }
  }, []);

  const handleCreateInvitation = React.useCallback(async () => {
    const parsedDurationDays = durationDays ? Number(durationDays) : null;
    const response = await invitationMutation.mutateAsync({
      id: folder.id,
      payload: {
        durationDays:
          parsedDurationDays && Number.isSafeInteger(parsedDurationDays) && parsedDurationDays > 0
            ? parsedDurationDays
            : null,
      },
    });

    setInvitationUrl(resolveInvitationUrl(response.data.invitation, folder.id));
  }, [durationDays, folder.id, invitationMutation]);

  const handleCopyInvitation = React.useCallback(() => {
    if (!invitationUrl) {
      return;
    }

    Clipboard.setStringAsync(invitationUrl).catch((error: unknown) => {
      console.log("folders:share:copy-failed", error);
    });
  }, [invitationUrl]);

  const handleKakaoShare = React.useCallback(() => {
    // TODO: Wire Kakao share integration when product sharing requirements are finalized.
    console.log("folders:share:kakao:todo", { folderId: folder.id, invitationUrl });
  }, [folder.id, invitationUrl]);

  const overviewBody = (
    <View className="gap-4">
      <View className="gap-1">
        <Text className="text-base font-semibold text-foreground">{folder.name}</Text>
        <Text className="text-sm text-muted-foreground">
          공유 링크 생성과 멤버 초대 기능이 여기에 연결될 예정이에요.
        </Text>
      </View>
      <View className="flex-row justify-end gap-2">
        <Button
          className="h-10"
          variant="outline"
          onPress={() => onOpenChange(false)}
        >
          <Text>닫기</Text>
        </Button>
        {isOwner ? (
          <Button
            className="h-10"
            onPress={() => setView("invite")}
          >
            <Icon
              as={Send}
              size={16}
              className="text-primary-foreground"
            />
            <Text>공유하기</Text>
          </Button>
        ) : null}
      </View>
    </View>
  );

  const inviteBody = (
    <View className="gap-4">
      <View className="gap-2">
        <Text className="text-sm font-semibold text-muted-foreground">초대 링크</Text>
        <View className="flex-row items-center gap-2">
          <Input
            className="h-10 flex-1 rounded-xl px-4 text-base"
            editable={false}
            placeholder="초대 링크를 생성해주세요."
            value={invitationUrl}
          />
          <IconButton
            accessibilityLabel="초대 링크 복사"
            disabled={!invitationUrl}
            icon={Copy}
            size="sm"
            onPress={handleCopyInvitation}
          />
        </View>
      </View>
      <View className="gap-2">
        <Text className="text-sm font-semibold text-muted-foreground">만료 일수</Text>
        <Input
          className="h-10 rounded-xl px-4 text-base"
          inputMode="numeric"
          keyboardType="number-pad"
          placeholder="비워두면 무기한"
          value={durationDays}
          onChangeText={handleDurationDaysChange}
        />
      </View>
      {invitationMutation.error ? (
        <Text className="text-sm font-medium text-destructive">
          초대 링크 생성에 실패했어요. 잠시 후 다시 시도해주세요.
        </Text>
      ) : null}
      <View className="flex-row justify-center gap-2">
        <Button
          className="h-10"
          disabled={invitationMutation.isPending}
          onPress={handleCreateInvitation}
        >
          {invitationMutation.isPending ? <ActivityIndicator size="small" /> : null}
          <Text>초대 링크 생성</Text>
        </Button>
        <Button
          className="h-10"
          disabled={!invitationUrl}
          variant="kakao"
          onPress={handleKakaoShare}
        >
          <Text>카톡으로 공유하기</Text>
        </Button>
      </View>
    </View>
  );

  const body = view === "invite" ? inviteBody : overviewBody;
  const title = view === "invite" ? "초대 링크" : "폴더 공유";
  const description =
    view === "invite"
      ? "초대 링크를 생성해 공유할 수 있어요."
      : "공유 폴더 초대 기능을 준비 중이에요.";
  const titleContent =
    view === "invite" ? (
      <View className="flex-row items-center gap-2">
        <IconButton
          accessibilityLabel="공유 안내로 돌아가기"
          icon={ChevronLeft}
          size="sm"
          variant="ghost"
          onPress={() => setView("overview")}
        />
        <Text className="text-lg font-semibold text-foreground">{title}</Text>
      </View>
    ) : (
      <Text className="text-lg font-semibold text-foreground">{title}</Text>
    );

  if (mode === "wide") {
    return (
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            {view === "invite" ? titleContent : <DialogTitle>{title}</DialogTitle>}
            <DialogDescription>{description}</DialogDescription>
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
        {titleContent}
        {body}
      </View>
    </Sheet>
  );
}

function resolveInvitationUrl(invitation: string, folderId: number) {
  const path = `/invite?token=${encodeURIComponent(invitation)}&folderId=${folderId}`;
  if (process.env.EXPO_OS === "web" && typeof window !== "undefined") {
    return `${window.location.origin}${path}`;
  }

  return Linking.createURL("/invite", {
    queryParams: { folderId: String(folderId), token: invitation },
  });
}

export { FolderHeaderActions };
export type { FolderHeaderActionsProps };
