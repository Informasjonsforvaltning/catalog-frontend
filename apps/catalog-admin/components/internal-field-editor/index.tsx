'use client';

import React, { useState } from 'react';
import cn from 'classnames';
import styles from './internal-field.module.css';
import { Button, Select } from '@catalog-frontend/ui';
import { Textfield, Checkbox, HelpText } from '@digdir/design-system-react';
import { CodeList, FieldType, InternalField, InternalFieldTemplate, SelectOption } from '@catalog-frontend/types';
import { getTranslateText, localization, textRegexWithNumbers } from '@catalog-frontend/utils';
import { useAdminDispatch } from '../../context/admin';
import { useGetAllCodeLists } from '../../hooks/code-lists';
import { compare } from 'fast-json-patch';
import {
  useGetInternalFields,
  useCreateInternalField,
  useDeleteInternalField,
  useUpdateInternalField,
} from '../../hooks/internal-fields';

const fieldTypeOptions: { [key: string]: SelectOption } = {
  shortText: { label: 'Kort tekst', value: 'text_short' },
  longText: { label: 'Lang tekst', value: 'text_long' },
  boolean: { label: 'Boolsk verdi', value: 'boolean' },
  codelist: { label: 'Kodeliste', value: 'code_list' },
};

export interface Props {
  field?: InternalField;
  catalogId: string;
}

export const InternalFieldEditor = ({ catalogId, field }: Props) => {
  const { data: getInternalFields } = useGetInternalFields(catalogId);
  const dbFields = getInternalFields?.internal;

  const { data: getAllCodeLists } = useGetAllCodeLists({ catalogId });
  const dbCodeLists: CodeList[] = getAllCodeLists?.codeLists;

  const createInternalField = useCreateInternalField(catalogId);
  const deleteInternalField = useDeleteInternalField(catalogId);
  const updateInternalField = useUpdateInternalField(catalogId);

  const adminDispatch = useAdminDispatch();

  const newFieldTemplate: InternalFieldTemplate = {
    label: { nb: '' },
    type: undefined,
    location: 'main_column',
    description: { nb: '' },
  };

  const [updatedFieldsList, setUpdatedFieldsList] = React.useState<InternalField[]>([]);
  const [newField, setNewField] = useState<InternalFieldTemplate>(newFieldTemplate);

  const handleCreateInternalField = () => {
    createInternalField
      .mutateAsync(newField)
      .then(() => {
        alert(localization.alert.success);
      })
      .catch(() => {
        alert(localization.alert.fail);
      });
    handleCancel();
  };

  const handleCancel = () => {
    adminDispatch({ type: 'SET_SHOW_INTERNAL_FIELD_EDITOR', payload: { showInternalFieldEditor: false } });
  };

  const handleUpdateDbInternalField = (fieldId: string) => {
    const updatedField: InternalField | undefined = updatedFieldsList.find((field) => field.id === fieldId);
    const dbField: InternalField | undefined = dbFields.find((field: { id: string }) => field.id === fieldId)!;

    if (!updatedField || !dbField) {
      window.alert(localization.alert.noChanges);
      return;
    }

    const diff = compare(dbField, updatedField);

    if (diff) {
      updateInternalField
        .mutateAsync({ beforeUpdateField: dbField, updatedField: updatedField })
        .then(() => {
          alert(localization.alert.success);
        })
        .catch(() => {
          alert(localization.alert.fail);
        });
    } else {
      window.alert(localization.alert.noChanges);
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
        value: codeList.id || '',
        label: codeList.name,
      })) || []
    );
  };

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

  return (
    <>
      <div className='accordionField'>
        <Textfield
          label={localization.catalogAdmin.fieldNameDescription}
          value={String(
            getTranslateText((updatedFieldsList.find((f) => f.id === field?.id) || field)?.label || newField?.label),
          )}
          required
          type='text'
          error={
            validateLabelField(
              String(
                getTranslateText(
                  (updatedFieldsList.find((f) => f.id === field?.id) || field)?.label || newField?.label,
                ),
              ),
            )
              ? null
              : localization.validation.invalidValue
          }
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            field
              ? updateFieldsListState(field.id, event.target.value, undefined, undefined)
              : setNewField((prevField) => ({
                  ...prevField,
                  label: { nb: event.target.value },
                }));
          }}
        />
      </div>

      <div className='accordionField'>
        <Select
          label={localization.catalogAdmin.fieldTypeDescription}
          options={Object.values(fieldTypeOptions)}
          value={(updatedFieldsList.find((f) => f.id === field?.id) || field)?.type || newField?.type}
          onChange={(value) => {
            field
              ? updateFieldsListState(field?.id, undefined, value as FieldType, undefined)
              : setNewField((prevField) => ({
                  ...prevField,
                  type: value as FieldType,
                }));
          }}
        />
      </div>

      {((updatedFieldsList.find((f) => f.id === field?.id) || field)?.type === 'code_list' ||
        newField?.type === 'code_list') && (
        <div className='accordionField'>
          <Select
            label={localization.catalogAdmin.chooseCodeList}
            options={codeListsOptions()}
            value={(updatedFieldsList.find((f) => f.id === field?.id) || field)?.codeListId || newField?.codeListId}
            onChange={(value) => {
              if (field) {
                updateFieldsListState(field?.id, undefined, undefined, value);
              } else {
                setNewField((prevField) => ({
                  ...prevField,
                  codeListId: value,
                }));
              }
            }}
          />
        </div>
      )}

      {((updatedFieldsList.find((f) => f.id === field?.id) || field)?.type == 'boolean' ||
        newField?.type === 'boolean') && (
        <>
          <div className={cn('accordionField', styles.row)}>
            <Checkbox
              onChange={(e) => {
                field
                  ? updateFieldsListState(field?.id, undefined, undefined, undefined, e.target.checked)
                  : setNewField((prevField) => ({
                      ...prevField,
                      enableFilter: e.target.checked,
                    }));
              }}
              value={''}
              checked={(updatedFieldsList.find((f) => f.id === field?.id) || field)?.enableFilter}
            >
              {localization.catalogAdmin.enableFilter}
            </Checkbox>
            <HelpText
              placement='right'
              title={localization.catalogAdmin.manage.enableFilter}
            >
              {localization.catalogAdmin.manage.enableFilter}
            </HelpText>
          </div>
        </>
      )}

      <div className='accordionField'>
        <div className='editorButtons'>
          <div className={styles.saveButton}>
            <Button
              fullWidth={true}
              onClick={() => (field ? handleUpdateDbInternalField(field?.id) : handleCreateInternalField())}
            >
              {localization.button.save}
            </Button>
          </div>
          {field ? (
            <Button
              color='danger'
              onClick={() => {
                handleDeleteInternalField(field?.id);
              }}
            >
              {localization.button.delete}
            </Button>
          ) : (
            <Button
              color='danger'
              onClick={handleCancel}
            >
              {localization.button.cancel}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
