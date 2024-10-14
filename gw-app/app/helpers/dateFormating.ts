import { formatDistanceToNowStrict } from "date-fns";

enum TimeUnit {
  SECOND = "second",
  SECONDS = "seconds",
  MINUTE = "minute",
  MINUTES = "minutes",
  HOUR = "hour",
  HOURS = "hours",
  DAY = "day",
  DAYS = "days",
}

const forceWeeks = (date: string) => {
  const formatedDate = formatDistanceToNowStrict(new Date(date), {
    unit: "day",
  });

  const [time, unit] = formatedDate.split(" ");

  const timeNumber = parseInt(time);

  if (timeNumber > 6) {
    return `${Math.floor(timeNumber / 7)}w`;
  }
  return `${time}d`;
};

export const formatedDate = (date: string | undefined) => {
  if (!date) return "";
  const formatedDate = formatDistanceToNowStrict(new Date(date));

  const [time, unit] = formatedDate.split(" ");

  switch (unit) {
    case TimeUnit.SECOND:
    case TimeUnit.SECONDS:
      return `${time}s`;
    case TimeUnit.MINUTE:
    case TimeUnit.MINUTES:
      return `${time}m`;
    case TimeUnit.HOUR:
    case TimeUnit.HOURS:
      return `${time}h`;
    default:
      return forceWeeks(date);
  }
};
