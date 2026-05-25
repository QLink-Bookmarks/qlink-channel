import * as React from "react";

type ClipboardFeedback = {
  title: string;
  description: string;
};

function useClipboardFailureFeedback() {
  const isWeb = process.env.EXPO_OS === "web";

  return React.useMemo<ClipboardFeedback>(() => {
    if (!isWeb) {
      return {
        title: "클립보드를 읽지 못했어요",
        description: "입력창에 직접 붙여넣기 하거나 다시 시도해주세요.",
      };
    }

    return {
      title: "클립보드 권한이 필요해요",
      description: "브라우저 권한을 허용하거나 직접 붙여넣어주세요.",
    };
  }, [isWeb]);
}

export { useClipboardFailureFeedback };
export type { ClipboardFeedback };
