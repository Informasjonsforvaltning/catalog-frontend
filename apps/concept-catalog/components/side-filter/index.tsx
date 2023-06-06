import { Accordion, CheckboxGroup } from '@digdir/design-system-react';
import { ReactNode, memo } from 'react';
import { localization } from '@catalog-frontend/utils';
import styles from './side-filter.module.css';
import { useSearchDispatch, useSearchState } from '../../context/search';
import { PublishedFilterType } from '../../context/search/state';

type AccordionItem = {
  header: string;
  content: ReactNode;
};

const SideFilter = () => {
  const searchState = useSearchState();
  const searchDispatch = useSearchDispatch();
  const handleOnPublishedChange = (names: string[]) => {
    searchDispatch({
      type: 'SET_PUBLISHED',
      payload: { filters: { published: names.map((name) => name as PublishedFilterType) } },
    });
  };

  const accordionItemContents: AccordionItem[] = [
    {
      header: localization.subjectArea,
      content: <div>Accordion content</div>,
    },
    {
      header: localization.conceptStatus,
      content: <div>Accordion content</div>,
    },
    {
      header: localization.assigned,
      content: <div>Accordion content</div>,
    },
    {
      header: localization.publicationState,
      content: (
        <>
          <p>
            {localization.publicationStateDescription}
            <br />
            <br />
          </p>
          <CheckboxGroup
            items={[
              {
                label: localization.search.filter.published,
                name: 'published',
                checked: searchState.filters.published?.includes('published'),
              },
              {
                label: localization.search.filter.notPublished,
                name: 'unpublished',
                checked: searchState.filters.published?.includes('notPublished'),
              },
            ]}
            onChange={handleOnPublishedChange}
          />
        </>
      ),
    },
    {
      header: localization.nameAndConcept,
      content: <div>Accordion content</div>,
    },
  ];

  const accordionItems = accordionItemContents.map((item, i) => {
    return (
      <Accordion.Item
        key={`filter-accordion-header-${i}`}
        className={i === 0 && styles.accordionFirstItem}
      >
        <Accordion.Header>{item.header}</Accordion.Header>
        <Accordion.Content>{item.content}</Accordion.Content>
      </Accordion.Item>
    );
  });

  return (
    <div className={styles.sideFilter}>
      <Accordion className={styles.accordion}>{accordionItems}</Accordion>
    </div>
  );
};

export default memo(SideFilter);
