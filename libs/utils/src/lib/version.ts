import { Version } from "@catalog-frontend/types";

export const compareVersion = (
  v1: Version | null | undefined,
  v2: Version | null | undefined
) => {
  if (v1 == null && v2 == null) return 0;
  if (v1 == null) return -1;
  if (v2 == null) return 1;

  const v1String = `${v1.major}.${v1.minor}.${v1.patch}`;
  const v2String = `${v2.major}.${v2.minor}.${v2.patch}`;

  // vnum stores each numeric
  // part of version
  let vnum1 = 0;
  let vnum2 = 0;

  // loop until both strings are processed
  for (let i = 0, j = 0; i < v1String.length || j < v2String.length; ) {
    // storing numeric part of
    // version 1 in vnum1
    while (i < v1String.length && v1String[i] !== '.') {
      vnum1 = vnum1 * 10 + +v1String[i];
      i++;
    }

    // storing numeric part of
    // version 2 in vnum2
    while (j < v2String.length && v2String[j] !== '.') {
      vnum2 = vnum2 * 10 + +v2String[j];
      j++;
    }

    if (vnum1 > vnum2) return 1;
    if (vnum2 > vnum1) return -1;

    // if equal, reset variables and
    // go for next numeric part
    vnum1 = 0;
    vnum2 = 0;
    i++;
    j++;
  }
  return 0;
};
