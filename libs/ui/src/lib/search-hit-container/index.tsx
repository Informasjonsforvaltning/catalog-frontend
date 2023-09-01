import { CodeList, Concept, ReferenceDataCode } from '@catalog-frontend/types';
import { SearchHit } from '../search-hit';
import { localization as loc } from '@catalog-frontend/utils';
import styles from './search-hit-container.module.css';

type Props = {
  data: any;
  catalogId: string;
  subjectCodeList?: CodeList;
  conceptStatuses?: ReferenceDataCode[];
};

const SearchHitContainer = ({ data, catalogId, subjectCodeList, conceptStatuses }: Props) => (
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
          conceptStatuses={conceptStatuses}
        />
      </div>
    ))}
  </div>
);

export { SearchHitContainer };
