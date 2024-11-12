'use client';
import React from 'react';
import { CodeList, Concept, ReferenceDataCode } from '@catalog-frontend/types';
import {
  getTranslateText as translate,
  localization,
  formatISO,
  validOrganizationNumber,
  validUUID,
} from '@catalog-frontend/utils';
import cn from 'classnames';
import { ConceptStatusTagProps, ConceptSubject, SearchHit, Tag } from '@catalog-frontend/ui';
import Link from 'next/link';
import styles from './concept-search-hits.module.css';
import { Chip } from '@digdir/designsystemet-react';

interface Props {
  catalogId: string;
  data: any;
  conceptStatuses?: ReferenceDataCode[];
  subjectCodeList?: CodeList;
  assignableUsers?: any[];
  onLabelClick?: (label: string) => void;
}

const ConceptSearchHits: React.FC<Props> = ({
  data,
  conceptStatuses,
  catalogId,
  subjectCodeList,
  assignableUsers,
  onLabelClick,
}: Props) => {
  const findConceptStatus = (statusURI) => conceptStatuses?.find((s) => s.uri === statusURI);

  const ConceptLabels: React.FC<{ searchHit: Concept }> = ({ searchHit }) => (
    <div className={styles.rowSpaceBetween}>
      <Chip.Group size='small'>
        {searchHit.merkelapp &&
          searchHit.merkelapp.map((label) => (
            <Chip.Toggle
              key={`label-${label}`}
              onClick={() => onLabelClick?.(label)}
            >
              {label}
            </Chip.Toggle>
          ))}
      </Chip.Group>
    </div>
  );

  const ConceptPublishingInfo: React.FC<{ searchHit: Concept }> = ({ searchHit }) => (
    <>
      <div className={styles.metaData}>
        <p>{localization.searchHit.lastEdited}&nbsp;</p>
        {searchHit?.endringslogelement && (
          <p>
            {formatISO(searchHit.endringslogelement.endringstidspunkt, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}

        <p className={styles.dot}>•</p>
        <p>
          {searchHit?.erPublisert
            ? localization.publicationState.publishedInFDK
            : localization.publicationState.unpublished}
        </p>
      </div>
      <div className={styles.rowSpaceBetween}>
        {searchHit.sistPublisertId && !searchHit?.erPublisert && (
          <div className={styles.metaData}>
            <Link
              prefetch={false}
              href={
                validOrganizationNumber(catalogId) && validUUID(searchHit.sistPublisertId)
                  ? `/${catalogId}/${searchHit.sistPublisertId}`
                  : '#'
              }
            >
              {localization.searchHit.lastPublished}
            </Link>
          </div>
        )}
        {searchHit?.assignedUser && (
          <p className={styles.greyFont}>
            {assignableUsers?.find((user) => user.id === searchHit.assignedUser)?.name ?? localization.unknown}
          </p>
        )}
      </div>
    </>
  );

  return (
    <>
      {data?.hits &&
        data.hits.map((concept: Concept) => (
          <div
            className={styles.searchHitContainer}
            key={concept.id}
          >
            <SearchHit
              title={concept?.anbefaltTerm?.navn ? translate(concept?.anbefaltTerm?.navn) : localization.concept.noName}
              description={translate(concept?.definisjon?.tekst)}
              labels={<ConceptLabels searchHit={concept} />}
              content={<ConceptPublishingInfo searchHit={concept} />}
              statusTag={
                concept?.statusURI && (
                  <Tag.ConceptStatus
                    statusKey={findConceptStatus(concept.statusURI)?.code as ConceptStatusTagProps['statusKey']}
                    statusLabel={translate(findConceptStatus(concept.statusURI)?.label) as string}
                  />
                )
              }
              titleHref={
                validOrganizationNumber(catalogId) && validUUID(concept?.id) ? `/${catalogId}/${concept.id}` : '#'
              }
              conceptSubject={
                <ConceptSubject
                  className={cn(styles.greyFont, styles.subject)}
                  concept={concept}
                  subjectCodeList={subjectCodeList}
                />
              }
            />
          </div>
        ))}
    </>
  );
};

export default ConceptSearchHits;
