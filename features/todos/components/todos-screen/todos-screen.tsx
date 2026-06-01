import * as React from "react";
import { Pressable, ScrollView, View } from "react-native";

import { PageHeader } from "@/components/layout/page-header";
import { ActivityIndicator } from "@/components/ui/activity-indicator";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { Favicon } from "@/components/ui/favicon";
import { Icon } from "@/components/ui/icon";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Text } from "@/components/ui/text";
import { getLinkDetailQueryKey } from "@/features/links/queries";
import type { LinkDetail } from "@/features/links/types";
import { reportError } from "@/lib/error-reporting";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

import {
  type TodoFilter,
  countTodosByFilter,
  filterTodos,
  formatReminderLabel,
  getDomainFromUrl,
  getFaviconUrl,
  getTodoBucket,
  groupTodosByLink,
  isOverdue,
} from "../../lib/todo-list-helpers";
import { useToggleTodoCompletedMutation } from "../../mutations";
import { useTodosQuery } from "../../queries";
import type { TodoListItem } from "../../types";

import { type Href, useRouter } from "expo-router";
import { AlarmClock } from "lucide-react-native/icons";

type TodosScreenMode = "mobile" | "wide";

const FILTER_OPTIONS: { value: TodoFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "incomplete", label: "미완료" },
  { value: "upcoming", label: "⏰ 알림예정" },
  { value: "overdue", label: "🔥 기간지남" },
  { value: "completed", label: "✓ 완료" },
];

function useTodosScreenState() {
  const [filter, setFilter] = React.useState<TodoFilter>("all");
  const todosQuery = useTodosQuery({ size: 100 });
  const allTodos = React.useMemo(() => todosQuery.data?.contents ?? [], [todosQuery.data]);
  // Refresh "now" whenever the underlying todo list changes so that overdue/upcoming buckets stay consistent.
  const nowMs = React.useMemo(() => Date.now(), [allTodos]); // eslint-disable-line react-hooks/exhaustive-deps
  const counts = React.useMemo(() => countTodosByFilter(allTodos, nowMs), [allTodos, nowMs]);
  const filteredTodos = React.useMemo(
    () => filterTodos(allTodos, filter, nowMs),
    [allTodos, filter, nowMs],
  );

  const filterChips = FILTER_OPTIONS.map((option) => ({
    label: `${option.label} ${counts[option.value]}`,
    value: option.value,
  }));

  return {
    counts,
    filter,
    filterChips,
    filteredTodos,
    isLoading: todosQuery.isLoading,
    nowMs,
    setFilter,
    totalCount: counts.all,
  };
}

function useToggleHandler() {
  const queryClient = useQueryClient();
  const toggleMutation = useToggleTodoCompletedMutation();

  const handleToggle = React.useCallback(
    async (todo: TodoListItem, nextChecked: boolean) => {
      try {
        const response = await toggleMutation.mutateAsync({
          payload: { isCompleted: nextChecked },
          todoId: todo.id,
        });

        const completedAt = nextChecked
          ? (response.data?.completeAt ?? new Date().toISOString())
          : null;

        queryClient.setQueriesData<{
          contents: TodoListItem[];
          [key: string]: unknown;
        }>({ queryKey: ["todos", "list"] }, (data) => {
          if (!data) return data;
          return {
            ...data,
            contents: data.contents.map((t) => (t.id === todo.id ? { ...t, completedAt } : t)),
          };
        });

        queryClient.setQueryData<LinkDetail>(getLinkDetailQueryKey(todo.linkId), (current) => {
          if (!current) return current;
          return {
            ...current,
            todos: (current.todos ?? []).map((t) =>
              String(t.id) === String(todo.id)
                ? { ...t, completed: nextChecked, completedAt, done: nextChecked }
                : t,
            ),
          };
        });
      } catch (error: unknown) {
        reportError(error, {
          area: "todos-screen:toggle",
          extra: { isCompleted: nextChecked, todoId: todo.id },
        });
      }
    },
    [queryClient, toggleMutation],
  );

  return handleToggle;
}

