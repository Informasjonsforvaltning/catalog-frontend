'use client';

import React, { FC, useEffect } from 'react';
import CheckboxTree, { OnCheckNode } from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';

import classes from './checkbox-tree.module.css';
import { Select } from '@catalog-frontend/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faSquare } from '@fortawesome/free-regular-svg-icons';
import { getPath, localization } from '@catalog-frontend/utils';
import { Button, Label } from '@digdir/design-system-react';
import { ChevronDownDoubleIcon, ChevronUpDoubleIcon } from '@navikt/aksel-icons';

export interface TreeNode {
  value: string;
  label: string;
  children?: TreeNode[];
}

interface Props {
  nodes?: TreeNode[];
  onCheck?: (value: string[]) => void;
  filters: string[];
}

const getSearchOptions = (nodes?: TreeNode[]) => {
  let options: any = [];
  if (nodes) {
    nodes.forEach(({ value, label, children }) => {
      options.push({ value, label });
      options = options.concat(getSearchOptions(children));
    });
  }

  return options.sort((a: { label: string }, b: { label: any }) => a.label.localeCompare(b.label));
};

const generateOptionElements = (nodes?: TreeNode[]): JSX.Element[] => {
  const options = getSearchOptions(nodes);

  return options.map((opt) => (
    <option
      value={opt.value}
      key={`searchOption-${opt.value}`}
    >
      {opt.label}
    </option>
  ));
};

export const CheckboxTreeFilter: FC<Props> = ({ nodes, onCheck, filters }) => {
  const [checked, setChecked] = React.useState<string[]>([]);
  const [expanded, setExpanded] = React.useState<string[]>([]);
  const [collapsed, setCollapsed] = React.useState(true);
  const [searchOption, setSearchOption] = React.useState('');

  useEffect(() => {
    setChecked(filters);
    setExpanded(filters);
  }, [filters]);

  const handleChecked = ({ value }) => {
    setSearchOption('');

    const path = getPath(nodes, value).map((item) => item.value);
    if (checked.includes(value)) {
      const newChecked = path.slice(0, -1);
      setExpanded(newChecked);
      onCheck?.(newChecked);
      return;
    }

    let inCurrentPath = false;
    for (const element of path) {
      if (expanded.includes(element)) {
        inCurrentPath = true;
        break;
      }
    }

    if (!inCurrentPath) {
      setExpanded([value]);
      onCheck?.([value]);
    } else {
      setExpanded(path);
      onCheck?.(path);
    }
  };
  const handleSearchOnChange = (value: any) => {
    if (value !== null) {
      setSearchOption(value);
      const path = getPath(nodes, value).map((item) => item.value);
      setExpanded(path);
      onCheck?.(path);

      const index = nodes?.findIndex((item) => item.value === path[0]);
      if (index && index >= 9 && collapsed) {
        setCollapsed(false);
      }
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
        value={searchOption}
        onChange={(event) => handleSearchOnChange(event.target.value)}
      >
        {generateOptionElements(nodes)}
      </Select>
      <div className={classes.pt1}>
        <CheckboxTree
          nodes={
            (collapsed ? nodes?.slice(0, 10) : nodes)?.map((node) => ({
              ...node,
              className: classes.checkbox,
              label: (
                <Label
                  as='span'
                  size='small'
                  weight='regular'
                >
                  {node.label}
                </Label>
              ),
            })) ?? []
          }
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
      {nodes && nodes.length > 10 && (
        <Button
          variant='tertiary'
          icon={collapsed ? <ChevronDownDoubleIcon /> : <ChevronUpDoubleIcon />}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? localization.showMore : localization.showLess}
        </Button>
      )}
    </div>
  );
};
