import { ScrollView, View } from "react-native";

import { PageHeader } from "@/components/layout/page-header";
import { ActivityIndicator } from "@/components/ui/activity-indicator";
import { EmptyState } from "@/components/ui/empty-state";
import { FolderHeaderActions } from "@/features/folders/components/folder-header-actions";
import { InviteAcceptScreen } from "@/features/folders/components/invite-accept-screen";
import { MobileFoldersScreen } from "@/features/folders/components/mobile-folders-screen";
import { useFoldersQuery } from "@/features/folders/queries";
import { LinkListView } from "@/features/home/components/link-list-view";
import { MobileHomeScreen } from "@/features/home/components/mobile-home-screen";
import { LinkDetailScreen } from "@/features/links/components/link-detail-screen";
import { SettingsScreen } from "@/features/settings/components/settings-screen";
import { TodosScreen } from "@/features/todos/components/todos-screen/todos-screen";

import { useShellRouteState } from "../hooks/use-shell-route-state";
import { readParamValue } from "../routes";
import { DummyRouteScreen } from "./dummy-route-screen";

import { useLocalSearchParams } from "expo-router";

function WidePlaceholderScreen({
  title,
  emoji,
  meta,
  description,
}: {
  title: string;
  emoji: string;
  meta: string;
  description: string;
}) {
  return (
    <ScrollView
      className="flex-1"
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <PageHeader
        title={title}
        emoji={emoji}
        meta={meta}
      />
      <View className="px-6 pb-6">
        <EmptyState
          emoji="🛠"
          title="준비 중"
          description={description}
        />
      </View>
    </ScrollView>
  );
}

function HomeRouteScreen() {
  const { isWideView } = useShellRouteState();

  if (isWideView) {
    return (
      <WidePlaceholderScreen
        title="홈"
        emoji="🏠"
        meta="홈 대시보드는 준비 중이다."
        description="홈 위젯이 곧 추가될 예정이다."
      />
    );
  }

  return <MobileHomeScreen />;
}

function FoldersRouteScreen() {
  const { isWideView } = useShellRouteState();

  if (isWideView) {
    return (
      <DummyRouteScreen
        title="폴더"
        routePath="/folders"
        viewMode="wide"
        description="와이드에서는 레이아웃 레벨에서 /home으로 리다이렉트된다."
      />
    );
  }

  return <MobileFoldersScreen />;
}

function FolderDetailRouteScreen() {
  const params = useLocalSearchParams<{ id?: string | string[]; linkId?: string | string[] }>();
  const folderId = readParamValue(params.id);
  const linkIdParam = readParamValue(params.linkId);
  const foldersQuery = useFoldersQuery({ size: 15 });
  const folderIdNumber = folderId ? Number(folderId) : Number.NaN;
  const isUncategorizedFolder = folderIdNumber === 0;

  if (isUncategorizedFolder) {
    return (
      <LinkListView
        folderId={0}
        title="미분류"
        emoji="🗂️"
        basePath="/folders/0"
        activeLinkId={linkIdParam ? Number(linkIdParam) : undefined}
      />
    );
  }

  if (foldersQuery.isLoading) {
    return (
      <ActivityIndicator
        size="large"
        className="flex-1 py-16"
      />
    );
  }

  const folders = foldersQuery.data?.contents ?? [];
  // TODO: Replace this list lookup with useFolderQuery(folderId) when the server exposes GET /api/folders/{id}.
  const folder = folders.find((entry) => entry.id === folderIdNumber);

  if (!folder) {
    return (
      <WidePlaceholderScreen
        title="폴더를 찾을 수 없어요"
        emoji="📁"
        meta={folderId ?? ""}
        description="삭제된 폴더이거나 접근 권한이 없는 폴더예요."
      />
    );
  }

  return (
    <LinkListView
      folderId={folder.id}
      title={folder.name}
      emoji={folder.emoji ?? undefined}
      meta={`${folder.linkCounts}개 링크`}
      basePath={`/folders/${folder.id}`}
      headerActions={
        <FolderHeaderActions
          folder={folder}
          mode="wide"
        />
      }
      activeLinkId={linkIdParam ? Number(linkIdParam) : undefined}
    />
  );
}

