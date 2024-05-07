import React from 'react';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { KeyValueListItem } from '@catalog-frontend/ui';
import { Relasjon } from '@catalog-frontend/types';

interface Props {
  seeAlso: Relasjon[];
  validToIncluding: string | undefined;
  validFromIncluding: string | undefined;
  relatedConceptsMap: (identifier: string) => any;
}

const SeeAlso = ({ seeAlso, relatedConceptsMap }: Props) => (
  <>
    {seeAlso.map((relasjon) => {
      if (!relasjon) return undefined;
      const relatedConcept = relatedConceptsMap(relasjon.relatertBegrep ?? '');
      if (relatedConcept) {
        return (
          <KeyValueListItem
            key={`seeAlso-${relatedConcept.id}`}
            property={localization.concept.seeAlso}
            value={<a href={relatedConcept.uri}>{getTranslateText(relatedConcept.title)}</a>}
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
