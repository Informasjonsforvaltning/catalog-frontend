import { jwtDecode } from 'jwt-decode';

/**
 * Generally used to produce a uniq hash array items.
 * Unlike uniqId() of lodash, it garanties that an array
 * item always has the same key value
 * @param s a string to hash
 * @returns the hash code of the string
 */
export const hashCode = (s: string) => {
  let i, h;
  for (i = 0, h = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
};

export const isObjectNullUndefinedEmpty = (object: any | null | undefined) =>
  object === undefined ||
  object === null ||
  Object.keys(object).length === 0 ||
  Object.values(object).every((x) => x === null || x === '');

export const getOrganizationsIds = (accessToken: string): string[] => {
  // @ts-expect-error .authorities gives type error, but exists in the object
  const orgRoles: string = jwtDecode(accessToken).authorities;
  const ids = orgRoles
    .split(',')
    .map((item) => item.split(':')[1])
    .filter((part) => /^\d+$/.test(part));

  return Array.from(new Set(ids));
};