function TodosRouteScreen() {
  const { isWideView } = useShellRouteState();
  return <TodosScreen mode={isWideView ? "wide" : "mobile"} />;
}

function LinksRouteScreen() {
  const { isWideView } = useShellRouteState();
  const params = useLocalSearchParams<{ linkId?: string | string[] }>();
  const linkIdParam = readParamValue(params.linkId);

  if (!isWideView) {
    return (
      <DummyRouteScreen
        title="링크"
        routePath="/links"
        viewMode="mobile"
        description="모바일에서는 /home으로 리다이렉트된다."
      />
    );
  }

  return (
    <LinkListView
      title="전체 보기"
      emoji="📚"
      basePath="/links"
      activeLinkId={linkIdParam ? Number(linkIdParam) : undefined}
    />
  );
}

function LinkDetailRouteScreen() {
  const { isWideView } = useShellRouteState();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const linkId = readParamValue(params.id);

  if (!isWideView) {
    return <LinkDetailScreen linkId={linkId} />;
  }

  return (
    <DummyRouteScreen
      title="링크"
      routePath="/links/[id]"
      viewMode="wide"
      description="와이드에서는 링크 목록 문맥을 유지하고 상세 패널만 오버레이로 띄운다."
    />
  );
}

function SettingsRouteScreen() {
  const { isWideView } = useShellRouteState();
  return <SettingsScreen mode={isWideView ? "wide" : "mobile"} />;
}

function SettingsProfileRouteScreen() {
  const { isWideView } = useShellRouteState();

  return (
    <DummyRouteScreen
      title={isWideView ? "프로필 관리" : "설정"}
      routePath="/settings/profile"
      viewMode={isWideView ? "wide" : "mobile"}
      description={
        isWideView
          ? "와이드 전용 프로필 관리 더미 페이지다."
          : "모바일에서는 향후 프로필 관리 바텀시트가 열릴 예정이라는 placeholder를 보여준다."
      }
    />
  );
}

function SettingsAiRouteScreen() {
  const { isWideView } = useShellRouteState();

  return (
    <DummyRouteScreen
      title="AI 설정"
      routePath="/settings/ai"
      viewMode={isWideView ? "wide" : "mobile"}
      description="AI 설정 관리 더미 화면이다."
    />
  );
}

function SettingsAccountsRouteScreen() {
  const { isWideView } = useShellRouteState();

  return (
    <DummyRouteScreen
      title="계정 관리"
      routePath="/settings/accounts"
      viewMode={isWideView ? "wide" : "mobile"}
      description="계정 관리 더미 화면이다."
    />
  );
}

function InviteRouteScreen() {
  const params = useLocalSearchParams<{
    folderId?: string | string[];
    token?: string | string[];
  }>();
  const folderId = readParamValue(params.folderId);
  const token = readParamValue(params.token);

  return (
    <InviteAcceptScreen
      folderId={folderId}
      token={token}
    />
  );
}

function NotFoundRouteScreen() {
  const { isWideView, pathname } = useShellRouteState();

  return (
    <DummyRouteScreen
      title="페이지를 찾을 수 없음"
      routePath={pathname}
      viewMode={isWideView ? "wide" : "mobile"}
      description="공통 셸은 유지한 상태로 노출되는 not-found 더미 화면이다."
    />
  );
}

export {
  FolderDetailRouteScreen,
  FoldersRouteScreen,
  HomeRouteScreen,
  InviteRouteScreen,
  LinkDetailRouteScreen,
  LinksRouteScreen,
  NotFoundRouteScreen,
  SettingsAccountsRouteScreen,
  SettingsAiRouteScreen,
  SettingsProfileRouteScreen,
  SettingsRouteScreen,
  TodosRouteScreen,
};
