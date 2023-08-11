export const ensureStringArray = (input: string | string[]): string[] => {
  if (typeof input === 'string') {
    return [input]; // Convert the string to a single-element array
  }
  return input; // Already an array, so return it as is
};
