import {
  type DateTimePickerButtonProps,
  PopoverVariant,
} from "./date-time-picker-button-internals";

/**
 * Web date/time picker button.
 *
 * Always renders the Popover variant, ignoring the `mode` prop. The Sheet
 * variant relies on touch-drag scrolling inside a BottomSheetModal, which
 * react-native-web's gesture handler swallows before it reaches our nested
 * wheel ScrollView — so the wheels can't be dragged on a mobile-sized browser.
 * The Popover variant uses real browser scrolling on the wheels and works for
 * both mouse wheel and touch drag, keeping the wide and mobile web layouts
 * consistent.
 */
function DateTimePickerButton(props: DateTimePickerButtonProps) {
  return <PopoverVariant {...props} />;
}

export type { DateTimePickerButtonProps };
export { DateTimePickerButton };
