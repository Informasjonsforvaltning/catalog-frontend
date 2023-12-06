'use client';

import { Concept, ChangeRequestUpdateBody, JsonPatchOperation } from '@catalog-frontend/types';
import jsonpatch from 'fast-json-patch';
import { useCreateChangeRequest } from '../../../../hooks/change-requests';
import { localization as loc } from '@catalog-frontend/utils';
import { BreadcrumbType, Breadcrumbs, PageBanner } from '@catalog-frontend/ui';
import { useCatalogDesign } from '../../../../context/catalog-design';
import ChangeRequestForm from '../../../../components/change-request-form/change-request-form';

const NewConceptSuggestionClient = ({
  FDK_REGISTRATION_BASE_URI,
  organization,
  changeRequest,
  changeRequestAsConcept,
  originalConcept,
}) => {
  const catalogId = organization.organizationId;
  const pageSubtitle = organization?.name ?? organization.id;

  const changeRequestMutateHook = useCreateChangeRequest({ catalogId: catalogId });
  const submitHandler = (values: Concept) => {
    const anbefaltTerm = values.anbefaltTerm?.navn.nb || values.anbefaltTerm?.navn.nn || values.anbefaltTerm?.navn.en;
    const changeRequestFromConcept: ChangeRequestUpdateBody = {
      conceptId: changeRequest.conceptId,
      operations: jsonpatch.compare(originalConcept, values) as JsonPatchOperation[],
      title: anbefaltTerm || '',
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
        logo={design?.hasLogo ? `/api/catalog-admin/${catalogId}/design/logo` : undefined}
        logoDescription={design?.logoDescription}
      />
      <ChangeRequestForm
        changeRequestAsConcept={changeRequestAsConcept}
        readOnly={false}
        submitHandler={submitHandler}
      />
    </>
  );
};

export default NewConceptSuggestionClient;
