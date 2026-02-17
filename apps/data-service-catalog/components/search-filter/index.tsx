"use client";

import { memo } from "react";
import { ReferenceDataCode } from "@catalog-frontend/types";
import {
  capitalizeFirstLetter,
  getTranslateText,
  localization as loc,
} from "@catalog-frontend/utils";
import styles from "./search-filter.module.css";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs";
import {
  AccordionItem,
  AccordionItemProps,
  CheckboxGroupFilter,
} from "@catalog-frontend/ui-v2";
import { Card } from "@digdir/designsystemet-react";

export type PublishedFilterType = "published" | "unpublished";

interface Props {
  distributionStatuses?: ReferenceDataCode[];
}

const SearchFilter = ({ distributionStatuses }: Props) => {
  const [pageState, setPageState] = useQueryState(
    "dataServicePage",
    parseAsInteger.withDefault(0),
  );
  const [filterStatus, setFilterStatus] = useQueryState(
    "dataServiceFilter.status",
    parseAsArrayOf(parseAsString),
  );
  const [filterPublicationState, setFilterPublicationState] = useQueryState(
    "dataServiceFilter.pubState",
    parseAsArrayOf(parseAsString),
  );

  const statusItems =
    distributionStatuses?.map((s) => ({
      value: s.uri,
      label: capitalizeFirstLetter(getTranslateText(s.label)),
    })) ?? [];

  const publicationStateItems = [
    {
      value: "published" as PublishedFilterType,
      label: loc.publicationState.published,
    },
    {
      value: "unpublished" as PublishedFilterType,
      label: loc.publicationState.unpublished,
    },
  ];

  const setPageDefault = () => {
    if (pageState != 0) {
      setPageState(0);
    }
  };

  const handleOnStatusChange = (names: string[]) => {
    setFilterStatus(names.map((name) => name));
    setPageDefault();
  };

  const handlePublicationOnChange = (names: string[]) => {
    setFilterPublicationState(names.map((name) => name as PublishedFilterType));
    setPageDefault();
  };

  const accordionItemContents: AccordionItemProps[] = [
    ...(statusItems?.length > 0
      ? [
          {
            header: loc.status,
            content: (
              <CheckboxGroupFilter<string>
                items={statusItems}
                onChange={handleOnStatusChange}
                value={filterStatus ?? []}
              />
            ),
          },
        ]
      : []),
    {
      header: loc.publicationState.state,
      content: (
        <>
          <p>
            {loc.publicationState.descriptionDataService}
            <br />
            <br />
          </p>
          <CheckboxGroupFilter<PublishedFilterType>
            items={publicationStateItems}
            onChange={handlePublicationOnChange}
            value={filterPublicationState ?? []}
          />
        </>
      ),
    },
  ];

  const accordionItems = accordionItemContents.map((item) => (
    <AccordionItem
      key={`accordion-item-${item.header}`}
      initiallyOpen={true}
      {...item}
    />
  ));

  return (
    <Card className={styles.searchFilter}>
      <div>{accordionItems}</div>
    </Card>
  );
};

export default memo(SearchFilter);
