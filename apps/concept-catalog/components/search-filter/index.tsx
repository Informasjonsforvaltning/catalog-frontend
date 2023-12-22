'use client';

import { memo } from 'react';
import { Accordion } from '@digdir/design-system-react';
import { Select } from '@catalog-frontend/ui';
import { AssignedUser, CodeList, InternalField, ReferenceDataCode } from '@catalog-frontend/types';
import {
  capitalizeFirstLetter,
  convertCodeListToTreeNodes,
  getTranslateText,
  localization as loc,
} from '@catalog-frontend/utils';
import styles from './search-filter.module.css';
import { CheckboxGroupFilter } from './checkbox-group-filter';
import { AccordionItem, AccordionItemProps } from '../accordion-item';
import { useGetUsers } from '../../hooks/users';
import { CheckboxTreeFilter } from './checkbox-tree-filter';
import { parseAsArrayOf, parseAsInteger, parseAsJson, parseAsString, useQueryState } from 'next-usequerystate';

export type PublishedFilterType = 'published' | 'unpublished';
export type InternalFieldFilterType = {
  id: string;
  value: string;
};
interface Props {
  internalFields?: InternalField[];
  subjectCodeList?: CodeList;
  conceptStatuses?: ReferenceDataCode[];
  catalogId: string;
}

const SearchFilter = ({ catalogId, internalFields, subjectCodeList, conceptStatuses }: Props) => {
  const [, setPage] = useQueryState('page', parseAsInteger);
  const [filterStatus, setFilterStatus] = useQueryState('filter.status', parseAsArrayOf(parseAsString));
  const [filterPublicationState, setFilterPublicationState] = useQueryState(
    'filter.pubState',
    parseAsArrayOf(parseAsString),
  );
  const [filterAssignedUser, setFilterAssignedUser] = useQueryState('filter.assignedUser');
  const [filterInternalFields, setFilterInternalFields] = useQueryState(
    'filter.internalFields',
    parseAsJson<Record<string, string[]>>(),
  );
  const [filterSubject, setFilterSubject] = useQueryState('filter.subject', parseAsArrayOf(parseAsString));

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
    setFilterStatus(names.map((name) => name));
    setPage(0);
  };

  const handlePublicationOnChange = (names: string[]) => {
    setFilterPublicationState(names.map((name) => name as PublishedFilterType));
    setPage(0);
  };

  const handleOnAssignedChange = (userId: string) => {
    const assignedUser: AssignedUser | undefined = assignedUserItems.find((item) => item.id === userId);
    setFilterAssignedUser(assignedUser?.id ?? '');
    setPage(0);
  };

  const handleInternalFieldChange = (fieldId: string, value: string[]) => {
    setFilterInternalFields({
      ...filterInternalFields,
      ...{
        [fieldId]: value,
      },
    });
    setPage(0);
  };

  const handleSubjectOnCheck = (values: string[]) => {
    setFilterSubject(values);
    setPage(0);
  };

  const accordionItemContents: AccordionItemProps[] = [
    ...(subjectCodeList?.codes?.length
      ? [
          {
            header: loc.subjectArea,
            content: (
              <CheckboxTreeFilter
                nodes={convertCodeListToTreeNodes(subjectCodeList?.codes)}
                onCheck={handleSubjectOnCheck}
                filters={filterSubject ?? []}
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
                onChange={handleOnStatusChange}
                value={filterStatus ?? []}
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
                  assignedUserItems
                    ? [...assignedUserItems.map((item) => ({ label: item.name ?? '', value: item.id ?? '' }))]
                    : []
                }
                onChange={handleOnAssignedChange}
                value={filterAssignedUser ?? ''}
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
            onChange={handlePublicationOnChange}
            value={filterPublicationState ?? []}
          />
        </>
      ),
    },
    ...(internalFields ?? [])
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
            onChange={(value) => handleInternalFieldChange(field.id, value)}
            value={filterInternalFields?.[field.id] ?? []}
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
