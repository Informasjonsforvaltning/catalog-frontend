import { SearchHit } from '@catalog-frontend/ui';
import styles from './search-hit-container.module.css';
import { Concept } from '@catalog-frontend/types';
import { localization as loc } from '@catalog-frontend/utils';

type Props = {
  data: any;
  catalogId: string;
};

const SearchHitContainer = ({ data, catalogId }: Props) => (
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
        />
      </div>
    ))}
  </div>
);

export { SearchHitContainer };
