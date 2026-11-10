import {
  formatIsoDuration,
  isDurationUnit,
  parseIsoDuration,
  toIsoDuration,
} from "./duration";

describe("isDurationUnit", () => {
  test.each(["H", "D", "M", "Y"])("accepts %s", (input) => {
    expect(isDurationUnit(input)).toBe(true);
  });

  test.each(["", "W", "S", "m", "HD"])("rejects %s", (input) => {
    expect(isDurationUnit(input)).toBe(false);
  });
});

describe("parseIsoDuration", () => {
  test.each([
    ["PT48H", { amount: 48, unit: "H" }],
    ["P30D", { amount: 30, unit: "D" }],
    ["P6M", { amount: 6, unit: "M" }],
    ["P10Y", { amount: 10, unit: "Y" }],
  ])("parses %s", (input, expected) => {
    expect(parseIsoDuration(input)).toEqual(expected);
  });

  test.each([
    [undefined],
    [null],
    [""],
    ["6M"],
    ["P"],
    ["P0D"],
    ["P2W"],
    ["PT30M"],
    ["P1Y6M"],
    ["P1DT12H"],
    ["P1.5Y"],
    ["p6m"],
  ])("rejects %s", (input) => {
    expect(parseIsoDuration(input)).toBeUndefined();
  });
});

describe("toIsoDuration", () => {
  test("uses time designator for hours", () => {
    expect(toIsoDuration(24, "H")).toBe("PT24H");
  });

  test("uses date part for days, months and years", () => {
    expect(toIsoDuration(30, "D")).toBe("P30D");
    expect(toIsoDuration(6, "M")).toBe("P6M");
    expect(toIsoDuration(1, "Y")).toBe("P1Y");
  });

  test("accepts string amounts", () => {
    expect(toIsoDuration("6", "M")).toBe("P6M");
    expect(toIsoDuration("48", "H")).toBe("PT48H");
  });

  test("round-trips with parseIsoDuration", () => {
    expect(parseIsoDuration(toIsoDuration(3, "M"))).toEqual({
      amount: 3,
      unit: "M",
    });
  });
});

describe("formatIsoDuration", () => {
  test("formats plural and singular", () => {
    expect(formatIsoDuration("P6M")).toBe("6 måneder");
    expect(formatIsoDuration("P1M")).toBe("1 måned");
    expect(formatIsoDuration("PT1H")).toBe("1 time");
    expect(formatIsoDuration("PT48H")).toBe("48 timer");
    expect(formatIsoDuration("P1D")).toBe("1 dag");
    expect(formatIsoDuration("P10Y")).toBe("10 år");
  });

  test("falls back to raw value when unsupported", () => {
    expect(formatIsoDuration("P1Y6M")).toBe("P1Y6M");
  });

  test("returns empty string for missing value", () => {
    expect(formatIsoDuration(undefined)).toBe("");
  });
});
