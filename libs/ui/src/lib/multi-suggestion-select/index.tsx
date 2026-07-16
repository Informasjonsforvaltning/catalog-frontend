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
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { localization } from "@catalog-frontend/utils";
import {
  SuggestionSelectOption,
  useSuggestionMounted,
} from "../single-suggestion-select";
import { reopenSuggestionList } from "../reopen-suggestion-list";

export type { SuggestionSelectOption };
export { useSuggestionMounted };

export type MultiSuggestionSelectProps = {
  ariaLabel?: string;
  emptyMessage?: string;
  error?: string;
  fieldsetLegend?: ReactNode;
  isMounted: boolean;
  onSelectedChange: (values: string[]) => void;
  options: SuggestionSelectOption[];
  placeholder?: string;
  readOnly?: boolean;
  selectedValues?: string[];
};

const getSelectedItems = (
  selectedValues: string[] | undefined,
  options: SuggestionSelectOption[],
): SuggestionSelectOption[] =>
  (selectedValues ?? []).map((value) => ({
    value,
    label: options.find((option) => option.value === value)?.label ?? value,
    description: options.find((option) => option.value === value)?.description,
  }));

export const MultiSuggestionSelect = ({
  ariaLabel,
  emptyMessage = localization.search.noHits,
  error,
  fieldsetLegend,
  isMounted,
  onSelectedChange,
  options,
  placeholder,
  readOnly,
  selectedValues,
}: MultiSuggestionSelectProps) => {
  const selectedItems = getSelectedItems(selectedValues, options);
  const comboboxRef = useRef<ComponentRef<typeof Suggestion>>(null);
  const optionsKey = options.map((option) => option.value).join("\0");

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
      multiple
      selected={selectedItems}
      onSelectedChange={(selected) =>
        onSelectedChange(selected.map((item) => item.value))
      }
    >
      <Suggestion.Input
        aria-invalid={error ? true : undefined}
        aria-label={ariaLabel}
        onFocus={handleReopenSuggestionList}
        placeholder={placeholder}
        readOnly={readOnly}
      />
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
