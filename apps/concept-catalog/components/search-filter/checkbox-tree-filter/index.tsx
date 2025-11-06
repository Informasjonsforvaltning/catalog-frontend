"use client";

import { FC, JSX, useEffect, useMemo, useState } from "react";
import CheckboxTree, { OnCheckNode } from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";

import classes from "./checkbox-tree.module.css";
import { Select } from "@catalog-frontend/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";
import { getPath, localization } from "@catalog-frontend/utils";
import { Button, Label } from "@digdir/designsystemet-react";
import {
  ChevronDownDoubleIcon,
  ChevronUpDoubleIcon,
} from "@navikt/aksel-icons";

export interface TreeNode {
  value: string;
  label: string;
  children?: TreeNode[];
}

interface Props {
  label?: string;
  "aria-label"?: string;
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

  return options.sort((a: { label: string }, b: { label: any }) =>
    a.label.localeCompare(b.label),
  );
};

const generateOptionElements = (nodes?: TreeNode[]): JSX.Element[] => {
  const options = getSearchOptions(nodes);

  return [
    <option key={"no-user-selected"} value={undefined} />,
    ...(options.map((opt: any, index: any) => (
      <option value={opt.value} key={`searchOption-${opt.value}-${index}`}>
        {opt.label}
      </option>
    )) || []),
  ];
};

export const CheckboxTreeFilter: FC<Props> = ({
  label,
  "aria-label": ariaLabel,
  nodes,
  onCheck,
  filters,
}) => {
  const [checked, setChecked] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(true);
  const [searchOption, setSearchOption] = useState("");

  // Generate a stable ID for the CheckboxTree to prevent hydration mismatches
  const treeId = useMemo(() => {
    return `checkbox-tree-${label?.replace(/\s+/g, "-").toLowerCase() || "default"}`;
  }, [label]);

  useEffect(() => {
    setChecked(filters);
    setExpanded(filters);
  }, [filters]);

  const handleChecked = ({ value }: any) => {
    setSearchOption("");

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

  const handleOnCheck = (_values: any, node: OnCheckNode) => {
    handleChecked(node);
  };

  return (
    <div>
      <Select
        label={label}
        aria-label={ariaLabel}
        value={searchOption}
        size="sm"
        onChange={(event) => handleSearchOnChange(event.target.value)}
      >
        {generateOptionElements(nodes)}
      </Select>
      <div className={classes.pt1}>
        <CheckboxTree
          id={treeId}
          nodes={
            (collapsed ? nodes?.slice(0, 10) : nodes)?.map((node) => ({
              ...node,
              className: classes.checkbox,
              label: (
                <Label asChild size="small" weight="regular">
                  <span>{node.label}</span>
                </Label>
              ),
            })) ?? []
          }
          checked={checked}
          expanded={expanded}
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
          variant="tertiary"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronDownDoubleIcon /> : <ChevronUpDoubleIcon />}
          {collapsed ? localization.showMore : localization.showLess}
        </Button>
      )}
    </div>
  );
};
