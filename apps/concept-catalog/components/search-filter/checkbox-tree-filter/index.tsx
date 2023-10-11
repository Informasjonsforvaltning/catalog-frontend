import React, { FC, useEffect } from 'react';
import CheckboxTree, { OnCheckNode } from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';

import classes from './checkbox-tree.module.css';
import { Select } from '@catalog-frontend/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faSquare } from '@fortawesome/free-regular-svg-icons';
import { getPath, localization } from '@catalog-frontend/utils';
import { Button, Heading, Label } from '@digdir/design-system-react';
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

  return options.sort((a, b) => a.label.localeCompare(b.label));
};

export const CheckboxTreeFilter: FC<Props> = ({ nodes, onCheck, filters }) => {
  const [checked, setChecked] = React.useState<string[]>([]);
  const [expanded, setExpanded] = React.useState<string[]>([]);
  const [collapsed, setCollapsed] = React.useState(true);
  const [searchOption, setSearchOption] = React.useState('');

  useEffect(() => {
    setChecked(filters);
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
    for (let i = 0; i < path.length; i++) {
      if (expanded.includes(path[i])) {
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

      const index = nodes.findIndex((item) => item.value === path[0]);
      if (index >= 9 && collapsed) {
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
        options={getSearchOptions(nodes)}
        onChange={handleSearchOnChange}
      />
      <CheckboxTree
        nodes={
          (collapsed ? nodes.slice(0, 10) : nodes).map((node) => ({
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
      {nodes && nodes.length > 10 && (
        <Button
          variant='quiet'
          icon={collapsed ? <ChevronDownDoubleIcon /> : <ChevronUpDoubleIcon />}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? localization.showMore : localization.showLess}
        </Button>
      )}
    </div>
  );
};
