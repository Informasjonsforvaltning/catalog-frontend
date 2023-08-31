import { CodeList, TreeNode } from '@catalog-frontend/types';
import { getTranslateText } from '../language/translateText';

const findParent = (id: number, nodes: TreeNode[]): TreeNode | null => {
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

export const convertCodeListToTreeNodes = (codeList: CodeList): TreeNode[] =>
  codeList?.codes?.reduce((accumulator, currentValue) => {
    const parent = currentValue.parentID !== null ? findParent(currentValue.parentID, accumulator) : null;

    if (parent) {
      parent.children = [
        ...(parent.children ?? []),
        {
          value: `${currentValue.id}`,
          label: `${getTranslateText(currentValue.name)}`,
        },
      ];
    } else {
      accumulator.push({
        value: `${currentValue.id}`,
        label: `${getTranslateText(currentValue.name)}`,
      });
    }
    return accumulator;
  }, [] as TreeNode[]) ?? [];
