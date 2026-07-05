import * as React from "react";
import { ScrollView, View } from "react-native";

import { ActivityIndicator } from "@/components/ui/activity-indicator";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Text } from "@/components/ui/text";
import { formatPostDate, isPostForbidden, isPostNotFound } from "@/features/posts/lib";
import { usePostQuery } from "@/features/posts/queries";

import { Image } from "expo-image";
import { type Href, useRouter } from "expo-router";

function PostImage({ url }: { url: string }) {
  const [aspectRatio, setAspectRatio] = React.useState(4 / 3);
  return (
    <Image
      source={{ uri: url }}
      contentFit="cover"
      onLoad={(event) => {
        const { width, height } = event.source;
        if (width > 0 && height > 0) {
          setAspectRatio(width / height);
        }
      }}
      style={{ width: "100%", aspectRatio, borderRadius: 12 }}
    />
  );
}

function DetailNotice({
  emoji,
  title,
  description,
  onBack,
}: {
  emoji: string;
  title: string;
  description: string;
  onBack: () => void;
}) {
  return (
    <View className="flex-1">
      <EmptyState
        className="flex-1"
        emoji={emoji}
        title={title}
        description={description}
        actions={
          <Button
            variant="outline"
            onPress={onBack}
          >
            <Text>목록으로</Text>
          </Button>
        }
      />
    </View>
  );
}

function AnnouncementDetailScreen({ postId }: { postId?: string }) {
  const router = useRouter();
  const query = usePostQuery(postId ?? "");

  const handleBackToList = React.useCallback(() => {
    router.replace("/announcements" as Href);
  }, [router]);

  if (!postId) {
    return (
      <DetailNotice
        emoji="🔍"
        title="게시글을 찾을 수 없어요"
        description="잘못된 주소예요."
        onBack={handleBackToList}
      />
    );
  }

  if (query.isLoading) {
    return (
      <ActivityIndicator
        size="large"
        className="flex-1 py-16"
      />
    );
  }

  if (query.isError) {
    if (isPostForbidden(query.error)) {
      return (
        <DetailNotice
          emoji="🔒"
          title="페이지 권한이 없어요"
          description="이 게시글을 볼 수 있는 권한이 없어요."
          onBack={handleBackToList}
        />
      );
    }
    return (
      <DetailNotice
        emoji={isPostNotFound(query.error) ? "🔍" : "⚠️"}
        title={
          isPostNotFound(query.error) ? "게시글을 찾을 수 없어요" : "게시글을 불러오지 못했어요"
        }
        description={
          isPostNotFound(query.error)
            ? "삭제되었거나 존재하지 않는 게시글이에요."
            : "잠시 후 다시 시도해주세요."
        }
        onBack={handleBackToList}
      />
    );
  }

  const post = query.data;
  if (!post) {
    return null;
  }

  return (
    <ScrollView
      className="flex-1"
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="mx-auto w-full gap-4 px-4 pb-16 pt-4 md:max-w-3xl md:px-6"
    >
      <View className="gap-2">
        <Text className="text-2xl font-semibold text-foreground">{post.title}</Text>
        <Text className="text-sm text-muted-foreground">
          {post.author} · {formatPostDate(post.createdAt)}
        </Text>
      </View>
      <View className="h-px bg-border" />
      <Text className="text-base leading-7 text-foreground">{post.contents}</Text>
      {post.imageUrls.length > 0 ? (
        <View className="gap-3 pt-2">
          {post.imageUrls.map((url) => (
            <PostImage
              key={url}
              url={url}
            />
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}

export { AnnouncementDetailScreen };
