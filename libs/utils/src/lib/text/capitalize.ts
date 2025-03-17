export const capitalizeFirstLetter = (text: string | undefined | null) => {
  return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : '';
};
