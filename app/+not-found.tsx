import { ResponsiveShell } from "@/features/navigation/components/responsive-shell";
import { NotFoundRouteScreen } from "@/features/navigation/components/route-screens";

export default function NotFound() {
  return (
    <ResponsiveShell>
      <NotFoundRouteScreen />
    </ResponsiveShell>
  );
}
