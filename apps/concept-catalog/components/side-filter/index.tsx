import { FC, memo, useState } from 'react';
import { Accordion, TextField } from '@digdir/design-system-react';
import { Select } from '@catalog-frontend/ui';
import { hashCode, localization as loc } from '@catalog-frontend/utils';
import { Tree } from 'react-arborist';
import { action, useSearchDispatch } from '../../context/search';
import { PublishedFilterType, StatusFilterType } from '../../context/search/state';
import { CheckboxGroupFilter } from './checkbox-group-filter';
import { AccordionItem, AccordionItemProps } from './accordion-item';
import styles from './side-filter.module.css';

const SideFilter = () => {
  const searchDispatch = useSearchDispatch();
  const [fagomraadeTerm, setFagomraadeTerm] = useState('');

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

  const fagomraadeData = [
    { id: '1', name: 'Unread' },
    { id: '2', name: 'Threads' },
    {
      id: '3',
      name: 'Chat Rooms',
      children: [
        { id: 'c1', name: 'General' },
        { id: 'c2', name: 'Random' },
        { id: 'c3', name: 'Open Source Projects' },
      ],
    },
    {
      id: '4',
      name: 'Direct Messages',
      children: [
        { id: 'd1', name: 'Alice' },
        { id: 'd2', name: 'Bob' },
        { id: 'd3', name: 'Charlie' },
      ],
    },
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

  const FagomraadeFilter = () => {
    return (
      <div key={'fagomraadeFilterTermDiv'}>
        <TextField
          key={'fagomraadeFilterTerm'}
          value={fagomraadeTerm}
          onChange={(e) => {
            e.preventDefault();
            setFagomraadeTerm(e.target.value);
          }}
        />
        <Tree
          key={'fagomraadeFilterTree'}
          data={fagomraadeData}
          searchTerm={fagomraadeTerm}
          searchMatch={(node, term) => node.data.name.toLowerCase().includes(term.toLowerCase())}
        />
      </div>
    );
  };

  const accordionItemContents: AccordionItemProps[] = [
    {
      header: loc.subjectArea,
      content: <FagomraadeFilter />,
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
