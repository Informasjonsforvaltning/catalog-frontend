import { CodeList, Concept } from '@catalog-frontend/types';
import { SearchHit } from '../search-hit';
import { localization as loc } from '@catalog-frontend/utils';
import styles from './search-hit-container.module.css';

type Props = {
  data: any;
  catalogId: string;
  subjectCodeList?: CodeList;
};

const SearchHitContainer = ({ data, catalogId, subjectCodeList }: Props) => (
  <div className={styles.searchHitsContainer}>
    {data?.hits.length === 0 && <div className={styles.noHits}>{loc.search.noHits}</div>}
    {data?.hits.map((concept: Concept) => (
      <div
        className={styles.searchHitContainer}
        key={concept.id}
      >
        <SearchHit
          searchHit={concept}
          catalogId={catalogId}
          subjectCodeList={subjectCodeList}
        />
      </div>
    ))}
  </div>
);

export { SearchHitContainer };
