import { Accordion } from '@digdir/design-system-react';
import { memo } from 'react';
import { action, useSearchDispatch } from '../../context/search';
import { PublishedFilterType, StatusFilterType } from '../../context/search/state';
import { hashCode, localization as loc } from '@catalog-frontend/utils';
import styles from './side-filter.module.css';
import { CheckboxGroupFilter } from './checkbox-group-filter';
import { AccordionItem, AccordionItemProps } from './accordion-item';
import { Select } from '@catalog-frontend/ui';

const SideFilter = () => {
  const searchDispatch = useSearchDispatch();

  const statusItems = [
    { value: 'utkast' as StatusFilterType, label: loc.statusType.draft },
    { value: 'høring' as StatusFilterType, label: loc.statusType.hearing },
    { value: 'godkjent' as StatusFilterType, label: loc.statusType.approved },
  ];
  const nameAndConceptItems = [
    { value: 'Egenskapsnavn', label: 'Egenskapsnavn' },
    { value: 'Forretningsbegrep', label: 'Forretningsbegrep' },
  ];
  const publicationStateItems = [
    { value: 'published' as PublishedFilterType, label: loc.publicationStateType.published },
    { value: 'unpublished' as PublishedFilterType, label: loc.publicationStateType.unpublished },
  ];

  const handleOnStatusChange = (names: string[]) => {
    searchDispatch(
      action('SET_CONCEPT_STATUS', { filters: { status: names.map((name) => name as StatusFilterType) } }),
    );
  };

  const handleOnNameAndConceptChange = (names: string[]) =>
    searchDispatch(action('SET_NAME_AND_CONCEPT', { filters: {} }));

  const handlePublicationOnChange = (names: string[]) =>
    searchDispatch(
      action('SET_PUBLICATION_STATE', { filters: { published: names.map((name) => name as PublishedFilterType) } }),
    );

  const accordionItemContents: AccordionItemProps[] = [
    {
      header: loc.subjectArea,
      content: <div>Accordion content</div>,
    },
    {
      header: loc.conceptStatus,
      content: (
        <CheckboxGroupFilter<StatusFilterType>
          items={statusItems}
          filterName='status'
          onChange={handleOnStatusChange}
        />
      ),
    },
    {
      header: loc.assigned,
      content: (
        <Select
          label={loc.search.searchField}
          options={['TODO1', 'TODO2', 'TODO3'].map((item) => ({ label: item, value: item }))}
          onChange={() => 'TODO'}
          value={'TODO'}
          hideLabel={true}
        />
      ),
    },
    {
      header: loc.publicationState,
      content: (
        <>
          <p>
            {loc.publicationStateDescription}
            <br />
            <br />
          </p>
          <CheckboxGroupFilter<PublishedFilterType>
            items={publicationStateItems}
            filterName='published'
            onChange={handlePublicationOnChange}
          />
        </>
      ),
    },
    {
      header: loc.nameAndConcept,
      content: (
        <CheckboxGroupFilter<string>
          items={nameAndConceptItems}
          filterName='nameAndConcept'
          onChange={handleOnNameAndConceptChange}
        />
      ),
    },
  ];

  const accordionItems = accordionItemContents.map((item) => (
    <AccordionItem
      key={`accordion-item-${hashCode(item.header)}`}
      {...item}
    />
  ));

  return (
    <div className={styles.sideFilter}>
      <Accordion
        border={true}
        className={styles.accordion}
      >
        {accordionItems}
      </Accordion>
    </div>
  );
};

export default memo(SideFilter);
