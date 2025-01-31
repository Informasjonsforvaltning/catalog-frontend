import React from 'react';
import { UnionRelation, RelatedConcept } from '@catalog-frontend/types';
import { KeyValueListItem } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Link } from '@digdir/designsystemet-react';

interface Props {
  partitiveRelations: UnionRelation[];
  relatedConceptsMap: (identifier: string) => RelatedConcept | undefined;
  language?: string;
}

const PartitiveRelations = ({ partitiveRelations, relatedConceptsMap, language }: Props) => {
  return (
    <>
      {partitiveRelations.map(({ inndelingskriterium, relasjonsType, relatertBegrep }) => {
        const relatedConcept = relatertBegrep && relatedConceptsMap(relatertBegrep);
        if (!relatedConcept) return undefined;
        return (
          <KeyValueListItem
            key={relatedConcept.id}
            property={
              <div>
                <div>
                  <p>{localization.concept.partitiveRelation}</p>
                  <span>
                    {relasjonsType === 'erDelAv' ? localization.concept.isPartOf : localization.concept.hasPart}
                  </span>
                  {getTranslateText(inndelingskriterium, language) && (
                    <span>{` (${localization.concept.divisionCriterion}: ${getTranslateText(
                      inndelingskriterium, language
                    )})`}</span>
                  )}
                </div>
              </div>
            }
            value={<Link href={relatedConcept.href}>{getTranslateText(relatedConcept.title, language)}</Link>}
          />
        );
      })}
    </>
  );
};

export default PartitiveRelations;
