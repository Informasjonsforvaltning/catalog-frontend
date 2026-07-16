"use client";

import {
  EXPERIMENTAL_Suggestion as Suggestion,
  Fieldset,
  Input,
  ValidationMessage,
} from "@digdir/designsystemet-react";
import {
  ComponentRef,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { localization } from "@catalog-frontend/utils";
import { reopenSuggestionList } from "../reopen-suggestion-list";

export type SuggestionSelectOption = {
  value: string;
  label: string;
  description?: string;
};

export type SingleSuggestionSelectProps = {
  ariaLabel?: string;
  disabled?: boolean;
  emptyMessage?: string;
  error?: string;
  fieldsetLegend?: ReactNode;
  inputRef?: Ref<HTMLInputElement>;
  isMounted: boolean;
  onValueChange: (value: string | undefined) => void;
  options: SuggestionSelectOption[];
  placeholder?: string;
  readOnly?: boolean;
  value?: string;
};

const getSelectedItem = (
  value: string | undefined,
  options: SuggestionSelectOption[],
) => {
  if (!value) {
    return null;
  }

  return (
    options.find((option) => option.value === value) ?? {
      value,
      label: value,
    }
  );
};

export const getSuggestionSelectedItem = getSelectedItem;

export const useSuggestionMounted = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
};

export const SingleSuggestionSelect = ({
  ariaLabel,
  disabled,
  emptyMessage = localization.search.noHits,
  error,
  fieldsetLegend,
  inputRef,
  isMounted,
  onValueChange,
  options,
  placeholder,
  readOnly,
  value,
}: SingleSuggestionSelectProps) => {
  const selectedItem = getSelectedItem(value, options);
  const comboboxRef = useRef<ComponentRef<typeof Suggestion>>(null);
  const inputElementRef = useRef<HTMLInputElement | null>(null);
  const optionsKey = options.map((option) => option.value).join("\0");

  const setInputElementRef = useCallback(
    (element: HTMLInputElement | null) => {
      inputElementRef.current = element;

      if (typeof inputRef === "function") {
        inputRef(element);
      } else if (inputRef) {
        inputRef.current = element;
      }
    },
    [inputRef],
  );

  const refocusInput = () => {
    requestAnimationFrame(() => inputElementRef.current?.focus());
  };

  const handleReopenSuggestionList = useCallback(() => {
    reopenSuggestionList(comboboxRef.current);
  }, []);

  useLayoutEffect(() => {
    handleReopenSuggestionList();
  }, [handleReopenSuggestionList, optionsKey]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      handleReopenSuggestionList();
    });

    return () => cancelAnimationFrame(frame);
  }, [handleReopenSuggestionList, isMounted, optionsKey]);

  const suggestion = isMounted ? (
    <Suggestion
      ref={comboboxRef}
      data-size="sm"
      selected={selectedItem}
      onSelectedChange={(selected) => {
        const hadValue = Boolean(value);
        onValueChange(selected?.value);

        if (hadValue && !selected?.value) {
          refocusInput();
        }
      }}
    >
      <Suggestion.Input
        ref={setInputElementRef}
        aria-invalid={error ? true : undefined}
        aria-label={ariaLabel}
        disabled={disabled}
        onFocus={handleReopenSuggestionList}
        onInput={(event) => {
          if (value && event.currentTarget.value === "") {
            onValueChange(undefined);
            refocusInput();
          }
        }}
        placeholder={placeholder}
        readOnly={readOnly}
      />
      {!disabled && <Suggestion.Clear />}
      <Suggestion.List>
        <Suggestion.Empty>{emptyMessage}</Suggestion.Empty>
        {options.map((option) => (
          <Suggestion.Option
            key={option.value}
            value={option.value}
            label={option.label}
          >
            {option.description ? (
              <div>
                <div>{option.label}</div>
                <div>{option.description}</div>
              </div>
            ) : (
              option.label
            )}
          </Suggestion.Option>
        ))}
      </Suggestion.List>
    </Suggestion>
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
