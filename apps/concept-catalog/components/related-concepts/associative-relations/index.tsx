import { UnionRelation, RelatedConcept } from '@catalog-frontend/types';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { KeyValueListItem } from '@catalog-frontend/ui';
import { Link } from '@digdir/designsystemet-react';
import { LanguageIcon } from '@navikt/aksel-icons';

interface Props {
  associativeRelations: UnionRelation[];
  relatedConceptsMap: (identifier: string) => RelatedConcept | undefined;
  language?: string;
}

const AssociativeRelations = ({ associativeRelations, relatedConceptsMap, language }: Props) => {
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
                    <span>{getTranslateText(beskrivelse, language)}</span>
                  </div>
                </div>
              }
              value={<Link href={relatedConcept.href}>{getTranslateText(relatedConcept.title, language)}</Link>}
            />
          );
        }
      })}
    </>
  );
};

export default AssociativeRelations;
