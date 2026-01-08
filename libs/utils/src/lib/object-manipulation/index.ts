import _ from "lodash";

/**
 * Checks if a value is considered empty (null, undefined, empty string, or empty array).
 */
const isEmptyValue = (value: unknown): boolean => {
  if (value === undefined || value === null || value === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
};

/**
 * Recursively removes keys with empty values from an object.
 * Handles empty strings, null, undefined, and empty arrays.
 * E.g., { title: { nb: "", nn: "text" } } becomes { title: { nn: "text" } }
 */
export const removeEmptyOrNullValues = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map((value: unknown) =>
      typeof value === "object" && value !== null
        ? removeEmptyOrNullValues(value)
        : isEmptyValue(value)
          ? undefined
          : value,
    ) as T;
  }

  if (typeof obj === "object" && obj !== null) {
    return _.mapValues(
      _.omitBy(obj as Record<string, unknown>, isEmptyValue),
      (value: unknown) =>
        typeof value === "object" && value !== null
          ? removeEmptyOrNullValues(value)
          : value,
    ) as T;
  }

  return obj;
};

export const removeEmptyValues = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((value) =>
      typeof value === "object" && value !== null
        ? removeEmptyValues(value) // Recursively process nested objects in arrays
        : value !== ""
          ? value
          : undefined,
    );
  }

  if (typeof obj === "object" && obj !== null) {
    return _.mapValues(
      _.omitBy(obj, (value) => value === ""), // Omit key-value pairs where the value is an empty string
      (value) =>
        typeof value === "object" && value !== null
          ? removeEmptyValues(value) // Recursively process nested objects in objects
          : value,
    );
  }

  return obj;
};

export const trimObjectWhitespace = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((value) =>
      typeof value === "object" && value !== null
        ? trimObjectWhitespace(value) // Recursively process nested objects in arrays
        : typeof value === "string"
          ? value.trim() // Trim strings in arrays
          : value,
    );
  }

  if (typeof obj === "object" && obj !== null) {
    return _.mapValues(obj, (value) =>
      typeof value === "object" && value !== null
        ? trimObjectWhitespace(value) // Recursively process nested objects in objects
        : typeof value === "string"
          ? value.trim() // Trim strings in objects
          : value,
    );
  }

  return typeof obj === "string" ? obj.trim() : obj; // Trim root-level strings if necessary
};

/**
 * Recursively replaces null values with undefined in an object or array
 * This is useful for Formik forms that don't handle null values well
 */
export const safeValues = (obj: any): any => {
  if (obj === null) {
    return undefined;
  }
  if (Array.isArray(obj)) {
    return obj.map(safeValues);
  }
  if (typeof obj === "object" && obj !== null) {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = safeValues(value);
    }
    return result;
  }
  return obj;
};

export const convertListToListOfObjects = (
  valueList: string[],
  key: string,
) => {
  return valueList.map((value) => ({ [key]: value }));
};

export function groupByKeys(inputList: { [key: string]: string }[]): {
  [key: string]: string[];
} {
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
  const allowedKeys: (keyof typeof inputDict)[] = ["nn", "nb", "en"];

  allowedKeys.forEach((key) => {
    if (inputDict[key]) {
      inputDict[key]!.forEach((value) => {
        outputList.push({ [key]: value });
      });
    }
  });

  return outputList;
}

/**
 * Deep merge utility that handles undefined values properly
 * This is useful for merging form data where undefined values should not override existing values
 * @param target - The base object to merge into
 * @param source - The object to merge from
 * @returns A new object with the merged values
 */
export const deepMergeWithUndefinedHandling = (
  target: any,
  source: any,
): any => {
  if (source === undefined) {
    return target;
  }

  if (typeof source !== "object" || source === null) {
    return source;
  }

  if (typeof target !== "object" || target === null) {
    return source;
  }

  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] === undefined) {
        // Skip undefined values from source
        continue;
      }

      if (
        typeof source[key] === "object" &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        result[key] = deepMergeWithUndefinedHandling(result[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }

  return result;
};
