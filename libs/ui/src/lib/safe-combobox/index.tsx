'use client';

import { Combobox } from '@digdir/designsystemet-react';
import type { ComboboxProps } from '@digdir/designsystemet-react';
import { useMemo } from 'react';

/**
 * Safe wrapper around Combobox that validates values exist in available options
 * and filters out undefined/null values to prevent runtime errors.
 *
 * This component addresses the issue where the Combobox component throws errors
 * when receiving arrays containing undefined/null values or values that don't
 * exist in the available options.
 */
export type SafeComboboxProps = ComboboxProps & {
  /**
   * Array of valid option values to validate against.
   * If provided, only values that exist in this array will be passed to Combobox.
   * This prevents errors when the Combobox tries to look up values that don't exist
   * in its internal options map.
   */
  availableValues?: string[];
};

export const SafeCombobox = ({ value, availableValues = [], ...props }: SafeComboboxProps) => {
  const safeValue = useMemo(() => {
    if (!value || !Array.isArray(value)) return [];

    // Filter out undefined/null/falsy values
    const filtered = value.filter((v) => v != null && v !== '' && String(v).trim() !== '');

    // If validation is enabled and we have available values, check values exist in options
    if (availableValues.length > 0) {
      return filtered.filter((v) => availableValues.includes(String(v)));
    }

    return filtered;
  }, [value, availableValues]);

  return <Combobox {...props} value={safeValue} />;
};
