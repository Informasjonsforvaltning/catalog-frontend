import React from 'react';
import { Relasjon, RelatedConcept, LocalizedStrings } from '@catalog-frontend/types';
import { KeyValueList } from '@catalog-frontend/ui';
import AssociativeRelations from './associative-relations';
import PartitiveRelations from './partitive-relations';
import GenericRelations from './generic-relations';
import SeeAlso from './see-also';
import IsReplacedBy from './is-replaced-by';
import { conceptIdFromUriRegex } from '@catalog-frontend/utils';

interface Props {
  conceptRelations: Relasjon[];
  relatedConcepts: RelatedConcept[];
  validFromIncluding: string | null | undefined;
  validToIncluding: string | null | undefined;
  title: LocalizedStrings;
}

const RelatedConcepts = ({ conceptRelations, relatedConcepts, validToIncluding, validFromIncluding, title }: Props) => {
  const associativeRelations = conceptRelations.filter((relasjon) => relasjon.relasjon === 'assosiativ') ?? [];
  const partitiveRelations = conceptRelations.filter((relasjon) => relasjon.relasjon === 'partitiv') ?? [];
  const genericRelations = conceptRelations.filter((relasjon) => relasjon.relasjon === 'generisk') ?? [];
  const seeAlso =
    conceptRelations.filter((relasjon) => relasjon.relasjon === 'seOgså' || relasjon.relasjon === 'internSeOgså') ?? [];
  const isReplacedBy =
    conceptRelations.filter(
      (relasjon) => relasjon.relasjon === 'erstattesAv' || relasjon.relasjon === 'internErstattesAv',
    ) ?? [];

  const relatedConceptsMap = (identifier: string) => {
    const result = relatedConcepts.find(
      (concept) =>
        concept.identifier === identifier || concept.identifier === identifier.match(conceptIdFromUriRegex)?.[1],
    );
    return result;
  };

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
