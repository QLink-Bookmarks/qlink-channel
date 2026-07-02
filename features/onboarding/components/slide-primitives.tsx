import { Pressable, View } from "react-native";

import { Checkbox } from "@/components/ui/checkbox";
import { Favicon } from "@/components/ui/favicon";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

import { AlarmClock } from "lucide-react-native/icons";

// Shared leaf visuals used by both the native onboarding pager and the web
// marketing landing. Positioning/animation is left to the caller (the landing
// wraps these in scroll-reveal wrappers; onboarding places them statically), so
// these stay purely presentational.

export function faviconFor(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

// A single saved bookmark card. Width/position come from `className`.
export function BookmarkCard({
  className,
  rotate,
  faviconUrl,
  fallback,
  tint,
  title,
}: {
  className?: string;
  rotate: string;
  faviconUrl?: string;
  fallback: string;
  tint?: string;
  title: string;
}) {
  return (
    <View
      className={cn(
        "flex-row items-center gap-2.5 rounded-2xl border border-border-soft bg-card px-3 py-2.5 shadow-qlink-md",
        className,
      )}
      style={{ transform: [{ rotate }] }}
    >
      <View
        className={cn(
          "size-7 items-center justify-center overflow-hidden rounded-lg bg-muted",
          tint,
        )}
      >
        {faviconUrl ? (
          <Favicon
            url={faviconUrl}
            fallback={fallback}
            size="sm"
          />
        ) : (
          <Text className="text-sm">{fallback}</Text>
        )}
      </View>
      <Text
        className="flex-1 text-xs font-semibold text-foreground"
        numberOfLines={1}
      >
        {title}
      </Text>
    </View>
  );
}

// A small colored browser/app dot. Position comes from `className`.
export function BrowserDot({
  className,
  rotate,
  fallback,
  tint,
}: {
  className?: string;
  rotate: string;
  fallback: string;
  tint: string;
}) {
  return (
    <View
      className={cn(
        "size-8 items-center justify-center rounded-full shadow-qlink-sm",
        tint,
        className,
      )}
      style={{ transform: [{ rotate }] }}
    >
      <Text className="text-xs font-bold text-white">{fallback}</Text>
    </View>
  );
}

export function ChecklistRow({
  text,
  done,
  reminderLabel,
  overdue,
}: {
  text: string;
  done?: boolean;
  reminderLabel?: string;
  overdue?: boolean;
}) {
  return (
    <View className="flex-row items-center gap-3">
      <Checkbox
        checked={done ?? false}
        disabled
        shape="round"
        size="sm"
        onCheckedChange={() => {}}
      />
      <Text
        className={cn("flex-1 text-sm", done && "text-muted-foreground line-through")}
        numberOfLines={1}
      >
        {text}
      </Text>
      {reminderLabel ? (
        <View
          className={cn(
            "flex-row items-center gap-1 rounded-full px-3 py-1.5",
            overdue ? "bg-destructive/10" : "bg-primary/10",
          )}
        >
          <Icon
            as={AlarmClock}
            className={cn("size-3.5", overdue ? "text-destructive" : "text-primary")}
          />
          <Text
            className={cn("text-xs font-semibold", overdue ? "text-destructive" : "text-primary")}
          >
            {reminderLabel}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

// Folder pill. Pressable when `onPress` is supplied (landing uses this for the
// selectable filter row); a plain view otherwise (onboarding's static preview).
export function FolderChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  const className = cn(
    "rounded-full border px-3.5 py-1.5",
    active ? "border-primary bg-primary" : "border-border bg-card",
    onPress && "web:transition-transform web:hover:scale-105",
  );
  const content = (
    <Text
      className={cn(
        "text-sm font-semibold",
        active ? "text-primary-foreground" : "text-muted-foreground",
      )}
    >
      {label}
    </Text>
  );
  if (!onPress) {
    return <View className={className}>{content}</View>;
  }
  return (
    <Pressable
      className={cn(className, "active:opacity-90")}
      onPress={onPress}
    >
      {content}
    </Pressable>
  );
}

export function SheetChip({ label, active }: { label: string; active?: boolean }) {
  return (
    <View
      className={cn(
        "rounded-full border px-3 py-1.5",
        active ? "border-foreground bg-foreground" : "border-border bg-background",
      )}
    >
      <Text
        className={cn(
          "text-xs font-semibold",
          active ? "text-background" : "text-muted-foreground",
        )}
      >
        {label}
      </Text>
    </View>
  );
}

export function MemberAvatar({
  emoji,
  tint,
  overlap,
}: {
  emoji: string;
  tint: string;
  overlap?: boolean;
}) {
  return (
    <View
      className={cn(
        "size-10 items-center justify-center rounded-full border-2 border-card",
        tint,
        overlap && "-ml-3",
      )}
    >
      <Text className="text-lg">{emoji}</Text>
    </View>
  );
}
