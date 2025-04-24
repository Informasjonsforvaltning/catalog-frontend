'use client';

import { localization } from '@catalog-frontend/utils';
import { Concept } from '@catalog-frontend/types';
import ConceptForm from '../../../../../../components/concept-form';
import { updateConcept } from '../../../../../actions/concept/actions';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, ButtonBar, ConfirmModal, LinkButton, Snackbar } from '@catalog-frontend/ui';
import { ArrowLeftIcon } from '@navikt/aksel-icons';

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
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleUpdate = async (values: Concept) => {
    return await updateConcept(catalogId.toString(), concept, values);
  };

  const handleSuccess = () => {
    setAutoSave(true);
  };

  const handleCancel = () => {
    router.replace(`/catalogs/${catalogId}/concepts/${concept.id}`);
  };

  useEffect(() => {
    if (searchParams.get('created') === 'true') {
      setShowSnackbar(true);

      // Remove the param and update the URL shallowly
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('created');

      const newUrl = newParams.toString().length > 0 ? `${pathname}?${newParams.toString()}` : pathname;

      window.history.replaceState(null, '', newUrl);
    }
  }, [searchParams, pathname]);

  return (
    <>
    {showCancelConfirm && (
        <ConfirmModal
          title={localization.confirm.cancelForm.title}
          content={localization.confirm.cancelForm.message}
          onSuccess={() => router.replace(`/catalogs/${catalogId}/concepts`)}
          onCancel={() => setShowCancelConfirm(false)}
        />
      )}
      {hasChangeRequests ? (
        <ConfirmModal
          title={localization.changeRequest.changeRequest}
          content={localization.concept.confirmEditWithChangeRequest}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      ) : undefined}
      <ButtonBar>
        <ButtonBar.Left>
          <Button
            variant='tertiary'
            color='second'
            size='sm'
            onClick={() => setShowCancelConfirm(true)}
          >
            <ArrowLeftIcon />
            {localization.button.backToOverview}
          </Button>
        </ButtonBar.Left>
      </ButtonBar>
      <ConceptForm
        autoSave={autoSave}
        autoSaveId={concept.id}
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
