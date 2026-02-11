"use client";

import { FC, ReactNode, useEffect, useRef, useState } from "react";
import {
  Button,
  Combobox,
  NativeSelect,
  Spinner,
  Textfield,
} from "@digdir/designsystemet-react";
import { MagnifyingGlassIcon } from "@navikt/aksel-icons";
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
  const searchActionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query, optionValue);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.key === "Enter") {
      if (onSearch) {
        onSearch(query, optionValue);
      }
    }
  };

  useEffect(() => {
    if (inputRef?.current && searchActionsRef?.current) {
      const actionsWidth = searchActionsRef.current.offsetWidth;
      inputRef.current.style.paddingRight = `${actionsWidth + 20}px`;
    }
  }, []);

  return (
    <div
      className={classNames([styles.search, ...(className ? [className] : [])])}
    >
      <div className={styles.searchBox}>
        <Textfield
          ref={inputRef}
          autoComplete="off"
          className={styles.inputTextfield}
          placeholder={placeholder}
          size="large"
          value={query}
          type="search"
          label={label}
          onChange={(e) => setQuery(e.target.value)}
          onKeyUp={handleKeyUp}
        />
        <div ref={searchActionsRef} className={styles.searchActions}>
          {options && (
            <NativeSelect
              size="sm"
              aria-label="Velg alternativ"
              value={optionValue}
              className={styles.searchOptions}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setOptionValue(e.target.value)
              }
            >
              {options.map(({ value, label }) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </NativeSelect>
          )}
          <Button
            className={styles.searchButton}
            type="submit"
            size="sm"
            onClick={handleClick}
          >
            {loading ? (
              <Spinner
                title={localization.loading}
                size="xsmall"
                variant="inverted"
              />
            ) : (
              <>
                <MagnifyingGlassIcon
                  className={styles.searchIcon}
                  aria-hidden
                />
                <span>{localization.search.search}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export { SearchField, type SearchFieldProps };
