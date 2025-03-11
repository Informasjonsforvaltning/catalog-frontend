'use client';

import { useParams } from 'next/navigation';
import { hasAcceptedTermsForOrg, hasAccessToMoreThanOneOrg } from '@catalog-frontend/utils';
import { TermsNotAcceptedModal } from '../terms-not-accepted-modal';

type TermsModalWrapperProps = {
  session: any;
  termsBaseUri?: string;
  catalogPortalBaseUri?: string;
};

const TermsNotAcceptedWrapper = ({ session, termsBaseUri, catalogPortalBaseUri }: TermsModalWrapperProps) => {
  const { catalogId } = useParams();
  const currentCatalog =
    typeof catalogId === 'string'
      ? catalogId
      : Array.isArray(catalogId) && catalogId.length === 1
        ? catalogId[0]
        : undefined;

  if (session && currentCatalog && !hasAcceptedTermsForOrg(`${session?.accessToken}`, currentCatalog)) {
    return (
      <TermsNotAcceptedModal
        termsOfUseUrl={`${termsBaseUri}/terms-and-conditions/${currentCatalog}`}
        closeable={hasAccessToMoreThanOneOrg(`${session?.accessToken}`)}
        closeUrl={`${catalogPortalBaseUri}/catalogs`}
      />
    );
  }
};

export { TermsNotAcceptedWrapper };
