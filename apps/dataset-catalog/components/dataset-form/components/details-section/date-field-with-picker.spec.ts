import { isAllowedDateChars } from "./date-field-with-picker.utils";

describe("isAllowedDateChars", () => {
  it.each([
    null,
    "",
    "1",
    "123",
    "01.02.2024",
    "01/02/2024",
    ".",
    " ",
    "2026 ",
    " 2026",
    "12 34",
  ])("allows %p", (value) => {
    expect(isAllowedDateChars(value)).toBe(true);
  });

  it.each(["a", "-", "2024-06-15", "ø", "1a", "01.02.2024a"])(
    "rejects %p",
    (value) => {
      expect(isAllowedDateChars(value)).toBe(false);
    },
  );
});
