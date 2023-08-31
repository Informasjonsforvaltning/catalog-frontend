import React, { FC } from 'react';
import CheckboxTree, { Node, OnCheckNode } from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';

import classes from './checkbox-tree.module.css';
import { Select } from '@catalog-frontend/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faSquare } from '@fortawesome/free-regular-svg-icons';
import { getPath } from '@catalog-frontend/utils';

export interface TreeNode {
  value: string;
  label: string;
  children?: TreeNode[];
}

interface Props {
  nodes?: TreeNode[];
  onCheck?: (value: string[]) => void;
}

const getSearchOptions = (nodes?: TreeNode[]) => {
  let options: any = [];
  if (nodes) {
    nodes.forEach(({ value, label, children }) => {
      options.push({ value, label });
      options = options.concat(getSearchOptions(children));
    });
  }

  return options;
};

export const CheckboxTreeFilter: FC<Props> = ({ nodes, onCheck }) => {
  const [checked, setChecked] = React.useState<string[]>([]);
  const [expanded, setExpanded] = React.useState<string[]>([]);

  const handleChecked = ({ value }) => {
    const path = getPath(nodes, value).map((item) => item.value);
    if (checked.includes(value)) {
      const newChecked = path.slice(0, -1);
      setExpanded(newChecked);
      setChecked(newChecked);
      onCheck?.(newChecked);
      return;
    }

    let inCurrentPath = false;
    for (let i = 0; i < path.length; i++) {
      if (expanded.includes(path[i])) {
        inCurrentPath = true;
        break;
      }
    }

    if (!inCurrentPath) {
      setExpanded([value]);
      setChecked([value]);
      onCheck?.([value]);
    } else {
      setExpanded(path);
      setChecked(path);
      onCheck?.(path);
    }
  };
  const handleSearchOnChange = (value: any) => {
    if (value !== null) {
      const path = getPath(nodes, value).map((item) => item.value);
      setExpanded(path);
      setChecked(path);
      onCheck?.(path);
    }
  };

  const handleOnClick = (node: OnCheckNode) => {
    handleChecked(node);
  };

  const handleOnCheck = (_values, node: OnCheckNode) => {
    handleChecked(node);
  };

  return (
    <div>
      <Select
        options={getSearchOptions(nodes)}
        onChange={handleSearchOnChange}
      />
      <CheckboxTree
        nodes={nodes.map((node) => ({ ...node, className: classes.checkbox })) ?? []}
        checked={checked}
        expanded={expanded}
        onClick={handleOnClick}
        onCheck={handleOnCheck}
        onExpand={(exp) => setExpanded(exp)}
        noCascade
        expandDisabled
        icons={{
          parentClose: null,
          parentOpen: null,
          leaf: null,
          halfCheck: null,
          expandClose: null,
          expandOpen: null,
          expandAll: null,
          collapseAll: null,
          check: (
            <FontAwesomeIcon
              className={classes.checkboxIcon}
              icon={faCheckSquare}
            />
          ),
          uncheck: (
            <FontAwesomeIcon
              className={classes.checkboxIcon}
              icon={faSquare}
            />
          ),
        }}
      />
    </div>
  );
};
