import { ResponsiveShell } from "@/features/navigation/components/responsive-shell";

import { Slot } from "expo-router";

export default function PagesLayout() {
  return (
    <ResponsiveShell>
      <Slot />
    </ResponsiveShell>
  );
}
