const allowedDateChars = /^[\d./]*$/;

export const isAllowedDateChars = (data: string | null): boolean =>
  data === null || allowedDateChars.test(data);
