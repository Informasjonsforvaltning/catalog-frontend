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

export type { SuggestionSelectOption };
export { useSuggestionMounted };

type SuggestionRef = ComponentRef<typeof Suggestion>;

type DataListElement = HTMLElement & {
  hidden: boolean;
  hidePopover?: () => void;
};

const restoreInputState = (
  input: HTMLInputElement,
  value: string,
  selectionStart: number | null,
  selectionEnd: number | null,
) => {
  if (input.value !== value) {
    input.value = value;
  }

  if (selectionStart !== null && selectionEnd !== null) {
    input.setSelectionRange(selectionStart, selectionEnd);
  }
};

const syncSuggestionList = (combobox: SuggestionRef | null) => {
  const input = combobox?.control;
  const list = combobox?.list as DataListElement | null | undefined;

  if (!input || !list || document.activeElement !== input) {
    return;
  }

  const { value, selectionStart, selectionEnd } = input;

  for (const option of combobox.options ?? []) {
    if (!option.hasAttribute("data-empty")) {
      option.disabled = false;
      option.removeAttribute("aria-hidden");
    }
  }

  if (!list.hidden) {
    list.hidden = true;

    try {
      if (
        typeof list.hidePopover === "function" &&
        list.matches(":popover-open")
      ) {
        list.hidePopover();
      }
    } catch {
      // Popover may be unavailable in some environments.
    }
  }

  input.dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true }),
  );

  restoreInputState(input, value, selectionStart, selectionEnd);

  window.dispatchEvent(new Event("resize"));

  requestAnimationFrame(() => {
    if (!list.hidden || document.activeElement !== input) {
      return;
    }

    input.blur();
    input.focus();
    restoreInputState(input, value, selectionStart, selectionEnd);
    window.dispatchEvent(new Event("resize"));
  });
};

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
    syncSuggestionList(comboboxRef.current);
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
