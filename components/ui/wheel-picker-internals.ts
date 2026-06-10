/** Shared constants, types, and helpers for the wheel picker. */

const DEFAULT_ITEM_HEIGHT = 44;
const DEFAULT_VISIBLE_COUNT = 5;

type WheelPickerOption<T extends string | number> = {
  value: T;
  label: string;
};

type WheelPickerProps<T extends string | number> = {
  options: WheelPickerOption<T>[];
  value: T;
  onChange: (next: T) => void;
  itemHeight?: number;
  visibleCount?: number;
  className?: string;
  align?: "center" | "left" | "right";
};

function getOptionIndex<T extends string | number>(options: WheelPickerOption<T>[], value: T) {
  const index = options.findIndex((option) => option.value === value);
  return index >= 0 ? index : 0;
}

function distanceClassName(distance: number) {
  if (distance === 0) return "text-3xl font-bold text-primary";
  if (distance === 1) return "text-xl font-semibold text-muted-foreground/40";
  if (distance === 2) return "text-base text-muted-foreground/20";
  return "text-base text-transparent";
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export type { WheelPickerOption, WheelPickerProps };
export { DEFAULT_ITEM_HEIGHT, DEFAULT_VISIBLE_COUNT, clamp, distanceClassName, getOptionIndex };
