import * as React from "react";

import { reportError } from "@/lib/error-reporting";
import { initializeKakaoSDK } from "@react-native-kakao/core";

function initializeKakao() {
  return initializeKakaoSDK(process.env.EXPO_PUBLIC_KAKAO_NATIVE_KEY ?? "", {
    web: {
      javascriptKey: process.env.EXPO_PUBLIC_KAKAO_JS_KEY ?? "",
      restApiKey: process.env.EXPO_PUBLIC_KAKAO_REST_KEY ?? "",
    },
  });
}

function useSocialSdks() {
  React.useEffect(() => {
    initializeKakao().catch((error) => reportError(error, { area: "social-sdk:kakao-init" }));
  }, []);
}

export { useSocialSdks };
