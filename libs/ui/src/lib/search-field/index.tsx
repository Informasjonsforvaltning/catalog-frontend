'use client';

import { FC, ChangeEvent, useState, KeyboardEvent } from 'react';
import MagnifyingGlassSVG from './MagnifyingGlass.svg';
import styles from './search-field.module.css';

type IconPoseType = 'left' | 'right' | undefined;

interface SearchFieldProps {
  ariaLabel: string;
  placeholder?: string;
  label?: string;
  error?: boolean;
  nrOfLines?: number;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  iconPos?: IconPoseType;
  value?: string;
  onSearchSubmit?: (inputValue: string) => void | undefined;
}

const SearchField: FC<SearchFieldProps> = ({
  ariaLabel,
  startIcon,
  endIcon = <MagnifyingGlassSVG />,
  placeholder = '',
  error = false,
  value = '',
  onSearchSubmit,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const conditionalPlaceholder = error ? 'Invalid input' : placeholder;

  const onInput = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    setInputValue(changeEvent.target.value);

    if (onSearchSubmit && changeEvent.target.value === '') {
      onSearchSubmit('');
    }
  };

  const onSubmit = (event: KeyboardEvent<HTMLInputElement> | 'clicked') => {
    if (onSearchSubmit) {
      if (event === 'clicked' || event?.key === 'Enter') {
        onSearchSubmit(inputValue);
      }
    }
  };

  return (
    <div className={styles.searchField}>
      {startIcon && <span className={styles.leftSvg}>{startIcon}</span>}
      <input
        className={styles.input}
        aria-label={ariaLabel}
        placeholder={conditionalPlaceholder}
        type='search'
        value={inputValue}
        onInput={onInput}
        onKeyUp={onSubmit}
      />
      {endIcon && (
        <figure
          className={styles.svgWrapper}
          onClick={(e) => onSubmit('clicked')}
        >
          {endIcon}
        </figure>
      )}
    </div>
  );
};

export { SearchField, type SearchFieldProps };
