"use client";

import {
  InformationModel,
  InformationModelsPageSettings,
} from "@catalog-frontend/types";
import styles from "./information-models-page.module.css";

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
  dateStringToDate,
  formatDate,
  getTranslateText,
  localization,
  sortAscending,
  sortDateStringsDescending,
  sortDescending,
  setClientInformationModelsPageSettings,
} from "@catalog-frontend/utils";
import { PlusCircleIcon } from "@navikt/aksel-icons";
import {
  parseAsArrayOf,
  parseAsString,
  useQueryState,
  parseAsInteger,
} from "nuqs";
import { isEmpty } from "lodash";

type SortTypes = "titleAsc" | "titleDesc" | "lastChanged";
const sortTypes: SortTypes[] = ["titleAsc", "titleDesc", "lastChanged"];
const itemPerPage = 5;

interface Props {
  informationModels: InformationModel[];
  catalogId: string;
  hasWritePermission: boolean;
  hasAdminPermission: boolean;
  pageSettings?: InformationModelsPageSettings;
}

const InformationModelsPageClient = ({
  informationModels,
  catalogId,
  hasWritePermission,
  pageSettings,
}: Props) => {
  const defaultSearchTerm = useMemo(() => pageSettings?.search ?? "", []);
  const defaultFilterPublicationState = useMemo(
    () => pageSettings?.filter?.pubState ?? [],
    [],
  );
  const defaultSortValue = useMemo(() => pageSettings?.sort ?? "", []);
  const defaultPage = useMemo(() => pageSettings?.page ?? 0, []);

  const [searchTerm, setSearchTerm] = useQueryState("informationModelSearch", {
    defaultValue: defaultSearchTerm,
  });
  const [filterPublicationState, setFilterPublicationState] = useQueryState(
    "informationModelFilter.pubState",
    parseAsArrayOf(parseAsString).withDefault(defaultFilterPublicationState),
  );
  const [sortValue, setSortValue] = useQueryState("informationModelSort", {
    defaultValue: defaultSortValue,
  });
  const [page, setPage] = useQueryState(
    "informationModelPage",
    parseAsInteger.withDefault(defaultPage),
  );
  const [filteredInformationModels, setFilteredInformationModels] =
    useState<InformationModel[]>(informationModels);

  const getSortFunction = useMemo(() => {
    return (sortKey: SortTypes) => {
      switch (sortKey) {
        case "titleAsc":
          return (a: InformationModel, b: InformationModel) =>
            sortAscending(getTranslateText(a.title), getTranslateText(b.title));
        case "titleDesc":
          return (a: InformationModel, b: InformationModel) =>
            sortDescending(
              getTranslateText(a.title),
              getTranslateText(b.title),
            );
        case "lastChanged":
          return (a: InformationModel, b: InformationModel) =>
            sortDateStringsDescending(
              a.lastModified || "",
              b.lastModified || "",
            );
        default:
          return () => 0;
      }
    };
  }, []);

  const removeFilter = (filterName: string) => {
    setFilterPublicationState(
      filterPublicationState?.filter((name) => name !== filterName) ?? [],
    );
    setPage(0);
  };

  useEffect(() => {
    const settings = {
      search: searchTerm,
      sort: sortValue,
      page,
      filter: {
        pubState: filterPublicationState,
        status: null,
      },
    };
    setClientInformationModelsPageSettings(settings);
  }, [page, searchTerm, sortValue, filterPublicationState]);

  useEffect(() => {
    const filterAndSortInformationModels = () => {
      let filtered = informationModels;

      if (!isEmpty(filterPublicationState)) {
        filtered = filtered.filter((informationModel) => {
          return filterPublicationState?.includes(
            informationModel?.published ? "published" : "unpublished",
          );
        });
      }

      if (searchTerm) {
        const lowercasedQuery = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (informationModel) =>
            getTranslateText(informationModel?.title)
              .toLowerCase()
              .includes(lowercasedQuery) ||
            getTranslateText(informationModel?.description)
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

      setFilteredInformationModels(filtered);
    };
    filterAndSortInformationModels();
  }, [
    informationModels,
    filterPublicationState,
    searchTerm,
    sortValue,
    getSortFunction,
  ]);

  const hasActiveFilters = !isEmpty(filterPublicationState);

  const totalPages = Math.ceil(filteredInformationModels.length / itemPerPage);

  const paginatedInformationModels = useMemo(() => {
    const startIndex = page ? page * itemPerPage : 0;
    const endIndex = startIndex + itemPerPage;
    return filteredInformationModels.slice(startIndex, endIndex);
  }, [filteredInformationModels, page]);

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
                data-size="sm"
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
                <option value="lastChanged">
                  {localization.search.sortOptions.LAST_UPDATED_FIRST}
                </option>
              </Select>
            </div>
            <div className={styles.buttons}>
              {hasWritePermission && (
                <LinkButton
                  href={`/catalogs/${catalogId}/information-models/new`}
                >
                  <PlusCircleIcon />
                  {
                    localization.informationModelCatalog.button
                      .newInformationModel
                  }
                </LinkButton>
              )}
            </div>
          </div>
          {hasActiveFilters && (
            <div className={styles.chips}>
              {filterPublicationState?.map((filter) => (
                <Chip.Removable
                  key={`published-${filter}`}
                  aria-label={`Fjern filter for publisering ${filter}`}
                  onClick={() => removeFilter(filter)}
                >
                  {filter === "published"
                    ? localization.publicationState.published
                    : localization.publicationState.unpublished}
                </Chip.Removable>
              ))}
            </div>
          )}
        </SearchHitsLayout.SearchRow>
        <SearchHitsLayout.LeftColumn>
          <SearchFilter />
        </SearchHitsLayout.LeftColumn>
        <SearchHitsLayout.MainColumn>
          <SearchHitContainer
            searchHits={
              paginatedInformationModels.length > 0 ? (
                <ul className={styles.searchHits} role="list">
                  {paginatedInformationModels.map(
                    (informationModel: InformationModel) => (
                      <li role="listitem" key={informationModel.id}>
                        <SearchHit
                          title={getTranslateText(informationModel?.title)}
                          description={getTranslateText(
                            informationModel?.description,
                          )}
                          titleHref={`/catalogs/${catalogId}/information-models/${informationModel?.id}`}
                          content={
                            <div className={styles.set}>
                              {informationModel.lastModified && (
                                <>
                                  <p>
                                    {localization.lastChanged}{" "}
                                    {formatDate(
                                      dateStringToDate(
                                        informationModel.lastModified,
                                      ),
                                    )}
                                  </p>
                                  <span>•</span>
                                </>
                              )}
                              {informationModel.published
                                ? localization.publicationState.publishedInFDK
                                : localization.publicationState.unpublished}
                            </div>
                          }
                        />
                      </li>
                    ),
                  )}
                </ul>
              ) : null
            }
            noSearchHits={
              !paginatedInformationModels ||
              paginatedInformationModels.length === 0
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

export default InformationModelsPageClient;
