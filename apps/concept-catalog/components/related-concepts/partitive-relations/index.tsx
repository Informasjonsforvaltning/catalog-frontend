import React from 'react';
import { Relasjon } from '@catalog-frontend/types';
import { KeyValueListItem } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';

interface Props {
  partitiveRelations: Relasjon[];
  relatedConceptsMap: (identifier: string) => any;
  catalogId: string;
}

const PartitiveRelations = ({ partitiveRelations, relatedConceptsMap, catalogId }: Props) => {
  return (
    <>
      {partitiveRelations.map(({ inndelingskriterium, relasjonsType, relatertBegrep }) => {
        const relatedConcept = relatedConceptsMap(relatertBegrep);
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
                  <span>{` (${getTranslateText(inndelingskriterium)})`}</span>
                </div>
              </div>
            }
            value={<a href={relatedConcept.identifier}>{getTranslateText(relatedConcept.prefLabel)}</a>}
          />
        );
      })}
    </>
  );
};

export default PartitiveRelations;
