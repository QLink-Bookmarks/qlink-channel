import { View } from "react-native";

import type { GradientTextProps } from "@/components/ui/gradient-text";
import { GradientText } from "@/components/ui/gradient-text";
import { cn } from "@/lib/utils";

type BrandHeaderSize = "md" | "lg" | "xl" | "2xl";

const sizeClasses: Record<BrandHeaderSize, string> = {
  md: "text-3xl",
  lg: "text-4xl",
  xl: "text-5xl",
  "2xl": "text-[2.5rem] leading-[1.1]",
};

function BrandHeader({
  className,
  title = "QLINK",
  size = "md",
  align = "start",
  accent,
  mode,
  colors,
  ...props
}: React.ComponentProps<typeof View> & {
  title?: string;
  size?: BrandHeaderSize;
  align?: "start" | "center";
  accent?: GradientTextProps["accent"];
  mode?: GradientTextProps["mode"];
  colors?: GradientTextProps["colors"];
}) {
  const isCentered = align === "center";

  return (
    <View
      className={cn("gap-2 px-2 pt-2", isCentered && "items-center", className)}
      {...props}
    >
      <GradientText
        accent={accent}
        mode={mode}
        colors={colors}
        className={cn(
          "font-black tracking-tight",
          sizeClasses[size],
          isCentered && "self-center text-center",
        )}
      >
        {title}
      </GradientText>
    </View>
  );
}

export { BrandHeader };
export type { BrandHeaderSize };
