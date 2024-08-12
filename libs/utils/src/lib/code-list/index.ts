import { Code, CodeList, TreeNode } from '@catalog-frontend/types';
import { getTranslateText } from '../language/translateText';

const findParent = (id: string, nodes: TreeNode[]): TreeNode | null => {
  const parent = nodes.find((node) => node.value === `${id}`);
  if (parent) {
    return parent;
  }

  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].children) {
      const parent = findParent(id, nodes[i].children ?? []);
      if (parent) {
        return parent;
      }
    }
  }

  return null;
};

const findPathInNode = (treeNode: TreeNode, targetValue: string) => {
  const path: TreeNode[] = [];

  const dfs = (tn: TreeNode, v: string) => {
    if (!tn) {
      return false;
    }

    path.push(tn);

    if (tn.value === v) {
      return true;
    }

    if (tn.children?.length) {
      for (let index = 0; index < tn.children.length; index++) {
        if (dfs(tn.children[index], v)) {
          return true;
        }
      }
    }

    path.pop();
    return false;
  };

  dfs(treeNode, targetValue);
  return path.slice(); // Return a shallow copy of the path array
};

export const getPath = (nodes?: TreeNode[], value?: string) => {
  if (nodes && value) {
    for (let index = 0; index < nodes.length; index++) {
      const path = findPathInNode(nodes[index], value);
      if (path.length > 0) {
        return path;
      }
    }
  }

  return [];
};

export const convertCodeListToTreeNodes = (codes: Code[] | undefined): TreeNode[] =>
  codes?.reduce((accumulator, currentValue, _currentIndex, codes) => {
    // Use the tree node if it already exists in the accumulator
    const current = accumulator.find((node) => node.value === `${currentValue.id}`);
    // Remove the node from the accumulator if it exists
    accumulator = accumulator.filter((node) => node.value !== `${currentValue.id}`);

    if (currentValue.parentID !== null && currentValue.parentID !== 'noParent') {
      let parent = findParent(currentValue.parentID, accumulator);
      if (!parent) {
        const parentCode = codes.find((code) => code.id === currentValue.parentID);
        parent = parentCode
          ? ({
              value: `${parentCode.id}`,
              label: `${getTranslateText(parentCode.name)}`,
            } as TreeNode)
          : null;
        if (parent) {
          accumulator.push(parent);
        }
      }

      if (parent) {
        parent.children = [
          ...(parent.children ?? []),
          current ?? {
            value: `${currentValue.id}`,
            label: `${getTranslateText(currentValue.name)}`,
          },
        ];
      }
    } else {
      accumulator.push(
        current ?? {
          value: `${currentValue.id}`,
          label: `${getTranslateText(currentValue.name)}`,
        },
      );
    }
    return accumulator;
  }, [] as TreeNode[]) ?? [];

export const getAllChildrenCodes = (codeId: string, codeList: CodeList | undefined) => {
  const children: Code[] = [];
  (codeList?.codes?.filter((code) => code.parentID === codeId) ?? []).forEach((code) => {
    children.push(code);
    children.push(...getAllChildrenCodes(code.id, codeList));
  });
  return children;
};
