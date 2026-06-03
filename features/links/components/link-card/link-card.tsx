import { Platform, Pressable, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Favicon } from "@/components/ui/favicon";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

import { AlarmClock, Ellipsis, Pin } from "lucide-react-native/icons";

type LinkCardTodo = {
  id: string;
  text: string;
  done?: boolean;
  dueLabel?: string;
  overdue?: boolean;
};

type LinkCardStatusVariant = "progress" | "success" | "error" | null;

const statusVariantClasses: Record<NonNullable<LinkCardStatusVariant>, string> = {
  progress: "text-primary",
  success: "text-muted-foreground",
  error: "text-destructive",
};

function LinkCard({
  className,
  faviconUrl,
  domain,
  title,
  summary,
  tags = [],
  pinned,
  active,
  todos = [],
  remainingTodoCount,
  todoLayout = "row",
  statusLabel,
  statusVariant,
  summaryModelLabel,
  bookmarkHoverAction,
  leadingHoverActions,
  trailingHoverActions,
  onPress,
  onActionPress,
  onTodoToggle,
}: {
  className?: string;
  faviconUrl?: string;
  domain: string;
  title: string;
  summary?: string;
  tags?: string[];
  pinned?: boolean;
  active?: boolean;
  todos?: LinkCardTodo[];
  remainingTodoCount?: number;
  todoLayout?: "row" | "stack";
  statusLabel?: string | null;
  statusVariant?: LinkCardStatusVariant;
  summaryModelLabel?: string | null;
  /** Web-only corner badge anchored to the favicon's top-left (e.g. bookmark / shortcut toggle). */
  bookmarkHoverAction?: React.ReactNode;
  leadingHoverActions?: React.ReactNode;
  trailingHoverActions?: React.ReactNode;
  onPress?: () => void;
  onActionPress?: () => void;
  onTodoToggle?: (id: string, done: boolean) => void;
}) {
  const visibleTodos = todos.slice(0, 2);
  const extraTodoCount = remainingTodoCount ?? Math.max(todos.length - visibleTodos.length, 0);
  const showHoverActions = Boolean(leadingHoverActions || trailingHoverActions);

  return (
    <Pressable
      className={cn(
        "group relative gap-4 overflow-visible rounded-[28px] border border-border bg-card p-5 shadow-qlink-card active:border-primary",
        active && "border-primary shadow-qlink-md",
        pinned && "bg-warning/10",
        "web:hover:border-primary web:hover:shadow-qlink-md",
        className,
      )}
      onPress={onPress}
    >
      {showHoverActions ? (
        <>
          {leadingHoverActions ? (
            <View
              className={cn(
                "pointer-events-none absolute -left-3 top-4 z-10 opacity-0 transition-opacity web:group-hover:opacity-100",
                active && "pointer-events-auto opacity-100",
              )}
              {...(Platform.OS === "web"
                ? ({
                    onClick: (event: { stopPropagation?: () => void }) => {
                      event.stopPropagation?.();
                    },
                  } as Record<string, unknown>)
                : null)}
            >
              <View className="pointer-events-auto rounded-2xl border border-border-soft bg-card p-1.5 shadow-qlink-sm">
                {leadingHoverActions}
              </View>
            </View>
          ) : null}
          {trailingHoverActions ? (
            <View
              className={cn(
                "pointer-events-none absolute right-4 top-4 z-10 flex-row gap-1 opacity-0 transition-opacity web:group-hover:opacity-100",
                active && "pointer-events-auto opacity-100",
              )}
              {...(Platform.OS === "web"
                ? ({
                    onClick: (event: { stopPropagation?: () => void }) => {
                      event.stopPropagation?.();
                    },
                  } as Record<string, unknown>)
                : null)}
            >
              <View className="pointer-events-auto flex-row gap-1 rounded-2xl border border-border-soft bg-card p-1.5 shadow-qlink-sm">
                {trailingHoverActions}
              </View>
            </View>
          ) : null}
        </>
      ) : null}
      <View className={cn("flex-row items-start gap-3", showHoverActions ? "pr-28" : "pr-6")}>
        <View className="relative">
          <Favicon
            url={faviconUrl}
            fallback={domain.slice(0, 1).toUpperCase()}
          />
          {bookmarkHoverAction ? (
            <View
              className={cn(
                "pointer-events-none absolute -left-1.5 -top-1.5 z-10 opacity-0 transition-opacity web:group-hover:opacity-100",
                active && "pointer-events-auto opacity-100",
              )}
              {...(Platform.OS === "web"
                ? ({
                    onClick: (event: { stopPropagation?: () => void }) => {
                      event.stopPropagation?.();
                    },
                  } as Record<string, unknown>)
                : null)}
            >
              <View className="pointer-events-auto">{bookmarkHoverAction}</View>
            </View>
          ) : null}
        </View>
        <View className="flex-1 gap-1">
          <Text className="text-xs text-muted-foreground">{domain}</Text>
          <Text
            className="text-base font-semibold"
            numberOfLines={2}
          >
            {title}
          </Text>
          {summaryModelLabel ? (
            <Text
              className="text-xs font-medium text-muted-foreground"
              numberOfLines={1}
            >
              {summaryModelLabel}
            </Text>
          ) : null}
        </View>
        {pinned ? (
          <Icon
            as={Pin}
            className="size-4 text-warning"
          />
        ) : null}
        {!showHoverActions && onActionPress ? (
          <Pressable
            className="rounded-xl bg-card p-1"
            onPress={onActionPress}
          >
            <Icon
              as={Ellipsis}
              className="size-5 text-muted-foreground"
            />
          </Pressable>
        ) : null}
      </View>
      {summary ? (
        <Text
          className="text-sm text-muted-foreground"
          numberOfLines={2}
        >
          {summary}
        </Text>
      ) : null}
      {tags.length ? (
        <View className="flex-row flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="tag"
            >
              <Text>{tag}</Text>
            </Badge>
          ))}
        </View>
      ) : null}
      {statusLabel ? (
        <View className="flex-row justify-end">
          <Text
            className={cn(
              "text-xs font-semibold",
              statusVariant ? statusVariantClasses[statusVariant] : "text-muted-foreground",
            )}
            numberOfLines={1}
          >
            {statusLabel}
          </Text>
        </View>
      ) : null}
      {visibleTodos.length ? (
        <View className="gap-2 border-t border-dashed border-border-soft pt-4">
          {visibleTodos.map((todo) => {
            const dueBadge = todo.dueLabel ? (
              <View
                className={cn(
                  "flex-row items-center gap-1 rounded-full px-3 py-1.5",
                  todo.overdue ? "bg-destructive/10" : "bg-primary/10",
                )}
              >
                <Icon
                  as={AlarmClock}
                  className={cn("size-3.5", todo.overdue ? "text-destructive" : "text-primary")}
                />
                <Text
                  className={cn(
                    "text-xs font-semibold",
                    todo.overdue ? "text-destructive" : "text-primary",
                  )}
                >
                  {todo.dueLabel}
                </Text>
              </View>
            ) : null;

            if (todoLayout === "stack") {
              return (
                <View
                  key={todo.id}
                  className="flex-row items-start gap-3"
                >
                  <Checkbox
                    checked={todo.done ?? false}
                    disabled={!onTodoToggle}
                    shape="round"
                    size="sm"
                    onCheckedChange={(value) => onTodoToggle?.(todo.id, value === true)}
                  />
                  <View className="min-w-0 flex-1 gap-1.5">
                    <Text
                      className={cn("text-sm", todo.done && "text-muted-foreground line-through")}
                      numberOfLines={1}
                    >
                      {todo.text}
                    </Text>
                    {dueBadge ? <View className="self-start">{dueBadge}</View> : null}
                  </View>
                </View>
              );
            }

            return (
              <View
                key={todo.id}
                className="flex-row items-center gap-3"
              >
                <Checkbox
                  checked={todo.done ?? false}
                  disabled={!onTodoToggle}
                  shape="round"
                  size="sm"
                  onCheckedChange={(value) => onTodoToggle?.(todo.id, value === true)}
                />
                <Text
                  className={cn(
                    "flex-1 text-sm",
                    todo.done && "text-muted-foreground line-through",
                  )}
                  numberOfLines={1}
                >
                  {todo.text}
                </Text>
                {dueBadge}
              </View>
            );
          })}
          {extraTodoCount > 0 ? (
            <Text className="pl-8 text-sm text-muted-foreground">+{extraTodoCount}개 더</Text>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}

export { LinkCard };
export type { LinkCardStatusVariant, LinkCardTodo };
