import styles from './editable-fields.module.css';
import { Heading } from '@digdir/design-system-react';
import { BreadcrumbType, Breadcrumbs, Button, Select } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { CodeList } from '@catalog-frontend/types';
import { useRouter } from 'next/router';

import { useGetAllCodeLists } from '../../../../../hooks/code-lists';
import { useGetInternalFields, useUpdateEditableFields } from '../../../../../hooks/internal-fields';
import { useState } from 'react';
import { compare } from 'fast-json-patch';
import { Banner } from '../../../../../components/banner';
import { serverSidePropsWithAdminPermissions } from '../../../../../utils/auth';

export function EditableFields() {
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';
  const { data: getAllCodeLists } = useGetAllCodeLists({ catalogId });
  const dbCodeLists: CodeList[] = getAllCodeLists?.codeLists;
  const { data: getInternalFields } = useGetInternalFields(catalogId);
  const dbEditableFields = getInternalFields?.editable;
  const [updatedCodeListId, setUpdatedCodeListId] = useState<string>(null);
  const updateCodeListId = useUpdateEditableFields(catalogId);

  const handleUpdateDbCodeListId = () => {
    const newField = { catalogId: catalogId, domainCodeListId: updatedCodeListId };
    const diff = compare(dbEditableFields, newField);

    if (diff) {
      if (updatedCodeListId === undefined) {
        console.error('Invalid data: updateCodeListId is undefined.');
        return;
      }

      updateCodeListId
        .mutateAsync({ beforeUpdate: dbEditableFields, afterUpdate: newField })
        .then(() => {
          alert(localization.alert.success);
        })
        .catch(() => {
          alert(localization.alert.fail);
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
          href: `/catalogs/${catalogId}/concepts/editable-fields`,
          text: getTranslateText(localization.catalogAdmin.editableFields),
        },
      ] as BreadcrumbType[])
    : [];

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <Banner />
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
                  value={dbEditableFields?.domainCodeListId}
                  onChange={(value) => {
                    setUpdatedCodeListId(value);
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

export async function getServerSideProps(props) {
  return serverSidePropsWithAdminPermissions(props);
}

export default EditableFields;
