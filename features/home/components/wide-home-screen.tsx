import * as React from "react";
import { Platform, Pressable, ScrollView, View } from "react-native";

import { BrandHeader } from "@/components/layout/brand-header";
import { TopbarSearchField } from "@/components/layout/topbar-search-field";
import { ActivityIndicator } from "@/components/ui/activity-indicator";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Kbd } from "@/components/ui/kbd";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Text } from "@/components/ui/text";
import { useMyProfileQuery } from "@/features/account/queries";
import { LinkCard } from "@/features/links/components/link-card/link-card";
import { useLinksQuery } from "@/features/links/queries";
import { TodoItem } from "@/features/todos/components/todo-item/todo-item";
import { formatReminderLabel, isOverdue } from "@/features/todos/lib/todo-list-helpers";
import { useToggleTodoCompletedMutation } from "@/features/todos/mutations";
import { useTodosQuery } from "@/features/todos/queries";
import type { TodoListItem } from "@/features/todos/types";
import { useDisplaySettings } from "@/stores/display-settings";
import { useQueryClient } from "@tanstack/react-query";

import { formatFullDateLabel, getGreetingMessage } from "../lib/greeting";
import { getDomainFromUrl, mapLinkListItem } from "../lib/link-card-mapper";
import { AddShortcutDialog } from "./add-shortcut-dialog";
import { AddShortcutTile, HomeShortcutTile } from "./home-shortcut-tile";

import { type Href, useRouter } from "expo-router";
import { Search } from "lucide-react-native";

const SEARCH_SCOPES = [
  { label: "🔀 통합", value: "all" },
  { label: "⊕ 내 링크", value: "links" },
  { label: "🌐 웹", value: "web" },
];

const TODO_PREVIEW_COUNT = 6;
const RECENT_PREVIEW_COUNT = 6;
const SHORTCUT_PREVIEW_COUNT = 9;
const GRID_ITEM_CLASS = "w-[calc(33.333%-0.5rem)] min-w-[260px]";

function dispatchWideShortcut(key: "search" | "new-link") {
  if (Platform.OS !== "web" || typeof window === "undefined") {
    return;
  }
  const event =
    key === "search"
      ? new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
      : new KeyboardEvent("keydown", { key: "n", bubbles: true });
  window.dispatchEvent(event);
}

