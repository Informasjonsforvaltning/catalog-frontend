import React from 'react';
import styles from './internal-fields.module.css';
import { Accordion, Heading } from '@digdir/design-system-react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BreadcrumbType, Breadcrumbs, Button } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { InternalField, Organization } from '@catalog-frontend/types';
import { useRouter } from 'next/router';
import { Banner } from '../../../../../components/banner';
import { serverSidePropsWithAdminPermissions } from '../../../../../utils/auth';
import { getOrganization } from '@catalog-frontend/data-access';
import { useGetInternalFields } from '../../../../../hooks/internal-fields';
import { InternalFieldEditor } from '../../../../../components/internal-field-editor';
import { useAdminDispatch, useAdminState } from '../../../../../context/admin';

export const InternalFieldsPage = ({ organization }) => {
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';

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

          <Heading
            level={2}
            size='xsmall'
          >
            {localization.catalogAdmin.internalFields}
          </Heading>
          <div className={styles.pageContent}>
            {showInternalFieldEditor && (
              <Accordion
                key={'create-editor'}
                border={true}
                className={styles.accordion}
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
                    <InternalFieldEditor type={'create'} />
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>
            )}
            {dbFields &&
              dbFields.map((field: InternalField) => (
                <Accordion
                  key={field.id}
                  border={true}
                  className={styles.accordion}
                >
                  <Accordion.Item>
                    <Accordion.Header>
                      <Heading
                        size='small'
                        className={styles.label}
                      >
                        {getTranslateText(field.label)}
                      </Heading>
                    </Accordion.Header>

                    <Accordion.Content>
                      <InternalFieldEditor field={field} />
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

export async function getServerSideProps({ req, res, params }) {
  return serverSidePropsWithAdminPermissions({ req, res, params }, async () => {
    const { catalogId } = params;

    const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

    return {
      organization,
    };
  });
}
export default InternalFieldsPage;
