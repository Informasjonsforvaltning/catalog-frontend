import React from 'react';
import { Relasjon, RelatedConcept } from '@catalog-frontend/types';
import { KeyValueListItem } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Link } from '@digdir/designsystemet-react';

interface Props {
  partitiveRelations: Relasjon[];
  relatedConceptsMap: (identifier: string) => RelatedConcept | undefined;
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
            value={<Link href={relatedConcept.href}>{getTranslateText(relatedConcept.title)}</Link>}
          />
        );
      })}
    </>
  );
};

export default PartitiveRelations;
