"use client";

import { Checkbox } from "@digdir/designsystemet-react";
import { TreeNode } from "../checkbox-tree-filter";
import styles from "./recursive-checkbox.module.css";

interface Props {
  filters: string[];
  node: TreeNode;
  onCheck: (node: string) => void;
}

export const RecursiveCheckbox = (props: Props) => {
  const { node, filters, onCheck } = props;
  const checked = filters.includes(node.value);

  return (
    <div>
      <Checkbox
        size="small"
        checked={checked}
        onChange={() => onCheck(node.value)}
        value={node.value}
      >
        {node.label}
      </Checkbox>

      {checked && Boolean(node.children?.length) && (
        <div className={styles.checkboxGroup}>
          {node.children?.map((child) => (
            <RecursiveCheckbox
              filters={filters}
              key={child.value}
              node={child}
              onCheck={onCheck}
            />
          ))}
        </div>
      )}
    </div>
  );
};
