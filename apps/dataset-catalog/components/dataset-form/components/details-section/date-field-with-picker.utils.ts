const allowedDateChars = /^[\d./\s]*$/;

export const isAllowedDateChars = (data: string | null): boolean =>
  data === null || allowedDateChars.test(data);
