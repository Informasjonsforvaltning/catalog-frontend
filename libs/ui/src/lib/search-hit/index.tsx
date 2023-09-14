import {
  convertCodeListToTreeNodes,
  ensureStringArray,
  formatISO,
  getPath,
  localization,
  getTranslateText as translate,
  validOrganizationNumber,
  validUUID,
} from '@catalog-frontend/utils';
import cn from 'classnames';
import styles from './search-hit.module.css';
import Link from 'next/link';
import { Tag } from '../tag';
import { CodeList, Concept, ReferenceDataCode } from '@catalog-frontend/types';
import { Chip } from '@digdir/design-system-react';

interface Props {
  catalogId: string;
  searchHit: Concept;
  subjectCodeList?: CodeList;
  conceptStatuses?: ReferenceDataCode[];
  onLabelClick?: (label: string) => void;
}

const SearchHit = ({ catalogId, searchHit, subjectCodeList, conceptStatuses, onLabelClick }: Props) => {
  const conceptStatus = translate(conceptStatuses?.find((s) => s.uri === searchHit.statusURI)?.label) as string;
  const Title = () => {
    const title = translate(searchHit?.anbefaltTerm?.navn);
    return <span>{title ? title : localization.concept.noName}</span>;
  };

  const Subject = () => {
    if (subjectCodeList && searchHit?.fagområdeKoder?.[0]) {
      const path = getPath(convertCodeListToTreeNodes(subjectCodeList), searchHit.fagområdeKoder[0]);
      return <p className={cn(styles.greyFont, styles.subject)}>{path.map((item) => item.label).join(' - ')}</p>;
    }

    return (
      <p className={cn(styles.greyFont, styles.subject)}>
        {ensureStringArray(translate(searchHit.fagområde)).join(' ')}
      </p>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.rowSpaceBetween}>
        <div className={styles.titleRow}>
          {searchHit?.anbefaltTerm && (
            <Link
              href={
                validOrganizationNumber(catalogId) && validUUID(searchHit.id) ? `/${catalogId}/${searchHit.id}` : '#'
              }
            >
              <h2 className={styles.title}>
                <Title />
              </h2>
            </Link>
          )}

          {conceptStatus && (
            <div className={styles.status}>
              <Tag>{conceptStatus}</Tag>
            </div>
          )}
        </div>

        <Subject />
      </div>

      <div className={styles.metaData}>
        <p>{localization.searchHit.lastEdited} &nbsp;</p>
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
        {searchHit.gjeldendeRevisjon && (
          <div className={styles.metaData}>
            <p>
              <Link
                href={
                  validOrganizationNumber(catalogId) && validUUID(searchHit.gjeldendeRevisjon)
                    ? `/${catalogId}/${searchHit.gjeldendeRevisjon}`
                    : '#'
                }
              >
                {localization.searchHit.underRevision}
              </Link>
            </p>
          </div>
        )}
        {searchHit?.tildeltBruker && <p className={styles.greyFont}>{searchHit.tildeltBruker.id}</p>}
      </div>
      {searchHit?.definisjon && <p className={styles.description}>{translate(searchHit?.definisjon?.tekst)}</p>}
      {searchHit?.merkelapp && (
        <div className={styles.rowSpaceBetween}>
          <Chip.Group size='xsmall'>
            {searchHit?.merkelapp.map((label) => (
              <Chip.Toggle
                key={`label-${label}`}
                onClick={() => onLabelClick?.(label)}
              >
                {label}
              </Chip.Toggle>
            ))}
          </Chip.Group>
        </div>
      )}
    </div>
  );
};

export { SearchHit };
