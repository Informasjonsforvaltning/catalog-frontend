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

export const convertListToListOfObjects = (valueList: string[], key: string) => {
  return valueList.map((value) => ({ [key]: value }));
};

export function groupByKeys(inputList: { [key: string]: string }[]): { [key: string]: string[] } {
  // Transform from localizedStrings to list on the form {nb: [], nn: [], en: []}
  const outputDict: { [key: string]: string[] } = {};

  inputList.forEach((item) => {
    for (const key in item) {
      if (outputDict[key]) {
        outputDict[key].push(item[key]);
      } else {
        outputDict[key] = [item[key]];
      }
    }
  });

  return outputDict;
}

export function transformToLocalizedStrings(inputDict: {
  nn?: string[];
  nb?: string[];
  en?: string[];
}): { nn?: string; nb?: string; en?: string }[] {
  const outputList: { nn?: string; nb?: string; en?: string }[] = [];
  const allowedKeys: (keyof typeof inputDict)[] = ['nn', 'nb', 'en'];

  allowedKeys.forEach((key) => {
    if (inputDict[key]) {
      inputDict[key]!.forEach((value) => {
        outputList.push({ [key]: value });
      });
    }
  });

  return outputList;
}
