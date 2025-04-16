'use client';

import { localization } from '@catalog-frontend/utils';
import { Concept } from '@catalog-frontend/types';
import ConceptForm from '../../../../../../components/concept-form';
import { updateConcept } from '../../../../../actions/concept/actions';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ConfirmModal, Snackbar } from '@catalog-frontend/ui';

export const EditPage = ({
  catalogId,
  concept,
  conceptStatuses,
  codeListsResult,
  fieldsResult,
  usersResult,
  hasChangeRequests,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [autoSave, setAutoSave] = useState(hasChangeRequests ? false : true);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const created = searchParams.get('created');

  const handleUpdate = async (values: Concept) => {
    return await updateConcept(catalogId.toString(), concept, values);
  };

  const handleSuccess = () => {
    setAutoSave(true);
  };

  const handleCancel = () => {
    router.replace(`/catalogs/${catalogId}/concepts`);
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
    <>
      {hasChangeRequests && (
        <ConfirmModal
          title={localization.changeRequest.changeRequest}
          content={localization.concept.confirmEditWithChangeRequest}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}
      <ConceptForm
        autoSave={autoSave}
        catalogId={catalogId}
        initialConcept={concept}
        conceptStatuses={conceptStatuses}
        codeListsResult={codeListsResult}
        fieldsResult={fieldsResult}
        usersResult={usersResult}
        onSubmit={handleUpdate}
        onCancel={handleCancel}
        showSnackbarSuccessOnInit={showSnackbar}
      />
    </>
  );
};
