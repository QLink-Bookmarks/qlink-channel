import {
  type DateTimePickerButtonProps,
  PopoverVariant,
  SheetVariant,
} from "./date-time-picker-button-internals";

/**
 * Native date/time picker button.
 *
 * Wide layouts get a Popover anchored to the button; mobile layouts get the
 * platform-native bottom sheet picker. Web uses a separate file that always
 * renders the Popover variant — see date-time-picker-button.web.tsx for why.
 */
function DateTimePickerButton(props: DateTimePickerButtonProps) {
  return props.mode === "wide" ? <PopoverVariant {...props} /> : <SheetVariant {...props} />;
}

export type { DateTimePickerButtonProps };
export { DateTimePickerButton };