function TodoRow({
  todo,
  layout,
  nowMs,
  onToggle,
  onPress,
}: {
  todo: TodoListItem;
  layout: "card" | "row";
  nowMs: number;
  onToggle: (todo: TodoListItem, nextChecked: boolean) => void;
  onPress?: (todo: TodoListItem) => void;
}) {
  const done = Boolean(todo.completedAt);
  const overdue = isOverdue(todo, nowMs);
  const reminderLabel = formatReminderLabel(todo.reminderAt, { withOverdueSuffix: overdue });
  const domain = getDomainFromUrl(todo.linkUrl);

  if (layout === "row") {
    return (
      <View
        className={cn(
          "flex-row items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3",
          overdue && "border-destructive/40 bg-destructive/5",
        )}
      >
        <Pressable
          className="min-w-0 flex-1 flex-row items-center gap-3"
          onPress={onPress ? () => onPress(todo) : undefined}
        >
          <Favicon
            url={getFaviconUrl(todo.linkUrl)}
            fallback={domain.slice(0, 1).toUpperCase()}
          />
          <View className="min-w-0 flex-1 gap-1">
            <Text
              className={cn(
                "text-base font-semibold text-foreground",
                done && "text-muted-foreground line-through",
              )}
              numberOfLines={1}
            >
              {todo.title}
            </Text>
            <Text
              className="text-xs text-muted-foreground"
              numberOfLines={1}
            >
              {`${domain} · ${todo.linkTitle}`}
            </Text>
            {reminderLabel ? (
              <View className="flex-row items-center gap-1">
                <Icon
                  as={AlarmClock}
                  size={14}
                  className={cn("text-primary", overdue && "text-destructive")}
                />
                <Text
                  className={cn(
                    "text-xs font-semibold text-primary",
                    overdue && "text-destructive",
                  )}
                >
                  {reminderLabel}
                </Text>
              </View>
            ) : null}
          </View>
        </Pressable>
        <Checkbox
          checked={done}
          shape="round"
          onCheckedChange={(value) => onToggle(todo, value === true)}
        />
      </View>
    );
  }

  return (
    <View className="flex-row items-start gap-3">
      <Checkbox
        checked={done}
        shape="round"
        onCheckedChange={(value) => onToggle(todo, value === true)}
      />
      <Pressable
        className="min-w-0 flex-1 gap-1.5"
        onPress={onPress ? () => onPress(todo) : undefined}
      >
        <Text
          className={cn(
            "text-sm font-medium text-foreground",
            done && "text-muted-foreground line-through",
            overdue && !done && "text-destructive",
          )}
        >
          {todo.title}
        </Text>
        {reminderLabel ? (
          <View
            className={cn(
              "flex-row items-center gap-1 self-start rounded-full px-3 py-1",
              overdue ? "bg-destructive/10" : "bg-primary/10",
            )}
          >
            <Icon
              as={AlarmClock}
              size={12}
              className={cn(overdue ? "text-destructive" : "text-primary")}
            />
            <Text
              className={cn("text-xs font-semibold", overdue ? "text-destructive" : "text-primary")}
            >
              {reminderLabel}
            </Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}

function LinkTodoCard({
  group,
  nowMs,
  onToggle,
  onPress,
}: {
  group: ReturnType<typeof groupTodosByLink>[number];
  nowMs: number;
  onToggle: (todo: TodoListItem, nextChecked: boolean) => void;
  onPress?: (todo: TodoListItem) => void;
}) {
  const domain = getDomainFromUrl(group.linkUrl);

  return (
    <View className="gap-3 rounded-3xl border border-border bg-card p-4">
      <Pressable
        className="flex-row items-center gap-2"
        onPress={onPress ? () => onPress(group.todos[0]) : undefined}
      >
        <Favicon
          url={getFaviconUrl(group.linkUrl)}
          fallback={domain.slice(0, 1).toUpperCase()}
        />
        <Text
          className="min-w-0 flex-1 text-sm font-semibold text-muted-foreground"
          numberOfLines={1}
        >
          {`${domain} · ${group.linkTitle}`}
        </Text>
      </Pressable>
      <View className="gap-3">
        {group.todos.map((todo) => (
          <TodoRow
            key={todo.id}
            layout="card"
            nowMs={nowMs}
            onPress={onPress}
            onToggle={onToggle}
            todo={todo}
          />
        ))}
      </View>
    </View>
  );
}

function SectionHeader({ emoji, label, count }: { emoji: string; label: string; count: number }) {
  return (
    <View className="flex-row items-center gap-2">
      <Text className="text-base font-bold text-foreground">{`${emoji} ${label}`}</Text>
      <View className="rounded-full bg-muted px-2 py-0.5">
        <Text className="text-xs font-semibold text-muted-foreground">{count}</Text>
      </View>
    </View>
  );
}

function WideTodosScreen() {
  const router = useRouter();
  const { filter, filterChips, filteredTodos, isLoading, nowMs, setFilter, totalCount } =
    useTodosScreenState();
  const handleToggle = useToggleHandler();
  const handleTodoPress = React.useCallback(
    (todo: TodoListItem) => {
      router.replace(`/todos?linkId=${todo.linkId}` as Href);
    },
    [router],
  );

  const overdueTodos = filteredTodos.filter((todo) => getTodoBucket(todo, nowMs) === "overdue");
  const upcomingTodos = filteredTodos.filter((todo) => getTodoBucket(todo, nowMs) === "upcoming");
  const completedTodos = filteredTodos.filter((todo) => getTodoBucket(todo, nowMs) === "completed");

  return (
    <ScrollView
      className="flex-1"
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <PageHeader
        title="할일"
        emoji="✅"
        meta={`${totalCount}개`}
      />
      <View className="gap-6 px-6 pb-10 pt-2">
        <SegmentedControl
          options={filterChips}
          selectionMode="single"
          value={filter}
          variant="chipsBadge"
          onValueChange={(next) => {
            if (typeof next === "string") {
              setFilter(next as TodoFilter);
            }
          }}
        />
        {isLoading ? (
          <ActivityIndicator
            size="large"
            className="py-16"
          />
        ) : filteredTodos.length === 0 ? (
          <EmptyState
            emoji="✅"
            title="해당하는 할 일이 없어요"
            description="다른 필터를 선택해보세요."
          />
        ) : (
          <View className="gap-6">
            {overdueTodos.length > 0 ? (
              <View className="gap-3">
                <SectionHeader
                  emoji="🔥"
                  label="기간지남"
                  count={overdueTodos.length}
                />
                <View className="gap-3">
                  {overdueTodos.map((todo) => (
                    <TodoRow
                      key={todo.id}
                      layout="row"
                      nowMs={nowMs}
                      onPress={handleTodoPress}
                      onToggle={handleToggle}
                      todo={todo}
                    />
                  ))}
                </View>
              </View>
            ) : null}
            {upcomingTodos.length > 0 ? (
              <View className="gap-3">
                <SectionHeader
                  emoji="⏰"
                  label="알림예정"
                  count={upcomingTodos.length}
                />
                <View className="gap-3">
                  {upcomingTodos.map((todo) => (
                    <TodoRow
                      key={todo.id}
                      layout="row"
                      nowMs={nowMs}
                      onPress={handleTodoPress}
                      onToggle={handleToggle}
                      todo={todo}
                    />
                  ))}
                </View>
              </View>
            ) : null}
            {completedTodos.length > 0 ? (
              <View className="gap-3">
                <SectionHeader
                  emoji="✓"
                  label="완료"
                  count={completedTodos.length}
                />
                <View className="gap-3">
                  {completedTodos.map((todo) => (
                    <TodoRow
                      key={todo.id}
                      layout="row"
                      nowMs={nowMs}
                      onPress={handleTodoPress}
                      onToggle={handleToggle}
                      todo={todo}
                    />
                  ))}
                </View>
              </View>
            ) : null}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function MobileTodosScreen() {
  const router = useRouter();
  const { filter, filterChips, filteredTodos, isLoading, nowMs, setFilter } = useTodosScreenState();
  const handleToggle = useToggleHandler();
  const handleTodoPress = React.useCallback(
    (todo: TodoListItem) => {
      router.push(`/links/${todo.linkId}` as Href);
    },
    [router],
  );
  const groups = React.useMemo(() => groupTodosByLink(filteredTodos), [filteredTodos]);

  return (
    <ScrollView
      className="flex-1"
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-5 px-4 pb-24 pt-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <SegmentedControl
            options={filterChips}
            selectionMode="single"
            value={filter}
            variant="chipsBadge"
            onValueChange={(next) => {
              if (typeof next === "string") {
                setFilter(next as TodoFilter);
              }
            }}
          />
        </ScrollView>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            className="py-16"
          />
        ) : groups.length === 0 ? (
          <EmptyState
            emoji="✅"
            title="해당하는 할 일이 없어요"
            description="다른 필터를 선택해보세요."
          />
        ) : (
          <View className="gap-3">
            {groups.map((group) => (
              <LinkTodoCard
                key={group.linkId}
                group={group}
                nowMs={nowMs}
                onPress={handleTodoPress}
                onToggle={handleToggle}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function TodosScreen({ mode }: { mode: TodosScreenMode }) {
  if (mode === "wide") {
    return <WideTodosScreen />;
  }
  return <MobileTodosScreen />;
}

export { TodosScreen };
export type { TodosScreenMode };
