import * as React from "react";
import { Pressable, ScrollView, View } from "react-native";

import { PageHeader } from "@/components/layout/page-header";
import { Sheet } from "@/components/layout/sheet";
import { ActivityIndicator } from "@/components/ui/activity-indicator";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmojiPickerGrid } from "@/components/ui/emoji-picker-grid";
import { Icon } from "@/components/ui/icon";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { useUpdateMyProfileMutation } from "@/features/account/mutations";
import {
  accountQueryKeys,
  useMyProfileQuery,
  useMySettingsQuery,
} from "@/features/account/queries";
import type { AiProviderType, ConnectedAuthProvider } from "@/features/account/types";
import {
  AiModelPickerList,
  type AiModelSelection,
  getProviderLabel,
} from "@/features/ai/components/ai-model-picker-list";
import { usePutAiUserProviderMutation } from "@/features/ai/mutations";
import { useAiProviderModelsQuery } from "@/features/ai/queries";
import type { AiProviderWithModels } from "@/features/ai/types";
import { signOut as signOutApi } from "@/features/auth/api";
import { ConnectedProvidersRow } from "@/features/auth/components/connect-providers";
import { useUploadImageMutation } from "@/features/images/mutations";
import type { ImageUploadInput } from "@/features/images/types";
import { DeviceNotificationNotice } from "@/features/notifications/components/device-notification-notice";
import { reportError } from "@/lib/error-reporting";
import { useAuthStore } from "@/stores/auth";
import { useDisplaySettings } from "@/stores/display-settings";
import { useToastStore } from "@/stores/toast-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSettingsAutosave } from "../hooks/use-settings-autosave";

import * as Linking from "expo-linking";
import { type Href, useRouter } from "expo-router";
import { Camera, ChevronRight, KeyRound, Settings, Sparkles, X } from "lucide-react-native/icons";

type SettingsScreenMode = "wide" | "mobile";

type ProviderTypeOption = {
  type: AiProviderType;
  label: string;
  placeholder: string;
};

const PROVIDER_TYPE_OPTIONS: ProviderTypeOption[] = [
  { type: "OPENAI", label: "OpenAI", placeholder: "sk-..." },
  { type: "CLAUDE", label: "Claude", placeholder: "sk-ant-..." },
  { type: "GEMINI", label: "Gemini", placeholder: "AIza..." },
];

function SettingsScreen({ mode }: { mode: SettingsScreenMode }) {
  const profileQuery = useMyProfileQuery();
  const settingsQuery = useMySettingsQuery();
  const profile = profileQuery.data;
  const settings = settingsQuery.data;

  // Hydrate the local store the moment settings come back.
  const hydrateFromServer = useDisplaySettings((state) => state.hydrateFromServer);
  const hasHydrated = useDisplaySettings((state) => state.hasHydratedFromServer);
  React.useEffect(() => {
    if (settings && !hasHydrated) {
      hydrateFromServer(settings);
    }
  }, [settings, hasHydrated, hydrateFromServer]);

  const isLoading = profileQuery.isLoading || settingsQuery.isLoading;

  const body = (
    <View className="mx-auto w-full gap-4 px-4 pb-12 pt-4 md:max-w-3xl md:px-6 md:pt-0">
      {mode === "wide" ? (
        <PageHeader
          className="px-0"
          title="설정"
          icon={Settings}
          meta="프로필, AI 제공자, 알림 설정을 관리해요."
        />
      ) : null}

      {isLoading ? (
        <ActivityIndicator
          size="large"
          className="py-16"
        />
      ) : (
        <View className="gap-4">
          <ProfileSection
            mode={mode}
            nickname={profile?.nickname ?? "사용자"}
            username={profile?.username ?? ""}
            avatarUrl={profile?.avatarUrl ?? null}
            avatarFromApi={profile?.avatarEmoji ?? null}
            connectedProviders={settings?.providers ?? []}
          />

          {mode === "mobile" ? <DisplaySection /> : null}

          <AiProviderSection mode={mode} />

          <BehaviorSection />
        </View>
      )}
    </View>
  );

  if (mode === "wide") {
    return (
      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        {body}
      </ScrollView>
    );
  }

  // Mobile: own ScrollView so the shell's AppHeader/BottomTabs are not displaced
  // and the content scrolls correctly behind the tab bar.
  return (
    <ScrollView
      className="flex-1"
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      {body}
    </ScrollView>
  );
}

function SettingsSectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card
      density="compact"
      className="gap-3"
    >
      <View className="gap-1 px-5 pt-1">
        <Text className="text-base font-semibold text-foreground">{title}</Text>
        {description ? <Text className="text-xs text-muted-foreground">{description}</Text> : null}
      </View>
      <View className="gap-3 px-5">{children}</View>
    </Card>
  );
}

function ProfileSection({
  mode,
  nickname,
  username,
  avatarUrl,
  avatarFromApi,
  connectedProviders,
}: {
  mode: SettingsScreenMode;
  nickname: string;
  username: string;
  avatarUrl: string | null;
  avatarFromApi: string | null;
  connectedProviders: ConnectedAuthProvider[];
}) {
  const avatarOverride = useDisplaySettings((state) => state.profile.avatarEmoji);
  const setAvatarEmoji = useDisplaySettings((state) => state.setAvatarEmoji);
  const avatar = avatarOverride ?? avatarFromApi ?? "🌸";
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [logoutOpen, setLogoutOpen] = React.useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();
  const signOutStore = useAuthStore((state) => state.signOut);
  const showToast = useToastStore((state) => state.showToast);
  const signOutMutation = useMutation({
    mutationFn: () => signOutApi({ refreshToken: useAuthStore.getState().refreshToken }),
  });
  const handleConfirmLogout = React.useCallback(async () => {
    try {
      await signOutMutation.mutateAsync();
    } catch (error) {
      reportError(error, { area: "settings:sign-out" });
    } finally {
      signOutStore();
      queryClient.clear();
      setAvatarEmoji(null);
      setLogoutOpen(false);
      router.replace("/" as Href);
      showToast({
        title: "로그아웃 되었어요",
        variant: "success",
        sourceKey: "settings-logout",
        dismissible: true,
      });
    }
  }, [queryClient, router, setAvatarEmoji, showToast, signOutMutation, signOutStore]);

  return (
    <>
      <SettingsSectionCard
        title="프로필"
        description="대표 아이콘과 닉네임을 확인해요."
      >
        <View className="flex-row items-center gap-4">
          <Pressable
            className="min-w-0 flex-1 flex-row items-center gap-4 rounded-xl px-2 py-2 active:bg-accent web:hover:bg-accent"
            onPress={() => setProfileOpen(true)}
          >
            <Avatar
              alt={`${nickname} avatar`}
              size="lg"
            >
              {avatarUrl ? <AvatarImage source={{ uri: avatarUrl }} /> : null}
              <AvatarFallback>
                <Text className="text-2xl leading-none">{avatar}</Text>
              </AvatarFallback>
            </Avatar>
            <View className="min-w-0 flex-1">
              <Text
                numberOfLines={1}
                className="text-base font-semibold text-foreground"
              >
                {nickname}
              </Text>
              <Text
                numberOfLines={1}
                className="text-sm text-muted-foreground"
              >
                {username}
              </Text>
            </View>
          </Pressable>
          <Button
            variant="outline"
            size="sm"
            className="self-center"
            onPress={() => setLogoutOpen(true)}
          >
            <Text>로그아웃</Text>
          </Button>
        </View>
        <ConnectedProvidersRow
          mode={mode}
          connectedProviders={connectedProviders}
        />
      </SettingsSectionCard>

      <ProfileEditOverlay
        mode={mode}
        open={profileOpen}
        avatarEmoji={avatar}
        avatarUrl={avatarUrl}
        nickname={nickname}
        username={username}
        onOpenChange={setProfileOpen}
        onSaved={(nextAvatarEmoji) => {
          setAvatarEmoji(nextAvatarEmoji);
          setProfileOpen(false);
        }}
      />

      <AlertDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>로그아웃 할까요?</AlertDialogTitle>
            <AlertDialogDescription>로그아웃하면 다시 로그인해야 해요.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={signOutMutation.isPending}>
              <Text>취소</Text>
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={signOutMutation.isPending}
              onPress={handleConfirmLogout}
            >
              <Text>로그아웃</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ProfileEditOverlay({
  mode,
  open,
  avatarEmoji,
  avatarUrl,
  username,
  nickname,
  onOpenChange,
  onSaved,
}: {
  mode: SettingsScreenMode;
  open: boolean;
  avatarEmoji: string | null;
  avatarUrl: string | null;
  username: string;
  nickname: string;
  onOpenChange: (open: boolean) => void;
  onSaved: (avatarEmoji: string | null) => void;
}) {
  const [draftAvatarEmoji, setDraftAvatarEmoji] = React.useState<string | null>(avatarEmoji);
  const [draftUsername, setDraftUsername] = React.useState(username);
  const [draftNickname, setDraftNickname] = React.useState(nickname);
  const [draftAvatarUploadedUrl, setDraftAvatarUploadedUrl] = React.useState<string | null>(null);
  const [isAvatarCleared, setIsAvatarCleared] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | undefined>();
  const queryClient = useQueryClient();
  const mutation = useUpdateMyProfileMutation();
  const resetMutation = mutation.reset;
  const uploadImageMutation = useUploadImageMutation();
  const resetUploadMutation = uploadImageMutation.reset;
  const showToast = useToastStore((state) => state.showToast);

  React.useEffect(() => {
    if (open) {
      setDraftAvatarEmoji(avatarEmoji);
      setDraftUsername(username);
      setDraftNickname(nickname);
      setDraftAvatarUploadedUrl(null);
      setIsAvatarCleared(false);
      setValidationError(undefined);
      resetMutation();
      resetUploadMutation();
    }
  }, [avatarEmoji, nickname, open, resetMutation, resetUploadMutation, username]);

  const handleUsernameChange = React.useCallback((next: string) => {
    setDraftUsername(next);
    setValidationError(undefined);
  }, []);
  const handleNicknameChange = React.useCallback((next: string) => {
    setDraftNickname(next);
    setValidationError(undefined);
  }, []);

  const handleAvatarPicked = React.useCallback(
    async (file: ImageUploadInput) => {
      try {
        const response = await uploadImageMutation.mutateAsync(file);
        const uploadedUrl = response.data?.url;
        if (uploadedUrl) {
          setDraftAvatarUploadedUrl(uploadedUrl);
          setIsAvatarCleared(false);
          setDraftAvatarEmoji(null);
        }
      } catch {
        showToast({
          description: "이미지 업로드에 실패했어요. 잠시 후 다시 시도해주세요.",
          dismissible: true,
          durationMs: 3000,
          sourceKey: "settings-profile-avatar",
          title: "업로드 실패",
          variant: "warning",
        });
      }
    },
    [showToast, uploadImageMutation],
  );

  const handleAvatarPress = React.useCallback(() => {
    const target = isAvatarCleared ? null : (draftAvatarUploadedUrl ?? avatarUrl);
    if (!target) {
      return;
    }
    void Linking.openURL(target);
  }, [avatarUrl, draftAvatarUploadedUrl, isAvatarCleared]);

  const handleClearAvatar = React.useCallback(() => {
    setDraftAvatarUploadedUrl(null);
    setIsAvatarCleared(true);
  }, []);

  const handleEmojiChange = React.useCallback((next: string | null) => {
    setDraftAvatarEmoji(next);
    if (next) {
      setDraftAvatarUploadedUrl(null);
      setIsAvatarCleared(true);
    }
  }, []);

  const handleClearEmoji = React.useCallback(() => {
    setDraftAvatarEmoji(null);
  }, []);

  const handleSave = React.useCallback(async () => {
    const trimmedUsername = draftUsername.trim();
    const trimmedNickname = draftNickname.trim();
    if (!trimmedUsername || !trimmedNickname) {
      setValidationError("아이디와 닉네임을 모두 입력해주세요.");
      return;
    }

    try {
      const response = await mutation.mutateAsync({
        avatarEmoji: draftAvatarEmoji,
        nickname: trimmedNickname,
        username: trimmedUsername,
        avatarUrl: isAvatarCleared ? null : (draftAvatarUploadedUrl ?? avatarUrl),
      });
      await queryClient.invalidateQueries({ queryKey: accountQueryKeys.myProfile() });
      onSaved(response.data?.avatarEmoji ?? draftAvatarEmoji);
      showToast({
        description: "프로필 정보가 업데이트되었어요.",
        dismissible: true,
        durationMs: 3000,
        sourceKey: "settings-profile",
        title: "수정 완료",
        variant: "success",
      });
    } catch {
      showToast({
        description: "프로필 수정에 실패했어요. 잠시 후 다시 시도해주세요.",
        dismissible: true,
        durationMs: 3000,
        sourceKey: "settings-profile",
        title: "수정 실패",
        variant: "warning",
      });
    }
  }, [
    avatarUrl,
    draftAvatarEmoji,
    draftAvatarUploadedUrl,
    draftNickname,
    draftUsername,
    isAvatarCleared,
    mutation,
    onSaved,
    queryClient,
    showToast,
  ]);

  const displayAvatarUrl = isAvatarCleared ? null : (draftAvatarUploadedUrl ?? avatarUrl);

  const renderBody = (pickerMaxHeight: number, pickerFixedHeight: boolean) => (
    <View className="gap-4">
      <View className="items-center">
        <View className="relative">
          <Pressable
            accessibilityRole="button"
            disabled={!displayAvatarUrl || uploadImageMutation.isPending}
            onPress={handleAvatarPress}
          >
            <Avatar
              alt={`${draftNickname || nickname} avatar`}
              size="xl"
            >
              {displayAvatarUrl ? <AvatarImage source={{ uri: displayAvatarUrl }} /> : null}
              <AvatarFallback>
                <Text className="text-3xl leading-none">
                  {uploadImageMutation.isPending ? "⏳" : (draftAvatarEmoji ?? "🌸")}
                </Text>
              </AvatarFallback>
            </Avatar>
          </Pressable>
          {uploadImageMutation.isPending ? (
            <View className="pointer-events-none absolute inset-0 items-center justify-center rounded-full bg-black/40">
              <ActivityIndicator size="small" />
            </View>
          ) : null}
          {displayAvatarUrl && !uploadImageMutation.isPending ? (
            <Pressable
              accessibilityLabel="아바타 초기화"
              className="absolute -left-2 -top-2 size-7 items-center justify-center rounded-full border border-border bg-background shadow-sm active:bg-accent web:hover:bg-accent"
              hitSlop={8}
              onPress={handleClearAvatar}
            >
              <Icon
                as={X}
                size={14}
                className="text-foreground"
              />
            </Pressable>
          ) : null}
          {!displayAvatarUrl && !uploadImageMutation.isPending && draftAvatarEmoji ? (
            <Pressable
              accessibilityLabel="이모지 제거"
              className="absolute -left-2 -top-2 size-7 items-center justify-center rounded-full border border-border bg-background shadow-sm active:bg-accent web:hover:bg-accent"
              hitSlop={8}
              onPress={handleClearEmoji}
            >
              <Icon
                as={X}
                size={14}
                className="text-foreground"
              />
            </Pressable>
          ) : null}
          <ImageUploader
            className="absolute -bottom-2 -right-2 size-9 items-center justify-center rounded-full border border-border bg-background shadow-sm active:bg-accent web:hover:bg-accent"
            hitSlop={8}
            onImagePicked={handleAvatarPicked}
          >
            <Icon
              as={Camera}
              size={16}
              className="text-foreground"
            />
          </ImageUploader>
        </View>
      </View>
      <View className="gap-2">
        <Text className="text-sm font-semibold text-muted-foreground">아이디</Text>
        <Input
          className="h-10 rounded-xl px-4 text-base"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="아이디"
          value={draftUsername}
          onChangeText={handleUsernameChange}
        />
        <Text className="text-xs text-muted-foreground">공유 프로필과 계정 식별에 사용돼요.</Text>
      </View>
      <View className="gap-2">
        <Text className="text-sm font-semibold text-muted-foreground">닉네임</Text>
        <Input
          className="h-10 rounded-xl px-4 text-base"
          placeholder="닉네임"
          value={draftNickname}
          onChangeText={handleNicknameChange}
        />
        <Text className="text-xs text-muted-foreground">앱 안에서 표시되는 이름이에요.</Text>
      </View>
      {validationError ? (
        <Text className="text-sm font-medium text-destructive">{validationError}</Text>
      ) : null}
      <EmojiPickerGrid
        value={draftAvatarEmoji}
        onChange={handleEmojiChange}
        maxHeight={pickerMaxHeight}
        fixedHeight={pickerFixedHeight}
      />
      <View className="flex-row justify-end gap-2">
        <Button
          variant="outline"
          onPress={() => onOpenChange(false)}
        >
          <Text>취소</Text>
        </Button>
        <Button
          disabled={mutation.isPending}
          onPress={handleSave}
        >
          {mutation.isPending ? <ActivityIndicator size="small" /> : null}
          <Text>수정하기</Text>
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
        <DialogContent className="scrollbar-none max-h-[80vh] max-w-md overflow-y-auto">
          <DialogHeader>
            <DialogTitle>프로필 수정</DialogTitle>
            <DialogDescription>아이디, 닉네임, 대표 이모지를 수정해요.</DialogDescription>
          </DialogHeader>
          {renderBody(452, true)}
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
      maxDynamicContentSize={560}
      onOpenChange={onOpenChange}
    >
      <Text className="text-lg font-semibold text-foreground">프로필 수정</Text>
      {renderBody(220, false)}
    </Sheet>
  );
}

function DisplaySection() {
  const accent = useDisplaySettings((state) => state.display.accent);
  const theme = useDisplaySettings((state) => state.display.theme);
  const setAccent = useDisplaySettings((state) => state.setAccent);
  const setTheme = useDisplaySettings((state) => state.setTheme);

  return (
    <SettingsSectionCard
      title="화면 표시"
      description="다크 모드와 강조 색상을 선택해요."
    >
      <ThemeSwitcher
        accent={accent}
        mode={theme}
        variant="switch"
        onAccentChange={setAccent}
        onModeChange={setTheme}
      />
    </SettingsSectionCard>
  );
}

function BehaviorSection() {
  const allowsReminder = useDisplaySettings((state) => state.behavior.allowsReminderNotification);
  const setAllowsReminder = useDisplaySettings((state) => state.setAllowsReminderNotification);

  return (
    <SettingsSectionCard
      title="알림"
      description="할 일 알림을 받을지 선택해요."
    >
      <DeviceNotificationNotice />
      <View className="flex-row items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3">
        <View className="min-w-0 flex-1 gap-1">
          <Text className="text-sm font-semibold text-foreground">리마인더 알림</Text>
          <Text className="text-xs text-muted-foreground">할 일이 다가오면 알림을 보내요.</Text>
        </View>
        <Switch
          checked={allowsReminder}
          onCheckedChange={setAllowsReminder}
        />
      </View>
    </SettingsSectionCard>
  );
}

function AiProviderSection({ mode }: { mode: SettingsScreenMode }) {
  const defaultProvider = useDisplaySettings((state) => state.ai.defaultProvider);
  const defaultModel = useDisplaySettings((state) => state.ai.defaultModel);
  const setDefaultProvider = useDisplaySettings((state) => state.setDefaultProvider);
  const setDefaultModel = useDisplaySettings((state) => state.setDefaultModel);
  const providersQuery = useAiProviderModelsQuery();
  const providers = React.useMemo(() => providersQuery.data ?? [], [providersQuery.data]);

  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [addKeyOpen, setAddKeyOpen] = React.useState(false);

  const selectedModelId = defaultModel.id;
  const selectedProvider = providers.find((provider) => provider.providerId === defaultProvider.id);
  const selectedModel = selectedProvider?.models.find((model) => model.id === selectedModelId);

  const providerNameLabel = selectedProvider ? getProviderLabel(selectedProvider) : null;
  const modelNameLabel =
    selectedModel?.model ?? defaultModel.model ?? (selectedProvider ? "모델 미선택" : null);

  const handleSelect = React.useCallback(
    (selection: AiModelSelection) => {
      const provider = providers.find((entry) =>
        entry.models.some((model) => model.id === selection.modelId),
      );
      if (provider) {
        setDefaultProvider({ id: provider.providerId, type: provider.providerType });
      }
      setDefaultModel({ id: selection.modelId, model: selection.modelLabel });
      setPickerOpen(false);
    },
    [providers, setDefaultModel, setDefaultProvider],
  );

  return (
    <SettingsSectionCard
      title="AI 제공자"
      description="기본 AI 모델을 선택하고 API 키를 등록해요."
    >
      <Pressable
        className="flex-row items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 active:bg-accent web:hover:bg-accent"
        onPress={() => setPickerOpen(true)}
      >
        <View className="min-w-0 flex-1 gap-1">
          <View className="flex-row items-center gap-2">
            <Icon
              as={Sparkles}
              size={14}
              className="text-primary"
            />
            <Text
              numberOfLines={1}
              className="text-xs font-semibold uppercase text-muted-foreground"
            >
              {providerNameLabel ?? "제공자 미선택"}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            className="text-lg font-semibold text-foreground"
          >
            {modelNameLabel ?? "기본 모델 사용"}
          </Text>
        </View>
        <Icon
          as={ChevronRight}
          size={18}
          className="text-muted-foreground"
        />
      </Pressable>

      <Button
        variant="outline"
        className="flex-row items-center gap-2"
        onPress={() => setAddKeyOpen(true)}
      >
        <Icon
          as={KeyRound}
          size={16}
          className="text-foreground"
        />
        <Text>API 키 등록</Text>
      </Button>

      <AiPickerOverlay
        mode={mode}
        open={pickerOpen}
        selectedModelId={selectedModelId}
        onOpenChange={setPickerOpen}
        onSelect={handleSelect}
        onAddKeyPress={() => {
          setPickerOpen(false);
          setAddKeyOpen(true);
        }}
      />

      <AddProviderKeyOverlay
        mode={mode}
        providers={providers}
        open={addKeyOpen}
        onOpenChange={setAddKeyOpen}
      />
    </SettingsSectionCard>
  );
}

function AiPickerOverlay({
  mode,
  open,
  selectedModelId,
  onOpenChange,
  onSelect,
  onAddKeyPress,
}: {
  mode: SettingsScreenMode;
  open: boolean;
  selectedModelId: number | null;
  onOpenChange: (open: boolean) => void;
  onSelect: (selection: AiModelSelection) => void;
  onAddKeyPress: () => void;
}) {
  const body = (
    <View className="gap-4">
      <AiModelPickerList
        selectedModelId={selectedModelId}
        onSelect={onSelect}
      />
      <Button
        variant="outline"
        className="flex-row items-center gap-2"
        onPress={onAddKeyPress}
      >
        <Icon
          as={KeyRound}
          size={16}
          className="text-foreground"
        />
        <Text>새 API 키 등록</Text>
      </Button>
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
            <DialogTitle>AI 제공자 모델</DialogTitle>
            <DialogDescription>기본 AI 모델을 선택하거나 새 키를 등록해요.</DialogDescription>
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
      <Text className="text-lg font-semibold text-foreground">AI 제공자 모델</Text>
      {body}
    </Sheet>
  );
}

function AddProviderKeyOverlay({
  mode,
  providers,
  open,
  onOpenChange,
}: {
  mode: SettingsScreenMode;
  providers: AiProviderWithModels[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [providerType, setProviderType] = React.useState<AiProviderType>("OPENAI");
  const [apiKey, setApiKey] = React.useState("");
  const mutation = usePutAiUserProviderMutation();
  const resetMutation = mutation.reset;
  const showToast = useToastStore((state) => state.showToast);

  React.useEffect(() => {
    if (!open) {
      setApiKey("");
      setProviderType("OPENAI");
      resetMutation();
    }
  }, [open, resetMutation]);

  const matchingProvider = providers.find((provider) => provider.providerType === providerType);
  const providerOption = PROVIDER_TYPE_OPTIONS.find((entry) => entry.type === providerType);

  const handleSave = React.useCallback(async () => {
    const trimmed = apiKey.trim();
    if (!matchingProvider) {
      showToast({
        description: "지원하지 않는 제공자입니다.",
        dismissible: true,
        durationMs: 3000,
        sourceKey: "settings-ai-provider",
        title: "등록 실패",
        variant: "warning",
      });
      return;
    }
    if (!trimmed) {
      showToast({
        description: "API 키를 입력해주세요.",
        dismissible: true,
        durationMs: 3000,
        sourceKey: "settings-ai-provider",
        title: "API 키 필요",
        variant: "warning",
      });
      return;
    }
    try {
      await mutation.mutateAsync({
        providerId: matchingProvider.providerId,
        apiKey: trimmed,
      });
      showToast({
        description: "새 API 키가 등록되었어요.",
        dismissible: true,
        durationMs: 3000,
        sourceKey: "settings-ai-provider",
        title: "등록 완료",
        variant: "success",
      });
      onOpenChange(false);
    } catch {
      showToast({
        description: "API 키 등록에 실패했어요. 잠시 후 다시 시도해주세요.",
        dismissible: true,
        durationMs: 3000,
        sourceKey: "settings-ai-provider",
        title: "등록 실패",
        variant: "warning",
      });
    }
  }, [apiKey, matchingProvider, mutation, onOpenChange, showToast]);

  const body = (
    <View className="gap-4">
      <View className="gap-2">
        <Text className="text-sm font-semibold text-muted-foreground">제공자</Text>
        <View className="flex-row flex-wrap gap-2">
          {PROVIDER_TYPE_OPTIONS.map((option) => {
            const isSelected = providerType === option.type;
            const isSupported = providers.some((provider) => provider.providerType === option.type);
            return (
              <Pressable
                key={option.type}
                className={`flex-row items-center gap-2 rounded-xl border px-3 py-2 ${
                  isSelected ? "border-primary bg-accent" : "border-border bg-card"
                } ${isSupported ? "" : "opacity-50"}`}
                onPress={() => {
                  if (isSupported) {
                    setProviderType(option.type);
                  }
                }}
              >
                <Text
                  className={`text-sm font-semibold ${
                    isSelected ? "text-accent-foreground" : "text-foreground"
                  }`}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="gap-2">
        <Text className="text-sm font-semibold text-muted-foreground">API 키</Text>
        <Input
          className="h-10 rounded-xl px-4 text-base"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          placeholder={providerOption?.placeholder ?? "sk-..."}
          value={apiKey}
          onChangeText={setApiKey}
        />
        <Text className="text-xs text-muted-foreground">
          저장하면 새 키로 등록돼요. 기존 키는 표시되지 않아요.
        </Text>
      </View>

      <View className="flex-row justify-end gap-2">
        <Button
          variant="outline"
          onPress={() => onOpenChange(false)}
        >
          <Text>취소</Text>
        </Button>
        <Button
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
            <DialogTitle>API 키 등록</DialogTitle>
            <DialogDescription>제공자를 선택하고 새 키를 입력하면 저장돼요.</DialogDescription>
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
      <Text className="text-lg font-semibold text-foreground">API 키 등록</Text>
      {body}
    </Sheet>
  );
}

function SettingsScreenWithAutosave({ mode }: { mode: SettingsScreenMode }) {
  useSettingsAutosave();
  return <SettingsScreen mode={mode} />;
}

export { SettingsScreenWithAutosave as SettingsScreen };
export type { SettingsScreenMode };
