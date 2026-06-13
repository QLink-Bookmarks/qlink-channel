const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

function getGreetingMessage(date: Date): string {
  const hour = date.getHours();
  if (hour < 6) return "늦은 밤이에요";
  if (hour < 11) return "좋은 아침이에요";
  if (hour < 17) return "좋은 오후예요";
  if (hour < 21) return "좋은 저녁이에요";
  return "편안한 밤 되세요";
}

function formatFullDateLabel(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAY_LABELS[date.getDay()];

  const rawHour = date.getHours();
  const period = rawHour < 12 ? "오전" : "오후";
  const hour12 = rawHour % 12 === 0 ? 12 : rawHour % 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}년 ${month}월 ${day}일 ${weekday}요일 · ${period} ${hour12}:${minutes}`;
}

export { formatFullDateLabel, getGreetingMessage };
