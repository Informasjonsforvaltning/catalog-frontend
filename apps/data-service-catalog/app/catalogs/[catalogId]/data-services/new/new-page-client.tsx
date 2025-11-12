'use client';

import { Button, ButtonBar, ConfirmModal } from '@catalog-frontend/ui';
import { LocalDataStorage, localization } from '@catalog-frontend/utils';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { useRef, useState } from 'react';
import type { StorageData } from '@catalog-frontend/types';
import DataServiceForm from '../../../../../components/data-service-form';
import { createDataService } from '@data-service-catalog/app/actions/actions';
import { useRouter } from 'next/navigation';

type NewDataServicePageClientProps = {
    catalogId: string;
    initialValues: any;
    searchEnv: string;
    referenceData: any;
    referenceDataEnv: string;
};

export const NewDataServicePageClient = ({
    catalogId,
    initialValues,
    searchEnv,
    referenceData,
    referenceDataEnv
}: NewDataServicePageClientProps) => {
    const router = useRouter();
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const dataServiceIdRef = useRef<string | undefined>(undefined); // Ref to store the data service id

    const dataStorage = new LocalDataStorage<StorageData>({
        key: 'dataServiceForm'
    });

    const handleCancel = () => {
        dataStorage.delete();
        window.location.replace(`/catalogs/${catalogId}/data-services`);
    };

    const handleCreate = async (values: any) => {
        const dataServiceId = await createDataService(catalogId.toString(), values);
        dataServiceIdRef.current = dataServiceId;
        return undefined;
    };

    const handleAfterSubmit = async () => {
        if (dataServiceIdRef.current) {
            // Add a small delay to allow for data propagation and revalidation
            await new Promise(resolve => setTimeout(resolve, 500));

            // Navigate to the edit page with created=true parameter
            router.replace(`/catalogs/${catalogId}/data-services/${dataServiceIdRef.current}/edit?created=true`);
        } else {
            router.replace(`/catalogs/${catalogId}/data-services`);
        }
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
                    data-size='sm'
                    onClick={() => setShowCancelConfirm(true)}
                >
                    <ArrowLeftIcon fontSize='1.25em' />
                    {localization.button.backToOverview}
                </Button>
            </ButtonBar>
            <DataServiceForm
                initialValues={initialValues}
                searchEnv={searchEnv}
                referenceData={referenceData}
                referenceDataEnv={referenceDataEnv}
                autoSaveStorage={dataStorage}
                onCancel={handleCancel}
                onSubmit={handleCreate}
                afterSubmit={handleAfterSubmit}
            />
        </>
    );
}; 