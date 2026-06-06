import * as React from "react";

import { useUpdateMySettingsMutation } from "@/features/account/mutations";
import type { UpdateMySettingsRequest } from "@/features/account/types";
import { useDisplaySettings } from "@/stores/display-settings";

type SettingsPayloadKey = keyof UpdateMySettingsRequest;

function buildPayload(state: {
  display: { theme: string; accent: string };
  behavior: { allowsReminderNotification: boolean };
  ai: { defaultProvider: { id: number | null }; defaultModel: { id: number | null } };
}): UpdateMySettingsRequest {
  return {
    theme: state.display.theme,
    accent: state.display.accent,
    allowsReminder: state.behavior.allowsReminderNotification,
    defaultProviderId: state.ai.defaultProvider.id,
    defaultModelId: state.ai.defaultModel.id,
  };
}

function shallowDiff(
  a: UpdateMySettingsRequest,
  b: UpdateMySettingsRequest,
): UpdateMySettingsRequest {
  const next: UpdateMySettingsRequest = {};
  (Object.keys(b) as SettingsPayloadKey[]).forEach((key) => {
    if (a[key] !== b[key]) {
      (next as Record<string, unknown>)[key] = b[key];
    }
  });
  return next;
}

const DEBOUNCE_MS = 500;

function useSettingsAutosave() {
  const mutation = useUpdateMySettingsMutation();
  const mutate = mutation.mutate;
  const hasHydrated = useDisplaySettings((state) => state.hasHydratedFromServer);

  const display = useDisplaySettings((state) => state.display);
  const behavior = useDisplaySettings((state) => state.behavior);
  const ai = useDisplaySettings((state) => state.ai);

  const lastSentRef = React.useRef<UpdateMySettingsRequest | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Seed the baseline from the first hydration so we don't immediately re-send.
  React.useEffect(() => {
    if (!hasHydrated) {
      return;
    }
    if (lastSentRef.current === null) {
      lastSentRef.current = buildPayload({ display, behavior, ai });
    }
  }, [ai, behavior, display, hasHydrated]);

  React.useEffect(() => {
    if (!hasHydrated || lastSentRef.current === null) {
      return;
    }

    const next = buildPayload({ display, behavior, ai });
    const diff = shallowDiff(lastSentRef.current, next);
    if (Object.keys(diff).length === 0) {
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      lastSentRef.current = next;
      mutate(diff);
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [ai, behavior, display, hasHydrated, mutate]);
}

export { useSettingsAutosave };
