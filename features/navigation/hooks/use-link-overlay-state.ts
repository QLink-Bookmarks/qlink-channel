import * as React from "react";

import { useLinkDetailQuery } from "@/features/links/queries";

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
  const linkDetailQuery = useLinkDetailQuery(overlayLinkId);

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
    detail: linkDetailQuery.data,
    error: linkDetailQuery.isError,
    handleOpenChange,
    isLoading: linkDetailQuery.isLoading,
    isOpen: isWideView && Boolean(overlayLinkId),
  };
}

export { useLinkOverlayState };
