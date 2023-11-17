import { AssignedUser, CodeList, Concept, ReferenceDataCode } from '@catalog-frontend/types';
import { SearchHit } from '../search-hit';
import { localization as loc } from '@catalog-frontend/utils';
import styles from './search-hit-container.module.css';
import { Pagination } from '../pagination';

type Props = {
  data: any;
  catalogId: string;
  subjectCodeList: CodeList;
  conceptStatuses: ReferenceDataCode[];
  assignableUsers: AssignedUser[];
  onLabelClick: (label: string) => void;
  onPageChange(selectedItem: number): void;
};

const SearchHitContainer = ({
  data,
  catalogId,
  subjectCodeList,
  conceptStatuses,
  assignableUsers,
  onLabelClick,
  onPageChange,
}: Props) => {
  let currentPage = 0;
  let totalPage = 0;

  if (data?.page) {
    const page = data.page;
    if (page.totalPages) {
      totalPage = page.totalPages;
    }
    if (page.currentPage) {
      currentPage = page.currentPage;
    }
  }

  return (
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
            assignableUsers={assignableUsers}
            onLabelClick={onLabelClick}
          />
        </div>
      ))}
      {data?.hits?.length > 0 && (
        <Pagination
          onChange={onPageChange}
          totalPages={totalPage}
          currentPage={currentPage + 1}
        />
      )}
    </div>
  );
};

export { SearchHitContainer };
