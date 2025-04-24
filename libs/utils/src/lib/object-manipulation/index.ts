import _ from 'lodash';

export const removeEmptyValues = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((value) =>
      typeof value === 'object' && value !== null
        ? removeEmptyValues(value) // Recursively process nested objects in arrays
        : value !== ''
          ? value
          : undefined,
    );
  }

  if (typeof obj === 'object' && obj !== null) {
    return _.mapValues(
      _.omitBy(obj, (value) => value === ''), // Omit key-value pairs where the value is an empty string
      (value) =>
        typeof value === 'object' && value !== null
          ? removeEmptyValues(value) // Recursively process nested objects in objects
          : value,
    );
  }

  return obj;
};

export const trimObjectWhitespace = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((value) =>
      typeof value === 'object' && value !== null
        ? trimObjectWhitespace(value) // Recursively process nested objects in arrays
        : typeof value === 'string'
          ? value.trim() // Trim strings in arrays
          : value,
    );
  }

  if (typeof obj === 'object' && obj !== null) {
    return _.mapValues(obj, (value) =>
      typeof value === 'object' && value !== null
        ? trimObjectWhitespace(value) // Recursively process nested objects in objects
        : typeof value === 'string'
          ? value.trim() // Trim strings in objects
          : value,
    );
  }

  return typeof obj === 'string' ? obj.trim() : obj; // Trim root-level strings if necessary
};
