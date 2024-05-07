import React from 'react';
import { Relasjon, TextLanguage } from '@catalog-frontend/types';
import { KeyValueListItem } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';

interface Props {
  title: Partial<TextLanguage>;
  isReplacedBy: Relasjon[];
  relatedConceptsMap: (identifier: string) => any;
}

const IsReplacedBy = ({ title, isReplacedBy, relatedConceptsMap }: Props) => (
  <>
    {isReplacedBy.map((relasjon, index) => {
      const relatedConcept = relatedConceptsMap(relasjon.relatertBegrep ?? '');
      if (relatedConcept) {
        return (
          <KeyValueListItem
            key={`IsReplacedBy-${index}`}
            property={
              <div>
                <p>{localization.concept.isReplacedBy}</p>
                <p>{getTranslateText(title)}</p>
              </div>
            }
            value={<a href={relatedConcept.uri}>{getTranslateText(relatedConcept.title)}</a>}
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
