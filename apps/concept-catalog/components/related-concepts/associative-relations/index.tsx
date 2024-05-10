import { Relasjon, RelatedConcept } from '@catalog-frontend/types';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { KeyValueListItem } from '@catalog-frontend/ui';
import { Link } from '@digdir/designsystemet-react';

interface Props {
  associativeRelations: Relasjon[];
  relatedConceptsMap: (identifier: string) => RelatedConcept | undefined;
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
              value={<Link href={relatedConcept.href}>{getTranslateText(relatedConcept.title)}</Link>}
            />
          );
        }
      })}
    </>
  );
};

export default AssociativeRelations;
