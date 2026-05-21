import { View } from "react-native";

import type { GradientTextProps } from "@/components/ui/gradient-text";
import { GradientText } from "@/components/ui/gradient-text";
import { cn } from "@/lib/utils";

function BrandHeader({
  className,
  title = "QLINK",
  accent,
  mode,
  colors,
  ...props
}: React.ComponentProps<typeof View> & {
  title?: string;
  accent?: GradientTextProps["accent"];
  mode?: GradientTextProps["mode"];
  colors?: GradientTextProps["colors"];
}) {
  return (
    <View
      className={cn("gap-2 px-2 pt-2", className)}
      {...props}
    >
      <GradientText
        accent={accent}
        mode={mode}
        colors={colors}
        className="text-2xl font-bold"
      >
        {title}
      </GradientText>
    </View>
  );
}

export { BrandHeader };
