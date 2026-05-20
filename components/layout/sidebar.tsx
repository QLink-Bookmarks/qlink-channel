import { Pressable, View } from "react-native";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Kbd } from "@/components/ui/kbd";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

import type { LucideIcon } from "lucide-react-native";

// View scope: 와이드뷰 전용. md >= 768px에서 사용한다.

function Sidebar({
  className,
  collapsed,
  children,
  ...props
}: React.ComponentProps<typeof View> & { collapsed?: boolean }) {
  return (
    <View
      className={cn(
        "hidden h-full border-r border-sidebar-border bg-sidebar p-3 md:flex",
        collapsed ? "w-20" : "w-72",
        className,
      )}
      {...props}
    >
      {children}
    </View>
  );
}

function SidebarItem({
  className,
  icon,
  label,
  count,
  kbd,
  active,
  onPress,
}: {
  className?: string;
  icon?: LucideIcon;
  label: string;
  count?: number | string;
  kbd?: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      className={cn(
        "relative min-h-10 flex-row items-center gap-3 overflow-hidden rounded-xl px-3 active:bg-sidebar-accent",
        active && "bg-sidebar-accent shadow-qlink-sm",
        className,
      )}
      onPress={onPress}
    >
      {active ? (
        <View className="absolute bottom-2 left-0 top-2 w-1 rounded-full bg-primary" />
      ) : null}
      {icon ? (
        <Icon
          as={icon}
          className={cn("size-4", active ? "text-primary" : "text-muted-foreground")}
        />
      ) : null}
      <Text
        className={cn(
          "flex-1 text-sm font-medium",
          active ? "text-sidebar-accent-foreground" : "text-sidebar-foreground",
        )}
      >
        {label}
      </Text>
      {count ? <Text className="text-xs text-muted-foreground">{count}</Text> : null}
      {kbd ? <Kbd size="xs">{kbd}</Kbd> : null}
    </Pressable>
  );
}

function SidebarSection({
  className,
  title,
  actionLabel,
  onActionPress,
  children,
}: React.ComponentProps<typeof View> & {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
}) {
  return (
    <View className={cn("gap-2 border-t border-sidebar-border pt-3", className)}>
      <View className="flex-row items-center justify-between px-2">
        <Text className="text-xs font-semibold uppercase text-muted-foreground">{title}</Text>
        {actionLabel ? (
          <Pressable onPress={onActionPress}>
            <Text className="text-xs font-medium text-primary">{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
      {children}
    </View>
  );
}

function SidebarProfile({
  className,
  avatarUrl,
  name,
  email,
  onPress,
}: {
  className?: string;
  avatarUrl?: string;
  name: string;
  email: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      className={cn(
        "flex-row items-center gap-3 rounded-xl p-2 active:bg-sidebar-accent",
        className,
      )}
      onPress={onPress}
    >
      <Avatar alt={`${name} avatar`}>
        {avatarUrl ? <AvatarImage source={{ uri: avatarUrl }} /> : null}
        <AvatarFallback>
          <Text className="text-xs font-semibold">{name.slice(0, 1)}</Text>
        </AvatarFallback>
      </Avatar>
      <View className="flex-1">
        <Text
          numberOfLines={1}
          className="text-sm font-semibold"
        >
          {name}
        </Text>
        <Text
          numberOfLines={1}
          className="text-xs text-muted-foreground"
        >
          {email}
        </Text>
      </View>
    </Pressable>
  );
}

function SidebarCTA({
  className,
  label,
  onPress,
}: {
  className?: string;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Button
      className={cn("min-h-11 w-full rounded-2xl px-4 shadow-qlink-md", className)}
      onPress={onPress}
      size="lg"
      variant="gradient"
    >
      <Text className="font-semibold text-primary-foreground">{label}</Text>
    </Button>
  );
}

export { Sidebar, SidebarCTA, SidebarItem, SidebarProfile, SidebarSection };
