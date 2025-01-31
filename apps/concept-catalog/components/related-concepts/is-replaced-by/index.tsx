import React from 'react';
import { UnionRelation, RelatedConcept, LocalizedStrings } from '@catalog-frontend/types';
import { KeyValueListItem } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Link } from '@digdir/designsystemet-react';

interface Props {
  title: LocalizedStrings;
  isReplacedBy: UnionRelation[];
  relatedConceptsMap: (identifier: string) => RelatedConcept | undefined;
  language?: string;
}

const IsReplacedBy = ({ title, isReplacedBy, relatedConceptsMap, language }: Props) => (
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
            value={<Link href={relatedConcept.href}>{getTranslateText(relatedConcept.title, language)}</Link>}
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
