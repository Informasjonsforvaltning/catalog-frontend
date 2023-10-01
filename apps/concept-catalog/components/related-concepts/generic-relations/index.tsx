import React from 'react';
import { KeyValueListItem } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Relasjon } from '@catalog-frontend/types';

interface Props {
  genericRelations: Relasjon[];
  relatedConceptsMap: (identifier: string) => any;
  catalogId: string;
}

const GenericRelations = ({ genericRelations, relatedConceptsMap, catalogId }: Props) => (
  <>
    {genericRelations.map(({ relatertBegrep, inndelingskriterium }) => {
      const relatedConcept = relatedConceptsMap(relatertBegrep);
      if (!relatedConcept) return undefined;
      return (
        <KeyValueListItem
          key={relatedConcept.id}
          property={
            <div>
              <div>
                <span>{localization.concept.genericRelation}</span>
              </div>
              <div>
                <span>
                  {relatedConcept.relasjonsType === 'overordnet'
                    ? localization.concept.generalizes
                    : localization.concept.specializes}
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

export default GenericRelations;
