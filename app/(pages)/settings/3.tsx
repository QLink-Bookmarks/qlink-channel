import { useShellRouteState } from "@/features/navigation/hooks/use-shell-route-state";
import { SettingsScreen } from "@/features/settings/components/settings-screen";

export default function SettingsDesignThree() {
  const { isWideView } = useShellRouteState();
  return (
    <SettingsScreen
      mode={isWideView ? "wide" : "mobile"}
      design={3}
    />
  );
}
