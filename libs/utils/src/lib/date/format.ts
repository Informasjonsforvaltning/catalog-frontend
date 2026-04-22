import { DateTime } from "luxon";

export const formatISO = (
  isoDate: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  },
) => {
  if (!isoDate) {
    return null;
  }

  const d = new Date(isoDate);
  return d.toLocaleString("no-NO", options);
};

export const dateStringToDate = (dateString: string) => {
  const dateStringTimestamp = Date.parse(dateString);
  const date = new Date(dateStringTimestamp);
  date.setHours(0, 0, 0, 0);
  return !isNaN(dateStringTimestamp) ? date : null;
};

export const formatDate = (date: Date | null) =>
  date
    ? date
        .toLocaleDateString("nb-NO", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .split("/")
        .join(".")
    : "";

const isDateSameDayAsNow = (date: Date) =>
  date.getFullYear() === new Date().getFullYear() &&
  date.getMonth() === new Date().getMonth() &&
  date.getDate() === new Date().getDate();

export const isDateBeforeToday = (date: Date | null) =>
  date && date.getTime() < Date.now() && !isDateSameDayAsNow(date);

export const isDateAfterToday = (date: Date | null) =>
  date && date.getTime() > Date.now() && !isDateSameDayAsNow(date);

export const parseDateTime = (value: any) => {
  if (!value) {
    return null;
  }

  let dateTime = DateTime.fromJSDate(value);
  if (dateTime.isValid) {
    return dateTime;
  }

  dateTime = DateTime.fromFormat(value, "yyyy-MM-dd");
  if (dateTime.isValid) {
    return dateTime;
  }

  return null;
};

export const formatDateToDDMMYYYY = (isoDate: string | undefined) => {
  if (!isoDate) return null;

  const date = DateTime.fromISO(isoDate);
  return date.isValid ? date.toFormat("dd.MM.yyyy") : null;
};

export type FlexiblePrecision = "year" | "yearMonth" | "date";

export interface FlexibleParsed {
  dateTime: DateTime;
  precision: FlexiblePrecision;
  iso: string;
}

type FlexibleVariant = {
  pattern: RegExp;
  source: "iso" | "nor";
  luxonFormat: string;
  precision: FlexiblePrecision;
};

const flexibleVariants: FlexibleVariant[] = [
  {
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    source: "iso",
    luxonFormat: "yyyy-MM-dd",
    precision: "date",
  },
  {
    pattern: /^\d{4}-\d{2}$/,
    source: "iso",
    luxonFormat: "yyyy-MM",
    precision: "yearMonth",
  },
  { pattern: /^\d{4}$/, source: "iso", luxonFormat: "yyyy", precision: "year" },
  {
    pattern: /^\d{2}\.\d{2}\.\d{4}$/,
    source: "nor",
    luxonFormat: "dd.MM.yyyy",
    precision: "date",
  },
  {
    pattern: /^\d{2}\.\d{4}$/,
    source: "nor",
    luxonFormat: "MM.yyyy",
    precision: "yearMonth",
  },
];

const isoFormatFor = (precision: FlexiblePrecision): string =>
  precision === "date"
    ? "yyyy-MM-dd"
    : precision === "yearMonth"
      ? "yyyy-MM"
      : "yyyy";

export const parseFlexibleDate = (
  value: string | Date | null | undefined,
): FlexibleParsed | null => {
  if (!value) return null;

  if (value instanceof Date) {
    const dt = DateTime.fromJSDate(value);
    return dt.isValid
      ? { dateTime: dt, precision: "date", iso: dt.toFormat("yyyy-MM-dd") }
      : null;
  }

  const trimmed = value.trim();
  if (!trimmed) return null;

  const candidates = {
    iso: trimmed.replace(/\//g, "-"),
    nor: trimmed.replace(/\//g, "."),
  };

  for (const variant of flexibleVariants) {
    const input = candidates[variant.source];
    if (!variant.pattern.test(input)) continue;
    const dt = DateTime.fromFormat(input, variant.luxonFormat);
    if (dt.isValid) {
      return {
        dateTime: dt,
        precision: variant.precision,
        iso: dt.toFormat(isoFormatFor(variant.precision)),
      };
    }
  }

  return null;
};

export const toCanonicalFlexibleISO = (value: string): string | null =>
  parseFlexibleDate(value)?.iso ?? null;

export const formatFlexibleDate = (
  value: string | undefined,
): string | null => {
  if (!value) {
    return null;
  }

  const parsed = parseFlexibleDate(value);

  if (parsed) {
    switch (parsed.precision) {
      case "year":
        return parsed.dateTime.toFormat("yyyy");
      case "yearMonth":
        return parsed.dateTime.toFormat("MM.yyyy");
      case "date":
        return parsed.dateTime.toFormat("dd.MM.yyyy");
    }
  }
  return formatDateToDDMMYYYY(value);
};
