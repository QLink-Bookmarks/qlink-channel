import * as React from "react";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { ToastViewport } from "@/components/ui/toast-viewport";
import { useToastStore } from "@/stores/toast-store";
import type { Meta, StoryObj } from "@storybook/react-native";

function ToastViewportStory() {
  const showToast = useToastStore((state) => state.showToast);
  const dismissAllToasts = useToastStore((state) => state.dismissAllToasts);

  const handleShowToast = React.useCallback(() => {
    showToast({
      description: "클립보드 권한을 허용하거나 Cmd/Ctrl + V로 붙여넣어주세요.",
      sourceKey: undefined,
      title: "클립보드 권한이 필요해요",
      variant: "error",
    });
  }, [showToast]);

  return (
    <View className="flex-1 justify-end gap-3 bg-background p-4">
      <Button onPress={handleShowToast}>
        <Text>토스트 추가</Text>
      </Button>
      <Button
        variant="outline"
        onPress={dismissAllToasts}
      >
        <Text>모두 닫기</Text>
      </Button>
      <ToastViewport />
    </View>
  );
}

const meta = {
  title: "공통 UI/토스트 뷰포트",
  component: ToastViewportStory,
} satisfies Meta<typeof ToastViewportStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const StackDemo: Story = {
  name: "스택 데모",
  render: () => <ToastViewportStory />,
};
