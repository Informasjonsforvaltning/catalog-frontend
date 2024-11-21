import React from 'react';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { KeyValueListItem } from '@catalog-frontend/ui';
import { UnionRelation, RelatedConcept } from '@catalog-frontend/types';
import { Link } from '@digdir/designsystemet-react';

interface Props {
  seeAlso: UnionRelation[];
  validToIncluding: string | null | undefined;
  validFromIncluding: string | null | undefined;
  relatedConceptsMap: (identifier: string) => RelatedConcept | undefined;
}

const SeeAlso = ({ seeAlso, relatedConceptsMap }: Props) => (
  <>
    {seeAlso.map((relasjon) => {
      if (!relasjon) return undefined;
      const relatedConcept = relatedConceptsMap(relasjon.relatertBegrep ?? '');
      if (relatedConcept) {
        return (
          <KeyValueListItem
            key={`seeAlso-${relatedConcept.id}`}
            property={localization.concept.seeAlso}
            value={<Link href={relatedConcept.href}>{getTranslateText(relatedConcept.title)}</Link>}
          />
        );
      } else {
        return (
          <KeyValueListItem
            key={relasjon.relatertBegrep}
            property={localization.concept.seeAlso}
            value={relasjon.relatertBegrep}
          />
        );
      }
    })}
  </>
);

export default SeeAlso;
