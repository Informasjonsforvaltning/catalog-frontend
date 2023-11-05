'use client';

import React from 'react';
import styles from './internal-fields.module.css';
import { Accordion, Heading } from '@digdir/design-system-react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BreadcrumbType, Breadcrumbs, Button } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { InternalField } from '@catalog-frontend/types';
import { Banner } from '../../../../../components/banner';
import { useGetInternalFields } from '../../../../../hooks/internal-fields';
import { InternalFieldEditor } from '../../../../../components/internal-field-editor';
import { useAdminDispatch, useAdminState } from '../../../../../context/admin';
import { PageLayout } from '../../../../../components/page-layout';

export const InternalFieldsPageClient = ({ catalogId, organization }) => {
  const { data: getInternalFields } = useGetInternalFields(catalogId);
  const dbFields = getInternalFields?.internal;

  const adminDispatch = useAdminDispatch();
  const adminContext = useAdminState();
  const { showInternalFieldEditor } = adminContext;

  const handleCreateInternalField = () => {
    adminDispatch({ type: 'SET_SHOW_INTERNAL_FIELD_EDITOR', payload: { showInternalFieldEditor: true } });
  };

  const breadcrumbList = catalogId
    ? ([
        {
          href: `/catalogs/${catalogId}`,
          text: getTranslateText(localization.catalogAdmin.manage.catalogAdmin),
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
      <Banner orgName={organization?.prefLabel} />

      <PageLayout>
        <div className={styles.topButtonRow}>
          <Button
            icon={<PlusCircleIcon title='' />}
            onClick={handleCreateInternalField}
          >
            {localization.catalogAdmin.create.newInternalField}
          </Button>
        </div>

        <Heading
          level={2}
          size='xsmall'
        >
          {localization.catalogAdmin.internalFields}
        </Heading>
        <div className='accordionStructure'>
          {showInternalFieldEditor && (
            <Accordion
              key={'create-editor'}
              border={true}
              className='accordionWidth'
            >
              <Accordion.Item defaultOpen={showInternalFieldEditor}>
                <Accordion.Header>
                  <Heading
                    size='small'
                    className={styles.label}
                    level={3}
                  ></Heading>
                </Accordion.Header>
                <Accordion.Content>
                  <InternalFieldEditor
                    type={'create'}
                    catalogId={catalogId}
                  />
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          )}
          {dbFields &&
            dbFields.map((field: InternalField) => (
              <Accordion
                key={field.id}
                border={true}
                className='accordionWidth'
              >
                <Accordion.Item>
                  <Accordion.Header>
                    <Heading
                      size='xsmall'
                      className={styles.label}
                    >
                      {getTranslateText(field.label)}
                    </Heading>
                  </Accordion.Header>

                  <Accordion.Content>
                    <InternalFieldEditor
                      field={field}
                      catalogId={catalogId}
                    />
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>
            ))}
        </div>
      </PageLayout>
    </>
  );
};

export default InternalFieldsPageClient;
