'use client';

import { Concept, ChangeRequestUpdateBody, JsonPatchOperation } from '@catalog-frontend/types';
import jsonpatch from 'fast-json-patch';
import { useCreateChangeRequest } from '../../../../hooks/change-requests';
import { localization as loc } from '@catalog-frontend/utils';
import { BreadcrumbType, Breadcrumbs, PageBanner } from '@catalog-frontend/ui';
import { useCatalogDesign } from '../../../../context/catalog-design';
import ChangeRequestForm from '../[changeRequestId]/change-request-form';

const NewConceptSuggestionClient = ({
  FDK_REGISTRATION_BASE_URI,
  organization,
  changeRequest,
  changeRequestAsConcept,
  originalConcept,
  showOriginal,
}) => {
  const catalogId = organization.organizationId;
  const pageSubtitle = organization?.name ?? organization.id;

  const changeRequestMutateHook = useCreateChangeRequest({ catalogId: catalogId });
  const submitHandler = (values: Concept, title: string) => {
    const changeRequestFromConcept: ChangeRequestUpdateBody = {
      conceptId: changeRequest.conceptId,
      operations: jsonpatch.compare(originalConcept, values) as JsonPatchOperation[],
      title: title,
    };
    changeRequestMutateHook.mutate(changeRequestFromConcept);
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
      href: `/${catalogId}/change-requests/new`,
      text: loc.suggestionForNewConcept,
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

export default NewConceptSuggestionClient;
