"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  ApplicationProfile,
  Dataset,
  DatasetsPageSettings,
  FilterType,
  PublicationStatus,
} from "@catalog-frontend/types";
import styles from "./datasets-page.module.css";
import {
  HelpMarkdown,
  NewDatasetModal,
  SearchField,
  SearchHit,
  SearchHitContainer,
  SearchHitsLayout,
  Select,
} from "@catalog-frontend/ui";
import { Button, Chip, Tag } from "@digdir/designsystemet-react";
import {
  dateStringToDate,
  formatDate,
  getTranslateText,
  localization,
  setClientDatasetsPageSettings,
  sortAscending,
  sortDateStringsDescending,
  sortDescending,
} from "@catalog-frontend/utils";
import StatusTag from "../../../../components/status-tag/index";
import { PlusCircleIcon } from "@navikt/aksel-icons";
import SearchFilter from "../../../../components/search-filter";
import { isEmpty } from "lodash";
import {
  useQueryState,
  parseAsArrayOf,
  parseAsString,
  parseAsInteger,
} from "nuqs";

interface Props {
  datasets: Dataset[];
  hasWritePermission: boolean;
  catalogId: string;
  pageSettings?: DatasetsPageSettings;
}

type SortTypes = "titleAsc" | "titleDesc" | "lastChanged";
const sortTypes: SortTypes[] = ["titleAsc", "titleDesc", "lastChanged"];
const itemPerPage = 5;

