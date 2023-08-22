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
