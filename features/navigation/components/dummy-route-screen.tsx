import { ScrollView, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";

function DummyRouteScreen({
  title,
  routePath,
  viewMode,
  description,
  params,
}: {
  title: string;
  routePath: string;
  viewMode: "wide" | "mobile";
  description: string;
  params?: { label: string; value?: string }[];
}) {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="gap-5 px-4 py-6 md:px-6">
        <View className="gap-3 rounded-[28px] border border-border bg-card p-5 md:p-6">
          <View className="flex-row items-center gap-2">
            <Badge variant="outline">
              <Text>{viewMode === "wide" ? "wide" : "mobile"}</Text>
            </Badge>
            <Badge variant="secondary">
              <Text>{routePath}</Text>
            </Badge>
          </View>
          <View className="gap-2">
            <Text className="text-3xl font-bold tracking-tight text-foreground">{title}</Text>
            <Text className="text-sm leading-6 text-muted-foreground">{description}</Text>
          </View>
        </View>

        {params?.length ? (
          <View className="gap-3 rounded-[24px] border border-border-soft bg-surface p-5">
            <Text className="text-sm font-semibold text-foreground">Params</Text>
            <View className="gap-2">
              {params.map((param) => (
                <View
                  key={param.label}
                  className="rounded-2xl bg-muted px-4 py-3"
                >
                  <Text className="text-xs uppercase tracking-wide text-muted-foreground">
                    {param.label}
                  </Text>
                  <Text className="mt-1 text-sm font-medium text-foreground">
                    {param.value ?? "-"}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View className="gap-3 rounded-[24px] border border-dashed border-border bg-card p-5">
          <Text className="text-sm font-semibold text-foreground">다음 단계</Text>
          <Text className="text-sm leading-6 text-muted-foreground">
            이 화면은 라우팅 골격 확인용 더미다. 이후 실제 feature 화면과 데이터 연동으로 대체한다.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

export { DummyRouteScreen };
