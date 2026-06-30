import * as React from "react";

import { useFoldersQuery } from "@/features/folders/queries";
import { useLinkDetailQuery } from "@/features/links/queries";
import { useWideView } from "@/lib/hooks/use-wide-view";

import { getRouteTitle, normalizePathname, readParamValue } from "../routes";
import type { RouteParams } from "../types";

import { useGlobalSearchParams, usePathname } from "expo-router";

const APP_NAME = "QLink";
const BRAND_TITLE = "큐링크 QLink — 북마크마저 간편하게, 스마트하게";
const NOT_FOUND_TITLE = "페이지를 찾을 수 없음";

function useDocumentTitle() {
  const pathname = normalizePathname(usePathname());
  const searchParams = useGlobalSearchParams() as RouteParams;
  const isWideView = useWideView();
  const folderId = readParamValue(searchParams.id);

  // Detail-resource ids: a link detail path (or the wide-view overlay linkId)
  // and a folder detail path. The queries below stay disabled off these routes,
  // so they never fire on unauthenticated screens.
  const linkId = /^\/links\/[^/]+$/.test(pathname)
    ? pathname.split("/")[2]
    : readParamValue(searchParams.linkId);
  const folderDetailId = /^\/folders\/([^/]+)$/.exec(pathname)?.[1];

  const linkDetailQuery = useLinkDetailQuery(linkId);
  const foldersQuery = useFoldersQuery({ size: 15 }, { enabled: Boolean(folderDetailId) });

  const linkTitle = linkId ? linkDetailQuery.data?.title?.trim() : undefined;
  const folderName = folderDetailId
    ? foldersQuery.data?.contents?.find((folder) => String(folder.id) === folderDetailId)?.name
    : undefined;
  const resourceTitle = linkTitle || folderName || undefined;

  const routeTitle = getRouteTitle(pathname, { id: folderId }, isWideView);

  React.useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const base = resourceTitle ?? routeTitle;
    document.title = base && base !== NOT_FOUND_TITLE ? `${base} · ${APP_NAME}` : BRAND_TITLE;
  }, [resourceTitle, routeTitle]);
}

export { useDocumentTitle };
