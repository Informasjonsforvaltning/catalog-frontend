import {FC, ChangeEvent, useState} from 'react';
import {Input, SearchField as StyledSearchField} from './styled';
import MagnifyingGlassSVG from './MagnifyingGlass.svg';

type InputType =
  | 'text'
  | 'tel'
  | 'url'
  | 'number'
  | 'file'
  | 'email'
  | 'date'
  | 'search';
type IconPoseType = 'left' | 'right' | undefined;

interface SearchFieldProps {
  ariaLabel: string;
  type?: InputType;
  placeholder?: string;
  label?: string;
  error?: boolean;
  nrOfLines?: number;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  iconPos?: IconPoseType;
  onSearchSubmit?: (inputValue: string) => void | any;
}

const SearchField: FC<SearchFieldProps> = ({
  ariaLabel,
  startIcon,
  endIcon = <MagnifyingGlassSVG />,
  type = 'text',
  placeholder = 'Input placeholder ...',
  error = false,
  onSearchSubmit,
}) => {
  const [inputValue, setInputValue] = useState('');
  const conditionalPlaceholder = error ? 'Invalid input' : placeholder;

  const onChange = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    setInputValue(changeEvent.target.value);
    onSearchSubmit && onSearchSubmit(changeEvent.target.value);
  };

  return (
    <StyledSearchField
      ariaLabel=""
      error={error}
      iconPos={startIcon ? 'left' : endIcon ? 'right' : undefined}
    >
      {startIcon}
      <Input
        aria-label={ariaLabel}
        placeholder={conditionalPlaceholder}
        type={type}
        value={inputValue}
        onChange={onChange}
        onSubmit={onChange}
      />
      {endIcon}
    </StyledSearchField>
  );
};

export {SearchField, type SearchFieldProps};
