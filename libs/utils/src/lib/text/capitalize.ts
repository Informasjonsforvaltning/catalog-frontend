export const capitalizeFirstLetter = (text: unknown): string => {
  if (typeof text !== 'string') return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const lowerCaseFirstLetter = (text: string | undefined) => {
  return text ? text.charAt(0).toLowerCase() + text.slice(1) : '';
};
