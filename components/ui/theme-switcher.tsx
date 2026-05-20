import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/text";
import { ACCENT_OPTIONS, accentSwatchClasses } from "@/lib/accent";
import { type AccentName, DEFAULT_ACCENT, type ThemeMode } from "@/lib/theme";
import { cn } from "@/lib/utils";

function ThemeSwitcher({
  className,
  accent,
  mode = "light",
  onAccentChange,
  onModeToggle,
  ...props
}: React.ComponentProps<typeof View> & {
  accent?: AccentName;
  mode?: ThemeMode;
  onAccentChange?: (accent: AccentName) => void;
  onModeToggle?: () => void;
}) {
  const resolvedAccent = accent ?? DEFAULT_ACCENT;

  return (
    <View
      className={cn("gap-3 rounded-2xl border border-border bg-card p-3", className)}
      {...props}
    >
      <View className="flex-row gap-2">
        {ACCENT_OPTIONS.map((option) => (
          <Pressable
            key={option}
            className={cn(
              "size-10 items-center justify-center rounded-full",
              option === resolvedAccent
                ? "border-2 border-foreground bg-card"
                : "border border-border-soft bg-transparent",
            )}
            onPress={() => onAccentChange?.(option)}
          >
            <View className={cn("size-7 rounded-full", accentSwatchClasses.swatch[option])} />
          </Pressable>
        ))}
      </View>
      <Pressable
        className="rounded-xl bg-surface-elevated px-3 py-2"
        onPress={onModeToggle}
      >
        <Text className="text-center text-sm font-medium">
          {mode === "dark" ? "Dark" : "Light"}
        </Text>
      </Pressable>
    </View>
  );
}

export { ThemeSwitcher };
