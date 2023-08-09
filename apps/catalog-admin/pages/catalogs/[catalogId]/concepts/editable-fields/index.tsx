import styles from './editable-fields.module.css';
import { Heading } from '@digdir/design-system-react';
import { Button, PageBanner, Select } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { CodeList } from '@catalog-frontend/types';
import { useRouter } from 'next/router';

import { useGetAllCodeLists } from '../../../../../hooks/code-lists';
import { useGetInternalFields, useUpdateEditableField } from '../../../../../hooks/internal-fields';
import { useState } from 'react';
import { compare } from 'fast-json-patch';

export function EditableFields() {
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';
  const { data: getAllCodeLists } = useGetAllCodeLists({ catalogId });
  const dbCodeLists: CodeList[] = getAllCodeLists?.codeLists;
  const { data: getInternalFields } = useGetInternalFields(catalogId);
  const dbEditableField = getInternalFields?.editable;
  const [updatedCodeListId, setUpdatedCodeListId] = useState<string>(null);
  const updateCodeListId = useUpdateEditableField(catalogId);

  const handleUpdateDbCodeListId = () => {
    const newField = { catalogId: catalogId, domainCodeListId: updatedCodeListId };
    const diff = compare(dbEditableField, newField);

    if (diff) {
      if (updatedCodeListId === undefined) {
        console.error('Invalid data: updateCodeListId is undefined.');
        return;
      }

      updateCodeListId
        .mutateAsync({ beforeUpdate: dbEditableField, afterUpdate: newField })
        .then(() => {
          alert('Field updated successfully!');
        })
        .catch(() => {
          alert('Failed to update field.');
        });
    } else {
      console.log('No changes detected.');
    }
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
    <>
      <PageBanner
        title='Hva skal stå her?'
        subtitle='Rognan og revisjon'
      />
      <div className={styles.center}>
        <div className={styles.heading}>
          <Heading
            level={2}
            size='xsmall'
          >
            {localization.catalogAdmin.editableFields}
          </Heading>
        </div>

        <div className={styles.page}>
          <div className={styles.pageContent}>
            <div>
              <div className={styles.field}>
                <p>Fagområde:</p>

                <Select
                  label={localization.catalogAdmin.chooseCodeList}
                  options={codeListsOptions()}
                  value={dbEditableField?.domainCodeListId}
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    setUpdatedCodeListId(String(event));
                  }}
                />
              </div>

              <div className={styles.field}>
                <div className={styles.accordionButtons}>
                  <div className={styles.saveButton}>
                    <Button
                      fullWidth={true}
                      size='small'
                      onClick={() => handleUpdateDbCodeListId()}
                    >
                      {localization.button.save}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditableFields;
