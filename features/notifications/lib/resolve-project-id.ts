import Constants from "expo-constants";

// EAS project id used by getExpoPushTokenAsync. Shared by the push bridge and
// the logout unregister flow so they resolve it the same way.
function resolveProjectId(): string | undefined {
  return (
    Constants.expoConfig?.extra?.eas?.projectId ??
    (Constants.easConfig as { projectId?: string } | undefined)?.projectId
  );
}

export { resolveProjectId };
