import React, { useRef, useState } from 'react';
import styles from './internal-fields.module.css';
import { Accordion, Checkbox, Heading, TextField } from '@digdir/design-system-react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BreadcrumbType, Breadcrumbs, Button, Select } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { CodeList, InternalField, FieldType, SelectOption } from '@catalog-frontend/types';
import { useRouter } from 'next/router';
import { textRegexWithNumbers } from '@catalog-frontend/utils';

import {
  useGetInternalFields,
  useCreateInternalField,
  useDeleteInternalField,
  useUpdateInternalField,
} from '../../../../../hooks/internal-fields';
import { useGetAllCodeLists } from '../../../../../hooks/code-lists';
import { compare } from 'fast-json-patch';
import { Banner } from '../../../../../components/banner';

const fieldTypeOptions: { [key: string]: SelectOption } = {
  shortText: { label: 'Kort tekst', value: 'text_short' },
  longText: { label: 'Lang tekst', value: 'text_long' },
  boolean: { label: 'Boolsk verdi', value: 'boolean' },
  codelist: { label: 'Kodeliste', value: 'code_list' },
};

export const InternalFieldsPage = () => {
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';

  const { data: getInternalFields } = useGetInternalFields(catalogId);
  const dbFields = getInternalFields?.internal;
  const { data: getAllCodeLists } = useGetAllCodeLists({ catalogId });
  const dbCodeLists: CodeList[] = getAllCodeLists?.codeLists;
  const createInternalField = useCreateInternalField(catalogId);
  const deleteInternalField = useDeleteInternalField(catalogId);
  const updateInternalField = useUpdateInternalField(catalogId);
  const [accordionIsOpen, setAccordionIsOpen] = useState(false);
  const [checkboxState, setCheckboxState] = useState(false);

  const getNextFieldNumber = (fields: InternalField[]): number => (fields ? fields.length : 0) + 1;

  const newField: InternalField = {
    label: { nb: `Nytt felt ${getNextFieldNumber(dbFields)}` },
    type: 'boolean',
    location: 'main_column',
    description: { nb: 'Nytt felt beskrivelse' },
  };

  const newAccordionRef = useRef(null);

  const handleCreateInternalField = () => {
    createInternalField.mutate(newField, {
      onSuccess: () => {
        setAccordionIsOpen(true);
        newAccordionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      },
    });
  };

  const [updatedFieldsList, setUpdatedFieldsList] = React.useState<InternalField[]>([]);

  const updateFieldsListState = (
    fieldId: string,
    newLabel?: string,
    newType?: FieldType,
    newCodeList?: string,
    enableFilter?: boolean,
  ) => {
    const updatedFieldIndex = updatedFieldsList.findIndex((field) => field.id === fieldId);
    const fieldToUpdate: InternalField =
      updatedFieldIndex !== -1 ? updatedFieldsList[updatedFieldIndex] : dbFields.find((field) => field.id === fieldId);
    const updatedFieldsListCopy = [...updatedFieldsList];

    if (fieldToUpdate) {
      const updatedField = {
        ...fieldToUpdate,
        label: newLabel !== undefined ? { nb: newLabel } : fieldToUpdate.label,
        type: newType !== undefined ? newType : fieldToUpdate.type,
        codeListId: newCodeList !== undefined ? newCodeList : fieldToUpdate.codeListId,
        enableFilter: enableFilter,
      };

      if (updatedFieldIndex !== -1) {
        updatedFieldsListCopy[updatedFieldIndex] = updatedField;
      } else {
        updatedFieldsListCopy.push(updatedField);
      }

      setUpdatedFieldsList(updatedFieldsListCopy);
    }
  };

  const handleUpdateDbInternalField = (fieldId: string) => {
    const updatedField: InternalField | undefined = updatedFieldsList.find((field) => field.id === fieldId)!;
    const dbField: InternalField | undefined = dbFields.find((field) => field.id === fieldId)!;

    if (!updatedField || !dbField) {
      console.error(`Field with id ${fieldId} not found`);
      return;
    }

    const diff = compare(dbField, updatedField);

    if (diff) {
      updateInternalField
        .mutateAsync({ beforeUpdateField: dbField, updatedField: updatedField })
        .then((data) => {
          alert(localization.alert.success);
        })
        .catch((error) => {
          alert(localization.alert.fail);
        });
    } else {
      console.log('No changes detected.');
    }
  };

  const handleDeleteInternalField = (fieldId) => {
    if (window.confirm(localization.codeList.confirmDelete)) {
      deleteInternalField.mutate(fieldId);
    }
  };

  const validateLabelField = (label: string) => {
    return textRegexWithNumbers.test(label);
  };

  const codeListsOptions = () => {
    return (
      dbCodeLists?.map((codeList: CodeList) => ({
        value: codeList.id,
        label: codeList.name,
      })) || []
    );
  };

  const breadcrumbList = catalogId
    ? ([
        {
          href: `/catalogs/${catalogId}`,
          text: getTranslateText(localization.catalogAdmin.catalogAdmin),
        },
        {
          href: `/catalogs/${catalogId}/concepts`,
          text: getTranslateText(localization.catalogType.concept),
        },
        {
          href: `/catalogs/${catalogId}/concepts/internal-fields`,
          text: getTranslateText(localization.catalogAdmin.internalFields),
        },
      ] as BreadcrumbType[])
    : [];

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <Banner />
      <div className={styles.center}>
        <div className={styles.page}>
          <div className={styles.topButtonRow}>
            <Button
              className={styles.createButton}
              icon={<PlusCircleIcon title='' />}
              onClick={handleCreateInternalField}
            >
              {localization.catalogAdmin.create.newInternalField}
            </Button>
          </div>

          <div className={`${styles.row} ${styles.pb0_5}`}>
            <Heading
              level={2}
              size='xsmall'
            >
              {localization.catalogAdmin.internalFields}
            </Heading>
          </div>

          <div className={styles.pageContent}>
            {dbFields &&
              dbFields.map((field) => (
                <Accordion
                  key={field.id}
                  border={true}
                  className={styles.accordion}
                >
                  <Accordion.Item
                    ref={newAccordionRef}
                    open={
                      getTranslateText(field.label).includes(`Nytt felt ${getNextFieldNumber(dbFields) - 1}`)
                        ? accordionIsOpen
                        : undefined
                    }
                  >
                    <Accordion.Header onClick={() => setAccordionIsOpen((prevState) => !prevState)}>
                      <h2 className={styles.label}>{getTranslateText(field.label)}</h2>
                    </Accordion.Header>

                    <Accordion.Content>
                      <div className={styles.accordionContent}>
                        <div className={styles.field}>
                          <TextField
                            label={localization.catalogAdmin.fieldNameDescription}
                            value={String(
                              getTranslateText((updatedFieldsList.find((f) => f.id === field.id) || field)?.label),
                            )}
                            required
                            type='text'
                            isValid={validateLabelField(
                              String(
                                getTranslateText((updatedFieldsList.find((f) => f.id === field.id) || field)?.label),
                              ),
                            )}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              updateFieldsListState(field.id, event.target.value, undefined, undefined);
                            }}
                          />
                        </div>

                        <div className={styles.field}>
                          <Select
                            label={localization.catalogAdmin.fieldTypeDescription}
                            options={Object.values(fieldTypeOptions)}
                            value={(updatedFieldsList.find((f) => f.id === field.id) || field)?.type}
                            onChange={(value) => {
                              updateFieldsListState(field.id, undefined, value as FieldType, undefined);
                            }}
                          />
                        </div>

                        {(updatedFieldsList.find((f) => f.id === field.id) || field)?.type == 'code_list' && (
                          <div className={styles.field}>
                            <Select
                              label={localization.catalogAdmin.chooseCodeList}
                              options={codeListsOptions()}
                              value={(updatedFieldsList.find((f) => f.id === field.id) || field)?.codeListId}
                              onChange={(value) => {
                                updateFieldsListState(field.id, undefined, undefined, value);
                              }}
                            />
                          </div>
                        )}

                        {(updatedFieldsList.find((f) => f.id === field.id) || field)?.type == 'boolean' && (
                          <>
                            <div className={styles.field}>
                              <Checkbox
                                onChange={(e) => {
                                  updateFieldsListState(field.id, undefined, undefined, undefined, e.target.checked);
                                  setCheckboxState(e.target.checked);
                                }}
                                value={''}
                                checked={
                                  (updatedFieldsList.find((f) => f.id === field.id) || field)?.enableFilter ||
                                  checkboxState
                                }
                              >
                                {localization.catalogAdmin.enableFilter}
                              </Checkbox>
                            </div>
                          </>
                        )}

                        <div className={styles.field}>
                          <div className={styles.accordionButtons}>
                            <div className={styles.saveButton}>
                              <Button
                                fullWidth={true}
                                size='small'
                                onClick={() => handleUpdateDbInternalField(field.id)}
                              >
                                {localization.button.save}
                              </Button>
                            </div>

                            <Button
                              color='danger'
                              size='small'
                              onClick={() => {
                                handleDeleteInternalField(field.id);
                              }}
                            >
                              {localization.button.delete}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default InternalFieldsPage;
