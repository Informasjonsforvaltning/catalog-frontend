// For sorting strings in ascending order (case-insensitive) using Norwegian locale
export const sortAscending = (a: string, b: string) => {
  return a.localeCompare(b, 'nb', { sensitivity: 'base' });
};

// For sorting strings in descending order (case-insensitive) using Norwegian locale
export const sortDescending = (a: string, b: string) => {
  return b.localeCompare(a, 'nb', { sensitivity: 'base' });
};

// For sorting ISO 8601 date strings in ascending order
export const sortDateStringsAscending = (a: string, b: string) => {
  return new Date(a).getTime() - new Date(b).getTime();
};

// For sorting ISO 8601 date strings in descending order
export const sortDateStringsDescending = (a: string, b: string) => {
  return new Date(b).getTime() - new Date(a).getTime();
};
