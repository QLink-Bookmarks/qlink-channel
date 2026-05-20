import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

// View scope: 와이드뷰 전용. md >= 768px에서 사용한다.

type PageHeaderPrimaryAction = {
  label: string;
  onPress?: () => void;
};

function PageHeader({
  className,
  title,
  emoji,
  meta,
  primaryAction,
  actions,
  ...props
}: React.ComponentProps<typeof View> & {
  title: string;
  emoji?: string;
  meta?: string;
  primaryAction?: PageHeaderPrimaryAction;
  actions?: React.ReactNode;
}) {
  return (
    <View
      className={cn(
        "hidden max-w-[1600px] flex-row items-start justify-between gap-4 px-6 py-5 md:flex",
        className,
      )}
      {...props}
    >
      <View className="flex-1 gap-1">
        <Text className="text-3xl font-extrabold">
          {emoji ? `${emoji} ` : ""}
          {title}
        </Text>
        {meta ? <Text className="text-sm text-muted-foreground">{meta}</Text> : null}
      </View>
      {actions || primaryAction ? (
        <View className="flex-row items-center gap-2">
          {actions}
          {primaryAction ? (
            <Button
              className="min-w-28 shadow-qlink-md"
              onPress={primaryAction.onPress}
              variant="gradient"
            >
              <Text className="text-sm font-semibold text-primary-foreground">
                {primaryAction.label}
              </Text>
            </Button>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export { PageHeader };
export type { PageHeaderPrimaryAction };
