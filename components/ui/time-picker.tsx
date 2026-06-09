import * as React from "react";
import { View } from "react-native";

import { WheelPicker, type WheelPickerOption } from "@/components/ui/wheel-picker";
import { cn } from "@/lib/utils";

type Meridiem = "AM" | "PM";

type TimeValue = {
  // 24-hour internal representation. UI displays as 12-hour AM/PM.
  hour: number; // 0-23
  minute: number; // 0-59
};

type TimePickerProps = {
  value: TimeValue;
  onChange: (next: TimeValue) => void;
  className?: string;
};

function buildRange(from: number, to: number): number[] {
  const list: number[] = [];
  for (let value = from; value <= to; value += 1) {
    list.push(value);
  }
  return list;
}

function hourOption(hour12: number): WheelPickerOption<number> {
  return { value: hour12, label: hour12.toString().padStart(2, "0") };
}

function minuteOption(minute: number): WheelPickerOption<number> {
  return { value: minute, label: minute.toString().padStart(2, "0") };
}

const meridiemOptions: WheelPickerOption<Meridiem>[] = [
  { value: "AM", label: "AM" },
  { value: "PM", label: "PM" },
];

function to12Hour(hour24: number): { hour12: number; meridiem: Meridiem } {
  const meridiem: Meridiem = hour24 < 12 ? "AM" : "PM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return { hour12, meridiem };
}

function to24Hour(hour12: number, meridiem: Meridiem): number {
  if (meridiem === "AM") {
    return hour12 === 12 ? 0 : hour12;
  }
  return hour12 === 12 ? 12 : hour12 + 12;
}

function TimePicker({ value, onChange, className }: TimePickerProps) {
  const { hour12, meridiem } = to12Hour(value.hour);
  const hourOptions = React.useMemo(() => buildRange(1, 12).map(hourOption), []);
  const minuteOptions = React.useMemo(() => buildRange(0, 59).map(minuteOption), []);

  const handleMeridiemChange = React.useCallback(
    (next: Meridiem) => {
      onChange({ hour: to24Hour(hour12, next), minute: value.minute });
    },
    [hour12, onChange, value.minute],
  );

  const handleHourChange = React.useCallback(
    (nextHour12: number) => {
      onChange({ hour: to24Hour(nextHour12, meridiem), minute: value.minute });
    },
    [meridiem, onChange, value.minute],
  );

  const handleMinuteChange = React.useCallback(
    (nextMinute: number) => {
      onChange({ hour: value.hour, minute: nextMinute });
    },
    [onChange, value.hour],
  );

  return (
    <View className={cn("flex-row items-center", className)}>
      <View className="flex-1 items-center">
        <WheelPicker
          options={meridiemOptions}
          value={meridiem}
          onChange={handleMeridiemChange}
        />
      </View>
      <View className="flex-1 items-center">
        <WheelPicker
          options={hourOptions}
          value={hour12}
          onChange={handleHourChange}
        />
      </View>
      <View className="flex-1 items-center">
        <WheelPicker
          options={minuteOptions}
          value={value.minute}
          onChange={handleMinuteChange}
        />
      </View>
    </View>
  );
}

function timeValueFromDate(source: Date): TimeValue {
  return { hour: source.getHours(), minute: source.getMinutes() };
}

function formatTimeLabel({ hour, minute }: TimeValue) {
  const { hour12, meridiem } = to12Hour(hour);
  const meridiemLabel = meridiem === "AM" ? "오전" : "오후";
  return `${meridiemLabel} ${hour12.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
}

function formatTimeApi({ hour, minute }: TimeValue) {
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

function parseTimeApi(value: string | null | undefined): TimeValue | null {
  if (!value) return null;
  const match = /^(\d{1,2}):(\d{1,2})/.exec(value);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  return { hour, minute };
}

export type { Meridiem, TimePickerProps, TimeValue };
export { TimePicker, formatTimeApi, formatTimeLabel, parseTimeApi, timeValueFromDate };
