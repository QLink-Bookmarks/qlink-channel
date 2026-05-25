import * as React from "react";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { ErrorBoundaryBase } from "./error-boundary-base";

import { type Href, useRouter } from "expo-router";

function AppErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-background px-6 py-10">
      <View className="w-full max-w-md gap-5 rounded-[28px] border border-border bg-card p-6">
        <View className="gap-2">
          <Text className="text-2xl font-bold text-foreground">문제가 발생했어요</Text>
          <Text className="text-sm leading-6 text-muted-foreground">
            잠시 후 다시 시도하거나 홈으로 이동해주세요.
          </Text>
        </View>
        {__DEV__ ? (
          <View className="rounded-2xl bg-muted px-4 py-3">
            <Text
              className="text-xs leading-5 text-muted-foreground"
              numberOfLines={6}
            >
              {error.message}
            </Text>
          </View>
        ) : null}
        <View className="flex-row gap-3">
          <Button
            className="flex-1"
            onPress={reset}
          >
            <Text>다시 시도</Text>
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            onPress={() => router.replace("/home" as Href)}
          >
            <Text>홈으로 이동</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

function AppErrorBoundary({
  children,
  resetKeys,
}: {
  children: React.ReactNode;
  resetKeys?: unknown[];
}) {
  return (
    <ErrorBoundaryBase
      area="app-root"
      resetKeys={resetKeys}
      fallback={({ error, reset }) => (
        <AppErrorFallback
          error={error}
          reset={reset}
        />
      )}
    >
      {children}
    </ErrorBoundaryBase>
  );
}

export { AppErrorBoundary };
