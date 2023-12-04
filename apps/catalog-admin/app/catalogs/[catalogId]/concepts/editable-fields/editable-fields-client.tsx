'use client';

import styles from './editable-fields.module.css';
import { Heading } from '@digdir/design-system-react';
import { BreadcrumbType, Breadcrumbs, Button, Select } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { CodeList, Organization } from '@catalog-frontend/types';

import { useGetAllCodeLists } from '../../../../../hooks/code-lists';
import { useGetInternalFields, useUpdateEditableFields } from '../../../../../hooks/internal-fields';
import { useState } from 'react';
import { compare } from 'fast-json-patch';
import { Banner } from '../../../../../components/banner';
import { PageLayout } from '../../../../../components/page-layout';

export interface EditableFieldsClientProps {
  catalogId: string;
  organization: Organization;
}

export function EditableFieldsClient({ catalogId, organization }: EditableFieldsClientProps) {
  const { data: getAllCodeLists } = useGetAllCodeLists({ catalogId });
  const dbCodeLists: CodeList[] = getAllCodeLists?.codeLists;
  const { data: getInternalFields } = useGetInternalFields(catalogId);
  const dbEditableFields = getInternalFields?.editable;
  const [updatedCodeListId, setUpdatedCodeListId] = useState<string>();
  const updateCodeListId = useUpdateEditableFields(catalogId);

  const handleUpdateDbCodeListId = () => {
    const newField = { catalogId: catalogId, domainCodeListId: updatedCodeListId ?? '' };
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
        value: codeList.id ?? '',
        label: codeList.name,
      })) || []
    );
  };

  const breadcrumbList = catalogId
    ? ([
        {
          href: `/catalogs/${catalogId}`,
          text: localization.manageCatalog,
        },
        {
          href: `/catalogs/${catalogId}/concepts`,
          text: localization.catalogType.concept,
        },
        {
          href: `/catalogs/${catalogId}/concepts/editable-fields`,
          text: localization.catalogAdmin.editableFields,
        },
      ] as BreadcrumbType[])
    : [];

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <Banner
        title={localization.catalogAdmin.manage.conceptCatalog}
        orgName={`${getTranslateText(organization?.prefLabel)}`}
        catalogId={catalogId}
      />
      <PageLayout>
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
              <div className='accordionField'>
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

              <div className='accordionField'>
                <div className={styles.accordionButtons}>
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
      </PageLayout>
    </>
  );
}
export default EditableFieldsClient;
