import { useEffect, useRef } from "react";

import { analytics } from "../analytics";

import { usePathname } from "expo-router";

function useScreenTracking() {
  const pathname = usePathname();
  const previous = useRef<string | null>(null);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    analytics.logScreenView(pathname);
  }, [pathname]);
}

export { useScreenTracking };
