'use client';

import { memo } from 'react';
import { useRouter } from 'next/navigation';
import { Accordion } from '@digdir/design-system-react';
import { Select } from '@catalog-frontend/ui';
import { AssignedUser, CodeList, InternalField, ReferenceDataCode } from '@catalog-frontend/types';
import {
  capitalizeFirstLetter,
  convertCodeListToTreeNodes,
  getTranslateText,
  localization as loc,
} from '@catalog-frontend/utils';
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
  conceptStatuses?: ReferenceDataCode[];
}

const SearchFilter = ({ internalFields, subjectCodeList, conceptStatuses }: Props) => {
  const router = useRouter();
  const catalogId = `${router.query?.catalogId}`;
  const searchDispatch = useSearchDispatch();
  const searchState = useSearchState();
  const assignedUserState = searchState.filters.assignedUser;
  const subjectState = searchState.filters.subject;

  const statusItems =
    conceptStatuses?.map((s) => ({
      value: s.uri,
      label: capitalizeFirstLetter(getTranslateText(s.label) as string),
    })) ?? [];
  const publicationStateItems = [
    { value: 'published' as PublishedFilterType, label: loc.publicationState.published },
    { value: 'unpublished' as PublishedFilterType, label: loc.publicationState.unpublished },
  ];

  const { data: getUsers } = useGetUsers(catalogId);
  const assignedUserItems: AssignedUser[] = getUsers?.users;

  const handleOnStatusChange = (names: string[]) => {
    searchDispatch(action('SET_CONCEPT_STATUS_FILTER', { filters: { status: names.map((name) => name as string) } }));
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
    ...(subjectCodeList?.codes.length > 0
      ? [
          {
            header: loc.subjectArea,
            content: (
              <CheckboxTreeFilter
                nodes={convertCodeListToTreeNodes(subjectCodeList?.codes)}
                onCheck={handleSubjectOnCheck}
                filters={subjectState}
              />
            ),
          },
        ]
      : []),
    ...(statusItems?.length > 0
      ? [
          {
            header: loc.conceptStatus,
            content: (
              <CheckboxGroupFilter<string>
                items={statusItems}
                filterName='status'
                onChange={handleOnStatusChange}
              />
            ),
          },
        ]
      : []),
    ...(assignedUserItems?.length > 0
      ? [
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
        ]
      : []),
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
            filterName={`internalFields.${field.id}`}
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
