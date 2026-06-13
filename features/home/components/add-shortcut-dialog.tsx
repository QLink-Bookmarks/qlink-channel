import { View } from "react-native";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";

function AddShortcutDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>바로가기 추가</DialogTitle>
          <DialogDescription>
            자주 가는 사이트를 홈 화면 바로가기로 등록할 예정인 더미 다이얼로그다.
          </DialogDescription>
        </DialogHeader>
        <View className="gap-4">
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">사이트 주소</Text>
            <View className="rounded-2xl border border-border bg-card px-4 py-3">
              <Text className="text-sm text-muted-foreground">https://example.com</Text>
            </View>
          </View>
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">이름</Text>
            <View className="rounded-2xl border border-border bg-card px-4 py-3">
              <Text className="text-sm text-muted-foreground">바로가기 이름</Text>
            </View>
          </View>
          <View className="flex-row justify-end gap-2">
            <Button
              variant="ghost"
              onPress={() => onOpenChange(false)}
            >
              <Text>취소</Text>
            </Button>
            <Button
              disabled
              onPress={() => onOpenChange(false)}
            >
              <Text>추가</Text>
            </Button>
          </View>
        </View>
      </DialogContent>
    </Dialog>
  );
}

export { AddShortcutDialog };
