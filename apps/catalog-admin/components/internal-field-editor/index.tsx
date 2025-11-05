"use client";

import React, { useState } from "react";
import cn from "classnames";
import styles from "./internal-field.module.css";
import { Button, Select } from "@catalog-frontend/ui";
import {
  Textfield,
  Checkbox,
  HelpText,
  Paragraph,
} from "@digdir/designsystemet-react";
import {
  CodeList,
  FieldType,
  InternalField,
  InternalFieldTemplate,
} from "@catalog-frontend/types";
import {
  getTranslateText,
  localization,
  textRegexWithNumbers,
} from "@catalog-frontend/utils";
import { useAdminDispatch } from "../../context/admin";
import { useGetAllCodeLists } from "../../hooks/code-lists";
import { compare } from "fast-json-patch";
import {
  useGetInternalFields,
  useCreateInternalField,
  useDeleteInternalField,
  useUpdateInternalField,
} from "../../hooks/internal-fields";

const fieldTypeOptions = [
  { label: "Kort tekst", value: "text_short" },
  { label: "Lang tekst", value: "text_long" },
  { label: "Boolsk verdi", value: "boolean" },
  { label: "Kodeliste", value: "code_list" },
];

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
    label: { nb: "" },
    type: undefined,
    location: "main_column",
    description: { nb: "" },
  };

  const [updatedFieldsList, setUpdatedFieldsList] = React.useState<
    InternalField[]
  >([]);
  const [newField, setNewField] =
    useState<InternalFieldTemplate>(newFieldTemplate);

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
    adminDispatch({
      type: "SET_SHOW_INTERNAL_FIELD_EDITOR",
      payload: { showInternalFieldEditor: false },
    });
  };

  const handleUpdateDbInternalField = (fieldId: string) => {
    const updatedField: InternalField | undefined | null =
      updatedFieldsList.find((field) => field.id === fieldId);
    const dbField: InternalField | undefined | null = dbFields.find(
      (field: { id: string }) => field.id === fieldId,
    )!;

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

  const codeListsOptions = [
    <option key={"no-codelist"} value={undefined}>
      {localization.catalogAdmin.noListChosen}
    </option>,
    ...(dbCodeLists?.map((codeList: CodeList, index) => (
      <option key={`codelist-option-${index}`} value={codeList.id}>
        {codeList.name}
      </option>
    )) || []),
  ];

  const updateFieldsListState = (
    fieldId: string,
    newLabel?: string,
    newType?: FieldType,
    newCodeList?: string,
    enableFilter?: string[],
  ) => {
    const updatedFieldIndex = updatedFieldsList.findIndex(
      (field) => field.id === fieldId,
    );
    const fieldToUpdate: InternalField =
      updatedFieldIndex !== -1
        ? updatedFieldsList[updatedFieldIndex]
        : dbFields.find((field) => field.id === fieldId);
    const updatedFieldsListCopy = [...updatedFieldsList];
    const enableFilterBoolean =
      enableFilter &&
      enableFilter?.length > 0 &&
      enableFilter[0] === "enableFilter";

    if (fieldToUpdate) {
      const updatedField = {
        ...fieldToUpdate,
        label: newLabel !== undefined ? { nb: newLabel } : fieldToUpdate.label,
        type: newType !== undefined ? newType : fieldToUpdate.type,
        codeListId:
          newCodeList !== undefined ? newCodeList : fieldToUpdate.codeListId,
        enableFilter: enableFilterBoolean,
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
      <div className="accordionField">
        <Textfield
          label={localization.catalogAdmin.fieldNameDescription}
          value={String(
            getTranslateText(
              (updatedFieldsList.find((f) => f.id === field?.id) || field)
                ?.label || newField?.label,
            ),
          )}
          required
          type="text"
          error={
            validateLabelField(
              String(
                getTranslateText(
                  (updatedFieldsList.find((f) => f.id === field?.id) || field)
                    ?.label || newField?.label,
                ),
              ),
            )
              ? null
              : localization.validation.invalidValue
          }
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            field
              ? updateFieldsListState(
                  field.id,
                  event.target.value,
                  undefined,
                  undefined,
                )
              : setNewField((prevField) => ({
                  ...prevField,
                  label: { nb: event.target.value },
                }));
          }}
        />
      </div>

      <div className="accordionField">
        <Select
          label={localization.catalogAdmin.fieldTypeDescription}
          value={
            (updatedFieldsList.find((f) => f.id === field?.id) || field)
              ?.type || newField?.type
          }
          onChange={(event) => {
            field
              ? updateFieldsListState(
                  field?.id,
                  undefined,
                  event.target.value as FieldType,
                  undefined,
                )
              : setNewField((prevField) => ({
                  ...prevField,
                  type: event.target.value as FieldType,
                }));
          }}
        >
          {fieldTypeOptions.map((opt) => (
            <option key={`internal-field-type-${opt.value}`} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>

      {((updatedFieldsList.find((f) => f.id === field?.id) || field)?.type ===
        "code_list" ||
        newField?.type === "code_list") && (
        <div className="accordionField">
          <Select
            label={localization.catalogAdmin.chooseCodeList}
            value={
              (updatedFieldsList.find((f) => f.id === field?.id) || field)
                ?.codeListId || newField?.codeListId
            }
            onChange={(value) => {
              if (field) {
                updateFieldsListState(
                  field?.id,
                  undefined,
                  undefined,
                  value.target.value,
                );
              } else {
                setNewField((prevField) => ({
                  ...prevField,
                  codeListId: value.target.value,
                }));
              }
            }}
          >
            {codeListsOptions}
          </Select>
        </div>
      )}

      {((updatedFieldsList.find((f) => f.id === field?.id) || field)?.type ==
        "boolean" ||
        newField?.type === "boolean") && (
        <>
          <div className={cn("accordionField", styles.row)}>
            <Checkbox.Group
              legend=""
              onChange={(filters) => {
                field
                  ? updateFieldsListState(
                      field?.id,
                      undefined,
                      undefined,
                      undefined,
                      filters,
                    )
                  : setNewField((prevField) => ({
                      ...prevField,
                      enableFilter: filters.length > 0,
                    }));
              }}
              defaultValue={
                (updatedFieldsList.find((f) => f.id === field?.id) || field)
                  ?.enableFilter
                  ? ["enableFilter"]
                  : []
              }
            >
              <Checkbox value="enableFilter">
                {localization.catalogAdmin.enableFilter}
              </Checkbox>
            </Checkbox.Group>

            <HelpText
              placement="right"
              title={localization.catalogAdmin.manage.enableFilter}
              type="button"
            >
              <Paragraph size="sm">
                {localization.catalogAdmin.manage.enableFilter}
              </Paragraph>
            </HelpText>
          </div>
        </>
      )}

      <div className="accordionField">
        <div className="editorButtons">
          <div className={styles.saveButton}>
            <Button
              fullWidth={true}
              onClick={() =>
                field
                  ? handleUpdateDbInternalField(field?.id)
                  : handleCreateInternalField()
              }
            >
              {localization.button.save}
            </Button>
          </div>
          {field ? (
            <Button
              color="danger"
              onClick={() => {
                handleDeleteInternalField(field?.id);
              }}
            >
              {localization.button.delete}
            </Button>
          ) : (
            <Button color="danger" onClick={handleCancel}>
              {localization.button.cancel}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
