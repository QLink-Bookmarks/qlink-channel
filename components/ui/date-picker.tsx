import * as React from "react";
import { View } from "react-native";

import { WheelPicker, type WheelPickerOption } from "@/components/ui/wheel-picker";
import { cn } from "@/lib/utils";

type DateValue = {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
};

type DatePickerProps = {
  value: DateValue;
  onChange: (value: DateValue) => void;
  minYear?: number;
  maxYear?: number;
  className?: string;
};

const DEFAULT_MIN_YEAR = 2020;
const DEFAULT_MAX_YEAR = 2035;

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function buildRange(from: number, to: number): number[] {
  const list: number[] = [];
  for (let value = from; value <= to; value += 1) {
    list.push(value);
  }
  return list;
}

function numberOption(value: number, suffix: string): WheelPickerOption<number> {
  return { value, label: `${value}${suffix}` };
}

function paddedNumberOption(value: number, suffix: string): WheelPickerOption<number> {
  return { value, label: `${value.toString().padStart(2, "0")}${suffix}` };
}

function DatePicker({
  value,
  onChange,
  minYear = DEFAULT_MIN_YEAR,
  maxYear = DEFAULT_MAX_YEAR,
  className,
}: DatePickerProps) {
  const yearOptions = React.useMemo(
    () => buildRange(minYear, maxYear).map((year) => numberOption(year, "년")),
    [maxYear, minYear],
  );
  const monthOptions = React.useMemo(
    () => buildRange(1, 12).map((month) => paddedNumberOption(month, "월")),
    [],
  );
  const dayCount = daysInMonth(value.year, value.month);
  const dayOptions = React.useMemo(
    () => buildRange(1, dayCount).map((day) => paddedNumberOption(day, "일")),
    [dayCount],
  );

  const handleYearChange = React.useCallback(
    (nextYear: number) => {
      const nextDayCount = daysInMonth(nextYear, value.month);
      onChange({
        year: nextYear,
        month: value.month,
        day: Math.min(value.day, nextDayCount),
      });
    },
    [onChange, value.day, value.month],
  );

  const handleMonthChange = React.useCallback(
    (nextMonth: number) => {
      const nextDayCount = daysInMonth(value.year, nextMonth);
      onChange({
        year: value.year,
        month: nextMonth,
        day: Math.min(value.day, nextDayCount),
      });
    },
    [onChange, value.day, value.year],
  );

  const handleDayChange = React.useCallback(
    (nextDay: number) => {
      onChange({ year: value.year, month: value.month, day: nextDay });
    },
    [onChange, value.month, value.year],
  );

  return (
    <View className={cn("flex-row items-center", className)}>
      <View className="flex-1 items-center">
        <WheelPicker
          options={yearOptions}
          value={value.year}
          onChange={handleYearChange}
        />
      </View>
      <View className="flex-1 items-center">
        <WheelPicker
          options={monthOptions}
          value={value.month}
          onChange={handleMonthChange}
        />
      </View>
      <View className="flex-1 items-center">
        <WheelPicker
          options={dayOptions}
          value={value.day}
          onChange={handleDayChange}
        />
      </View>
    </View>
  );
}

function dateValueFromDate(source: Date): DateValue {
  return {
    year: source.getFullYear(),
    month: source.getMonth() + 1,
    day: source.getDate(),
  };
}

function todayDateValue(): DateValue {
  return dateValueFromDate(new Date());
}

function dateValueToDate(value: DateValue): Date {
  return new Date(value.year, value.month - 1, value.day);
}

function formatDateLabel({ year, month, day }: DateValue) {
  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

export type { DatePickerProps, DateValue };
export {
  DEFAULT_MAX_YEAR,
  DEFAULT_MIN_YEAR,
  DatePicker,
  dateValueFromDate,
  dateValueToDate,
  formatDateLabel,
  todayDateValue,
};
// Internal helper used by adjacent pickers/utilities that need to read aloud
// the count of days in a (year, month) pair without re-implementing the rule.
export { daysInMonth };
