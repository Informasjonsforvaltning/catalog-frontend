import React from 'react';
import {
  dateStringToDate,
  formatDate,
  getTranslateText,
  isDateAfterToday,
  isDateBeforeToday,
  localization,
} from '@catalog-frontend/utils';
import { KeyValueListItem } from '@catalog-frontend/ui';
import { Relasjon } from '@catalog-frontend/types';

interface Props {
  seeAlso: Relasjon[];
  validToIncluding: string | undefined;
  validFromIncluding: string | undefined;
  relatedConceptsMap: (identifier: string) => any;
}

const SeeAlso = ({ seeAlso, relatedConceptsMap, validFromIncluding, validToIncluding }: Props) => (
  <>
    {seeAlso.map((relasjon) => {
      if (!relasjon) return undefined;
      const hasExpired = isDateBeforeToday(dateStringToDate(formatDate(dateStringToDate(validToIncluding ?? ''))));
      const willBeValid = isDateAfterToday(dateStringToDate(formatDate(dateStringToDate(validFromIncluding ?? ''))));
      const relatedConcept = relatedConceptsMap(relasjon.relatertBegrep ?? '');
      if (relatedConcept) {
        return (
          <KeyValueListItem
            key={`seeAlso-${relatedConcept.id}`}
            property={localization.concept.seeAlso}
            value={
              <a href={relatedConcept.identifier}>
                {getTranslateText(relatedConcept.prefLabel)}
                {hasExpired && <>&nbsp;({localization.validity.expired})</>}
                {!hasExpired && willBeValid && <>&nbsp;({localization.validity.willBeValid})</>}
              </a>
            }
          />
        );
      } else {
        return (
          <KeyValueListItem
            key={relasjon.relatertBegrep}
            property={localization.concept.seeAlso}
            value={relasjon.relatertBegrep}
          />
        );
      }
    })}
  </>
);

export default SeeAlso;
