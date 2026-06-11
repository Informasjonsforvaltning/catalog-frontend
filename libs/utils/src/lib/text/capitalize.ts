export const capitalizeFirstLetter = (
  text: string | undefined | null,
  allOtherLowercase: boolean = true,
) => {
  return text
    ? text.charAt(0).toUpperCase() +
        (allOtherLowercase ? text.slice(1).toLowerCase() : text.slice(1))
    : "";
};

export const lowerCaseFirstLetter = (text: string | undefined) => {
  return text ? text.charAt(0).toLowerCase() + text.slice(1) : "";
};
