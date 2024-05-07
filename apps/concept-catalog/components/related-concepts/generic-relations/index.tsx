import React from 'react';
import { KeyValueListItem } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Relasjon } from '@catalog-frontend/types';

interface Props {
  genericRelations: Relasjon[];
  relatedConceptsMap: (identifier: string) => any;
}

const GenericRelations = ({ genericRelations, relatedConceptsMap }: Props) => (
  <>
    {genericRelations.map(({ relatertBegrep, inndelingskriterium, relasjonsType }) => {
      const relatedConcept = relatertBegrep && relatedConceptsMap(relatertBegrep);
      if (!relatedConcept) return undefined;
      return (
        <KeyValueListItem
          key={`generic-relation-${relatedConcept.id}`}
          property={
            <div>
              <div>
                <span>{localization.concept.genericRelation}</span>
              </div>

              <div>
                <span>
                  {relasjonsType === 'overordnet' ? localization.concept.specializes : localization.concept.generalizes}
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

export default GenericRelations;
