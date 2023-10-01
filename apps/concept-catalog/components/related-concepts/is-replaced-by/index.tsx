import React from 'react';
import { Relasjon, TextLanguage } from '@catalog-frontend/types';
import { KeyValueListItem } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';

interface Props {
  title: Partial<TextLanguage>;
  isReplacedBy: Relasjon[];
  relatedConceptsMap: (identifier: string) => any;
  catalogId: string;
}

const IsReplacedBy = ({ title, isReplacedBy, relatedConceptsMap, catalogId }: Props) => (
  <>
    {isReplacedBy.map((relasjon) => {
      const relatedConcept = relatedConceptsMap(relasjon.relatertBegrep);
      if (relatedConcept) {
        return (
          <KeyValueListItem
            key={relatedConcept.id}
            property={
              <div>
                <p>{localization.concept.isReplacedBy}</p>
                <p>{getTranslateText(title)}</p>
              </div>
            }
            value={<a href={relatedConcept.identifier}>{getTranslateText(relatedConcept.prefLabel)}</a>}
          />
        );
      } else {
        return (
          <KeyValueListItem
            key={relasjon.relatertBegrep}
            property={localization.concept.isReplacedBy}
            value={relasjon.relatertBegrep}
          />
        );
      }
    })}
  </>
);

export default IsReplacedBy;