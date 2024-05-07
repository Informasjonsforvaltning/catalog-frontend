import React from 'react';
import { Relasjon, Search, TextLanguage } from '@catalog-frontend/types';
import { KeyValueList } from '@catalog-frontend/ui';
import AssociativeRelations from './associative-relations';
import PartitiveRelations from './partitive-relations';
import GenericRelations from './generic-relations';
import SeeAlso from './see-also';
import IsReplacedBy from './is-replaced-by';

type SearchObject = Search.SearchObject;

interface Props {
  catalogId: string;
  conceptRelations: Relasjon[];
  relatedConcepts: SearchObject[];
  validFromIncluding: string | undefined;
  validToIncluding: string | undefined;
  title: Partial<TextLanguage>;
}

const RelatedConcepts = ({
  catalogId,
  conceptRelations,
  relatedConcepts,
  validToIncluding,
  validFromIncluding,
  title,
}: Props) => {
  const associativeRelations = conceptRelations.filter((relasjon) => relasjon.relasjon === 'assosiativ') ?? [];
  const partitiveRelations = conceptRelations.filter((relasjon) => relasjon.relasjon === 'partitiv') ?? [];
  const genericRelations = conceptRelations.filter((relasjon) => relasjon.relasjon === 'generisk') ?? [];
  const seeAlso =
    conceptRelations.filter((relasjon) => relasjon.relasjon === 'seOgså' || relasjon.relasjon === 'internSeOgså') ?? [];
  const isReplacedBy =
    conceptRelations.filter(
      (relasjon) => relasjon.relasjon === 'erstattesAv' || relasjon.relasjon === 'internErstattesAv',
    ) ?? [];

  const relatedConceptsMap = (identifier: string) => relatedConcepts.find((concept) => concept.uri === identifier);

  return (
    <KeyValueList>
      {associativeRelations.length > 0 && (
        <AssociativeRelations
          associativeRelations={associativeRelations}
          relatedConceptsMap={relatedConceptsMap}
        />
      )}
      {partitiveRelations.length > 0 && (
        <PartitiveRelations
          partitiveRelations={partitiveRelations}
          relatedConceptsMap={relatedConceptsMap}
        />
      )}
      {genericRelations.length > 0 && (
        <GenericRelations
          genericRelations={genericRelations}
          relatedConceptsMap={relatedConceptsMap}
        />
      )}
      {isReplacedBy.length > 0 && (
        <IsReplacedBy
          title={title}
          isReplacedBy={isReplacedBy}
          relatedConceptsMap={relatedConceptsMap}
        />
      )}
      {seeAlso.length > 0 && (
        <SeeAlso
          seeAlso={seeAlso}
          validToIncluding={validToIncluding}
          validFromIncluding={validFromIncluding}
          relatedConceptsMap={relatedConceptsMap}
        />
      )}
    </KeyValueList>
  );
};

export default RelatedConcepts;
