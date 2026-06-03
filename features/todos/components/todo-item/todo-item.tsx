import { Pressable, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Favicon } from "@/components/ui/favicon";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { getDomainFromUrl, getFaviconUrl } from "@/features/home/lib/link-card-mapper";
import { cn } from "@/lib/utils";

import { AlarmClock } from "lucide-react-native/icons";

type TodoItemVariant = "inline" | "row" | "display";

type TodoItemProps = {
  className?: string;
  variant?: TodoItemVariant;
  text: string;
  done?: boolean;
  /** Pre-formatted reminder string (e.g. "06/04 09:36" or "06/04 09:36 (지남)"). */
  reminderLabel?: string | null;
  overdue?: boolean;
  /** Source-link URL — when set on the display variant, renders a favicon + domain header. */
  linkUrl?: string | null;
  /** Source-link title — paired with the domain in the header line. */
  linkTitle?: string | null;
  /** Adds a "👥 공유 할 일" badge under the reminder. */
  isShared?: boolean;
  /** Legacy free-form badge slot (used by the existing inline/row callers). */
  badge?: string;
  visibility?: "public" | "private";
  onToggle?: (done: boolean) => void;
  onPress?: () => void;
};

function ReminderPill({ label, overdue }: { label: string; overdue?: boolean }) {
  return (
    <View
      className={cn(
        "flex-row items-center gap-1 self-start rounded-full px-3 py-1",
        overdue ? "bg-destructive/10" : "bg-primary/10",
      )}
    >
      <Icon
        as={AlarmClock}
        size={12}
        className={overdue ? "text-destructive" : "text-primary"}
      />
      <Text className={cn("text-xs font-semibold", overdue ? "text-destructive" : "text-primary")}>
        {label}
      </Text>
    </View>
  );
}

function TodoItem({
  className,
  variant = "row",
  text,
  done,
  reminderLabel,
  overdue,
  linkUrl,
  linkTitle,
  isShared,
  badge,
  visibility,
  onToggle,
  onPress,
}: TodoItemProps) {
  if (variant === "display") {
    const domain = linkUrl ? getDomainFromUrl(linkUrl) : null;
    const hasLinkHeader = Boolean(linkUrl || linkTitle);

    return (
      <View
        className={cn(
          "gap-3 rounded-2xl border border-border bg-card px-4 py-3.5",
          overdue && !done && "border-destructive/40 bg-destructive/5",
          className,
        )}
      >
        {hasLinkHeader ? (
          <View className="flex-row items-center gap-2">
            {linkUrl ? (
              <Favicon
                url={getFaviconUrl(linkUrl)}
                fallback={(domain ?? "?").slice(0, 1).toUpperCase()}
              />
            ) : null}
            <Text
              className="min-w-0 flex-1 text-xs font-semibold text-muted-foreground"
              numberOfLines={1}
            >
              {[domain, linkTitle].filter(Boolean).join(" · ")}
            </Text>
          </View>
        ) : null}
        <View className="flex-row items-start gap-3">
          <Checkbox
            checked={done ?? false}
            shape="round"
            onCheckedChange={(value) => onToggle?.(value === true)}
          />
          <Pressable
            className="min-w-0 flex-1 gap-2"
            onPress={onPress}
          >
            <Text
              className={cn(
                "text-base font-semibold text-foreground",
                done && "text-muted-foreground line-through",
                overdue && !done && "text-destructive",
              )}
            >
              {text}
            </Text>
            {reminderLabel ? (
              <ReminderPill
                label={reminderLabel}
                overdue={overdue}
              />
            ) : null}
            {isShared ? (
              <Badge
                className="self-start px-2.5 py-0.5"
                variant="todo"
              >
                <Text className="text-xs font-semibold">👥 공유 할 일</Text>
              </Badge>
            ) : null}
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <Pressable
      className={cn(
        "flex-row items-center gap-3 rounded-xl border border-border-soft bg-surface p-3",
        variant === "inline" && "border-transparent bg-transparent p-0",
        className,
      )}
      onPress={onPress}
    >
      <Checkbox
        checked={done ?? false}
        shape="round"
        onCheckedChange={(value) => onToggle?.(value === true)}
      />
      <View className="flex-1 gap-1">
        <Text
          className={cn(
            "text-sm",
            done && "text-muted-foreground line-through",
            overdue && "text-destructive",
          )}
        >
          {text}
        </Text>
        <View className="flex-row flex-wrap gap-1.5">
          {badge ? (
            <Badge variant={overdue ? "overdue" : "todo"}>
              <Text>{badge}</Text>
            </Badge>
          ) : null}
          {reminderLabel ? (
            <Badge variant={overdue ? "overdue" : "todo"}>
              <Text>{reminderLabel}</Text>
            </Badge>
          ) : null}
          {visibility ? (
            <Badge variant={visibility}>
              <Text>{visibility}</Text>
            </Badge>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

export { TodoItem };
export type { TodoItemProps, TodoItemVariant };
