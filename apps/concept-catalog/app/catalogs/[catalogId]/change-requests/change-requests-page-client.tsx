"use client";

import cn from "classnames";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { Heading, Tabs } from "@digdir/designsystemet-react";
import {
  ChangeRequestStatusTagProps,
  LinkButton,
  SearchField,
  SearchHitsLayout,
  Select,
  Tag,
} from "@catalog-frontend/ui-v2";
import {
  capitalizeFirstLetter,
  convertTimestampToDateAndTime,
  localization,
  setClientChangeRequestsPageSettings,
  sortAscending,
  sortDescending,
  validOrganizationNumber,
  validUUID,
} from "@catalog-frontend/utils";
import ChangeRequestFilter from "@concept-catalog/components/change-request-filter";
import { getTranslatedStatus } from "@concept-catalog/utils/change-request";
import {
  ChangeRequest,
  ChangeRequestsPageSettings,
  Option,
} from "@catalog-frontend/types";
import { useFeatureFlags } from "@concept-catalog/context/feature-flags";
import styles from "./change-requests-page.module.css";
import { useEffect, useMemo } from "react";

type Props = {
  catalogId: string;
  data: ChangeRequest[];
  pageSettings?: ChangeRequestsPageSettings;
};

export const ChangeRequestsPageClient = ({
  catalogId,
  data,
  pageSettings,
}: Props) => {
  const itemTypeOptions = [
    {
      label: localization.changeRequest.changeRequest,
      value: "changeRequest",
    },
    {
      label: localization.suggestionForNewConcept,
      value: "suggestionForNewConcept",
    },
  ];

  const statusOptions = [
    {
      label: localization.changeRequest.status.open,
      value: "open",
    },
    {
      label: localization.changeRequest.status.accepted,
      value: "accepted",
    },
    {
      label: localization.changeRequest.status.rejected,
      value: "rejected",
    },
  ];

  const sortOptions = Object.entries(
    localization.changeRequest.sortOptions ?? {},
  ).map(([key, value]) => ({
    label: value as string,
    value: key,
  }));

  const router = useRouter();
  const { activityLogEnabled } = useFeatureFlags();

  // Memoize default values for query states
  const defaultSelectedSortOption = useMemo(
    () => pageSettings?.sort ?? "TIME_FOR_PROPOSAL_DESC",
    [],
  );
  const defaultSearchTerm = useMemo(() => pageSettings?.search ?? "", []);
  const defaultFilterStatus = useMemo(
    () => pageSettings?.filter?.status ?? [],
    [],
  );
  const defaultFilterItemType = useMemo(
    () => pageSettings?.filter?.itemType ?? itemTypeOptions[0].value,
    [],
  );

  const [searchTerm, setSearchTerm] = useQueryState("changeRequestSearch", {
    defaultValue: defaultSearchTerm,
  });
  const [filterItemType, setFilterItemType] = useQueryState(
    "changeRequestFilter.itemType",
    parseAsString.withDefault(defaultFilterItemType),
  );
  const [filterStatus, setFilterStatus] = useQueryState(
    "changeRequestFilter.status",
    parseAsArrayOf(parseAsString).withDefault(defaultFilterStatus),
  );
  const [sort, setSort] = useQueryState(
    "changeRequestSort",
    parseAsString.withDefault(defaultSelectedSortOption),
  );

  const onItemTypeChange = (value: string) => {
    setFilterItemType(value);
  };

  const onStatusChange = (values: string[]) => {
    setFilterStatus(values);
  };

  const onSortChange = (e) => {
    setSort(e.target.value);
  };

  const itemType = {
    options: itemTypeOptions,
    selected: filterItemType,
    onChange: onItemTypeChange,
  };

  const status = {
    options: statusOptions,
    selected: filterStatus,
    onChange: onStatusChange,
  };

  let listItems: ChangeRequest[];
  if (filterItemType === "changeRequest") {
    listItems = data.filter((item) => item.conceptId !== null);
  } else if (filterItemType === "suggestionForNewConcept") {
    listItems = data.filter((item) => item.conceptId === null);
  } else {
    listItems = data;
  }

  if (searchTerm) {
    const lowercasedQuery = searchTerm.toLowerCase();
    listItems = listItems.filter((item) =>
      item?.title.toLowerCase().includes(lowercasedQuery),
    );
  }

  if (filterStatus && filterStatus.length > 0) {
    listItems = listItems.filter((item) =>
      filterStatus.includes(item.status.toLowerCase()),
    );
  }

  switch (sort) {
    case "TIME_FOR_PROPOSAL_ASC":
      listItems = listItems.sort((a, b) =>
        sortAscending(a.timeForProposal ?? "", b.timeForProposal ?? ""),
      );
      break;
    case "TIME_FOR_PROPOSAL_DESC":
      listItems = listItems.sort((a, b) =>
        sortDescending(a.timeForProposal ?? "", b.timeForProposal ?? ""),
      );
      break;
    case "TITLE_ASC":
      listItems = listItems.sort((a, b) =>
        sortAscending(a.title.toLowerCase(), b.title.toLowerCase()),
      );
      break;
    case "TITLE_DESC":
      listItems = listItems.sort((a, b) =>
        sortDescending(a.title.toLowerCase(), b.title.toLowerCase()),
      );
      break;
    default:
      break;
  }

  useEffect(() => {
    const settings: ChangeRequestsPageSettings = {
      search: searchTerm,
      sort,
      filter: {
        status: filterStatus,
        itemType: filterItemType,
      },
    };
    setClientChangeRequestsPageSettings(settings);
  }, [searchTerm, sort, filterStatus, filterItemType]);

  return (
    <div className="container">
      <Tabs
        className={styles.tabs}
        defaultValue="changeRequestTab"
        data-size="md"
      >
        <Tabs.List className={styles.tabsList}>
          <Tabs.Tab
            value="conceptTab"
            onClick={() => router.push(`/catalogs/${catalogId}/concepts`)}
          >
            {localization.concept.concepts}
          </Tabs.Tab>
          <Tabs.Tab value="changeRequestTab">
            {localization.changeRequest.changeRequest}
          </Tabs.Tab>
          {activityLogEnabled && (
            <Tabs.Tab
              value="activityLogTab"
              onClick={() => router.push(`/catalogs/${catalogId}/activity-log`)}
            >
              {localization.activityLog.title}
            </Tabs.Tab>
          )}
        </Tabs.List>
        <Tabs.Panel value="changeRequestTab" className={styles.tabsContent}>
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
                    }}
                  />
                  <Select onChange={onSortChange} value={sort} data-size="sm">
                    {sortOptions.map((option: Option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <LinkButton href={`/catalogs/${catalogId}/change-requests/new`}>
                  {localization.suggestionForNewConcept}
                </LinkButton>
              </div>
            </SearchHitsLayout.SearchRow>
            <SearchHitsLayout.LeftColumn>
              <ChangeRequestFilter itemType={itemType} status={status} />
            </SearchHitsLayout.LeftColumn>
            <SearchHitsLayout.MainColumn>
              {listItems && listItems.length !== 0 ? (
                <div className={styles.listWrapper}>
                  <ul className={styles.list}>
                    {listItems.map(
                      ({
                        id,
                        title,
                        catalogId,
                        timeForProposal,
                        proposedBy,
                        status,
                      }) => (
                        <li
                          key={id}
                          itemID={id ?? ""}
                          title={catalogId}
                          className={styles.listItem}
                        >
                          <div className={styles.listContent}>
                            <div>
                              <Heading level={3} data-size="xs">
                                <Link
                                  prefetch={false}
                                  href={
                                    validOrganizationNumber(catalogId) &&
                                    validUUID(id) &&
                                    listItems.find(
                                      ({ id: changeRequestId }) =>
                                        changeRequestId === id,
                                    )
                                      ? `/catalogs/${catalogId}/change-requests/${id}`
                                      : "#"
                                  }
                                  className={
                                    title
                                      ? styles.heading
                                      : cn(styles.heading, styles.noName)
                                  }
                                >
                                  {title ||
                                    `(${localization.changeRequest.noName})`}
                                </Link>
                              </Heading>
                              <div className={styles.text}>
                                <p>
                                  {localization.created}:{" "}
                                  {convertTimestampToDateAndTime(
                                    timeForProposal ?? "",
                                  )}{" "}
                                  {localization.by}{" "}
                                  {(proposedBy?.name ?? "")
                                    .split(" ")
                                    .map((namePart) =>
                                      capitalizeFirstLetter(namePart),
                                    )
                                    .join(" ")}
                                </p>
                              </div>
                            </div>
                            {status && (
                              <div className={styles.status}>
                                <Tag.ChangeRequestStatus
                                  statusKey={status}
                                  statusLabel={
                                    getTranslatedStatus(
                                      status,
                                    ) as ChangeRequestStatusTagProps["statusLabel"]
                                  }
                                />
                              </div>
                            )}
                          </div>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              ) : (
                <div className={styles.noHits}>
                  <p>{localization.changeRequest.noHits}</p>
                </div>
              )}
            </SearchHitsLayout.MainColumn>
          </SearchHitsLayout>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default ChangeRequestsPageClient;
