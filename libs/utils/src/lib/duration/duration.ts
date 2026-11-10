import { localization } from "../language/localization";

export const durationUnits = ["H", "D", "M", "Y"] as const;
export type DurationUnit = (typeof durationUnits)[number];

export interface ParsedDuration {
  amount: number;
  unit: DurationUnit;
}

export const isoDurationRegex = /^P(?:T([1-9]\d*)H|([1-9]\d*)([DMY]))$/;

export const isDurationUnit = (value: string): value is DurationUnit =>
  (durationUnits as readonly string[]).includes(value);

export const parseIsoDuration = (
  value: string | null | undefined,
): ParsedDuration | undefined => {
  if (!value) return undefined;
  const match = isoDurationRegex.exec(value.trim());
  if (!match) return undefined;

  const [, hours, amount, unit] = match;
  if (hours) return { amount: Number(hours), unit: "H" };
  if (amount && unit && isDurationUnit(unit)) {
    return { amount: Number(amount), unit };
  }
  return undefined;
};

export const toIsoDuration = (
  amount: number | string,
  unit: DurationUnit,
): string => (unit === "H" ? `PT${amount}H` : `P${amount}${unit}`);

export const formatDurationUnit = (
  amount: number,
  unit: DurationUnit,
): string => {
  const names = localization.duration.unit[unit];
  return amount === 1 ? names.singular : names.plural;
};

export const formatIsoDuration = (value: string | null | undefined): string => {
  if (!value) return "";
  const parsed = parseIsoDuration(value);
  if (!parsed) return value;
  return `${parsed.amount} ${formatDurationUnit(parsed.amount, parsed.unit)}`;
};
