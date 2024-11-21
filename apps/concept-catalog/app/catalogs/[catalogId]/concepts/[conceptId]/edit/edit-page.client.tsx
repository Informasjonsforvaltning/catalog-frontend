'use client';

import { Breadcrumbs, PageBanner } from '@catalog-frontend/ui';
import { localization, getTranslateText } from '@catalog-frontend/utils';
import { Button } from '@digdir/designsystemet-react';
import ConceptForm from '../../../../../../components/concept-form';
import NotificationCarousel from '../../../../../../components/concept-form/components/notification-carousel';
import styles from './edit-page.module.scss';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { FormikProps } from 'formik';

export const EditPage = ({
  breadcrumbList,
  catalogId,
  organization,
  concept,
  conceptStatuses,
  codeListsResult,
  fieldsResult,
  usersResult,
}) => {
  

  return (
    <>
      <Breadcrumbs
        breadcrumbList={breadcrumbList}
        catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
      />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={getTranslateText(organization.prefLabel).toString()}
      />
      <ConceptForm
          catalogId={catalogId}
          concept={concept}
          conceptStatuses={conceptStatuses}
          codeListsResult={codeListsResult}
          fieldsResult={fieldsResult}
          usersResult={usersResult}
        />      
    </>
  );
};
