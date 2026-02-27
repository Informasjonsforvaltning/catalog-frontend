"use client";
import { FilterType, ReferenceDataCode } from "@catalog-frontend/types";
import {
  capitalizeFirstLetter,
  getTranslateText,
  localization,
} from "@catalog-frontend/utils";
import { Chip, Fieldset } from "@digdir/designsystemet-react";
import styles from "./filter-chips.module.css";

interface Props {
  handleRemoveFilter: (value: string, filterType: FilterType) => void;
  statusFilters: string[];
  publicationFilters: string[];
  statuses: ReferenceDataCode[];
}

export const FilterChips = ({
  handleRemoveFilter,
  statuses,
  statusFilters,
  publicationFilters,
}: Props) => {
  return (
    <Fieldset data-size="sm" className={styles.chips}>
      {statusFilters?.map((filter, index) => (
        <Chip.Removable
          key={`status-${index}`}
          onClick={() => handleRemoveFilter(filter, "status")}
        >
          {capitalizeFirstLetter(
            getTranslateText(statuses?.find((s) => s.uri === filter)?.label),
          )}
        </Chip.Removable>
      ))}
      {publicationFilters?.map((filter, index) => (
        <Chip.Removable
          key={`label-${index}`}
          onClick={() => handleRemoveFilter(filter, "published")}
        >
          {filter === "true"
            ? localization.publicationState.published
            : localization.publicationState.unpublished}
        </Chip.Removable>
      ))}
    </Fieldset>
  );
};

export default FilterChips;
