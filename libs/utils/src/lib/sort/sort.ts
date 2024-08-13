// For sorting strings in ascending order (case-insensitive)
export const sortAscending = (a: string, b: string) => {
  return a.toLowerCase().localeCompare(b.toLowerCase());
};

// For sorting strings in descending order (case-insensitive)
export const sortDescending = (a: string, b: string) => {
  return b.toLowerCase().localeCompare(a.toLowerCase());
};

// For sorting ISO 8601 date strings in ascending order
export const sortDateStringsAscending = (a: string, b: string) => {
  return new Date(a).getTime() - new Date(b).getTime();
};

// For sorting ISO 8601 date strings in descending order
export const sortDateStringsDescending = (a: string, b: string) => {
  return new Date(b).getTime() - new Date(a).getTime();
};
