import { UnionRelation, RelatedConcept } from "@catalog-frontend/types";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import { KeyValueListItem } from "@catalog-frontend/ui";
import { Link } from "@digdir/designsystemet-react";

interface Props {
  associativeRelations: UnionRelation[];
  relatedConceptsMap: (identifier: string) => RelatedConcept | undefined;
  language?: string;
}

const AssociativeRelations = ({
  associativeRelations,
  relatedConceptsMap,
  language,
}: Props) => {
  return (
    <>
      {associativeRelations.map(
        ({ beskrivelse, relatertBegrep = "" }, index) => {
          const relatedConcept = relatedConceptsMap(relatertBegrep);
          return (
            <KeyValueListItem
              key={`${relatertBegrep}-${index}`}
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
              value={
                relatedConcept ? (
                  <Link href={relatedConcept?.href}>
                    {getTranslateText(relatedConcept?.title, language)}
                  </Link>
                ) : (
                  relatertBegrep
                )
              }
            />
          );
        },
      )}
    </>
  );
};

export default AssociativeRelations;
