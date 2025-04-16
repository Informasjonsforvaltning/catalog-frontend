'use client';

import { useEffect, useState } from 'react';
import jsonpatch from 'fast-json-patch';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ConfirmModal, Snackbar } from '@catalog-frontend/ui';
import { Concept, ChangeRequestUpdateBody, JsonPatchOperation } from '@catalog-frontend/types';
import { localization, pruneEmptyProperties, updateDefinitionsIfEgendefinert } from '@catalog-frontend/utils';
import ConceptForm from '../../../../../../components/concept-form';
import { updateChangeRequestAction } from '../../../../../actions/change-requests/actions';

export const EditConceptFormClient = ({
  organization,
  changeRequest,
  changeRequestAsConcept,
  originalConcept,
  conceptStatuses,
  codeListsResult,
  fieldsResult,
  usersResult,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showSnackbar, setShowSnackbar] = useState(false);
  
  const created = searchParams.get('created');

  const emptyConcept: Concept = originalConcept || {
    id: null,
    ansvarligVirksomhet: { id: organization.organizationId },
    seOgså: [],
  };

  const handleSubmit = async (values: Concept) => {
    const changeRequestTitle =
      (originalConcept &&
        (originalConcept.anbefaltTerm?.navn?.nb ||
          originalConcept.anbefaltTerm?.navn?.nn ||
          originalConcept.anbefaltTerm?.navn?.en)) ||
      values.anbefaltTerm?.navn?.nb ||
      values.anbefaltTerm?.navn?.nn ||
      values.anbefaltTerm?.navn?.en ||
      '';

    const changeRequestFromConcept: ChangeRequestUpdateBody = {
      conceptId: originalConcept?.originaltBegrep ?? null,
      operations: jsonpatch.compare(
        pruneEmptyProperties(originalConcept || emptyConcept),
        pruneEmptyProperties(updateDefinitionsIfEgendefinert(values)),
      ) as JsonPatchOperation[],
      title: `${changeRequestTitle}`,
    };

    return await updateChangeRequestAction(organization.organizationId, changeRequest.id, changeRequestFromConcept);
  };

  const handleCancel = () => {
    router.replace(`/catalogs/${organization.organizationId}/change-requests`);
  };

  useEffect(() => {
    if (created === 'true') {
      setShowSnackbar(true);

      // Remove the param and update the URL shallowly
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('created');

      const newUrl = newParams.toString().length > 0 ? `${pathname}?${newParams.toString()}` : pathname;

      window.history.replaceState(null, '', newUrl);
    }
  }, [created, pathname]);

  return (
    <ConceptForm
      catalogId={organization.organizationId}
      initialConcept={changeRequestAsConcept}
      conceptStatuses={conceptStatuses}
      codeListsResult={codeListsResult}
      fieldsResult={fieldsResult}
      usersResult={usersResult}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      showSnackbarSuccessOnInit={showSnackbar}
    />
  );
};
