import { CodeList, Concept, ReferenceDataCode } from '@catalog-frontend/types';
import { SearchHit } from '../search-hit';
import { localization as loc } from '@catalog-frontend/utils';
import styles from './search-hit-container.module.css';
import Pagination from '../pagination';

type Props = {
  data: any;
  catalogId: string;
  subjectCodeList?: CodeList;
  conceptStatuses?: ReferenceDataCode[];
  onLabelClick?: (label: string) => void;
  onPageChange?(selectedItem: { selected: number }): void;
  forcePage?: number | undefined;
};

const SearchHitContainer = ({ data, catalogId, subjectCodeList, conceptStatuses, onLabelClick, onPageChange, forcePage }: Props) => (
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
          onLabelClick={onLabelClick}
        />
      </div>
    ))}
    {data?.hits?.length > 0 && (
      <Pagination
        onPageChange={onPageChange}
        forcePage={forcePage}
        pageCount={data?.page?.totalPages ?? 0}
      />
    )}
  </div>
);

export { SearchHitContainer };
