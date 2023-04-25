import {localization} from '@catalog-frontend/utils';
import {getTranslateText as translate} from 'libs/utils/src/lib/language/translateText';
import styles from './search-hit.module.css';
import {Concept} from '@catalog-frontend/types';


interface SearchHit {
  searchHit: Concept;
}

export function SearchHit({searchHit}: SearchHit) {

  return (
    <div className={styles.container}>
      <div className={styles.rowSpaceBetween}>
        {searchHit?.anbefaltTerm && (
          <h2 className={styles.title}>
            {translate(searchHit?.anbefaltTerm.navn)}
          </h2>
        )}

        <p className={styles.greyFont}>Brødsmuler - Ikke klart i backend </p>
      </div>

      <div className={styles.metaData}>
        <p>{localization.searchHit.lastEdited} &nbsp;</p>
        {searchHit.endringslogelement && (
          <p>{searchHit.endringslogelement.endringstidspunkt}</p>
        )}

        {searchHit.status && (
          <>
            <p className={styles.dot}>•</p>
            <p>
              {searchHit.status.charAt(0).toUpperCase() +
                searchHit.status.substring(1)}
            </p>
          </>
        )}

        {searchHit.erPublisert && (
          <>
            <p className={styles.dot}>•</p>
            <p>localization.searchHit.publishedInFDK</p>
          </>
        )}
      </div>

      <div className={styles.rowSpaceBetween}>
        <div className={styles.metaData}>
          <p>
            Dette begrepet er under revisjon. Se utkast under versjoner. - Ikke
            klart i backend
          </p>
        </div>
        {searchHit.tildeltBruker && (
          <p className={styles.greyFont}>{searchHit.tildeltBruker.id}</p>
        )}
      </div>
      {searchHit?.definisjon && (
        <p className={styles.description}>
          {translate(searchHit?.definisjon.tekst)}
        </p>
      )}
    </div>
  );
}

export default SearchHit;
