'use client';

import { Concept, ChangeRequestUpdateBody, JsonPatchOperation } from '@catalog-frontend/types';
import { localization as loc } from '@catalog-frontend/utils';
import jsonpatch from 'fast-json-patch';
import { useUpdateChangeRequest } from '../../../../../hooks/change-requests';
import { useRouter } from 'next/navigation';

import { BreadcrumbType, Breadcrumbs, PageBanner } from '@catalog-frontend/ui';
import { useCatalogDesign } from '../../../../../context/catalog-design';
import ChangeRequestForm from '../change-request-form';

const ChangeRequestEditPageClient = ({
  FDK_REGISTRATION_BASE_URI,
  organization,
  changeRequest,
  changeRequestAsConcept,
  originalConcept,
  showOriginal,
}) => {
  const router = useRouter();
  const catalogId = organization.organizationId;
  const pageSubtitle = organization?.name ?? organization.id;

  const changeRequestMutateHook = useUpdateChangeRequest({
    catalogId: organization.organizationId,
    changeRequestId: changeRequest.id,
  });
  const submitHandler = (values: Concept, title: string) => {
    const changeRequestFromConcept: ChangeRequestUpdateBody = {
      conceptId: changeRequest.conceptId,
      operations: jsonpatch.compare(originalConcept, values) as JsonPatchOperation[],
      title: title,
    };

    changeRequestMutateHook.mutate(changeRequestFromConcept, {
      onSuccess: () => {
        router.reload();
      },
    });
  };

  const breadcrumbList = [
    {
      href: `/${catalogId}`,
      text: loc.concept.concept,
    },
    {
      href: `/${catalogId}/change-requests`,
      text: loc.changeRequest.changeRequest,
    },
    {
      href: `/${catalogId}/change-requests/${changeRequest.id}`,
      text: changeRequest.title,
    },
    {
      href: `/${catalogId}/change-requests/${changeRequest.id}/edit`,
      text: loc.changeRequest.edit,
    },
  ] as BreadcrumbType[];

  const design = useCatalogDesign();

  return (
    <>
      <Breadcrumbs
        baseURI={FDK_REGISTRATION_BASE_URI}
        breadcrumbList={breadcrumbList}
      />
      <PageBanner
        title={loc.catalogType.concept}
        subtitle={pageSubtitle}
        fontColor={design?.fontColor}
        backgroundColor={design?.backgroundColor}
        logo={design?.hasLogo && `/api/catalog-admin/${catalogId}/design/logo`}
        logoDescription={design?.logoDescription}
      />
      <ChangeRequestForm
        changeRequest={changeRequest}
        changeRequestAsConcept={changeRequestAsConcept}
        originalConcept={originalConcept}
        showOriginal={showOriginal}
        submitHandler={submitHandler}
      />
    </>
  );
};

export default ChangeRequestEditPageClient;