const DatasetsPageClient = ({
  datasets,
  catalogId,
  hasWritePermission,
  pageSettings,
}: Props) => {
  // Memoize default values for query states
  const defaultSearchTerm = useMemo(() => pageSettings?.search ?? "", []);
  const defaultFilterStatus = useMemo(
    () => pageSettings?.filter?.status ?? [],
    [],
  );
  const defaultFilterPublicationState = useMemo(
    () => pageSettings?.filter?.pubState ?? [],
    [],
  );
  const defaultFilterApplicationProfile = useMemo(
    () => pageSettings?.filter?.applicationProfile ?? [],
    [],
  );
  const defaultSortValue = useMemo(() => pageSettings?.sort ?? "", []);
  const defaultPage = useMemo(() => pageSettings?.page ?? 0, []);

  // Query states
  const [searchTerm, setSearchTerm] = useQueryState("datasetSearch", {
    defaultValue: defaultSearchTerm,
  });
  const [filterStatus, setFilterStatus] = useQueryState(
    "datasetFilter.status",
    parseAsArrayOf(parseAsString).withDefault(defaultFilterStatus),
  );
  const [filterPublicationState, setFilterPublicationState] = useQueryState(
    "datasetFilter.pubState",
    parseAsArrayOf(parseAsString).withDefault(defaultFilterPublicationState),
  );
  const [filterApplicationProfile, setFilterApplicationProfile] = useQueryState(
    "datasetFilter.applicationProfile",
    parseAsArrayOf(parseAsString).withDefault(defaultFilterApplicationProfile),
  );
  const [sortValue, setSortValue] = useQueryState("datasetSort", {
    defaultValue: defaultSortValue,
  });
  const [page, setPage] = useQueryState(
    "datasetPage",
    parseAsInteger.withDefault(defaultPage),
  );
  const [filteredDatasets, setFilteredDatasets] = useState<Dataset[]>(datasets);
  const getSortFunction = useMemo(() => {
    return (sortKey: SortTypes) => {
      switch (sortKey) {
        case "titleAsc":
          return (a: Dataset, b: Dataset) =>
            sortAscending(getTranslateText(a.title), getTranslateText(b.title));
        case "titleDesc":
          return (a: Dataset, b: Dataset) =>
            sortDescending(
              getTranslateText(a.title),
              getTranslateText(b.title),
            );
        case "lastChanged":
          return (a: Dataset, b: Dataset) =>
            sortDateStringsDescending(
              a.lastModified || "",
              b.lastModified || "",
            );
        default:
          return () => 0;
      }
    };
  }, []);

  const removeFilter = (filterName: string, filterType: FilterType) => {
    if (filterType === "published") {
      setFilterPublicationState(
        filterPublicationState?.filter((name) => name !== filterName) ?? [],
      );
      setPage(0);
    } else if (filterType === "status") {
      setFilterStatus(
        filterStatus?.filter((name) => name !== filterName) ?? [],
      );
      setPage(0);
    } else if (filterType === "applicationProfile") {
      setFilterApplicationProfile(
        filterApplicationProfile?.filter((name) => name !== filterName) ?? [],
      );
      setPage(0);
    }
  };

  useEffect(() => {
    const settings = {
      search: searchTerm,
      sort: sortValue,
      page,
      filter: {
        pubState: filterPublicationState,
        status: filterStatus,
        applicationProfile: filterApplicationProfile,
      },
    };
    setClientDatasetsPageSettings(settings);
  }, [
    page,
    searchTerm,
    sortValue,
    filterPublicationState,
    filterStatus,
    filterApplicationProfile,
  ]);

  useEffect(() => {
    const filterAndSortDatasets = () => {
      let filtered = datasets;
      if (!isEmpty(filterStatus)) {
        filtered = filtered.filter((dataset) => {
          if (filterStatus?.includes(PublicationStatus.APPROVE)) {
            return dataset.approved || dataset.published;
          }
          if (filterStatus?.includes(PublicationStatus.DRAFT)) {
            return !dataset.approved && !dataset.published;
          }
          return false;
        });
      }
      if (!isEmpty(filterPublicationState)) {
        filtered = filtered.filter((dataset) => {
          if (filterPublicationState?.includes("PUBLISH")) {
            return dataset.published;
          }
          if (filterPublicationState?.includes("UNPUBLISH")) {
            return !dataset.published;
          }
          return false;
        });
      }
      if (!isEmpty(filterApplicationProfile)) {
        filtered = filtered.filter((dataset) => {
          if (
            filterApplicationProfile?.includes(
              ApplicationProfile.MOBILITYDCATAP,
            )
          ) {
            return (
              dataset?.applicationProfile === ApplicationProfile.MOBILITYDCATAP
            );
          }

          if (filterApplicationProfile?.includes(ApplicationProfile.DCATAPNO)) {
            return !(
              dataset?.applicationProfile === ApplicationProfile.MOBILITYDCATAP
            );
          }
          return false;
        });
      }

      if (searchTerm) {
        const lowercasedQuery = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (dataset) =>
            getTranslateText(dataset?.title)
              .toLowerCase()
              .includes(lowercasedQuery) ||
            getTranslateText(dataset?.description)
              .toLowerCase()
              .includes(lowercasedQuery),
        );
      }
      const sort: SortTypes | "" = sortTypes.includes(sortValue as SortTypes)
        ? (sortValue as SortTypes)
        : "";
      if (sort) {
        filtered = [...filtered].sort(getSortFunction(sort));
      }
      setFilteredDatasets(filtered);
    };
    filterAndSortDatasets();
  }, [
    datasets,
    filterPublicationState,
    filterStatus,
    filterApplicationProfile,
    searchTerm,
    sortValue,
  ]);

  const FilterChips = () => {
    if (
      isEmpty(filterStatus) &&
      isEmpty(filterPublicationState) &&
      isEmpty(filterApplicationProfile)
    ) {
      return undefined;
    }

    return (
      <div className={styles.chips}>
        <div className={styles.wrap}>
          {filterStatus?.map((filter, index) => (
            <Chip.Removable
              key={filter}
              onClick={() => {
                removeFilter(filter, "status");
              }}
            >
              {localization.datasetForm.filter[filter]}
            </Chip.Removable>
          ))}
          {filterPublicationState?.map((filter, index) => (
            <Chip.Removable
              key={filter}
              onClick={() => {
                removeFilter(filter, "published");
              }}
            >
              {filter === PublicationStatus.PUBLISH
                ? localization.publicationState.published
                : localization.publicationState.unpublished}
            </Chip.Removable>
          ))}
          {filterApplicationProfile?.map((filter, index) => (
            <Chip.Removable
              key={filter}
              onClick={() => {
                removeFilter(filter, "applicationProfile");
              }}
            >
              {filter === ApplicationProfile.MOBILITYDCATAP
                ? localization.tag.mobilityDcatAp
                : localization.tag.dcatApNo}
            </Chip.Removable>
          ))}
        </div>
      </div>
    );
  };

  const datasetTags = (dataset: Dataset) => {
    return (
      <div className={styles.set}>
        {dataset.specializedType === "SERIES" && (
          <HelpMarkdown
            aria-label={"series-not-implemented-warning"}
            severity={"warning"}
          >
            Datasettserier har ikke blitt implementert enda
          </HelpMarkdown>
        )}
        <StatusTag approved={dataset.approved || dataset.published} />
      </div>
    );
  };

  const totalPages = Math.ceil(filteredDatasets.length / itemPerPage);

  const paginatedDatasets = useMemo(() => {
    const startIndex = page ? page * itemPerPage : 0;
    const endIndex = startIndex + itemPerPage;
    return filteredDatasets.slice(startIndex, endIndex);
  }, [filteredDatasets, page]);

  return (
    <div className={styles.container}>
      <SearchHitsLayout>
        <SearchHitsLayout.SearchRow>
          <div className={styles.searchRow}>
            <div className={styles.searchFieldWrapper}>
              <SearchField
                className={styles.searchField}
                placeholder={`${localization.search.search}...`}
                value={searchTerm}
                onSearch={(value) => {
                  setSearchTerm(value);
                  setPage(0);
                }}
              />
              <Select
                size="sm"
                onChange={(e) => setSortValue(e.target.value)}
                value={sortValue}
              >
                <option value="">{`${localization.choose} ${localization.search.sort.toLowerCase()}...`}</option>
                <option value="lastChanged">
                  {localization.search.sortOptions.LAST_UPDATED_FIRST}
                </option>
                <option value="titleAsc">
                  {localization.search.sortOptions.TITLE_AÅ}
                </option>
                <option value="titleDesc">
                  {localization.search.sortOptions.TITLE_ÅA}
                </option>
              </Select>
            </div>
            <div className={styles.buttons}>
              {hasWritePermission && (
                <NewDatasetModal
                  catalogId={catalogId}
                  trigger={
                    <Button variant="primary" size="sm">
                      <PlusCircleIcon fontSize="1.2rem" />
                      {localization.datasetForm.button.addDataset}
                    </Button>
                  }
                />
              )}
            </div>
          </div>
          <FilterChips />
        </SearchHitsLayout.SearchRow>

        <SearchHitsLayout.LeftColumn>
          <div className={styles.leftColumn}>
            <SearchFilter pageSettings={pageSettings} />
          </div>
        </SearchHitsLayout.LeftColumn>

        <SearchHitsLayout.MainColumn>
          <SearchHitContainer
            searchHits={
              paginatedDatasets.length > 0 ? (
                <ul className={styles.searchHits} role="list">
                  {paginatedDatasets.map((dataset: Dataset) => (
                    <li role="listitem" key={dataset.id}>
                      <SearchHit
                        title={getTranslateText(dataset?.title)}
                        description={getTranslateText(dataset?.description)}
                        titleHref={`/catalogs/${catalogId}/datasets/${dataset?.id}`}
                        statusTag={datasetTags(dataset)}
                        rightColumn={
                          dataset.specializedType === "SERIES" && (
                            <Tag>Serie</Tag>
                          )
                        }
                        content={
                          <>
                            <div className={styles.set}>
                              <p>
                                {localization.lastChanged}{" "}
                                {formatDate(
                                  dateStringToDate(dataset.lastModified),
                                )}
                              </p>
                              <span>•</span>
                              {dataset.published
                                ? localization.publicationState.publishedInFDK
                                : localization.publicationState.unpublished}
                              {dataset?.applicationProfile && (
                                <>
                                  <span>•</span>
                                  {dataset?.applicationProfile ===
                                  ApplicationProfile.MOBILITYDCATAP
                                    ? localization.tag.mobilityDcatAp
                                    : localization.tag.dcatApNo}
                                </>
                              )}
                            </div>
                          </>
                        }
                      />
                    </li>
                  ))}
                </ul>
              ) : null
            }
            noSearchHits={!paginatedDatasets || paginatedDatasets.length === 0}
            paginationInfo={{
              currentPage: page ?? 0,
              totalPages: totalPages,
            }}
            onPageChange={(event, selectedItem) => {
              setPage(selectedItem - 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </SearchHitsLayout.MainColumn>
      </SearchHitsLayout>
    </div>
  );
};

export default DatasetsPageClient;
