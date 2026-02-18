"use client";

import { DataService, DataServicesPageSettings } from "@catalog-frontend/types";
import styles from "./data-services-page.module.css";

import {
  LinkButton,
  SearchField,
  SearchHit,
  SearchHitContainer,
  SearchHitsLayout,
  Select,
} from "@catalog-frontend/ui";
import SearchFilter from "../../../../components/search-filter";
import React, { useState, useEffect, useMemo } from "react";
import { Chip } from "@digdir/designsystemet-react";
import {
  capitalizeFirstLetter,
  getTranslateText,
  localization,
  sortAscending,
  sortDescending,
  setClientDataServicesPageSettings,
} from "@catalog-frontend/utils";
import { PlusCircleIcon } from "@navikt/aksel-icons";
import {
  parseAsArrayOf,
  parseAsString,
  useQueryState,
  parseAsInteger,
} from "nuqs";
import StatusTag from "../../../../components/status-tag";
import { isEmpty } from "lodash";

type SortTypes = "titleAsc" | "titleDesc";
type FilterType = "published" | "status";
const sortTypes: SortTypes[] = ["titleAsc", "titleDesc"];
const itemPerPage = 5;

interface Props {
  dataServices: DataService[];
  catalogId: string;
  hasWritePermission: boolean;
  hasAdminPermission: boolean;
  distributionStatuses: any;
  pageSettings?: DataServicesPageSettings;
}

const DataServicesPageClient = ({
  dataServices,
  catalogId,
  hasWritePermission,
  distributionStatuses,
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
  const defaultSortValue = useMemo(() => pageSettings?.sort ?? "", []);
  const defaultPage = useMemo(() => pageSettings?.page ?? 0, []);

  // Query states
  const [searchTerm, setSearchTerm] = useQueryState("dataServiceSearch", {
    defaultValue: defaultSearchTerm,
  });
  const [filterStatus, setFilterStatus] = useQueryState(
    "dataServiceFilter.status",
    parseAsArrayOf(parseAsString).withDefault(defaultFilterStatus),
  );
  const [filterPublicationState, setFilterPublicationState] = useQueryState(
    "dataServiceFilter.pubState",
    parseAsArrayOf(parseAsString).withDefault(defaultFilterPublicationState),
  );
  const [sortValue, setSortValue] = useQueryState("dataServiceSort", {
    defaultValue: defaultSortValue,
  });
  const [page, setPage] = useQueryState(
    "dataServicePage",
    parseAsInteger.withDefault(defaultPage),
  );
  const [filteredDataServices, setFilteredDataServices] =
    useState<DataService[]>(dataServices);

  const getSortFunction = useMemo(() => {
    return (sortKey: SortTypes) => {
      switch (sortKey) {
        case "titleAsc":
          return (a: DataService, b: DataService) =>
            sortAscending(getTranslateText(a.title), getTranslateText(b.title));
        case "titleDesc":
          return (a: DataService, b: DataService) =>
            sortDescending(
              getTranslateText(a.title),
              getTranslateText(b.title),
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
      },
    };
    setClientDataServicesPageSettings(settings);
  }, [page, searchTerm, sortValue, filterPublicationState, filterStatus]);

  useEffect(() => {
    const filterAndSortDataServices = () => {
      let filtered = dataServices;

      if (!isEmpty(filterStatus)) {
        filtered = filtered.filter((dataService) => {
          return filterStatus?.includes(dataService.status || "");
        });
      }

      if (!isEmpty(filterPublicationState)) {
        filtered = filtered.filter((dataService) => {
          return filterPublicationState?.includes(
            dataService?.published ? "published" : "unpublished",
          );
        });
      }

      if (searchTerm) {
        const lowercasedQuery = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (dataService) =>
            getTranslateText(dataService?.title)
              .toLowerCase()
              .includes(lowercasedQuery) ||
            getTranslateText(dataService?.description)
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

      setFilteredDataServices(filtered);
    };
    filterAndSortDataServices();
  }, [
    dataServices,
    filterPublicationState,
    filterStatus,
    searchTerm,
    sortValue,
    getSortFunction,
  ]);

  const FilterChips = () => {
    if (isEmpty(filterStatus) && isEmpty(filterPublicationState)) {
      return undefined;
    }

    return (
      <div className={styles.chips}>
        <Chip.Group size="small" className={styles.wrap}>
          {filterStatus?.map((filter, index) => (
            <Chip.Removable
              key={`status-${index}`}
              aria-label={`Fjern filter for status ${filter}`}
              onClick={() => {
                removeFilter(filter, "status");
              }}
            >
              {capitalizeFirstLetter(
                getTranslateText(
                  distributionStatuses?.find((s) => s.uri === filter)?.label,
                ),
              )}
            </Chip.Removable>
          ))}
          {filterPublicationState?.map((filter, index) => (
            <Chip.Removable
              key={`published-${index}`}
              aria-label={`Fjern filter for publisering ${filter}`}
              onClick={() => {
                removeFilter(filter, "published");
              }}
            >
              {filter === "published"
                ? localization.publicationState.published
                : localization.publicationState.unpublished}
            </Chip.Removable>
          ))}
        </Chip.Group>
      </div>
    );
  };

  const totalPages = Math.ceil(filteredDataServices.length / itemPerPage);

  const paginatedDataServices = useMemo(() => {
    const startIndex = page ? page * itemPerPage : 0;
    const endIndex = startIndex + itemPerPage;
    return filteredDataServices.slice(startIndex, endIndex);
  }, [filteredDataServices, page]);

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
                <LinkButton href={`/catalogs/${catalogId}/data-services/new`}>
                  <PlusCircleIcon />
                  {localization.dataServiceCatalog.button.newDataService}
                </LinkButton>
              )}
            </div>
          </div>
          <FilterChips />
        </SearchHitsLayout.SearchRow>
        <SearchHitsLayout.LeftColumn>
          <SearchFilter distributionStatuses={distributionStatuses} />
        </SearchHitsLayout.LeftColumn>
        <SearchHitsLayout.MainColumn>
          <SearchHitContainer
            searchHits={
              paginatedDataServices.length > 0 ? (
                <ul className={styles.searchHits} role="list">
                  {paginatedDataServices.map((dataService: DataService) => (
                    <li role="listitem" key={dataService.id}>
                      <SearchHit
                        title={getTranslateText(dataService?.title)}
                        description={getTranslateText(dataService?.description)}
                        titleHref={`/catalogs/${catalogId}/data-services/${dataService?.id}`}
                        statusTag={
                          <StatusTag
                            dataServiceStatus={dataService?.status}
                            distributionStatuses={distributionStatuses}
                            language="nb"
                          />
                        }
                        content={
                          <div className={styles.set}>
                            {dataService.published
                              ? localization.publicationState.publishedInFDK
                              : localization.publicationState.unpublished}
                          </div>
                        }
                      />
                    </li>
                  ))}
                </ul>
              ) : null
            }
            noSearchHits={
              !paginatedDataServices || paginatedDataServices.length === 0
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
    </div>
  );
};

export default DataServicesPageClient;
