import * as React from "react";

import { getLinkDetailMock } from "../routes";

import { type Href, useRouter } from "expo-router";

function useLinkOverlayState({
  isWideView,
  overlayBaseHref,
  overlayLinkId,
}: {
  isWideView: boolean;
  overlayBaseHref: string;
  overlayLinkId?: string;
}) {
  const router = useRouter();

  const detail = React.useMemo(() => {
    if (!overlayLinkId) {
      return undefined;
    }

    return getLinkDetailMock(overlayLinkId);
  }, [overlayLinkId]);

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (open || !isWideView) {
        return;
      }

      router.replace(overlayBaseHref as Href);
    },
    [isWideView, overlayBaseHref, router],
  );

  return {
    isOpen: isWideView && Boolean(overlayLinkId && detail),
    detail,
    handleOpenChange,
  };
}

export { useLinkOverlayState };
