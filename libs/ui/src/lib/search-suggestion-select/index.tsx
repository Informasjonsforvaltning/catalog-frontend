"use client";

import {
  EXPERIMENTAL_Suggestion as Suggestion,
  Fieldset,
  Input,
  ValidationMessage,
} from "@digdir/designsystemet-react";
import { ComponentRef, ReactNode, Ref, useLayoutEffect, useRef } from "react";
import {
  getSuggestionSelectedItem,
  SuggestionSelectOption,
  useSuggestionMounted,
} from "../single-suggestion-select";
import { reopenSuggestionList } from "../reopen-suggestion-list";

export type { SuggestionSelectOption };
export { useSuggestionMounted };

type SuggestionRef = ComponentRef<typeof Suggestion>;

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
  onClear?: () => void;
  onSearch: (value: string) => void;
  options: SuggestionSelectOption[];
  placeholder?: string;
  readOnly?: boolean;
  renderOption?: (option: SuggestionSelectOption) => ReactNode;
  value?: string;
};

const SuggestionFieldContent = ({
  ariaLabel,
  emptyMessage,
  error,
  inputRef,
  isFetching,
  multiple,
  onClear,
  onSearch,
  options,
  placeholder,
  readOnly,
  renderOption,
  value,
}: SuggestionFieldContentProps) => (
  <>
    <Suggestion.Input
      ref={inputRef}
      aria-busy={isFetching}
      aria-invalid={error ? true : undefined}
      aria-label={ariaLabel}
      onInput={(event) => {
        const nextValue = event.currentTarget.value;
        onSearch(nextValue);

        if (!multiple && value && nextValue === "") {
          onClear?.();
        }
      }}
      placeholder={placeholder}
      readOnly={readOnly}
    />
    {!multiple && <Suggestion.Clear />}
    <Suggestion.List>
      <Suggestion.Empty>{emptyMessage}</Suggestion.Empty>
      {options.map((option) => (
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
  const comboboxRef = useRef<SuggestionRef>(null);
  const optionsKey = options.map((option) => option.value).join("\0");

  useLayoutEffect(() => {
    reopenSuggestionList(comboboxRef.current);
  }, [optionsKey, isFetching]);

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
        ref={comboboxRef}
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
        ref={comboboxRef}
        data-size="sm"
        filter={() => true}
        selected={getSuggestionSelectedItem(props.value, options)}
        onSelectedChange={(selected) => props.onValueChange(selected?.value)}
      >
        <SuggestionFieldContent
          {...fieldContentProps}
          onClear={() => props.onValueChange(undefined)}
          value={props.value}
        />
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
