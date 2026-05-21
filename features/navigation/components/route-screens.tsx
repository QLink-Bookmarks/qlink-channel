import { useShellRouteState } from "../hooks/use-shell-route-state";
import { readParamValue } from "../routes";
import { DummyRouteScreen } from "./dummy-route-screen";

import { useLocalSearchParams } from "expo-router";

function HomeRouteScreen() {
  const { isWideView } = useShellRouteState();

  return (
    <DummyRouteScreen
      title="홈"
      routePath="/home"
      viewMode={isWideView ? "wide" : "mobile"}
      description="기본 홈 더미 화면이다. 와이드에서는 sidebar의 home, 모바일에서는 bottom tab의 home에 해당한다."
    />
  );
}

function FoldersRouteScreen() {
  const { isWideView } = useShellRouteState();

  return (
    <DummyRouteScreen
      title="폴더"
      routePath="/folders"
      viewMode={isWideView ? "wide" : "mobile"}
      description="모바일에서는 폴더 목록 더미를 보여주고, 와이드에서는 레이아웃 레벨에서 /home으로 리다이렉트된다."
    />
  );
}

function FolderDetailRouteScreen() {
  const { isWideView } = useShellRouteState();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const folderId = readParamValue(params.id);

  return (
    <DummyRouteScreen
      title="폴더 상세"
      routePath="/folders/[id]"
      viewMode={isWideView ? "wide" : "mobile"}
      description="특정 폴더 상세 더미 화면이다. 와이드에서는 sidebar의 폴더 섹션을 유지하고, 모바일에서는 folder 탭 문맥에서 진입한다."
      params={[{ label: "id", value: folderId }]}
    />
  );
}

function TodosRouteScreen() {
  const { isWideView } = useShellRouteState();

  return (
    <DummyRouteScreen
      title="투두"
      routePath="/todos"
      viewMode={isWideView ? "wide" : "mobile"}
      description="투두 목록 더미 화면이다. 와이드와 모바일 모두 해당 네비게이션 키를 활성화한다."
    />
  );
}

function LinksRouteScreen() {
  const { isWideView } = useShellRouteState();

  return (
    <DummyRouteScreen
      title="링크"
      routePath="/links"
      viewMode={isWideView ? "wide" : "mobile"}
      description="링크 목록 더미 화면이다. 와이드에서는 detail-panel overlay의 base route로도 사용된다."
    />
  );
}

function LinkDetailRouteScreen() {
  const { isWideView } = useShellRouteState();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const linkId = readParamValue(params.id);

  return (
    <DummyRouteScreen
      title={isWideView ? "링크" : "링크 상세"}
      routePath="/links/[id]"
      viewMode={isWideView ? "wide" : "mobile"}
      description={
        isWideView
          ? "와이드에서는 링크 목록 문맥을 유지하고 상세 패널만 오버레이로 띄운다."
          : "모바일에서는 독립적인 링크 상세 더미 페이지로 이동한다."
      }
      params={[{ label: "id", value: linkId }]}
    />
  );
}

function SettingsRouteScreen() {
  const { isWideView } = useShellRouteState();

  return (
    <DummyRouteScreen
      title="설정"
      routePath="/settings"
      viewMode={isWideView ? "wide" : "mobile"}
      description="설정 메인 더미 화면이다. 와이드에서는 topbar의 settings 진입점, 모바일에서는 bottom tab의 settings에 해당한다."
    />
  );
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
  const { isWideView } = useShellRouteState();
  const params = useLocalSearchParams<{ token?: string | string[] }>();
  const token = readParamValue(params.token);

  return (
    <DummyRouteScreen
      title="초대 확인"
      routePath="/invite"
      viewMode={isWideView ? "wide" : "mobile"}
      description="초대 토큰을 파싱하는 더미 화면이다. 공통 셸은 유지되고 탭 소속은 없다."
      params={[{ label: "token", value: token }]}
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
