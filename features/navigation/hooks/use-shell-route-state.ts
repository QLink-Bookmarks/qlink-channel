import * as React from "react";

import { useWideView } from "@/lib/hooks/use-wide-view";

import {
  getBackHref,
  getMobileTabActiveItem,
  getOverlayBaseHref,
  getOverlayLinkId,
  getRedirectHref,
  getRouteTitle,
  getSettingsSectionKey,
  getWideSidebarActiveItem,
  isKnownShellPath,
  normalizePathname,
} from "../routes";
import type { RouteParams } from "../types";

import { useGlobalSearchParams, usePathname } from "expo-router";

function useShellRouteState() {
  const pathname = normalizePathname(usePathname());
  const searchParams = useGlobalSearchParams() as RouteParams;
  const isWideView = useWideView();

  return React.useMemo(() => {
    const routeTitle = getRouteTitle(pathname, searchParams, isWideView);
    const overlayLinkId = getOverlayLinkId(pathname, searchParams, isWideView);
    const redirectHref = getRedirectHref({
      isWideView,
      pathname,
      searchParams,
    });
    const wideSidebarKey = getWideSidebarActiveItem(pathname);
    const mobileTabKey = getMobileTabActiveItem(pathname);
    const settingsSectionKey = getSettingsSectionKey(pathname);
    const backHref = getBackHref(pathname);
    const showBackButton =
      !isWideView &&
      (pathname.startsWith("/folders") ||
        pathname.startsWith("/links") ||
        pathname.startsWith("/todos") ||
        pathname.startsWith("/settings"));

    return {
      pathname,
      searchParams,
      isWideView,
      routeTitle,
      overlayLinkId,
      overlayBaseHref: getOverlayBaseHref(pathname),
      redirectHref,
      wideSidebarKey,
      mobileTabKey,
      settingsSectionKey,
      backHref,
      showBackButton,
      isKnownShellPath: isKnownShellPath(pathname),
    };
  }, [isWideView, pathname, searchParams]);
}

export { useShellRouteState };
