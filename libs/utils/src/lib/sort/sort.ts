export const sortAscending = (a: any, b: any) => {
  if (a === b) {
    return 0;
  }
  return a > b ? 1 : -1;
};

export const sortDescending = (a: any, b: any) => {
  if (a === b) {
    return 0;
  }
  return a < b ? 1 : -1;
};
