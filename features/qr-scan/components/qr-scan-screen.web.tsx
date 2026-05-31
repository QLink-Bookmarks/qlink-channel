import * as React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useQrScanStore } from "@/stores/qr-scan";
import { BrowserQRCodeReader, type IScannerControls } from "@zxing/browser";

import { useRouter } from "expo-router";

type PermissionState = "pending" | "granted" | "denied" | "unsupported";

function QrScanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [detected, setDetected] = React.useState<string | null>(null);
  const [permissionState, setPermissionState] = React.useState<PermissionState>("pending");
  const setResult = useQrScanStore((state) => state.setResult);

  React.useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setPermissionState("unsupported");
      return;
    }

    const reader = new BrowserQRCodeReader();
    let controls: IScannerControls | null = null;
    let isCancelled = false;

    reader
      .decodeFromVideoDevice(undefined, videoRef.current ?? undefined, (result) => {
        if (!result || isCancelled) {
          return;
        }
        const text = result.getText();
        setDetected((prev) => (prev === text ? prev : text));
      })
      .then((nextControls) => {
        if (isCancelled) {
          nextControls.stop();
          return;
        }
        controls = nextControls;
        setPermissionState("granted");
      })
      .catch((error) => {
        console.log("qr-scan:web:permission-error", error);
        if (!isCancelled) {
          setPermissionState("denied");
        }
      });

    return () => {
      isCancelled = true;
      controls?.stop();
    };
  }, []);

  const handleUse = React.useCallback(() => {
    if (!detected) {
      return;
    }
    setResult(detected);
    router.back();
  }, [detected, router, setResult]);

  return (
    <View className="flex-1 bg-black">
      <View
        className="flex-1 items-center justify-center"
        testID="qr-scan-stage"
      >
        {permissionState === "granted" || permissionState === "pending" ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Text
            className="px-6 text-center text-base text-white"
            testID="qr-scan-permission-message"
          >
            {permissionState === "unsupported"
              ? "이 브라우저에서는 카메라를 사용할 수 없어요"
              : "설정에서 카메라 권한을 허용해주세요"}
          </Text>
        )}
      </View>
      <QrScanMeta
        detected={detected}
        bottomInset={Math.max(insets.bottom, 16)}
        onUse={handleUse}
      />
    </View>
  );
}

function QrScanMeta({
  detected,
  bottomInset,
  onUse,
}: {
  detected: string | null;
  bottomInset: number;
  onUse: () => void;
}) {
  const isUrl = detected != null && /^https?:\/\//i.test(detected);

  return (
    <View
      className="gap-2 border-t border-border bg-background px-4 pt-4"
      style={{ paddingBottom: bottomInset }}
      testID="qr-scan-meta"
    >
      {detected == null ? (
        <Text className="text-sm text-muted-foreground">QR 코드를 화면 가운데에 맞춰주세요</Text>
      ) : isUrl ? (
        <>
          <Text className="text-xs font-semibold text-muted-foreground">감지된 링크</Text>
          <Text
            className="text-sm font-medium text-foreground"
            numberOfLines={2}
          >
            {detected}
          </Text>
          <Button
            className="h-10 rounded-2xl"
            onPress={onUse}
          >
            <Text>사용하기</Text>
          </Button>
        </>
      ) : (
        <>
          <Text className="text-sm text-muted-foreground">QR을 감지했지만 URL이 아니에요</Text>
          <Text
            className="text-xs text-muted-foreground"
            numberOfLines={2}
          >
            {detected}
          </Text>
        </>
      )}
    </View>
  );
}

export { QrScanScreen };
