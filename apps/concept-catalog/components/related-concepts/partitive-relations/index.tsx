import React from 'react';
import { Relasjon } from '@catalog-frontend/types';
import { KeyValueListItem } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';

interface Props {
  partitiveRelations: Relasjon[];
  relatedConceptsMap: (identifier: string) => any;
}

const PartitiveRelations = ({ partitiveRelations, relatedConceptsMap }: Props) => {
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
                  {getTranslateText(inndelingskriterium) && (
                    <span>{` (${localization.concept.divisionCriterion}: ${getTranslateText(
                      inndelingskriterium,
                    )})`}</span>
                  )}
                </div>
              </div>
            }
            value={<a href={relatedConcept.uri}>{getTranslateText(relatedConcept.title)}</a>}
          />
        );
      })}
    </>
  );
};

export default PartitiveRelations;
