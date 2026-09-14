"use client";

import { memo } from "react";
import { localization as loc } from "@catalog-frontend/utils";
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
} from "@catalog-frontend/ui";
import { Card } from "@digdir/designsystemet-react";

export type PublishedFilterType = "published" | "unpublished";

const SearchFilter = () => {
  const [pageState, setPageState] = useQueryState(
    "informationModelPage",
    parseAsInteger.withDefault(0),
  );
  const [filterPublicationState, setFilterPublicationState] = useQueryState(
    "informationModelFilter.pubState",
    parseAsArrayOf(parseAsString),
  );

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

  const handlePublicationOnChange = (names: string[]) => {
    setFilterPublicationState(names.map((name) => name as PublishedFilterType));
    setPageDefault();
  };

  const accordionItemContents: AccordionItemProps[] = [
    {
      header: loc.publicationState.state,
      content: (
        <CheckboxGroupFilter<PublishedFilterType>
          items={publicationStateItems}
          onChange={handlePublicationOnChange}
          value={(filterPublicationState as PublishedFilterType[]) ?? []}
        />
      ),
    },
  ];

  return (
    <Card className={styles.searchFilter}>
      {accordionItemContents.map((item) => (
        <AccordionItem key={item.header as string} {...item} />
      ))}
    </Card>
  );
};

export default memo(SearchFilter);
