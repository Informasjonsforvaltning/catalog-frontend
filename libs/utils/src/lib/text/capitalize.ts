export const capitalizeFirstLetter = (text: string|undefined) => {
  return `${text?.charAt(0).toUpperCase()}${text?.slice(1)}`;
}
