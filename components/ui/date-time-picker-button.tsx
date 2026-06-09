import * as React from "react";
import { Pressable, View } from "react-native";

import { Button } from "@/components/ui/button";
import {
  DatePicker,
  type DateValue,
  formatDateLabel,
  todayDateValue,
} from "@/components/ui/date-picker";
import { DatePickerOverlay, TimePickerOverlay } from "@/components/ui/date-time-picker-overlay";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  usePopoverContext,
} from "@/components/ui/popover";
import { Text } from "@/components/ui/text";
import { TimePicker, type TimeValue, formatTimeLabel } from "@/components/ui/time-picker";
import { cn } from "@/lib/utils";

import { CalendarDays, Clock3 } from "lucide-react-native/icons";

type Mode = "wide" | "mobile";

type CommonProps = {
  mode: Mode;
  placeholder?: string;
  className?: string;
};

type DateTimePickerButtonProps = CommonProps &
  (
    | {
        kind: "date";
        value: DateValue | null;
        onChange: (next: DateValue) => void;
        minYear?: number;
        maxYear?: number;
      }
    | {
        kind: "time";
        value: TimeValue | null;
        onChange: (next: TimeValue) => void;
      }
  );

const DEFAULT_TIME: TimeValue = { hour: 9, minute: 0 };

function defaultPlaceholder(kind: "date" | "time") {
  return kind === "date" ? "년-월-일" : "오전 09:00";
}

function formatLabel(
  kind: "date" | "time",
  value: DateValue | TimeValue | null,
  placeholder: string,
) {
  if (!value) return placeholder;
  return kind === "date"
    ? formatDateLabel(value as DateValue)
    : formatTimeLabel(value as TimeValue);
}

function buttonClassName(extra?: string) {
  return cn(
    "h-10 flex-1 flex-row items-center justify-between rounded-md border border-input bg-background px-4 shadow-sm shadow-black/5",
    extra,
  );
}

function labelClassName(filled: boolean) {
  return cn("text-sm", filled ? "text-foreground" : "text-muted-foreground");
}

/**
 * Renders the wheel picker + 취소/확인 footer inside a Popover. Uses
 * `usePopoverContext` to drive open/close, so the surrounding `<Popover>` can
 * stay uncontrolled (the trigger handles open, cancel/outside-click handle close).
 */
function WidePopoverBody(props: {
  kind: "date" | "time";
  value: DateValue | TimeValue | null;
  onConfirm: (next: DateValue | TimeValue) => void;
  minYear?: number;
  maxYear?: number;
}) {
  const { kind, value, onConfirm, minYear, maxYear } = props;
  const popover = usePopoverContext();
  const initial = React.useMemo<DateValue | TimeValue>(
    () => value ?? (kind === "date" ? todayDateValue() : DEFAULT_TIME),
    [kind, value],
  );
  const [draft, setDraft] = React.useState<DateValue | TimeValue>(initial);

  // Reset whenever the popover re-opens.
  const openRef = React.useRef(popover.open);
  React.useEffect(() => {
    if (popover.open && !openRef.current) {
      setDraft(initial);
    }
    openRef.current = popover.open;
  }, [initial, popover.open]);

  return (
    <View className="gap-3">
      <Text className="text-base font-semibold text-foreground">
        {kind === "date" ? "날짜 선택" : "시간선택"}
      </Text>
      <View className="-mx-1 border-b border-border" />
      {kind === "date" ? (
        <DatePicker
          value={draft as DateValue}
          onChange={(next) => setDraft(next)}
          minYear={minYear}
          maxYear={maxYear}
        />
      ) : (
        <TimePicker
          value={draft as TimeValue}
          onChange={(next) => setDraft(next)}
        />
      )}
      <View className="-mx-1 border-b border-border" />
      <View className="flex-row gap-2">
        <Button
          className="h-10 flex-1 rounded-xl"
          variant="outline"
          onPress={() => popover.onOpenChange(false)}
        >
          <Text className="text-sm font-semibold">취소</Text>
        </Button>
        <Button
          className="h-10 flex-1 rounded-xl"
          onPress={() => {
            onConfirm(draft);
            popover.onOpenChange(false);
          }}
        >
          <Text className="text-sm font-semibold">확인</Text>
        </Button>
      </View>
    </View>
  );
}

function DateTimePickerButton(props: DateTimePickerButtonProps) {
  const { mode, kind, value, className } = props;
  const placeholder = props.placeholder ?? defaultPlaceholder(kind);
  const label = formatLabel(kind, value, placeholder);
  const Icon = kind === "date" ? CalendarDays : Clock3;
  const iconSize = kind === "date" ? 18 : 20;

  if (mode === "wide") {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Pressable className={buttonClassName(className)}>
            <Text className={labelClassName(value != null)}>{label}</Text>
            <Icon size={iconSize} />
          </Pressable>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="bottom"
          className="w-80 p-4"
        >
          <WidePopoverBody
            kind={kind}
            value={value}
            onConfirm={(next) =>
              kind === "date"
                ? props.onChange(next as DateValue)
                : props.onChange(next as TimeValue)
            }
            minYear={kind === "date" ? props.minYear : undefined}
            maxYear={kind === "date" ? props.maxYear : undefined}
          />
        </PopoverContent>
      </Popover>
    );
  }

  // mobile: pressable opens a Sheet-backed overlay.
  return <MobileButton {...props} />;
}

function MobileButton(props: DateTimePickerButtonProps) {
  const { kind, value, className } = props;
  const placeholder = props.placeholder ?? defaultPlaceholder(kind);
  const label = formatLabel(kind, value, placeholder);
  const Icon = kind === "date" ? CalendarDays : Clock3;
  const iconSize = kind === "date" ? 18 : 20;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Pressable
        className={buttonClassName(className)}
        onPress={() => setOpen(true)}
      >
        <Text className={labelClassName(value != null)}>{label}</Text>
        <Icon size={iconSize} />
      </Pressable>
      {kind === "date" ? (
        <DatePickerOverlay
          mode="mobile"
          open={open}
          value={value ?? todayDateValue()}
          minYear={props.minYear}
          maxYear={props.maxYear}
          onCancel={() => setOpen(false)}
          onConfirm={(next) => {
            props.onChange(next);
            setOpen(false);
          }}
        />
      ) : (
        <TimePickerOverlay
          mode="mobile"
          open={open}
          value={value ?? DEFAULT_TIME}
          onCancel={() => setOpen(false)}
          onConfirm={(next) => {
            props.onChange(next);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}

export type { DateTimePickerButtonProps };
export { DateTimePickerButton };
