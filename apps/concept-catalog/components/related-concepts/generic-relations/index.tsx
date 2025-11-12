import { KeyValueListItem } from "@catalog-frontend/ui";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import { UnionRelation, RelatedConcept } from "@catalog-frontend/types";
import { Link } from "@digdir/designsystemet-react";

interface Props {
  genericRelations: UnionRelation[];
  relatedConceptsMap: (identifier: string) => RelatedConcept | undefined;
  language?: string;
}

const GenericRelations = ({
  genericRelations,
  relatedConceptsMap,
  language,
}: Props) => (
  <>
    {genericRelations.map(
      ({ relatertBegrep, inndelingskriterium, relasjonsType }, index) => {
        const relatedConcept =
          relatertBegrep && relatedConceptsMap(relatertBegrep);

        return (
          <KeyValueListItem
            key={`generic-relation-${index}`}
            property={
              <div>
                <div>
                  <span>{localization.concept.genericRelation}</span>
                </div>

                <div>
                  <span>
                    {relasjonsType === "overordnet"
                      ? localization.concept.specializes
                      : localization.concept.generalizes}
                  </span>
                  {getTranslateText(inndelingskriterium, language) && (
                    <span>{` (${localization.concept.divisionCriterion}: ${getTranslateText(
                      inndelingskriterium,
                      language,
                    )})`}</span>
                  )}
                </div>
              </div>
            }
            value={
              relatedConcept ? (
                <Link href={relatedConcept.href}>
                  {getTranslateText(relatedConcept.title, language)}
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

export default GenericRelations;
