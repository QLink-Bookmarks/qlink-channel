import * as React from "react";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

import { ErrorBoundaryBase } from "./error-boundary-base";

type RouteErrorBoundaryProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  resetKeys?: unknown[];
  onClose?: () => void;
};

function RouteErrorBoundary({
  children,
  title = "이 영역을 불러오지 못했어요",
  description = "잠시 후 다시 시도해주세요.",
  className,
  resetKeys,
  onClose,
}: RouteErrorBoundaryProps) {
  return (
    <ErrorBoundaryBase
      area="route-section"
      resetKeys={resetKeys}
      fallback={({ error, reset }) => (
        <View className={cn("gap-4 rounded-[24px] border border-border bg-card p-5", className)}>
          <View className="gap-2">
            <Text className="text-lg font-semibold text-foreground">{title}</Text>
            <Text className="text-sm leading-6 text-muted-foreground">{description}</Text>
          </View>
          {__DEV__ ? (
            <View className="rounded-2xl bg-muted px-4 py-3">
              <Text
                className="text-xs leading-5 text-muted-foreground"
                numberOfLines={5}
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
            {onClose ? (
              <Button
                className="flex-1"
                variant="outline"
                onPress={onClose}
              >
                <Text>닫기</Text>
              </Button>
            ) : null}
          </View>
        </View>
      )}
    >
      {children}
    </ErrorBoundaryBase>
  );
}

export { RouteErrorBoundary };
