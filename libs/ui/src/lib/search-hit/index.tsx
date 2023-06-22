import {
  formatISO,
  localization,
  getTranslateText as translate,
  validOrganizationNumber,
  validUUID,
} from '@catalog-frontend/utils';
import styles from './search-hit.module.css';
import { Concept } from '@catalog-frontend/types';
import Link from 'next/link';
import { Tag } from '../tag';

interface SearchHit {
  catalogId: string;
  searchHit: Concept;
}

export function SearchHit({ catalogId, searchHit }: SearchHit) {
  const Title = () => {
    const title = translate(searchHit?.anbefaltTerm?.navn);
    return <span>{title ? title : localization.concept.noName}</span>;
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

          {searchHit?.status && <Tag>{searchHit.status}</Tag>}
        </div>

        <p className={styles.greyFont}>Brødsmuler - Ikke klart i backend </p>
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

        {searchHit?.erPublisert && (
          <>
            <p className={styles.dot}>•</p>
            <p>{localization.publicationState.publishedInFDK}</p>
          </>
        )}
      </div>

      <div className={styles.rowSpaceBetween}>
        <div className={styles.metaData}>
          <p>Dette begrepet er under revisjon. Se utkast under versjoner. - Ikke klart i backend</p>
        </div>
        {searchHit?.tildeltBruker && <p className={styles.greyFont}>{searchHit.tildeltBruker.id}</p>}
      </div>
      {searchHit?.definisjon && <p className={styles.description}>{translate(searchHit?.definisjon?.tekst)}</p>}
    </div>
  );
}

export default SearchHit;
