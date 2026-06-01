import { Pressable, View } from "react-native";

import { ActivityIndicator } from "@/components/ui/activity-indicator";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

import { useAiProviderModelsQuery } from "../queries";
import type { AiProviderModel, AiProviderWithModels } from "../types";

import { Sparkles } from "lucide-react-native/icons";

type AiModelSelection = {
  userProviderId: number;
  modelId: number;
  modelLabel: string;
  providerLabel: string;
};

type AiModelPickerListProps = {
  selectedModelId: number | null;
  onSelect: (selection: AiModelSelection) => void;
  className?: string;
};

function getProviderLabel(provider: AiProviderWithModels): string {
  switch (provider.providerType) {
    case "GEMINI":
      return "Gemini";
    case "CLAUDE":
      return "Claude";
    case "OPENAI":
      return "OpenAI";
    default:
      return provider.providerType;
  }
}

function AiModelPickerList({ selectedModelId, onSelect, className }: AiModelPickerListProps) {
  const providersQuery = useAiProviderModelsQuery();
  const providers = providersQuery.data ?? [];

  if (providersQuery.isLoading) {
    return (
      <ActivityIndicator
        size="large"
        className={cn("py-8", className)}
      />
    );
  }

  if (providers.length === 0) {
    return (
      <EmptyState
        emoji="🤖"
        title="사용할 수 있는 AI 모델이 없어요"
        description="설정에서 AI 제공자를 먼저 연결해주세요."
      />
    );
  }

  return (
    <View className={cn("gap-4", className)}>
      {providers.map((provider) => {
        const providerLabel = getProviderLabel(provider);

        return (
          <View
            key={provider.providerId}
            className="gap-2"
          >
            <Text className="px-1 text-xs font-semibold uppercase text-muted-foreground">
              {providerLabel}
            </Text>
            <View className="gap-2">
              {provider.models.map((model) => (
                <AiModelPickerRow
                  key={model.id}
                  model={model}
                  selected={selectedModelId === model.id}
                  onPress={() =>
                    onSelect({
                      modelId: model.id,
                      modelLabel: model.model,
                      providerLabel,
                      userProviderId: model.userProviderId,
                    })
                  }
                />
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function AiModelPickerRow({
  model,
  selected,
  onPress,
}: {
  model: AiProviderModel;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      className={cn(
        "flex-row items-center justify-between rounded-xl border border-border bg-card px-4 py-3",
        selected && "border-primary bg-accent",
      )}
      onPress={onPress}
    >
      <Text
        className={cn("min-w-0 flex-1 font-semibold", selected && "text-accent-foreground")}
        numberOfLines={1}
      >
        {model.model}
      </Text>
      {selected ? (
        <Icon
          as={Sparkles}
          size={18}
          className="text-primary"
        />
      ) : null}
    </Pressable>
  );
}

export { AiModelPickerList, getProviderLabel };
export type { AiModelPickerListProps, AiModelSelection };
