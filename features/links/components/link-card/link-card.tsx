import { Pressable, View } from "react-native";

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
          <View
            className={cn(
              "pointer-events-none absolute -left-3 top-4 z-10 opacity-0 transition-opacity web:group-hover:opacity-100",
              active && "pointer-events-auto opacity-100",
            )}
          >
            <View className="pointer-events-auto rounded-2xl border border-border-soft bg-card p-1.5 shadow-qlink-sm">
              {leadingHoverActions}
            </View>
          </View>
          <View
            className={cn(
              "pointer-events-none absolute right-4 top-4 z-10 flex-row gap-2 opacity-0 transition-opacity web:group-hover:opacity-100",
              active && "pointer-events-auto opacity-100",
            )}
          >
            {trailingHoverActions}
          </View>
        </>
      ) : null}
      <View className={cn("flex-row items-start gap-3", showHoverActions ? "pr-32" : "pr-6")}>
        <Favicon
          url={faviconUrl}
          fallback={domain.slice(0, 1).toUpperCase()}
        />
        <View className="flex-1 gap-1">
          <Text className="text-xs text-muted-foreground">{domain}</Text>
          <Text
            className="text-base font-semibold"
            numberOfLines={2}
          >
            {title}
          </Text>
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
      {visibleTodos.length ? (
        <View className="gap-2 border-t border-dashed border-border-soft pt-4">
          {visibleTodos.map((todo) => (
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
                className={cn("flex-1 text-sm", todo.done && "text-muted-foreground line-through")}
                numberOfLines={1}
              >
                {todo.text}
              </Text>
              {todo.dueLabel ? (
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
              ) : null}
            </View>
          ))}
          {extraTodoCount > 0 ? (
            <Text className="pl-8 text-sm text-muted-foreground">+{extraTodoCount}개 더</Text>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}

export { LinkCard };
export type { LinkCardTodo };
