import React from 'react';
import styles from './internal-fields.module.css';
import { Accordion, TextField } from '@digdir/design-system-react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Select } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { CodeList, Field, FieldType, SelectOption } from '@catalog-frontend/types';
import { useRouter } from 'next/router';

import {
  useGetInternalFields,
  useCreateInternalField,
  useDeleteInternalField,
  useUpdateInternalField,
} from '../../../../../hooks/internal-fields';
import { useGetAllCodeLists } from '../../../../../hooks/code-lists';
import { compare } from 'fast-json-patch';

const fieldTypeOptions: { [key: string]: SelectOption } = {
  freetext: { label: 'Fritekst', value: 'text_short' },
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

  const newField: Field = {
    label: { nb: 'new field' },
    type: 'boolean',
    location: 'main_column',
    description: { nb: 'new field description' },
  };

  const getNextFieldNumber = (fields: Field[]): number => (fields ? fields.length : 0) + 1;

  const handleCreateInternalField = () => {
    createInternalField.mutate(newField);
  };

  const [updatedFieldsList, setUpdatedFieldsList] = React.useState<Field[]>([]);

  const updateFieldsListState = (fieldId: string, newLabel?: string, newType?: FieldType, newCodeList?: string) => {
    const updatedFieldIndex = updatedFieldsList.findIndex((field) => field.id === fieldId);
    const fieldToUpdate: Field =
      updatedFieldIndex !== -1 ? updatedFieldsList[updatedFieldIndex] : dbFields.find((field) => field.id === fieldId);
    const updatedFieldsListCopy = [...updatedFieldsList];

    if (fieldToUpdate) {
      const updatedField = {
        ...fieldToUpdate,
        label: newLabel !== undefined ? { nb: newLabel } : fieldToUpdate.label,
        type: newType !== undefined ? newType : fieldToUpdate.type,
        codeListId: newCodeList !== undefined ? newCodeList : fieldToUpdate.codeListId,
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
    const updatedField: Field | undefined = updatedFieldsList.find((field) => field.id === fieldId)!;
    const dbField: Field | undefined = dbFields.find((field) => field.id === fieldId)!;

    if (!updatedField || !dbField) {
      console.error(`Field with id ${fieldId} not found`);
      return;
    }

    const diff = compare(dbField, updatedField);

    if (diff) {
      updateInternalField
        .mutateAsync({ beforeUpdateField: dbField, updatedField: updatedField })
        .then((data) => {
          console.log('Update successful:', data);
          alert('Field updated successfully!');
        })
        .catch((error) => {
          console.error('Update failed:', error);
          alert('Failed to update field.');
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
    /* Can contain letters from the english alphabet, number, space, æ@å and -.,?+&%. Cannot be empty
       - Can contain letteres and numbers 
       - Can contain space (but not start or end with it)
       - Must contain one or more characters
       - Can contain æøå and  -.,?+&%
    */
    const labelRegex = /^(?! )(?!.* $)[\wæøåÆØÅ\s\-.,?!+&%]+$/;
    return labelRegex.test(label);
  };

  const codeListsOptions = () => {
    return (
      dbCodeLists?.map((codeList: CodeList) => ({
        value: codeList.id,
        label: codeList.name,
      })) || []
    );
  };

  return (
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
          <p>{localization.catalogAdmin.internalFields}</p>
        </div>

        <div className={styles.pageContent}>
          {dbFields &&
            dbFields.map((field) => (
              <Accordion
                key={field.id}
                border={true}
                className={styles.accordion}
              >
                <Accordion.Item key={field.id}>
                  <Accordion.Header level={2}>
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
                          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                            updateFieldsListState(field.id, undefined, String(event) as FieldType, undefined);
                          }}
                        />
                      </div>

                      {(updatedFieldsList.find((f) => f.id === field.id) || field)?.type == 'code_list' && (
                        <div className={styles.field}>
                          <Select
                            label={localization.catalogAdmin.chooseCodeList}
                            options={codeListsOptions()}
                            value={(updatedFieldsList.find((f) => f.id === field.id) || field)?.codeListId}
                            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                              updateFieldsListState(field.id, undefined, undefined, String(event));
                            }}
                          />
                        </div>
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
  );
};

export default InternalFieldsPage;
