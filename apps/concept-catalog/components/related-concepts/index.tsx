import React from 'react';
import { UnionRelation, RelatedConcept, LocalizedStrings } from '@catalog-frontend/types';
import { KeyValueList } from '@catalog-frontend/ui';
import AssociativeRelations from './associative-relations';
import PartitiveRelations from './partitive-relations';
import GenericRelations from './generic-relations';
import SeeAlso from './see-also';
import IsReplacedBy from './is-replaced-by';
import { conceptIdFromUriRegex } from '@catalog-frontend/utils';

interface Props {
  conceptRelations: UnionRelation[];
  relatedConcepts: RelatedConcept[];
  validFromIncluding: string | null | undefined;
  validToIncluding: string | null | undefined;
  title: LocalizedStrings;
  language?: string;
}

const RelatedConcepts = ({
  conceptRelations,
  relatedConcepts,
  validToIncluding,
  validFromIncluding,
  title,
  language,
}: Props) => {
  const associativeRelations = conceptRelations.filter((relasjon) => relasjon.relasjon === 'assosiativ') ?? []; //ja
  const partitiveRelations = conceptRelations.filter((relasjon) => relasjon.relasjon === 'partitiv') ?? []; //her //
  const genericRelations = conceptRelations.filter((relasjon) => relasjon.relasjon === 'generisk') ?? [];
  const seeAlso = conceptRelations.filter((relasjon) => relasjon.relasjon === 'seOgså') ?? [];
  const isReplacedBy = conceptRelations.filter((relasjon) => relasjon.relasjon === 'erstattesAv') ?? []; //her

  const relatedConceptsMap = (identifier: string | null) => {
    const result = relatedConcepts.find(
      (concept) =>
        concept.identifier === identifier || concept.identifier === identifier?.match(conceptIdFromUriRegex)?.[1],
    );
    return result;
  };

  return (
    <KeyValueList>
      {associativeRelations.length > 0 && (
        <AssociativeRelations
          associativeRelations={associativeRelations}
          relatedConceptsMap={relatedConceptsMap}
          language={language}
        />
      )}
      {partitiveRelations.length > 0 && (
        <PartitiveRelations
          partitiveRelations={partitiveRelations}
          relatedConceptsMap={relatedConceptsMap}
          language={language}
        />
      )}
      {genericRelations.length > 0 && (
        <GenericRelations
          genericRelations={genericRelations}
          relatedConceptsMap={relatedConceptsMap}
          language={language}
        />
      )}
      {isReplacedBy.length > 0 && (
        <IsReplacedBy
          title={title}
          isReplacedBy={isReplacedBy}
          relatedConceptsMap={relatedConceptsMap}
          language={language}
        />
      )}
      {seeAlso.length > 0 && (
        <SeeAlso
          seeAlso={seeAlso}
          validToIncluding={validToIncluding}
          validFromIncluding={validFromIncluding}
          relatedConceptsMap={relatedConceptsMap}
          language={language}
        />
      )}
    </KeyValueList>
  );
};

export default RelatedConcepts;
