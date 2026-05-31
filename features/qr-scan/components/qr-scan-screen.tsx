import * as React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useQrScanStore } from "@/stores/qr-scan";

import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";

function QrScanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [detected, setDetected] = React.useState<string | null>(null);
  const setResult = useQrScanStore((state) => state.setResult);

  React.useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleUse = React.useCallback(() => {
    if (!detected) {
      return;
    }
    setResult(detected);
    router.back();
  }, [detected, router, setResult]);

  const handleBarcode = React.useCallback(({ data }: { data: string }) => {
    setDetected((prev) => (prev === data ? prev : data));
  }, []);

  return (
    <View className="flex-1 bg-black">
      {permission?.granted ? (
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={handleBarcode}
        />
      ) : (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-base text-white">
            {permission?.canAskAgain === false
              ? "설정에서 카메라 권한을 허용해주세요"
              : "카메라 권한을 요청 중이에요"}
          </Text>
        </View>
      )}
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
