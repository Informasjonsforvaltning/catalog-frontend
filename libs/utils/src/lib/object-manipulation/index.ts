import _ from 'lodash';

const convertEmptyToNull = (obj: Record<string, any>): Record<string, any> => {
  return _.mapValues(obj, (value) => {
    if (typeof value === 'object' && value !== null) {
      return convertEmptyToNull(value); // Recursively process nested objects
    }
    return value === '' ? null : value; // Replace empty string with null
  });
};

export default convertEmptyToNull;
