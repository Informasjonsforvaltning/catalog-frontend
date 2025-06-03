'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import type { Concept, StorageData } from '@catalog-frontend/types';
import { Button, ButtonBar, ConfirmModal } from '@catalog-frontend/ui';
import { LocalDataStorage, localization } from '@catalog-frontend/utils';
import { createConcept } from '@concept-catalog/app/actions/concept/actions';
import ConceptForm from '@concept-catalog/components/concept-form';

export const NewPage = ({ catalogId, concept, conceptStatuses, codeListsResult, fieldsResult, usersResult }) => {
  const conceptIdRef = useRef<string | undefined>(undefined); // Ref to store the concept id
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const dataStorage = new LocalDataStorage<StorageData>({ key: 'conceptForm' });

  const handleCreate = async (values: Concept) => {
    const conceptId = await createConcept(values, catalogId.toString(), fieldsResult.internal);
    conceptIdRef.current = conceptId;
    return undefined;
  };

  const handleAfterSubmit = () => {
    if (conceptIdRef.current) {
      window.location.replace(`/catalogs/${catalogId}/concepts/${conceptIdRef.current}/edit?created=true`);
    } else {
      window.location.replace(`/catalogs/${catalogId}/concepts`);
    }
  };

  const handleCancel = () => {
    dataStorage.delete();
    window.location.replace(`/catalogs/${catalogId}/concepts`);
  };

  return (
    <>
      {showCancelConfirm && (
        <ConfirmModal
          title={localization.confirm.exitForm.title}
          content={localization.confirm.exitForm.message}
          onSuccess={handleCancel}
          onCancel={() => setShowCancelConfirm(false)}
        />
      )}
      <ButtonBar>
        <Button
          variant='tertiary'
          color='second'
          size='sm'
          onClick={() => setShowCancelConfirm(true)}
        >
          <ArrowLeftIcon fontSize='1.25em' />
          {localization.button.backToOverview}
        </Button>
      </ButtonBar>
      <ConceptForm
        afterSubmit={handleAfterSubmit}
        autoSaveStorage={dataStorage}
        catalogId={catalogId}
        initialConcept={concept}
        conceptStatuses={conceptStatuses}
        codeListsResult={codeListsResult}
        fieldsResult={fieldsResult}
        usersResult={usersResult}
        onSubmit={handleCreate}
        onCancel={handleCancel}
      />
    </>
  );
};
