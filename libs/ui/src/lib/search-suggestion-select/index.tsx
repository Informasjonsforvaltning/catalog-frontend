"use client";

import {
  EXPERIMENTAL_Suggestion as Suggestion,
  Fieldset,
  Input,
  ValidationMessage,
} from "@digdir/designsystemet-react";
import { ReactNode, Ref } from "react";
import {
  getSuggestionSelectedItem,
  SuggestionSelectOption,
  useSuggestionMounted,
} from "../single-suggestion-select";

export type { SuggestionSelectOption };
export { useSuggestionMounted };

type SearchSuggestionSelectBaseProps = {
  ariaLabel?: string;
  emptyMessage: string;
  error?: string;
  fieldsetLegend?: ReactNode;
  inputRef?: Ref<HTMLInputElement>;
  isFetching: boolean;
  isMounted: boolean;
  onSearch: (value: string) => void;
  options: SuggestionSelectOption[];
  placeholder?: string;
  readOnly?: boolean;
  renderOption?: (option: SuggestionSelectOption) => ReactNode;
};

export type SearchSuggestionSelectProps =
  | (SearchSuggestionSelectBaseProps & {
      multiple?: false;
      onValueChange: (value: string | undefined) => void;
      value?: string;
    })
  | (SearchSuggestionSelectBaseProps & {
      multiple: true;
      onSelectedChange: (values: SuggestionSelectOption[]) => void;
      selected: SuggestionSelectOption[];
    });

const renderOptionContent = (
  option: SuggestionSelectOption,
  renderOption?: (option: SuggestionSelectOption) => ReactNode,
) => {
  if (renderOption) {
    return renderOption(option);
  }

  if (option.description) {
    return (
      <div>
        <div>{option.label}</div>
        <div>{option.description}</div>
      </div>
    );
  }

  return option.label;
};

type SuggestionFieldContentProps = {
  ariaLabel?: string;
  emptyMessage: string;
  error?: string;
  inputRef?: Ref<HTMLInputElement>;
  isFetching: boolean;
  multiple?: boolean;
  onSearch: (value: string) => void;
  options: SuggestionSelectOption[];
  placeholder?: string;
  readOnly?: boolean;
  renderOption?: (option: SuggestionSelectOption) => ReactNode;
};

const SuggestionFieldContent = ({
  ariaLabel,
  emptyMessage,
  error,
  inputRef,
  isFetching,
  multiple,
  onSearch,
  options,
  placeholder,
  readOnly,
  renderOption,
}: SuggestionFieldContentProps) => (
  <>
    <Suggestion.Input
      ref={inputRef}
      aria-busy={isFetching}
      aria-invalid={error ? true : undefined}
      aria-label={ariaLabel}
      onInput={(event) => onSearch(event.currentTarget.value)}
      placeholder={placeholder}
      readOnly={readOnly}
    />
    {!multiple && <Suggestion.Clear />}
    <Suggestion.List>
      <Suggestion.Empty>{emptyMessage}</Suggestion.Empty>
      {!isFetching &&
        options.map((option) => (
          <Suggestion.Option
            key={option.value}
            value={option.value}
            label={option.label}
          >
            {renderOptionContent(option, renderOption)}
          </Suggestion.Option>
        ))}
    </Suggestion.List>
  </>
);

export const SearchSuggestionSelect = (props: SearchSuggestionSelectProps) => {
  const {
    ariaLabel,
    emptyMessage,
    error,
    fieldsetLegend,
    inputRef,
    isFetching,
    isMounted,
    onSearch,
    options,
    placeholder,
    readOnly,
    renderOption,
  } = props;

  const fieldContentProps: SuggestionFieldContentProps = {
    ariaLabel,
    emptyMessage,
    error,
    inputRef,
    isFetching,
    onSearch,
    options,
    placeholder,
    readOnly,
    renderOption,
  };

  const suggestion = isMounted ? (
    props.multiple ? (
      <Suggestion
        data-size="sm"
        filter={() => true}
        multiple
        selected={props.selected}
        onSelectedChange={props.onSelectedChange}
      >
        <SuggestionFieldContent {...fieldContentProps} multiple />
      </Suggestion>
    ) : (
      <Suggestion
        data-size="sm"
        filter={() => true}
        selected={getSuggestionSelectedItem(props.value, options)}
        onSelectedChange={(selected) => props.onValueChange(selected?.value)}
      >
        <SuggestionFieldContent {...fieldContentProps} />
      </Suggestion>
    )
  ) : (
    <Input
      data-size="sm"
      aria-invalid={error ? true : undefined}
      aria-label={ariaLabel}
      disabled
      placeholder={placeholder}
      readOnly
    />
  );

  const content = (
    <>
      {suggestion}
      {error ? <ValidationMessage>{error}</ValidationMessage> : null}
    </>
  );

  if (fieldsetLegend) {
    return (
      <Fieldset data-size="sm">
        <Fieldset.Legend>{fieldsetLegend}</Fieldset.Legend>
        {content}
      </Fieldset>
    );
  }

  return content;
};
