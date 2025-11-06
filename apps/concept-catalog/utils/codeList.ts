import { Code } from "@catalog-frontend/types";

export const getParentPath = (
  code: Code,
  codes: Code[],
  path: string[] = [],
) => {
  if (code.parentID) {
    const parent = codes?.find((match) => match.id === code.parentID);
    if (parent) {
      path.push(parent.name.nb as any);
      getParentPath(parent, codes, path);
    }
  }
  return path.reverse();
};
