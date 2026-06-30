import * as React from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import type { AiProviderWithModels } from "@/features/ai/types";
import type { Folder } from "@/features/folders/types";

import {
  createSharedLink,
  extractErrorMessage,
  fetchFolders,
  fetchProviderModels,
  hasAuth,
  requestSharedAiSummary,
} from "./share-api";

import { close, openHostApp } from "expo-share-extension";

type ShareSheetProps = {
  url?: string;
  text?: string;
  preprocessingResults?: unknown;
};

type ModelOption = {
  key: string;
  userProviderId: number;
  modelId: number;
  label: string;
};

type Phase = "loading" | "unauthenticated" | "invalid" | "ready";

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

function getSharedTitle(preprocessingResults: unknown, fallback: string): string {
  if (preprocessingResults && typeof preprocessingResults === "object") {
    const title = (preprocessingResults as { title?: unknown }).title;
    if (typeof title === "string" && title.trim()) return title.trim();
  }
  return fallback;
}

function getSharedUrl(url: string | undefined, text: string | undefined, pre: unknown): string {
  if (url?.trim()) return url.trim();
  if (pre && typeof pre === "object") {
    const preUrl = (pre as { url?: unknown }).url;
    if (typeof preUrl === "string" && preUrl.trim()) return preUrl.trim();
  }
  if (text?.trim()) return text.trim();
  return "";
}

const HTML_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

function decodeHtmlEntities(value: string): string {
  return value.replace(
    /&(?:amp|lt|gt|quot|#39|apos|nbsp);/g,
    (entity) => HTML_ENTITIES[entity] ?? entity,
  );
}

// Fallback when the share preprocessing didn't surface a title (e.g. a bare URL
// shared from a non-browser app): fetch the page and read its <title>. Bounded
// and best-effort — returns null on any failure.
async function fetchPageTitle(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "text/html" },
    });
    clearTimeout(timer);
    const html = await response.text();
    const match = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
    const title = match ? decodeHtmlEntities(match[1]).replace(/\s+/g, " ").trim() : "";
    return title || null;
  } catch {
    return null;
  }
}

function toModelOptions(providers: AiProviderWithModels[]): ModelOption[] {
  return providers.flatMap((provider) =>
    provider.models.map((model) => ({
      key: `${provider.providerId}:${model.id}`,
      userProviderId: model.userProviderId,
      modelId: model.id,
      label: `${provider.providerType} · ${model.model}`,
    })),
  );
}

