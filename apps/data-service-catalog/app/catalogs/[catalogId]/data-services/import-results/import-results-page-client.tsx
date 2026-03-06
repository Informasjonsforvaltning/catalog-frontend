"use client";

import { ImportResult } from "@catalog-frontend/types";
import {
  AccordionItem,
  AccordionItemProps,
  CheckboxGroupFilter,
  ImportResultsTable,
  SearchHitContainer,
  SearchHitsLayout,
  Select,
} from "@catalog-frontend/ui-v2";
import styles from "./import-results-page-client.module.css";
import { Card, Chip } from "@digdir/designsystemet-react";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs";
import {
  localization,
  localization as loc,
  sortDateStringsAscending,
  sortDateStringsDescending,
} from "@catalog-frontend/utils";
import { useEffect, useMemo, useState } from "react";
import { isEmpty } from "lodash";

const importStatuses = [
  { value: "COMPLETED", label: localization.importResult.completed },
  { value: "FAILED", label: localization.importResult.failed },
];

interface Props {
  catalogId: string;
  importResults: ImportResult[];
}

const ImportResultsPageClient = ({ catalogId, importResults }: Props) => {
  const [filteredImportResults, setFilteredImportResults] =
    useState<ImportResult[]>(importResults);
  const [sortType, setSortType] = useQueryState<string>(
    "api.import.sort.type",
    parseAsString,
  );
  const [filterStatus, setFilterStatus] = useQueryState(
    "api.import.filter.status",
    parseAsArrayOf(parseAsString),
  );
  const [page, setPage] = useQueryState("api.import.page", parseAsInteger);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 10;

  const filterItemContents: AccordionItemProps[] = [
    ...(importStatuses?.length > 0
      ? [
          {
            header: loc.status,
            content: (
              <CheckboxGroupFilter<string>
                items={importStatuses}
                onChange={(values) => {
                  setFilterStatus(values);
                }}
                value={filterStatus ?? []}
              />
            ),
          },
        ]
      : []),
  ];

  const filterItems = filterItemContents.map((item) => (
    <AccordionItem key={`accordion-item-${item.header}`} {...item} />
  ));

  const getSortFunction = (sortKey: string) => {
    if (sortKey === "createdAsc") {
      return (a: ImportResult, b: ImportResult) =>
        sortDateStringsAscending(a.created, b.created);
    }
    return (a: ImportResult, b: ImportResult) =>
      sortDateStringsDescending(a.created, b.created);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortType(event.target.value);
  };

  const hasActiveFilters = !isEmpty(filterStatus);

  useEffect(() => {
    const filteredImportResults = () => {
      let filtered = importResults;

      if (!isEmpty(filterStatus)) {
        filtered = filtered.filter(
          (result) => result.status && filterStatus?.includes(result.status),
        );
      }

      filtered = [...filtered].sort(getSortFunction(sortType ?? ""));

      setFilteredImportResults(filtered);
    };

    filteredImportResults();
  }, [importResults, sortType, filterStatus]);

  const paginatedImportResults = useMemo(() => {
    setTotalPages(Math.ceil(filteredImportResults.length / itemsPerPage));
    const startIndex = page ? page * itemsPerPage : 0;
    const endIndex = startIndex + itemsPerPage;
    return filteredImportResults?.slice(startIndex, endIndex);
  }, [filteredImportResults, page]);

  return (
    <SearchHitsLayout>
      <SearchHitsLayout.SearchRow>
        <Select className={styles.select} onChange={handleSortChange}>
          <option value="">
            {localization.search.sortOptions.NEWEST_FIRST}
          </option>
          <option value="createdAsc">
            {localization.search.sortOptions.LAST_UPDATED_LAST}
          </option>
        </Select>
      </SearchHitsLayout.SearchRow>
      <SearchHitsLayout.LeftColumn>
        <div className={styles.importFilter}>
          <Card className={styles.accordion}>{filterItems}</Card>
        </div>
        {hasActiveFilters && (
          <div className={styles.chips}>
            {filterStatus?.map((filter) => (
              <Chip.Removable
                key={`status-${filter}`}
                onClick={() =>
                  setFilterStatus(
                    filterStatus?.filter((value) => value !== filter) ?? [],
                  )
                }
              >
                {importStatuses?.find((s) => s.value === filter)?.label}
              </Chip.Removable>
            ))}
          </div>
        )}
      </SearchHitsLayout.LeftColumn>
      <SearchHitsLayout.MainColumn>
        <SearchHitContainer
          searchHits={
            paginatedImportResults.length > 0 ? (
              <ImportResultsTable
                importHref={`/catalogs/${catalogId}/data-services/import-results`}
                importResults={paginatedImportResults}
              />
            ) : null
          }
          noSearchHits={
            !paginatedImportResults || paginatedImportResults.length === 0
          }
          paginationInfo={{
            currentPage: page ?? 0,
            totalPages: totalPages,
          }}
          onPageChange={(newPage) => {
            setPage(newPage - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </SearchHitsLayout.MainColumn>
    </SearchHitsLayout>
  );
};

export default ImportResultsPageClient;
