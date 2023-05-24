import { localization, getTranslateText as translate } from '@catalog-frontend/utils';
import styles from './search-hit.module.css';
import { Concept } from '@catalog-frontend/types';
import Link from 'next/link';
import { Tag } from '../tag';

interface SearchHit {
  catalogId: string;
  searchHit: Concept;
}

export function SearchHit({ catalogId, searchHit }: SearchHit) {
  return (
    <div className={styles.container}>
      <div className={styles.rowSpaceBetween}>
        <div className={styles.titleRow}>
          {searchHit?.anbefaltTerm && (
            <Link href={`${catalogId}/${searchHit.id}`}>
              <h2 className={styles.title}>{translate(searchHit?.anbefaltTerm.navn)}</h2>
            </Link>
          )}

          {searchHit?.status && <Tag>{searchHit.status}</Tag>}
        </div>

        <p className={styles.greyFont}>Brødsmuler - Ikke klart i backend </p>
      </div>

      <div className={styles.metaData}>
        <p>{localization.searchHit.lastEdited} &nbsp;</p>
        {searchHit?.endringslogelement && (
          <p>{new Date(searchHit.endringslogelement.endringstidspunkt).toLocaleDateString()}</p>
        )}

        {searchHit?.erPublisert && (
          <>
            <p className={styles.dot}>•</p>
            <p>{localization.searchHit.publishedInFDK}</p>
          </>
        )}
      </div>

      <div className={styles.rowSpaceBetween}>
        <div className={styles.metaData}>
          <p>Dette begrepet er under revisjon. Se utkast under versjoner. - Ikke klart i backend</p>
        </div>
        {searchHit?.tildeltBruker && <p className={styles.greyFont}>{searchHit.tildeltBruker.id}</p>}
      </div>
      {searchHit?.definisjon && <p className={styles.description}>{translate(searchHit?.definisjon.tekst)}</p>}
    </div>
  );
}

export default SearchHit;
