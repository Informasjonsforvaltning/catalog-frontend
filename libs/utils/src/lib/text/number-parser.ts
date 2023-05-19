export const textToNumber = (text: string|undefined, defaultValue = 0) => {
  return text ? parseInt(text) : defaultValue;
}
