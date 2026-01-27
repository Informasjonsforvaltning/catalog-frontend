"use client";

import styles from "./editable-fields.module.css";
import { Heading } from "@digdir/designsystemet-react";
import { Button, Select, useWarnIfUnsavedChanges } from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";
import { CodeList } from "@catalog-frontend/types";

import { useGetAllCodeLists } from "../../../../../hooks/code-lists";
import {
  useGetInternalFields,
  useUpdateEditableFields,
} from "../../../../../hooks/internal-fields";
import { useState } from "react";
import { compare } from "fast-json-patch";
import { PageLayout } from "../../../../../components/page-layout";

export interface EditableFieldsClientProps {
  catalogId: string;
}

export function EditableFieldsClient({ catalogId }: EditableFieldsClientProps) {
  const { data: getAllCodeLists } = useGetAllCodeLists({ catalogId });
  const dbCodeLists: CodeList[] = getAllCodeLists?.codeLists;
  const { data: getInternalFields } = useGetInternalFields(catalogId);
  const dbEditableFields = getInternalFields?.editable;
  const [updatedCodeListId, setUpdatedCodeListId] = useState<string>();
  const updateCodeListId = useUpdateEditableFields(catalogId);
  const unsavedChanges = !!(
    updatedCodeListId &&
    updatedCodeListId !== dbEditableFields?.domainCodeListId
  );

  useWarnIfUnsavedChanges({ unsavedChanges: unsavedChanges });

  const handleUpdateDbCodeListId = () => {
    const newField = {
      catalogId: catalogId,
      domainCodeListId: updatedCodeListId ?? "",
    };
    const diff = compare(dbEditableFields, newField);

    if (updatedCodeListId === undefined) {
      window.alert(localization.alert.noChanges);
      return;
    }

    if (diff) {
      updateCodeListId
        .mutateAsync({ beforeUpdate: dbEditableFields, afterUpdate: newField })
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

  const codeListsOptions = [
    <option key="no-codelist" value={undefined}>
      {localization.catalogAdmin.noListChosen}
    </option>,
    ...(dbCodeLists?.map((codeList: CodeList) => (
      <option key={codeList.id} value={codeList.id}>
        {codeList.name}
      </option>
    )) || []),
  ];

  return (
    <>
      <PageLayout>
        <div className={styles.heading}>
          <Heading level={2} size="xsmall">
            {localization.catalogAdmin.editableFields}
          </Heading>
        </div>

        <div className={styles.page}>
          <div className={styles.pageContent}>
            <div>
              <div className="accordionField">
                <p>Fagområde:</p>

                <Select
                  label={localization.catalogAdmin.chooseCodeList}
                  value={
                    updatedCodeListId || dbEditableFields?.domainCodeListId
                  }
                  onChange={(event) => {
                    setUpdatedCodeListId(event.target.value);
                  }}
                >
                  {codeListsOptions}
                </Select>
              </div>

              <div className="accordionField">
                <div className={styles.accordionButtons}>
                  <Button
                    fullWidth={true}
                    size="small"
                    onClick={() => handleUpdateDbCodeListId()}
                  >
                    {localization.button.save}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
}
export default EditableFieldsClient;
