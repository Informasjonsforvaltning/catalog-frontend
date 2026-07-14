"use client";

import {
  EXPERIMENTAL_Suggestion as Suggestion,
  Fieldset,
  Input,
  ValidationMessage,
} from "@digdir/designsystemet-react";
import { ReactNode, useEffect, useState } from "react";

export type SuggestionSelectOption = {
  value: string;
  label: string;
  description?: string;
};

export type SingleSuggestionSelectProps = {
  ariaLabel?: string;
  emptyMessage?: string;
  error?: string;
  fieldsetLegend?: ReactNode;
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
  if (value === undefined) {
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
  emptyMessage = "",
  error,
  fieldsetLegend,
  isMounted,
  onValueChange,
  options,
  placeholder,
  readOnly,
  value,
}: SingleSuggestionSelectProps) => {
  const selectedItem = getSelectedItem(value, options);

  return (
    <Fieldset data-size="sm">
      {fieldsetLegend ? (
        <Fieldset.Legend>{fieldsetLegend}</Fieldset.Legend>
      ) : null}
      {isMounted ? (
        <Suggestion
          data-size="sm"
          selected={selectedItem}
          onSelectedChange={(selected) => onValueChange(selected?.value)}
        >
          <Suggestion.Input
            aria-invalid={error ? true : undefined}
            aria-label={ariaLabel}
            placeholder={placeholder}
            readOnly={readOnly}
          />
          <Suggestion.Clear />
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
      )}
      {error ? <ValidationMessage>{error}</ValidationMessage> : null}
    </Fieldset>
  );
};
