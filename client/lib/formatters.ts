const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const relativeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const timeDivisions: { amount: number; name: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, name: "seconds" },
  { amount: 60, name: "minutes" },
  { amount: 24, name: "hours" },
  { amount: 7, name: "days" },
  { amount: 4.34524, name: "weeks" },
  { amount: 12, name: "months" },
  { amount: Number.POSITIVE_INFINITY, name: "years" },
];

const numberFormatter = new Intl.NumberFormat("en", { maximumFractionDigits: 1 });

export const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.valueOf())) {
    return isoDate;
  }
  return dateFormatter.format(date);
};

export const formatDateTime = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.valueOf())) {
    return isoDate;
  }
  return dateTimeFormatter.format(date);
};

export const formatRelativeTime = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.valueOf())) {
    return isoDate;
  }

  let duration = (date.getTime() - Date.now()) / 1000;

  for (const division of timeDivisions) {
    if (Math.abs(duration) < division.amount) {
      return relativeFormatter.format(Math.round(duration), division.name);
    }
    duration /= division.amount;
  }

  return relativeFormatter.format(Math.round(duration), "years");
};

export const formatConfidence = (confidence: number) =>
  `${Math.round(confidence * 100)}%`;

export const formatTokens = (tokens: number) => `${tokens.toLocaleString()} tokens`;

export const formatDuration = (durationMs: number) => {
  if (durationMs < 1_000) {
    return `${durationMs} ms`;
  }
  if (durationMs < 60_000) {
    return `${numberFormatter.format(durationMs / 1_000)} s`;
  }
  const minutes = durationMs / 60_000;
  if (minutes < 60) {
    return `${numberFormatter.format(minutes)} min`;
  }
  return `${numberFormatter.format(minutes / 60)} h`;
};
