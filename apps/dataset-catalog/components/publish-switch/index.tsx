'use client';
import { localization } from '@catalog-frontend/utils';
import { Button } from '@digdir/designsystemet-react';
import { LinkButton } from '@catalog-frontend/ui';
import styles from './publish-switch.module.css';
import { publishDataset } from '../../app/actions/actions';
import { Dataset, PublicationStatus } from '@catalog-frontend/types';
import { VStack } from '@fellesdatakatalog/ui';

type Props = {
  catalogId: string;
  dataset: Dataset;
  disabled: boolean;
  referenceDataEnv: string;
  fdkDatasetId: string | null;
};

export const PublishSwitch = ({ catalogId, dataset, disabled, referenceDataEnv, fdkDatasetId }: Props) => {
  const handlePublishDataset = async () => {
    if (dataset.approved && !dataset.published) {
      if (window.confirm(localization.datasetForm.alert.confirmPublish)) {
        const publishedDataset = {
          ...dataset,
          published: true,
        };
        try {
          await publishDataset(catalogId, dataset, publishedDataset);
        } catch (error) {
          window.alert(error);
        }
      }
    }

    if (dataset.published) {
      if (window.confirm(localization.datasetForm.alert.confirmUnpublish)) {
        const approvedDataset = {
          ...dataset,
          approved: true,
          published: false,
        };
        try {
          await publishDataset(catalogId, dataset, approvedDataset);
        } catch (error) {
          window.alert(error);
        }
      }
    }
  };

  return (
    <>
      {
        dataset.published ?
        <VStack>
          {fdkDatasetId && (
            <LinkButton
              href={`${referenceDataEnv}/nb/datasets/${fdkDatasetId}`}
              data-variant='secondary'
              data-size='sm'
            >
              {localization.button.goToPage}
            </LinkButton>
          )}
          <Button onClick={() => handlePublishDataset()} data-size='sm' data-variant='secondary' data-color='danger'>
            {localization.button.unpublish}
          </Button>
        </VStack>:
        <Button onClick={() => handlePublishDataset()} data-size='sm' data-variant='secondary' data-color='success'>
          {localization.button.publish}
        </Button>
      }
    </>
  );
};

export default PublishSwitch;
