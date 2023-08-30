import { memo, useState } from 'react';
import { useRouter } from 'next/router';
import { Accordion } from '@digdir/design-system-react';
import { Select } from '@catalog-frontend/ui';
import { AssignedUser, CodeList, InternalField, Status } from '@catalog-frontend/types';
import { convertCodeListToTreeNodes, getTranslateText, localization as loc } from '@catalog-frontend/utils';
import { action, useSearchDispatch, useSearchState } from '../../context/search';
import { PublishedFilterType } from '../../context/search/state';
import styles from './search-filter.module.css';
import { CheckboxGroupFilter } from './checkbox-group-filter';
import { AccordionItem, AccordionItemProps } from '../accordion-item';
import { useGetUsers } from '../../hooks/users';
import { CheckboxTreeFilter } from './checkbox-tree-filter';

interface Props {
  internalFields?: InternalField[];
  subjectCodeList?: CodeList;
}

const SearchFilter = ({ internalFields, subjectCodeList }: Props) => {
  const router = useRouter();
  const catalogId = `${router.query?.catalogId}`;
  const searchDispatch = useSearchDispatch();
  const searchState = useSearchState();
  const assignedUserState = searchState.filters.assignedUser;
  const subjectState = searchState.filters.subject;

  const statusItems = [
    { value: 'utkast' as Status, label: loc.status.draft },
    { value: 'høring' as Status, label: loc.status.hearing },
    { value: 'godkjent' as Status, label: loc.status.approved },
  ];
  const publicationStateItems = [
    { value: 'published' as PublishedFilterType, label: loc.publicationState.published },
    { value: 'unpublished' as PublishedFilterType, label: loc.publicationState.unpublished },
  ];

  const { data: getUsers } = useGetUsers(catalogId);
  const assignedUserItems: AssignedUser[] = getUsers?.users;

  const handleOnStatusChange = (names: string[]) => {
    searchDispatch(action('SET_CONCEPT_STATUS_FILTER', { filters: { status: names.map((name) => name as Status) } }));
  };

  const handlePublicationOnChange = (names: string[]) =>
    searchDispatch(
      action('SET_PUBLICATION_STATE_FILTER', {
        filters: { published: names.map((name) => name as PublishedFilterType) },
      }),
    );

  const handleOnAssignedChange = (userId: string) => {
    const assignedUser: AssignedUser = assignedUserItems.find((item) => item.id === userId);
    searchDispatch(action('SET_ASSIGNED_USER_FILTER', { filters: { assignedUser } }));
  };

  const handleInternalFieldChange = (fieldId: string, value: string[]) => {
    searchDispatch(
      action('SET_INTERNAL_FIELDS_FILTER', {
        filters: {
          internalFields: {
            ...searchState.filters.internalFields,
            ...{
              [fieldId]: value,
            },
          },
        },
      }),
    );
  };

  const handleSubjectOnCheck = (values: string[]) => {
    searchDispatch(action('SET_SUBJECTS_FILTER', { filters: { subject: values } }));
  };

  const accordionItemContents: AccordionItemProps[] = [
    {
      header: loc.subjectArea,
      content: (
        <CheckboxTreeFilter
          nodes={convertCodeListToTreeNodes(subjectCodeList)}
          onCheck={handleSubjectOnCheck}
          filters={subjectState}
        />
      ),
    },
    {
      header: loc.conceptStatus,
      content: (
        <CheckboxGroupFilter<Status>
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
          options={
            assignedUserItems ? [...assignedUserItems.map((item) => ({ label: item.name, value: item.id }))] : []
          }
          onChange={handleOnAssignedChange}
          value={assignedUserState?.id}
        />
      ),
    },
    {
      header: loc.publicationState.state,
      content: (
        <>
          <p>
            {loc.publicationState.description}
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
    ...internalFields
      .filter((field) => field.enableFilter && field.type === 'boolean')
      .map((field) => ({
        header: getTranslateText(field.label),
        content: (
          <CheckboxGroupFilter<string>
            items={[
              {
                value: 'true',
                label: loc.yes,
              },
              {
                value: 'false',
                label: loc.no,
              },
            ]}
            filterName={field.id}
            onChange={(value) => handleInternalFieldChange(field.id, value)}
          />
        ),
      })),
  ];

  const accordionItems = accordionItemContents.map((item) => (
    <AccordionItem
      key={`accordion-item-${item.header}`}
      {...item}
    />
  ));

  return (
    <div className={styles.searchFilter}>
      <Accordion
        border={true}
        className={styles.accordion}
      >
        {accordionItems}
      </Accordion>
    </div>
  );
};

export default memo(SearchFilter);
