import * as React from "react";
import { Platform, Pressable, View } from "react-native";

import { AppHeader } from "@/components/layout/app-header";
import { BottomTabs } from "@/components/layout/bottom-tabs";
import { BrandHeader } from "@/components/layout/brand-header";
import { Fab } from "@/components/layout/fab";
import { Sheet } from "@/components/layout/sheet";
import { Sidebar, SidebarCTA, SidebarItem, SidebarSection } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { Kbd } from "@/components/ui/kbd";
import { Text } from "@/components/ui/text";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { DetailPanel } from "@/features/links/components/detail-panel/detail-panel";
import { LinkCreateForm } from "@/features/links/components/link-create-form";
import { useDisplaySettings } from "@/stores/display-settings";

import { useAddLinkSheet } from "../hooks/use-add-link-sheet";
import { useLinkOverlayState } from "../hooks/use-link-overlay-state";
import { useShellRouteState } from "../hooks/use-shell-route-state";
import { getFolderSidebarItems } from "../routes";
import type { MobileTabKey, WideSidebarKey } from "../types";
import { WideKbdHelper } from "./wide-kbd-helper";

import { type Href, Redirect, useRouter } from "expo-router";
import {
  Bell,
  BookCopyIcon,
  CheckSquare,
  Folder,
  House,
  ListTodo,
  LucideHome,
  type LucideIcon,
  Plus,
  Search,
  Settings,
} from "lucide-react-native";

const mobileTabItems = [
  { key: "home", label: "홈", icon: House },
  { key: "folders", label: "폴더", icon: Folder },
  { key: "todos", label: "할일", icon: ListTodo },
  { key: "settings", label: "설정", icon: Settings },
] satisfies React.ComponentProps<typeof BottomTabs>["items"];

const widePrimaryItems: {
  href: string;
  key: WideSidebarKey;
  label: string;
  icon: LucideIcon;
}[] = [
  { href: "/home", key: "home", label: "🏠 홈", icon: LucideHome },
  { href: "/links", key: "links", label: "📚 전체", icon: BookCopyIcon },
  { href: "/todos", key: "todos", label: "✅ 할일", icon: CheckSquare },
];

function ResponsiveShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const routeState = useShellRouteState();
  const addLinkSheet = useAddLinkSheet();
  const accent = useDisplaySettings((state) => state.display.accent);
  const theme = useDisplaySettings((state) => state.display.theme);
  const setAccent = useDisplaySettings((state) => state.setAccent);
  const setTheme = useDisplaySettings((state) => state.setTheme);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = React.useState(false);
  const [isAddLinkDialogOpen, setIsAddLinkDialogOpen] = React.useState(false);
  const { detail, handleOpenChange, isOpen } = useLinkOverlayState({
    isWideView: routeState.isWideView,
    overlayBaseHref: routeState.overlayBaseHref,
    overlayLinkId: routeState.overlayLinkId,
  });

  const handleMobileTabChange = React.useCallback(
    (value: string) => {
      const nextHrefByTab: Record<MobileTabKey, string> = {
        home: "/home",
        folders: "/folders",
        todos: "/todos",
        settings: "/settings",
      };

      router.replace(nextHrefByTab[value as MobileTabKey] as Href);
    },
    [router],
  );

  const handleBack = React.useCallback(() => {
    router.replace(routeState.backHref as Href);
  }, [routeState.backHref, router]);

  const handleSearchDialogOpenChange = React.useCallback((open: boolean) => {
    setIsSearchDialogOpen(open);
  }, []);

  const handleWideSearchPress = React.useCallback(() => {
    setIsSearchDialogOpen(true);
  }, []);

  const handleWideAddLinkPress = React.useCallback(() => {
    setIsAddLinkDialogOpen(true);
  }, []);

  const handleWideAddLinkDialogOpenChange = React.useCallback((open: boolean) => {
    setIsAddLinkDialogOpen(open);
  }, []);

  const handleMobileSearchPress = React.useCallback(() => {
    console.log("mobile:search");
  }, []);

  const handleNotificationsPress = React.useCallback(() => {
    console.log("shell:notifications");
  }, []);

  const handleProfilePress = React.useCallback(() => {
    console.log("shell:profile");
  }, []);

  const handleFabPress = React.useCallback(() => {
    addLinkSheet.open();
  }, [addLinkSheet]);

  const isSettingsRoute = routeState.pathname.startsWith("/settings");

  React.useEffect(() => {
    if (!routeState.isWideView || Platform.OS !== "web") {
      return;
    }

    const handleWideKeyboardShortcut = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const isMetaOrCtrlK = (event.metaKey || event.ctrlKey) && key === "k";

      if (isMetaOrCtrlK) {
        event.preventDefault();
        console.log("shortcut:search");
        setIsSearchDialogOpen(true);
        return;
      }

      if (key === "n" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        console.log("shortcut:new-link");
        setIsAddLinkDialogOpen(true);
      }
    };

    window.addEventListener("keydown", handleWideKeyboardShortcut);

    return () => {
      window.removeEventListener("keydown", handleWideKeyboardShortcut);
    };
  }, [routeState.isWideView]);

  if (routeState.redirectHref) {
    return <Redirect href={routeState.redirectHref as Href} />;
  }

  if (routeState.isWideView) {
    const activeFolderId =
      routeState.pathname.startsWith("/folders/") && typeof routeState.searchParams.id === "string"
        ? routeState.searchParams.id
        : undefined;
    const folderItems = getFolderSidebarItems(activeFolderId);

    return (
      <View className="flex-1 flex-row bg-background">
        <View className="w-[15%] min-w-56 max-w-80">
          <Sidebar className="h-full w-full min-w-0 max-w-none">
            <View className="flex-1 justify-between gap-6">
              <View className="gap-6">
                <BrandHeader
                  accent={accent}
                  mode={theme}
                />

                <SidebarCTA
                  label={
                    <>
                      <Text className="text-2xl font-semibold leading-none text-primary-foreground">
                        +
                      </Text>
                      <Kbd
                        keyClassName="border-white/20 bg-white/20"
                        keyTextClassName="text-primary-foreground"
                        label="새 링크"
                        labelClassName="text-base font-semibold text-primary-foreground"
                        labelPosition="left"
                      >
                        N
                      </Kbd>
                    </>
                  }
                  onPress={handleWideAddLinkPress}
                />

                <View className="gap-1">
                  {widePrimaryItems.map((item) => (
                    <SidebarItem
                      key={item.key}
                      active={routeState.wideSidebarKey === item.key}
                      label={item.label}
                      labelClassName="text-base"
                      onPress={() => router.replace(item.href as Href)}
                    />
                  ))}
                </View>

                <SidebarSection title="내 폴더">
                  <View className="gap-1">
                    {folderItems.map((item) => (
                      <SidebarItem
                        key={item.id}
                        active={routeState.pathname === item.href}
                        label={item.label}
                        labelClassName="text-[15px]"
                        onPress={() => router.replace(item.href as Href)}
                      />
                    ))}
                  </View>
                </SidebarSection>
              </View>

              <View className="gap-3 border-t border-sidebar-border pt-3">
                <ThemeSwitcher
                  accent={accent}
                  mode={theme}
                  variant="switch"
                  onAccentChange={setAccent}
                  onModeChange={setTheme}
                />

                <Button
                  className="h-auto min-h-0 w-full items-center justify-start gap-3 bg-transparent px-5 py-2 shadow-none web:hover:bg-sidebar-surface-2 sm:h-auto"
                  variant="ghost"
                  onPress={handleProfilePress}
                >
                  <View className="size-6 items-center justify-center rounded-2xl">
                    <Text className="text-xl leading-none">🌸</Text>
                  </View>
                  <View className="min-w-0 flex-1 items-start">
                    <Text className="text-left text-base font-semibold text-sidebar-hover">
                      지훈
                    </Text>
                    <Text
                      numberOfLines={1}
                      className="text-left text-sm text-sidebar-muted"
                    >
                      jihoon
                    </Text>
                  </View>
                </Button>
              </View>
            </View>
          </Sidebar>
        </View>

        <View className="flex-1 bg-background">
          <View className="hidden min-h-14 flex-row items-center gap-3 border-b border-border-soft bg-background px-5 md:flex">
            <Pressable
              className="flex-1 flex-row items-center gap-3 rounded-full border border-input bg-card px-5 py-3 shadow-sm shadow-black/5 web:transition-colors web:hover:border-primary"
              onPress={handleWideSearchPress}
            >
              <Text className="text-xl leading-none">🔍</Text>
              <Text className="flex-1 text-lg text-muted-foreground">링크 · 요약 · 태그 검색…</Text>
              <Kbd size="sm">⌘/Ctrl + K</Kbd>
            </Pressable>
            <IconButton
              icon={Bell}
              size="sm"
              onPress={handleNotificationsPress}
            />
            <IconButton
              icon={Settings}
              size="sm"
              active={isSettingsRoute}
              onPress={() => router.replace("/settings" as Href)}
            />
          </View>
          <View className="relative flex-1">
            {children}
            <WideKbdHelper />
          </View>
        </View>

        {detail ? (
          <DetailPanel
            mode="overlay"
            open={isOpen}
            summary={detail.summary}
            tags={detail.tags}
            title={detail.title}
            url={detail.url}
            onOpenChange={handleOpenChange}
          />
        ) : null}

        <Dialog
          open={isSearchDialogOpen}
          onOpenChange={handleSearchDialogOpenChange}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>검색</DialogTitle>
              <DialogDescription>
                링크, 요약, 태그를 통합 검색할 예정인 더미 다이얼로그다.
              </DialogDescription>
            </DialogHeader>
            <View className="gap-4">
              <View className="rounded-[24px] border border-border bg-card px-5 py-4">
                <Text className="text-base text-muted-foreground">링크 · 요약 · 태그 검색…</Text>
              </View>
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">추천</Text>
                <View className="gap-2">
                  <View className="rounded-2xl bg-muted px-4 py-3">
                    <Text className="text-sm text-foreground">최근 본 디자인 레퍼런스</Text>
                  </View>
                  <View className="rounded-2xl bg-muted px-4 py-3">
                    <Text className="text-sm text-foreground">태그: 채용</Text>
                  </View>
                  <View className="rounded-2xl bg-muted px-4 py-3">
                    <Text className="text-sm text-foreground">요약에 “마케팅” 포함</Text>
                  </View>
                </View>
              </View>
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isAddLinkDialogOpen}
          onOpenChange={handleWideAddLinkDialogOpenChange}
        >
          <DialogContent className="max-w-[960px] gap-0 overflow-hidden rounded-2xl p-0">
            <DialogHeader className="flex-row items-center gap-3 border-b border-border px-8 py-6">
              <Text className="text-2xl font-normal text-muted-foreground">+</Text>
              <DialogTitle className="text-xl">새 링크 추가</DialogTitle>
            </DialogHeader>
            <View className="px-8 py-6">
              <LinkCreateForm
                mode="wide"
                open={isAddLinkDialogOpen}
                onCancel={() => setIsAddLinkDialogOpen(false)}
                onSaved={() => setIsAddLinkDialogOpen(false)}
              />
            </View>
          </DialogContent>
        </Dialog>
      </View>
    );
  }

  const isMobileHome = routeState.pathname === "/home";
  const showMobileFab =
    routeState.pathname === "/home" ||
    routeState.pathname === "/folders" ||
    routeState.pathname === "/todos" ||
    routeState.pathname.startsWith("/folders/");

  return (
    <View className="flex-1 bg-background">
      <AppHeader
        back={!isMobileHome && !routeState.showBackButton}
        onBack={handleBack}
        leftSlot={isMobileHome ? <BrandHeader className="px-0 pt-0" /> : undefined}
        rightSlot={
          isMobileHome ? (
            <View className="flex-row items-center gap-1">
              <IconButton
                icon={Search}
                size="sm"
                onPress={handleMobileSearchPress}
              />
              <IconButton
                icon={Bell}
                size="sm"
                onPress={handleNotificationsPress}
              />
            </View>
          ) : undefined
        }
        title={isMobileHome ? undefined : routeState.routeTitle}
      />
      <View className="flex-1">{children}</View>
      {showMobileFab && !addLinkSheet.isOpen ? (
        <Fab
          className="bottom-24"
          icon={Plus}
          label="새 링크"
          onPress={handleFabPress}
        />
      ) : null}
      <BottomTabs
        items={mobileTabItems}
        value={routeState.mobileTabKey ?? ""}
        onValueChange={handleMobileTabChange}
      />
      <Sheet
        open={addLinkSheet.isOpen}
        snapPoints={["88%"]}
        onOpenChange={addLinkSheet.handleOpenChange}
      >
        <LinkCreateForm
          mode="mobile"
          open={addLinkSheet.isOpen}
          onCancel={addLinkSheet.close}
          onSaved={addLinkSheet.close}
        />
      </Sheet>
    </View>
  );
}

export { ResponsiveShell };
