"use client";

import {
  ChangeEvent,
  FC,
  FormEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { Field, Label, Search, Select } from "@digdir/designsystemet-react";
import styles from "./search-field.module.scss";
import classNames from "classnames";
import { localization } from "@catalog-frontend/utils";

type SearchOption = {
  value: string;
  label: string;
  default?: boolean;
};

type SearchFieldProps = {
  label?: ReactNode;
  placeholder?: string;
  value?: string;
  loading?: boolean;
  options?: SearchOption[];
  optionValue?: string;
  onSearch?: (query: string, option?: string) => void | undefined;
  className?: string;
};

const SearchField: FC<SearchFieldProps> = ({
  className,
  label,
  placeholder = "",
  value = "",
  loading = false,
  options,
  optionValue: selectedOptionValue,
  onSearch,
}) => {
  const [query, setQuery] = useState(value);
  const [optionValue, setOptionValue] = useState(
    selectedOptionValue ??
      options?.find((option) => option.default === true)?.value,
  );

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (selectedOptionValue !== undefined) {
      setOptionValue(selectedOptionValue);
    }
  }, [selectedOptionValue]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch?.(query, optionValue);
  };

  const searchInput = (
    <Search
      data-size="sm"
      className={classNames(styles.searchControl, {
        [styles.withOptions]: Boolean(options?.length),
      })}
    >
      <Search.Input
        autoComplete="off"
        placeholder={placeholder}
        value={query}
        aria-label={
          label ? undefined : placeholder || localization.search.search
        }
        onChange={(e) => setQuery(e.target.value)}
      />
      <Search.Clear
        aria-label={localization.search.clear}
        onClick={() => {
          setQuery("");
          onSearch?.("", optionValue);
        }}
      />
      {options && (
        <Select
          data-size="sm"
          aria-label={localization.search.searchField}
          value={optionValue}
          className={styles.searchOptions}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setOptionValue(e.target.value)
          }
        >
          {options.map(({ value: optionVal, label: optionLabel }) => (
            <option value={optionVal} key={optionVal}>
              {optionLabel}
            </option>
          ))}
        </Select>
      )}
      <Search.Button loading={loading}>
        {localization.search.search}
      </Search.Button>
    </Search>
  );

  return (
    <div className={classNames(styles.search, className)}>
      <form className={styles.searchForm} onSubmit={handleSubmit}>
        {label ? (
          <Field>
            <Label>{label}</Label>
            {searchInput}
          </Field>
        ) : (
          searchInput
        )}
      </form>
    </div>
  );
};

export { SearchField, type SearchFieldProps };
