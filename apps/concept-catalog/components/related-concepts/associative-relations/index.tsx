import { Relasjon } from '@catalog-frontend/types';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { KeyValueListItem } from '@catalog-frontend/ui';

interface Props {
  associativeRelations: Relasjon[];
  relatedConceptsMap: (identifier: string) => any;
}

const AssociativeRelations = ({ associativeRelations, relatedConceptsMap }: Props) => {
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
              value={<a href={relatedConcept.uri}>{getTranslateText(relatedConcept.title)}</a>}
            />
          );
        }
      })}
    </>
  );
};

export default AssociativeRelations;