function SectionHeader({
  emoji,
  title,
  count,
  onSeeAll,
}: {
  emoji: string;
  title: string;
  count?: number;
  onSeeAll?: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        <Text className="text-base font-semibold text-foreground">
          {emoji} {title}
        </Text>
        {count != null ? (
          <Badge variant="secondary">
            <Text className="text-xs">{count}</Text>
          </Badge>
        ) : null}
      </View>
      {onSeeAll ? (
        <Pressable
          className="active:opacity-60"
          onPress={onSeeAll}
        >
          <Text className="text-sm text-muted-foreground">전체 →</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function ActionPill({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) {
  return (
    <Pressable
      className="flex-row items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 active:opacity-70 web:transition-colors web:hover:border-primary"
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}

function EmptySectionCard({ message }: { message: string }) {
  return (
    <View className="rounded-2xl border border-border bg-card px-4 py-6">
      <Text className="text-center text-sm text-muted-foreground">{message}</Text>
    </View>
  );
}

function WideHomeScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const accent = useDisplaySettings((state) => state.display.accent);
  const theme = useDisplaySettings((state) => state.display.theme);
  const avatarEmojiOverride = useDisplaySettings((state) => state.profile.avatarEmoji);

  const myProfileQuery = useMyProfileQuery();
  const nickname = myProfileQuery.data?.nickname ?? "사용자";
  const avatarEmoji = avatarEmojiOverride ?? myProfileQuery.data?.avatarEmoji ?? "🌸";

  const now = React.useMemo(() => new Date(), []);
  const greeting = getGreetingMessage(now);
  const dateLabel = formatFullDateLabel(now);
  const nowMs = now.getTime();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchScope, setSearchScope] = React.useState("all");
  const [isAddShortcutOpen, setIsAddShortcutOpen] = React.useState(false);

  const favoritesQuery = useLinksQuery({ isFavorite: true, size: SHORTCUT_PREVIEW_COUNT });
  const todosQuery = useTodosQuery({ isCompleted: false, size: 30 });
  const recentLinksQuery = useLinksQuery({ order: "latest", size: RECENT_PREVIEW_COUNT });
  const toggleTodo = useToggleTodoCompletedMutation();

  const shortcuts = favoritesQuery.data?.contents ?? [];
  const todos = React.useMemo(() => todosQuery.data?.contents ?? [], [todosQuery.data?.contents]);
  const previewTodos = React.useMemo(() => {
    return [...todos]
      .sort((a, b) => {
        const aTime = a.reminderAt ? new Date(a.reminderAt).getTime() : Number.POSITIVE_INFINITY;
        const bTime = b.reminderAt ? new Date(b.reminderAt).getTime() : Number.POSITIVE_INFINITY;
        return aTime - bTime;
      })
      .slice(0, TODO_PREVIEW_COUNT);
  }, [todos]);
  const recentLinks = recentLinksQuery.data?.contents ?? [];

  const handleToggleTodo = React.useCallback(
    (todo: TodoListItem, next: boolean) => {
      toggleTodo.mutate(
        { todoId: todo.id, payload: { isCompleted: next } },
        {
          onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: ["todos"] });
          },
        },
      );
    },
    [queryClient, toggleTodo],
  );

  return (
    <ScrollView
      className="flex-1"
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full max-w-[980px] gap-8 self-center px-6 pb-16 pt-10">
        <View className="items-center gap-2">
          <BrandHeader
            accent={accent}
            mode={theme}
            size="xl"
            align="center"
            className="px-0 pt-0"
          />
          <Text className="text-xl font-bold text-foreground">
            안녕 {nickname}, {greeting} {avatarEmoji}
          </Text>
          <Text className="text-sm text-muted-foreground">{dateLabel}</Text>
        </View>

        <View className="items-center gap-4">
          <TopbarSearchField
            className="min-h-12 w-full max-w-[640px]"
            value={searchQuery}
            placeholder="웹 검색 또는 내 링크 검색…"
            leftSlot={
              <Icon
                as={Search}
                className="size-5 text-muted-foreground"
              />
            }
            action={{ label: "검색", onPress: () => dispatchWideShortcut("search") }}
            onChange={setSearchQuery}
            onSubmit={() => dispatchWideShortcut("search")}
          />
          <SegmentedControl
            labelClassName="text-sm"
            options={SEARCH_SCOPES}
            selectionMode="single"
            value={searchScope}
            variant="chipsBadge"
            onValueChange={(next) => {
              if (typeof next === "string") {
                setSearchScope(next);
              }
            }}
          />
        </View>

        <View className="flex-row flex-wrap items-start justify-center gap-5">
          {shortcuts.map((link) => (
            <HomeShortcutTile
              key={link.id}
              url={link.url}
              label={link.title || getDomainFromUrl(link.url)}
            />
          ))}
          <AddShortcutTile onPress={() => setIsAddShortcutOpen(true)} />
        </View>

        <View className="flex-row flex-wrap items-center justify-center gap-2">
          <ActionPill onPress={() => dispatchWideShortcut("new-link")}>
            <Text className="text-xs font-medium text-foreground">새 링크</Text>
            <Kbd size="sm">N</Kbd>
          </ActionPill>
          <ActionPill onPress={() => router.push("/todos" as Href)}>
            <Text className="text-xs font-medium text-foreground">✅ 할일 {todos.length}</Text>
          </ActionPill>
          <ActionPill onPress={() => router.push("/links" as Href)}>
            <Text className="text-xs font-medium text-foreground">📚 전체 보기</Text>
          </ActionPill>
        </View>

        <View className="gap-3">
          <SectionHeader
            emoji="📌"
            title="오늘 할 일"
            count={todos.length}
            onSeeAll={() => router.push("/todos" as Href)}
          />
          {todosQuery.isLoading ? (
            <ActivityIndicator className="py-8" />
          ) : previewTodos.length === 0 ? (
            <EmptySectionCard message="예정된 할 일이 없어요." />
          ) : (
            <View className="flex-row flex-wrap gap-3">
              {previewTodos.map((todo) => (
                <View
                  key={todo.id}
                  className={GRID_ITEM_CLASS}
                >
                  <TodoItem
                    variant="display"
                    text={todo.title}
                    done={Boolean(todo.completedAt)}
                    reminderLabel={formatReminderLabel(todo.reminderAt, {
                      withOverdueSuffix: true,
                    })}
                    overdue={isOverdue(todo, nowMs)}
                    linkUrl={todo.linkUrl}
                    linkTitle={todo.linkTitle}
                    onToggle={(next) => handleToggleTodo(todo, next)}
                    onPress={() => router.push(`/links/${todo.linkId}` as Href)}
                  />
                </View>
              ))}
            </View>
          )}
        </View>

        <View className="gap-3">
          <SectionHeader
            emoji="🔖"
            title="최근 저장"
            count={recentLinks.length}
            onSeeAll={() => router.push("/links" as Href)}
          />
          {recentLinksQuery.isLoading ? (
            <ActivityIndicator className="py-8" />
          ) : recentLinks.length === 0 ? (
            <EmptySectionCard message="아직 저장한 링크가 없어요." />
          ) : (
            <View className="flex-row flex-wrap gap-3">
              {recentLinks.map((item) => {
                const mapped = mapLinkListItem(item);
                return (
                  <View
                    key={mapped.id}
                    className={GRID_ITEM_CLASS}
                  >
                    <LinkCard
                      domain={mapped.domain}
                      faviconUrl={mapped.faviconUrl}
                      remainingTodoCount={mapped.remainingTodoCount}
                      statusLabel={mapped.statusLabel}
                      statusVariant={mapped.statusVariant}
                      summaryModelLabel={mapped.summaryModelLabel}
                      tags={mapped.tags}
                      title={mapped.title}
                      todos={mapped.todos}
                      todoLayout="stack"
                      onPress={() => router.push(`/links/${mapped.id}` as Href)}
                    />
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View className="flex-row flex-wrap items-center justify-center gap-2 pt-2">
          <Text className="text-xs text-muted-foreground">
            N 새 링크 · ⌘K 검색 · ? 단축키 도움말
          </Text>
        </View>
      </View>

      <AddShortcutDialog
        open={isAddShortcutOpen}
        onOpenChange={setIsAddShortcutOpen}
      />
    </ScrollView>
  );
}

export { WideHomeScreen };
