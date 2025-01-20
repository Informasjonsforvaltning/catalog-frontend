import React from 'react';
import { KeyValueListItem } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { UnionRelation, RelatedConcept } from '@catalog-frontend/types';
import { Link } from '@digdir/designsystemet-react';

interface Props {
  genericRelations: UnionRelation[];
  relatedConceptsMap: (identifier: string) => RelatedConcept | undefined;
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
          value={<Link href={relatedConcept.href}>{getTranslateText(relatedConcept.title)}</Link>}
        />
      );
    })}
  </>
);

export default GenericRelations;
