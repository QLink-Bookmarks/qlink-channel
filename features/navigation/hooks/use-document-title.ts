import * as React from "react";

import { useWideView } from "@/lib/hooks/use-wide-view";

import { getRouteTitle, normalizePathname, readParamValue } from "../routes";
import type { RouteParams } from "../types";

import { useGlobalSearchParams, usePathname } from "expo-router";

const APP_NAME = "QLink";
const BRAND_TITLE = "큐링크 QLink — 링크와 QR을 AI가 정리하는 스마트 북마크";
const NOT_FOUND_TITLE = "페이지를 찾을 수 없음";

function useDocumentTitle() {
  const pathname = normalizePathname(usePathname());
  const searchParams = useGlobalSearchParams() as RouteParams;
  const isWideView = useWideView();
  const folderId = readParamValue(searchParams.id);

  React.useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const routeTitle = getRouteTitle(pathname, { id: folderId }, isWideView);
    document.title =
      routeTitle && routeTitle !== NOT_FOUND_TITLE ? `${routeTitle} · ${APP_NAME}` : BRAND_TITLE;
  }, [folderId, isWideView, pathname]);
}

export { useDocumentTitle };
