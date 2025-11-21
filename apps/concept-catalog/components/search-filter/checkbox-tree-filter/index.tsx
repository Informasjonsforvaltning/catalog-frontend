"use client";

import React, { FC, useEffect, useMemo, useState } from "react";
import classes from "./checkbox-tree.module.css";
import { Select } from "@catalog-frontend/ui";
import { getPath, localization } from "@catalog-frontend/utils";
import { Button } from "@digdir/designsystemet-react";
import {
  ChevronDownDoubleIcon,
  ChevronUpDoubleIcon,
} from "@navikt/aksel-icons";
import { RecursiveCheckbox } from "../recursive-checkbox";

export interface TreeNode {
  value: string;
  label: string;
  children?: TreeNode[];
}

interface Props {
  "aria-label"?: string;
  nodes?: TreeNode[];
  onCheck: (value: string[]) => void;
  filters: string[];
}

const getSearchOptions = (nodes?: TreeNode[]) => {
  let options: TreeNode[] = [];
  if (nodes) {
    nodes.forEach(({ value, label, children }) => {
      options.push({ value, label });
      options = options.concat(getSearchOptions(children));
    });
  }

  return options.sort((a: { label: string }, b: { label: string }) =>
    a.label.localeCompare(b.label),
  );
};

export const CheckboxTreeFilter: FC<Props> = ({
  "aria-label": ariaLabel,
  nodes,
  onCheck,
  filters,
}) => {
  const expandCutoff = 10;
  const [expanded, setExpanded] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(true);
  const [searchOption, setSearchOption] = useState("");
  const options = useMemo(() => getSearchOptions(nodes), [nodes]);

  const handleChecked = (value: string) => {
    setSearchOption("");

    const path = getPath(nodes, value).map((item) => item.value);
    if (filters.includes(value)) {
      const newChecked = path.slice(0, -1);
      setExpanded(newChecked);
      onCheck(newChecked);
      return;
    }

    const inCurrentPath = path.some((element) => expanded.includes(element));
    if (!inCurrentPath) {
      setExpanded([value]);
      onCheck([value]);
    } else {
      setExpanded(path);
      onCheck(path);
    }
  };

  const handleSearchOnChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value;
    if (value !== null) {
      setSearchOption(value);
      const path = getPath(nodes, value).map((item) => item.value);
      setExpanded(path);
      onCheck(path);

      const index = nodes?.findIndex((item) => item.value === path[0]);
      if (index && index >= expandCutoff - 1 && collapsed) {
        setCollapsed(false);
      }
    }
  };

  useEffect(() => {
    setExpanded(filters);
  }, [filters]);

  return (
    <>
      <Select
        aria-label={ariaLabel}
        value={searchOption}
        size="sm"
        onChange={handleSearchOnChange}
      >
        <option value=""></option>
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      <div className={classes.pt1}>
        {(collapsed ? nodes?.slice(0, expandCutoff) : nodes)?.map((node) => (
          <RecursiveCheckbox
            filters={filters}
            key={node.value}
            node={node}
            onCheck={handleChecked}
          />
        ))}
      </div>

      {nodes && nodes.length > expandCutoff && (
        <Button
          variant="tertiary"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronDownDoubleIcon /> : <ChevronUpDoubleIcon />}
          {collapsed ? localization.showMore : localization.showLess}
        </Button>
      )}
    </>
  );
};
