import { Relasjon } from '@catalog-frontend/types';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { KeyValueListItem } from '@catalog-frontend/ui';

interface Props {
  associativeRelations: Relasjon[];
  relatedConceptsMap: (identifier: string) => any;
  catalogId: string;
}

const AssociativeRelations = ({ associativeRelations, relatedConceptsMap, catalogId }: Props) => {
  return (
    <>
      {associativeRelations.map(({ beskrivelse, relatertBegrep = '' }) => {
        const relatedConcept = relatedConceptsMap(relatertBegrep);
        if (relatedConcept) {
          return (
            <KeyValueListItem
              key={relatedConcept.id}
              property={
                <div>
                  <div>
                    <span>{localization.concept.associativeRelation}</span>
                  </div>
                  <div>
                    <span>{getTranslateText(beskrivelse)}</span>
                  </div>
                </div>
              }
              value={<a href={relatedConcept.identifier}>{getTranslateText(relatedConcept.prefLabel)}</a>}
            />
          );
        }
      })}
    </>
  );
};

export default AssociativeRelations;
