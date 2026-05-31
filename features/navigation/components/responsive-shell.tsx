import * as React from "react";
import { Platform, Pressable, ScrollView, View } from "react-native";

import { RouteErrorBoundary } from "@/components/error/route-error-boundary";
import { AppHeader } from "@/components/layout/app-header";
import { BottomTabs } from "@/components/layout/bottom-tabs";
import { BrandHeader } from "@/components/layout/brand-header";
import { Fab } from "@/components/layout/fab";
import { Sheet } from "@/components/layout/sheet";
import { Sidebar, SidebarCTA, SidebarItem, SidebarSection } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { ActivityIndicator } from "@/components/ui/activity-indicator";
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
import { CreateFolderDialog } from "@/features/folders/components/create-folder-dialog";
import { useFoldersQuery } from "@/features/folders/queries";
import { DetailPanel } from "@/features/links/components/detail-panel/detail-panel";
import { LinkCreateForm } from "@/features/links/components/link-create-form";
import { useLinksQuery } from "@/features/links/queries";
import { useDisplaySettings } from "@/stores/display-settings";

import { useAddLinkSheet } from "../hooks/use-add-link-sheet";
import { useLinkOverlayState } from "../hooks/use-link-overlay-state";
import { useShellRouteState } from "../hooks/use-shell-route-state";
import { canOpenWideOverlayInPlace } from "../routes";
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
const UNCATEGORIZED_FOLDER_ID = 0;

function ResponsiveShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const routeState = useShellRouteState();
  const {
    close: closeAddLinkSheet,
    handleOpenChange: handleAddLinkSheetOpenChange,
    isOpen: isAddLinkSheetOpen,
    open: openAddLinkSheet,
  } = useAddLinkSheet();
  const accent = useDisplaySettings((state) => state.display.accent);
  const theme = useDisplaySettings((state) => state.display.theme);
  const setAccent = useDisplaySettings((state) => state.setAccent);
  const setTheme = useDisplaySettings((state) => state.setTheme);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = React.useState(false);
  const [isAddLinkDialogOpen, setIsAddLinkDialogOpen] = React.useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = React.useState(false);
  const [hasOpenedAddLinkSheet, setHasOpenedAddLinkSheet] = React.useState(false);
  const [pendingMobileLinkId, setPendingMobileLinkId] = React.useState<number | null>(null);
  const foldersQuery = useFoldersQuery({ size: 15 });
  const uncategorizedLinksQuery = useLinksQuery({ folderId: UNCATEGORIZED_FOLDER_ID, size: 100 });
  const { detail, error, handleOpenChange, isLoading, isOpen } = useLinkOverlayState({
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
    setHasOpenedAddLinkSheet(true);
    openAddLinkSheet();
  }, [openAddLinkSheet]);

  const handleWideLinkSaved = React.useCallback(
    (id: number) => {
      setIsAddLinkDialogOpen(false);

      if (canOpenWideOverlayInPlace(routeState.pathname)) {
        router.replace(`${routeState.pathname}?linkId=${id}` as Href);
        return;
      }

      router.replace(`/links?linkId=${id}` as Href);
    },
    [routeState.pathname, router],
  );

  const handleMobileLinkSaved = React.useCallback(
    (id: number) => {
      setPendingMobileLinkId(id);
      closeAddLinkSheet();
    },
    [closeAddLinkSheet],
  );

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

  React.useEffect(() => {
    if (routeState.isWideView) {
      setHasOpenedAddLinkSheet(false);
      closeAddLinkSheet();
      return;
    }

    const canKeepSheetOpen =
      routeState.pathname === "/home" ||
      routeState.pathname === "/folders" ||
      routeState.pathname === "/todos" ||
      routeState.pathname.startsWith("/folders/");

    if (!canKeepSheetOpen && isAddLinkSheetOpen) {
      closeAddLinkSheet();
    }
  }, [closeAddLinkSheet, isAddLinkSheetOpen, routeState.isWideView, routeState.pathname]);

  React.useEffect(() => {
    if (routeState.isWideView || isAddLinkSheetOpen || pendingMobileLinkId == null) {
      return;
    }

    router.replace(`/links/${pendingMobileLinkId}` as Href);
    setPendingMobileLinkId(null);
  }, [isAddLinkSheetOpen, pendingMobileLinkId, routeState.isWideView, router]);

  if (routeState.redirectHref) {
    return <Redirect href={routeState.redirectHref as Href} />;
  }

  if (routeState.isWideView) {
    const allFolders = foldersQuery.data?.contents ?? [];
    const myFolders = allFolders.filter((folder) => !folder.isShared);
    const sharedFolders = allFolders.filter((folder) => folder.isShared);
    const isFoldersLoading = foldersQuery.isLoading;
    const uncategorizedCount = uncategorizedLinksQuery.data?.contents.length ?? 0;

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
                    {isFoldersLoading ? (
                      <ActivityIndicator
                        size="small"
                        className="py-3"
                      />
                    ) : (
                      <>
                        {myFolders.map((folder) => {
                          const href = `/folders/${folder.id}`;
                          return (
                            <SidebarItem
                              key={folder.id}
                              active={routeState.pathname === href}
                              count={folder.linkCounts}
                              label={folder.emoji ? `${folder.emoji} ${folder.name}` : folder.name}
                              labelClassName="text-base"
                              onPress={() => router.replace(href as Href)}
                            />
                          );
                        })}
                        <SidebarItem
                          active={routeState.pathname === `/folders/${UNCATEGORIZED_FOLDER_ID}`}
                          count={uncategorizedCount}
                          label="🗂️ 미분류"
                          labelClassName="text-base"
                          onPress={() =>
                            router.replace(`/folders/${UNCATEGORIZED_FOLDER_ID}` as Href)
                          }
                        />
                        <SidebarAddItem
                          label="+  폴더 추가"
                          onPress={() => setIsCreateFolderOpen(true)}
                        />
                      </>
                    )}
                  </View>
                </SidebarSection>

                <SidebarSection title="공유 폴더">
                  <View className="gap-1">
                    {isFoldersLoading ? null : (
                      <>
                        {sharedFolders.map((folder) => {
                          const href = `/folders/${folder.id}`;
                          return (
                            <SidebarItem
                              key={folder.id}
                              active={routeState.pathname === href}
                              count={folder.shareCounts}
                              label={folder.emoji ? `${folder.emoji} ${folder.name}` : folder.name}
                              labelClassName="text-base"
                              onPress={() => router.replace(href as Href)}
                            />
                          );
                        })}
                        <SidebarAddItem
                          label="+  공유 추가/참여"
                          onPress={() => console.log("sidebar:share-join:todo")}
                        />
                      </>
                    )}
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
          <Topbar
            className="flex"
            placeholder="링크 · 요약 · 태그 검색…"
            variant="default"
            searchReadOnly
            searchLeftSlot={<Text className="text-xl leading-none">🔍</Text>}
            searchRightSlot={<Kbd size="sm">⌘/Ctrl + K</Kbd>}
            onSearchPress={handleWideSearchPress}
            actions={
              <>
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
              </>
            }
          />
          <View className="relative flex-1">
            <RouteErrorBoundary resetKeys={[routeState.pathname]}>{children}</RouteErrorBoundary>
            <WideKbdHelper />
          </View>
        </View>

        {detail ? (
          <DetailPanel
            detail={detail}
            error={error}
            isLoading={isLoading}
            mode="overlay"
            open={isOpen}
            onDeleted={() => handleOpenChange(false)}
            onOpenChange={handleOpenChange}
          />
        ) : isOpen ? (
          <DetailPanel
            error={error}
            isLoading={isLoading}
            mode="overlay"
            open={isOpen}
            onDeleted={() => handleOpenChange(false)}
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

        <CreateFolderDialog
          mode="wide"
          open={isCreateFolderOpen}
          onOpenChange={setIsCreateFolderOpen}
        />

        <Dialog
          open={isAddLinkDialogOpen}
          onOpenChange={handleWideAddLinkDialogOpenChange}
        >
          <DialogContent className="max-h-[80vh] w-[42rem] max-w-[90vw] gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-[42rem]">
            <DialogHeader className="flex-row items-center gap-3 border-b border-border px-8 py-6">
              <Text className="text-2xl font-normal text-muted-foreground">+</Text>
              <DialogTitle className="text-xl">새 링크 추가</DialogTitle>
            </DialogHeader>
            <ScrollView
              className="flex-1"
              contentInsetAdjustmentBehavior="automatic"
              showsVerticalScrollIndicator={false}
            >
              <View className="px-8 py-6">
                <RouteErrorBoundary
                  description="링크 추가 시트를 다시 열어 시도해주세요."
                  resetKeys={[isAddLinkDialogOpen]}
                  title="링크 추가 화면을 불러오지 못했어요"
                  onClose={() => setIsAddLinkDialogOpen(false)}
                >
                  <LinkCreateForm
                    mode="wide"
                    open={isAddLinkDialogOpen}
                    onCancel={() => setIsAddLinkDialogOpen(false)}
                    onSaved={handleWideLinkSaved}
                  />
                </RouteErrorBoundary>
              </View>
            </ScrollView>
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
        back={!isMobileHome && routeState.showBackButton}
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
      <View className="flex-1">
        <RouteErrorBoundary resetKeys={[routeState.pathname]}>{children}</RouteErrorBoundary>
      </View>
      {showMobileFab && !isAddLinkSheetOpen ? (
        <Fab
          bottomOffset={96}
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
      {hasOpenedAddLinkSheet && isAddLinkSheetOpen ? (
        <Sheet
          open={isAddLinkSheetOpen}
          fitContent
          onOpenChange={handleAddLinkSheetOpenChange}
        >
          <RouteErrorBoundary
            description="시트를 닫고 다시 열어 시도해주세요."
            resetKeys={[isAddLinkSheetOpen]}
            title="링크 추가 시트를 불러오지 못했어요"
            onClose={closeAddLinkSheet}
          >
            <LinkCreateForm
              mode="mobile"
              open={isAddLinkSheetOpen}
              onCancel={closeAddLinkSheet}
              onSaved={handleMobileLinkSaved}
            />
          </RouteErrorBoundary>
        </Sheet>
      ) : null}
    </View>
  );
}

function SidebarAddItem({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable
      className="group min-h-8 flex-row items-center rounded-xl border border-dashed border-border px-4 active:bg-sidebar-surface-2 web:transition-colors web:hover:bg-sidebar-surface-2"
      onPress={onPress}
    >
      <Text className="text-sm font-medium text-sidebar-muted web:group-hover:text-primary">
        {label}
      </Text>
    </Pressable>
  );
}

export { ResponsiveShell };
