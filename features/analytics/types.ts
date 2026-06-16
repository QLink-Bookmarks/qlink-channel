type AnalyticsParams = Record<string, string | number | boolean | undefined>;

interface Analytics {
  logEvent(name: string, params?: AnalyticsParams): void;
  logScreenView(screenName: string, screenClass?: string): void;
  setUserId(userId: string | null): void;
  setUserProperties(properties: Record<string, string | null>): void;
}

export type { Analytics, AnalyticsParams };
