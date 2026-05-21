import * as React from "react";
import { Pressable, View } from "react-native";

import { AppHeader } from "@/components/layout/app-header";
import { BottomTabs } from "@/components/layout/bottom-tabs";
import { BrandHeader } from "@/components/layout/brand-header";
import { Sidebar, SidebarCTA, SidebarItem, SidebarSection } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { DetailPanel } from "@/features/links/components/detail-panel/detail-panel";

import { useLinkOverlayState } from "../hooks/use-link-overlay-state";
import { useShellRouteState } from "../hooks/use-shell-route-state";
import { getFolderSidebarItems } from "../routes";
import type { MobileTabKey, WideSidebarKey } from "../types";

import { type Href, Redirect, useRouter } from "expo-router";
import { Folder, House, ListTodo, Settings } from "lucide-react-native";

const mobileTabItems = [
  { key: "home", label: "Home", icon: House },
  { key: "folders", label: "Folder", icon: Folder },
  { key: "todos", label: "Todo", icon: ListTodo },
  { key: "settings", label: "Setting", icon: Settings },
] satisfies React.ComponentProps<typeof BottomTabs>["items"];

const widePrimaryItems: {
  href: string;
  key: WideSidebarKey;
  label: string;
}[] = [
  { href: "/home", key: "home", label: "🏠 홈" },
  { href: "/links", key: "links", label: "📚 전체" },
  { href: "/todos", key: "todos", label: "✅ 할일" },
];

function ResponsiveShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const routeState = useShellRouteState();
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
            <View className="gap-6">
              <BrandHeader />

              <SidebarCTA
                label="링크 추가"
                onPress={() => {}}
              />

              <View className="gap-1">
                {widePrimaryItems.map((item) => (
                  <SidebarItem
                    key={item.key}
                    active={routeState.wideSidebarKey === item.key}
                    label={item.label}
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
                      onPress={() => router.replace(item.href as Href)}
                    />
                  ))}
                </View>
              </SidebarSection>
            </View>
          </Sidebar>
        </View>

        <View className="flex-1 bg-background">
          <Topbar
            placeholder={routeState.routeTitle}
            searchLeftSlot={
              <Badge variant="secondary">
                <Text>{routeState.routeTitle}</Text>
              </Badge>
            }
            actions={
              <Pressable
                className="rounded-full bg-accent px-4 py-2 active:bg-accent/80"
                onPress={() => router.replace("/settings" as Href)}
              >
                <Text className="text-sm font-medium text-accent-foreground">Settings</Text>
              </Pressable>
            }
          />
          <View className="flex-1">{children}</View>
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
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <AppHeader
        back={routeState.showBackButton}
        title={routeState.routeTitle}
        onBack={handleBack}
      />
      <View className="flex-1">{children}</View>
      <BottomTabs
        items={mobileTabItems}
        value={routeState.mobileTabKey ?? ""}
        onValueChange={handleMobileTabChange}
      />
    </View>
  );
}

export { ResponsiveShell };
