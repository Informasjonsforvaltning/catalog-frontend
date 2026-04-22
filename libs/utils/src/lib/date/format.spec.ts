import {
  formatFlexibleDate,
  parseFlexibleDate,
  toCanonicalFlexibleISO,
} from "./format";

describe("parseFlexibleDate", () => {
  test("parses ISO yyyy-MM-dd as date precision", () => {
    const parsed = parseFlexibleDate("2024-06-15");
    expect(parsed?.precision).toBe("date");
    expect(parsed?.iso).toBe("2024-06-15");
  });

  test("parses ISO yyyy-MM as yearMonth precision", () => {
    const parsed = parseFlexibleDate("2024-06");
    expect(parsed?.precision).toBe("yearMonth");
    expect(parsed?.iso).toBe("2024-06");
  });

  test("parses ISO yyyy as year precision", () => {
    const parsed = parseFlexibleDate("2024");
    expect(parsed?.precision).toBe("year");
    expect(parsed?.iso).toBe("2024");
  });

  test("parses Norwegian dd.MM.yyyy as date precision", () => {
    const parsed = parseFlexibleDate("15.06.2024");
    expect(parsed?.precision).toBe("date");
    expect(parsed?.iso).toBe("2024-06-15");
  });

  test("parses Norwegian MM.yyyy as yearMonth precision", () => {
    const parsed = parseFlexibleDate("06.2024");
    expect(parsed?.precision).toBe("yearMonth");
    expect(parsed?.iso).toBe("2024-06");
  });

  test("accepts slash separators (ISO style)", () => {
    expect(parseFlexibleDate("2024/06/15")?.iso).toBe("2024-06-15");
    expect(parseFlexibleDate("2024/06")?.iso).toBe("2024-06");
  });

  test("accepts slash separators (Norwegian style)", () => {
    expect(parseFlexibleDate("15/06/2024")?.iso).toBe("2024-06-15");
    expect(parseFlexibleDate("06/2024")?.iso).toBe("2024-06");
  });

  test("accepts JS Date objects", () => {
    const date = new Date(Date.UTC(2024, 5, 15, 12));
    const parsed = parseFlexibleDate(date);
    expect(parsed?.precision).toBe("date");
    expect(parsed?.iso).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test("trims whitespace", () => {
    expect(parseFlexibleDate("  15.06.2024  ")?.iso).toBe("2024-06-15");
  });

  test("rejects empty and null", () => {
    expect(parseFlexibleDate("")).toBeNull();
    expect(parseFlexibleDate("   ")).toBeNull();
    expect(parseFlexibleDate(null)).toBeNull();
    expect(parseFlexibleDate(undefined)).toBeNull();
  });

  test("rejects partial and malformed input", () => {
    expect(parseFlexibleDate("2024-")).toBeNull();
    expect(parseFlexibleDate("24")).toBeNull();
    expect(parseFlexibleDate("2024.")).toBeNull();
    expect(parseFlexibleDate("6.2024")).toBeNull();
    expect(parseFlexibleDate("2024-6-15")).toBeNull();
    expect(parseFlexibleDate("abc")).toBeNull();
  });

  test("rejects invalid calendar dates", () => {
    expect(parseFlexibleDate("32.01.2024")).toBeNull();
    expect(parseFlexibleDate("00.01.2024")).toBeNull();
    expect(parseFlexibleDate("13.2024")).toBeNull();
    expect(parseFlexibleDate("29.02.2023")).toBeNull();
    expect(parseFlexibleDate("2023-02-29")).toBeNull();
  });

  test("accepts leap year Feb 29", () => {
    expect(parseFlexibleDate("29.02.2024")?.iso).toBe("2024-02-29");
    expect(parseFlexibleDate("2024-02-29")?.iso).toBe("2024-02-29");
  });

  test("rejects ISO datetime with time component", () => {
    expect(parseFlexibleDate("2024-06-15T00:00:00Z")).toBeNull();
  });
});

describe("toCanonicalFlexibleISO", () => {
  test("normalizes accepted formats to canonical ISO", () => {
    expect(toCanonicalFlexibleISO("2024")).toBe("2024");
    expect(toCanonicalFlexibleISO("06.2024")).toBe("2024-06");
    expect(toCanonicalFlexibleISO("15.06.2024")).toBe("2024-06-15");
    expect(toCanonicalFlexibleISO("2024-06-15")).toBe("2024-06-15");
  });

  test("returns null for invalid input", () => {
    expect(toCanonicalFlexibleISO("abc")).toBeNull();
    expect(toCanonicalFlexibleISO("2024-")).toBeNull();
  });
});

describe("formatFlexibleDate", () => {
  test("formats canonical year to year display", () => {
    expect(formatFlexibleDate("2024")).toBe("2024");
  });

  test("formats canonical yearMonth to MM.yyyy", () => {
    expect(formatFlexibleDate("2024-06")).toBe("06.2024");
  });

  test("formats canonical date to dd.MM.yyyy", () => {
    expect(formatFlexibleDate("2024-06-15")).toBe("15.06.2024");
  });

  test("is idempotent on display-form input", () => {
    expect(formatFlexibleDate("2024")).toBe("2024");
    expect(formatFlexibleDate("06.2024")).toBe("06.2024");
    expect(formatFlexibleDate("15.06.2024")).toBe("15.06.2024");
  });

  test("returns null for empty input", () => {
    expect(formatFlexibleDate(undefined)).toBeNull();
    expect(formatFlexibleDate("")).toBeNull();
  });

  test("falls back to dd.MM.yyyy for full ISO datetime (legacy data)", () => {
    expect(formatFlexibleDate("2024-06-15T00:00:00Z")).toBe("15.06.2024");
  });
});
