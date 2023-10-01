import React from 'react';
import { Relasjon, SkosConcept, TextLanguage } from '@catalog-frontend/types';
import { KeyValueList } from '@catalog-frontend/ui';
import AssociativeRelations from './associative-relations';
import PartitiveRelations from './partitive-relations';
import { useRouter } from 'next/router';
import GenericRelations from './generic-relations';
import SeeAlso from './see-also';
import IsReplacedBy from './is-replaced-by';

interface Props {
  conceptRelations: Relasjon[];
  relatedConcepts: SkosConcept[];
  validFromIncluding: string | undefined;
  validToIncluding: string | undefined;
  title: Partial<TextLanguage>;
}

const RelatedConcepts = ({ conceptRelations, relatedConcepts, validToIncluding, validFromIncluding, title }: Props) => {
  const router = useRouter();
  const catalogId = router.query.catalogId as string;
  const associativeRelations = conceptRelations.filter((relasjon) => relasjon.relasjon === 'assosiativ') ?? [];
  const partitiveRelations = conceptRelations.filter((relasjon) => relasjon.relasjon === 'partitiv') ?? [];
  const genericRelations = conceptRelations.filter((relasjon) => relasjon.relasjon === 'generisk') ?? [];
  const seeAlso = conceptRelations.filter((relasjon) => relasjon.relasjon === 'seOgså') ?? [];
  const isReplacedBy = conceptRelations.filter((relasjon) => relasjon.relasjon === 'erstattesAv') ?? [];

  const relatedConceptsMap = (identifier: string) =>
    relatedConcepts.find((concept) => concept.identifier === identifier);

  return (
    <KeyValueList>
      {associativeRelations.length > 0 && (
        <AssociativeRelations
          catalogId={catalogId}
          associativeRelations={associativeRelations}
          relatedConceptsMap={relatedConceptsMap}
        />
      )}
      {partitiveRelations.length > 0 && (
        <PartitiveRelations
          catalogId={catalogId}
          partitiveRelations={partitiveRelations}
          relatedConceptsMap={relatedConceptsMap}
        />
      )}
      {genericRelations.length > 0 && (
        <GenericRelations
          genericRelations={genericRelations}
          relatedConceptsMap={relatedConceptsMap}
          catalogId={catalogId}
        />
      )}
      {isReplacedBy.length > 0 && (
        <IsReplacedBy
          title={title}
          isReplacedBy={isReplacedBy}
          relatedConceptsMap={relatedConceptsMap}
          catalogId={catalogId}
        />
      )}
      {seeAlso.length > 0 && (
        <SeeAlso
          seeAlso={seeAlso}
          validToIncluding={validToIncluding}
          validFromIncluding={validFromIncluding}
          relatedConceptsMap={relatedConceptsMap}
          catalogId={catalogId}
        />
      )}
    </KeyValueList>
  );
};

export default RelatedConcepts;