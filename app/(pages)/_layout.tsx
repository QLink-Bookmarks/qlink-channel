import { ResponsiveShell } from "@/features/navigation/components/responsive-shell";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { Slot } from "expo-router";

export default function PagesLayout() {
  return (
    <BottomSheetModalProvider>
      <ResponsiveShell>
        <Slot />
      </ResponsiveShell>
    </BottomSheetModalProvider>
  );
}
