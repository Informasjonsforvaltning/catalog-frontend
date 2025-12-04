export const ensureStringArray = (input: string | string[]): string[] => {
  if (input === undefined || input === null || input === "") {
    return [];
  }
  if (typeof input === "string") {
    return [input]; // Convert the string to a single-element array
  }
  return input; // Already an array, so return it as is
};

export function getString(input: string | string[]): string {
  return typeof input === "object" ? input[0] : input;
}
