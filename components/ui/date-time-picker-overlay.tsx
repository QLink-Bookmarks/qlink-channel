import * as React from "react";

import { DatePicker, type DateValue } from "@/components/ui/date-picker";
import { PickerOverlay, type PickerOverlayMode } from "@/components/ui/picker-overlay";
import { TimePicker, type TimeValue } from "@/components/ui/time-picker";

type DatePickerOverlayProps = {
  mode: PickerOverlayMode;
  open: boolean;
  value: DateValue;
  title?: string;
  hint?: React.ReactNode;
  minYear?: number;
  maxYear?: number;
  onCancel: () => void;
  onConfirm: (next: DateValue) => void;
};

function DatePickerOverlay({
  mode,
  open,
  value,
  title = "날짜 선택",
  hint,
  minYear,
  maxYear,
  onCancel,
  onConfirm,
}: DatePickerOverlayProps) {
  const [draft, setDraft] = React.useState<DateValue>(value);

  // Reset the draft whenever the overlay is (re)opened with a fresh value.
  // We list the structural fields rather than `value` itself so a parent that
  // re-creates the object on every render doesn't reset our draft mid-edit.
  React.useEffect(() => {
    if (open) {
      setDraft(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, value.day, value.month, value.year]);

  return (
    <PickerOverlay
      mode={mode}
      open={open}
      title={title}
      hint={hint}
      onCancel={onCancel}
      onConfirm={() => onConfirm(draft)}
    >
      <DatePicker
        value={draft}
        onChange={setDraft}
        minYear={minYear}
        maxYear={maxYear}
      />
    </PickerOverlay>
  );
}

type TimePickerOverlayProps = {
  mode: PickerOverlayMode;
  open: boolean;
  value: TimeValue;
  title?: string;
  hint?: React.ReactNode;
  onCancel: () => void;
  onConfirm: (next: TimeValue) => void;
};

function TimePickerOverlay({
  mode,
  open,
  value,
  title = "시간선택",
  hint,
  onCancel,
  onConfirm,
}: TimePickerOverlayProps) {
  const [draft, setDraft] = React.useState<TimeValue>(value);

  React.useEffect(() => {
    if (open) {
      setDraft(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, value.hour, value.minute]);

  return (
    <PickerOverlay
      mode={mode}
      open={open}
      title={title}
      hint={hint}
      onCancel={onCancel}
      onConfirm={() => onConfirm(draft)}
    >
      <TimePicker
        value={draft}
        onChange={setDraft}
      />
    </PickerOverlay>
  );
}

export type { DatePickerOverlayProps, TimePickerOverlayProps };
export { DatePickerOverlay, TimePickerOverlay };