function ShareSheet({ url, text, preprocessingResults }: ShareSheetProps) {
  const sharedUrl = getSharedUrl(url, text, preprocessingResults);
  // Title from the in-page preprocessing if present; otherwise fetch the page
  // <title>. URL is only the last-resort fallback.
  const preprocessedTitle = getSharedTitle(preprocessingResults, "");
  const [fetchedTitle, setFetchedTitle] = React.useState<string | null>(null);
  const title = preprocessedTitle || fetchedTitle || sharedUrl;

  React.useEffect(() => {
    if (preprocessedTitle || !isHttpUrl(sharedUrl)) {
      return;
    }
    let active = true;
    void fetchPageTitle(sharedUrl).then((resolved) => {
      if (active && resolved) {
        setFetchedTitle(resolved);
      }
    });
    return () => {
      active = false;
    };
  }, [preprocessedTitle, sharedUrl]);

  const [phase, setPhase] = React.useState<Phase>("loading");
  const [folders, setFolders] = React.useState<Folder[]>([]);
  const [models, setModels] = React.useState<ModelOption[]>([]);
  const [folderId, setFolderId] = React.useState<number | null>(null);
  const [model, setModel] = React.useState<ModelOption | null>(null);
  const [submitting, setSubmitting] = React.useState<null | "save" | "ai">(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    (async () => {
      if (!isHttpUrl(sharedUrl)) {
        if (active) setPhase("invalid");
        return;
      }
      if (!(await hasAuth())) {
        if (active) setPhase("unauthenticated");
        return;
      }
      const [folderList, providerModels] = await Promise.all([
        fetchFolders().catch(() => [] as Folder[]),
        fetchProviderModels().catch(() => [] as AiProviderWithModels[]),
      ]);
      if (!active) return;
      const modelOptions = toModelOptions(providerModels);
      setFolders(folderList);
      setModels(modelOptions);
      setModel(modelOptions[0] ?? null);
      setPhase("ready");
    })();
    return () => {
      active = false;
    };
  }, [sharedUrl]);

  const handleSave = React.useCallback(async () => {
    setErrorMessage(null);
    setSubmitting("save");
    try {
      await createSharedLink({ url: sharedUrl, title, folderId });
      close();
    } catch (error) {
      setErrorMessage(extractErrorMessage(error));
      setSubmitting(null);
    }
  }, [folderId, sharedUrl, title]);

  const handleAiSave = React.useCallback(async () => {
    if (!model) {
      setErrorMessage("AI 모델을 먼저 선택해주세요.");
      return;
    }
    setErrorMessage(null);
    setSubmitting("ai");
    try {
      await requestSharedAiSummary({
        url: sharedUrl,
        title,
        folderId,
        userProviderId: model.userProviderId,
        modelId: model.modelId,
      });
      close();
    } catch (error) {
      setErrorMessage(extractErrorMessage(error));
      setSubmitting(null);
    }
  }, [folderId, model, sharedUrl, title]);

  const handleGoToLogin = React.useCallback(() => {
    // Open the host app at root ("" -> qlinkchannel:///), which lands on the
    // auth splash and shows the login screen when signed out. There is no
    // "/login" route, so passing "login" would deep-link to a not-found page.
    openHostApp("");
    close();
  }, []);

  if (phase === "loading") {
    return (
      <Centered>
        <ActivityIndicator />
      </Centered>
    );
  }

  if (phase === "invalid") {
    return (
      <Centered>
        <Text className="text-center text-base font-semibold text-foreground">
          북마크 가능한 웹페이지 url이 아니에요
        </Text>
        <Button
          className="mt-5 h-11 self-center px-6"
          variant="outline"
          onPress={() => close()}
        >
          <Text>닫기</Text>
        </Button>
      </Centered>
    );
  }

  if (phase === "unauthenticated") {
    return (
      <Centered>
        <Text className="text-center text-base font-semibold text-foreground">
          로그인을 먼저 해주세요
        </Text>
        <Button
          className="mt-5 h-11 self-center px-6"
          onPress={handleGoToLogin}
        >
          <Text>로그인 하러가기</Text>
        </Button>
      </Centered>
    );
  }

  const isBusy = submitting !== null;

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, gap: 14 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-1">
          <Text
            className="text-lg font-bold text-foreground"
            numberOfLines={2}
          >
            {title || "링크 저장"}
          </Text>
          <Text
            className="text-sm text-muted-foreground"
            numberOfLines={1}
          >
            {sharedUrl}
          </Text>
        </View>

        <ChipSection label="폴더">
          <Chip
            label="✨ AI 자동 분류"
            selected={folderId === null}
            onPress={() => setFolderId(null)}
          />
          {folders.map((folder) => (
            <Chip
              key={folder.id}
              label={folder.emoji ? `${folder.emoji} ${folder.name}` : folder.name}
              selected={folderId === folder.id}
              onPress={() => setFolderId(folder.id)}
            />
          ))}
        </ChipSection>

        {models.length > 0 ? (
          <ChipSection label="AI 모델">
            {models.map((option) => (
              <Chip
                key={option.key}
                label={option.label}
                selected={model?.key === option.key}
                onPress={() => setModel(option)}
              />
            ))}
          </ChipSection>
        ) : null}

        {errorMessage ? (
          <Text className="text-center text-sm font-medium text-destructive">{errorMessage}</Text>
        ) : null}

        <View className="flex-row gap-3 pt-1">
          <Button
            className="h-12 flex-1"
            variant="outline"
            disabled={isBusy}
            onPress={handleSave}
          >
            {submitting === "save" ? <ActivityIndicator /> : <Text>저장</Text>}
          </Button>
          <Button
            className="h-12 flex-1"
            variant="gradient"
            disabled={isBusy || models.length === 0}
            onPress={handleAiSave}
          >
            {submitting === "ai" ? <ActivityIndicator /> : <Text>AI 요약 저장</Text>}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex-1 items-center justify-center gap-2 bg-background p-6">{children}</View>
  );
}

function ChipSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-muted-foreground">{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <View className="flex-row gap-2">{children}</View>
      </ScrollView>
    </View>
  );
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      className={`rounded-full border px-4 py-2 ${
        selected ? "border-primary bg-primary" : "border-border bg-background"
      }`}
      onPress={onPress}
    >
      <Text
        className={`text-sm font-medium ${selected ? "text-primary-foreground" : "text-foreground"}`}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export { ShareSheet };
