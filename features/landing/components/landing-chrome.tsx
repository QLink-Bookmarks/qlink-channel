import { Pressable, View } from "react-native";

import { LinearGradient } from "@/components/ui/linear-gradient";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

// Clear pastel wash per section so scrolling reads as moving between distinct
// pages. Landing is pinned to light mode, so these fixed tints stay consistent.
export const HERO_BG = "bg-[#EFE9FB]";
export const SECTION_BG = [
  "bg-[#E9ECF3]",
  "bg-[#E1EDFC]",
  "bg-[#EEE6FB]",
  "bg-[#FCEFDE]",
  "bg-[#DFF3E7]",
];
export const FINAL_BG = "bg-[#FBE4EF]";

const SECTION_BLOB = ["#AEB8D4", "#9CC4F2", "#C4A9EE", "#F2C889", "#8FD9AF"];

export function StartButton({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <Pressable
      className="relative h-12 items-center justify-center overflow-hidden rounded-2xl px-8 shadow-qlink-md active:opacity-95 web:transition-transform web:hover:scale-105"
      onPress={onPress}
    >
      <LinearGradient
        accent="pink"
        style={{ bottom: 0, left: 0, position: "absolute", right: 0, top: 0 }}
        pointerEvents="none"
      />
      <Text className="text-base font-semibold text-primary-foreground">{label}</Text>
    </Pressable>
  );
}

// Ambient section backdrop: a big faded number watermark + two soft color
// blobs. Sits behind the content (overflow-hidden on the section clips it).
export function SectionBackdrop({ index }: { index: number }) {
  const color = SECTION_BLOB[index % SECTION_BLOB.length];
  return (
    <View
      pointerEvents="none"
      className="absolute inset-0"
    >
      <View
        className="absolute -left-24 top-12 h-72 w-72 rounded-full"
        style={{ backgroundColor: color, opacity: 0.16 }}
      />
      <View
        className="absolute -right-24 bottom-8 h-96 w-96 rounded-full"
        style={{ backgroundColor: color, opacity: 0.12 }}
      />
      <Text className="absolute right-4 top-6 font-mono text-[150px] font-bold leading-none text-foreground/[0.045] md:text-[260px]">
        {String(index + 1).padStart(2, "0")}
      </Text>
    </View>
  );
}

// Vertical progress rail (desktop): a dot per page, the active one stretches.
export function ProgressRail({ total, active }: { total: number; active: number }) {
  return (
    <View className="absolute right-6 top-1/2 hidden -translate-y-1/2 gap-2.5 md:flex">
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          className={cn(
            "w-1 rounded-full",
            index === active ? "h-6 bg-primary" : "bg-border-strong h-1.5",
          )}
          style={
            {
              transitionProperty: "height, background-color",
              transitionDuration: "350ms",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            } as object
          }
        />
      ))}
    </View>
  );
}
