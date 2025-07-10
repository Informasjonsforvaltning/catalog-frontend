'use server';

import { localization, redirectToSignIn } from '@catalog-frontend/utils';
import { withReadProtectedPage } from '@catalog-portal/utils/auth';
import TermsAndConditionsPageClient from './terms-and-conditions-page-client';
import { Breadcrumbs, BreadcrumbType } from '@catalog-frontend/ui';
import { getLatestTerms, getOrgAcceptation } from '@catalog-frontend/data-access';
import { Terms, TermsAcceptation } from '@catalog-frontend/types';

const TermsAndConditionsPage = withReadProtectedPage(
  ({ catalogId }) => `/terms-and-conditions/${catalogId}`,
  async ({ catalogId, session, hasAdminPermission }) => {
    if (!session) {
      return redirectToSignIn({ callbackUrl: `terms-and-conditions/${catalogId}` });
    }

    const breadcrumbList = catalogId
      ? ([
          {
            href: `/terms-and-conditions/${catalogId}`,
            text: localization.termsOfUse.pageTitle,
          },
        ] as BreadcrumbType[])
      : [];

    const latestTerms: Terms = await getLatestTerms().then((res) => res.json());
    const acceptation: TermsAcceptation | undefined = await getOrgAcceptation(catalogId, `${session.accessToken}`).then(
      (response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 404) {
          return undefined;
        } else throw new Error('Error when searching for original concept');
      },
    );

    return (
      <>
        <Breadcrumbs
          breadcrumbList={breadcrumbList}
          catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
        />
        <TermsAndConditionsPageClient
          hasAdminPermission={hasAdminPermission}
          catalogId={catalogId}
          userName={session.user?.name ?? 'Ukjent'}
          latestTerms={latestTerms}
          acceptation={acceptation}
        />
      </>
    );
  },
);

export default TermsAndConditionsPage;
