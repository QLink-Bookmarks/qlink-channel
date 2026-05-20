import { Pressable, View } from "react-native";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

function MemberChip({
  className,
  avatarUrl,
  name,
  removable,
  onRemove,
  ...props
}: React.ComponentProps<typeof View> & {
  avatarUrl?: string;
  name: string;
  removable?: boolean;
  onRemove?: () => void;
}) {
  return (
    <View
      className={cn(
        "flex-row items-center gap-2 rounded-full border border-border bg-surface px-2 py-1",
        className,
      )}
      {...props}
    >
      <Avatar
        size="xs"
        alt={`${name} avatar`}
      >
        {avatarUrl ? <AvatarImage source={{ uri: avatarUrl }} /> : null}
        <AvatarFallback>
          <Text className="text-2xs font-semibold">{name.slice(0, 1).toUpperCase()}</Text>
        </AvatarFallback>
      </Avatar>
      <Text
        className="max-w-32 text-sm font-medium"
        numberOfLines={1}
      >
        {name}
      </Text>
      {removable ? (
        <Pressable
          className="size-5 items-center justify-center rounded-full active:bg-destructive/10"
          onPress={onRemove}
        >
          <Text className="text-sm text-muted-foreground">x</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export { MemberChip };
