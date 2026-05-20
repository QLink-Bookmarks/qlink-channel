import { Pressable, View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

import { ChevronLeft } from "lucide-react-native/icons";

// View scope: 반응형. md 미만은 좁은 뷰, md 이상은 와이드뷰로 동작한다.

function AppHeader({
  className,
  title,
  back,
  leftSlot,
  rightSlot,
  transparent,
  onBack,
  ...props
}: React.ComponentProps<typeof View> & {
  title?: string;
  back?: boolean;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  transparent?: boolean;
  sticky?: boolean;
  onBack?: () => void;
}) {
  return (
    <View
      className={cn(
        "min-h-14 flex-row items-center justify-between gap-3 border-b border-border px-4",
        transparent ? "bg-transparent" : "bg-background",
        className,
      )}
      {...props}
    >
      <View className="min-w-10 flex-row items-center">
        {back ? (
          <Pressable
            className="size-10 items-center justify-center rounded-full active:bg-accent"
            onPress={onBack}
          >
            <Icon as={ChevronLeft} />
          </Pressable>
        ) : (
          leftSlot
        )}
      </View>
      {title ? (
        <Text
          className="flex-1 text-center text-base font-semibold"
          numberOfLines={1}
        >
          {title}
        </Text>
      ) : (
        <View className="flex-1" />
      )}
      <View className="min-w-10 flex-row justify-end">{rightSlot}</View>
    </View>
  );
}

export { AppHeader };
