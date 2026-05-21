export type WideSidebarKey = "home" | "folders" | "todos" | "links";

export type MobileTabKey = "home" | "folders" | "todos" | "settings";

export type SettingsSectionKey = "settings" | "profile" | "ai" | "accounts";

export type RouteParamValue = string | string[] | undefined;

export type RouteParams = Record<string, RouteParamValue>;
