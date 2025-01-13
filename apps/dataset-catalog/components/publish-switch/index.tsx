'use client';
import { localization } from '@catalog-frontend/utils';
import { Switch } from '@digdir/designsystemet-react';
import styles from './publish-switch.module.css';
import { publishDataset } from '../../app/actions/actions';
import { Dataset, PublicationStatus } from '@catalog-frontend/types';

type Props = {
  catalogId: string;
  dataset: Dataset;
  disabled: boolean;
};

export const PublishSwitch = ({ catalogId, dataset, disabled }: Props) => {
  const handlePublishDataset = async () => {
    if (dataset.registrationStatus !== PublicationStatus.PUBLISH) {
      if (window.confirm(localization.datasetForm.alert.confirmPublish)) {
        const publishedDataset = {
          ...dataset,
          registrationStatus: PublicationStatus.PUBLISH,
        };
        try {
          await publishDataset(catalogId, dataset, publishedDataset);
        } catch (error) {
          window.alert(error);
        }
      }
    }

    if (dataset.registrationStatus === PublicationStatus.PUBLISH) {
      if (window.confirm(localization.datasetForm.alert.confirmUnpublish)) {
        const approvedDataset = {
          ...dataset,
          registrationStatus: PublicationStatus.APPROVE,
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
      <Switch
        className={styles.center}
        size='small'
        position='right'
        onChange={() => handlePublishDataset()}
        checked={dataset?.registrationStatus === PublicationStatus.PUBLISH}
        disabled={disabled || dataset.registrationStatus === PublicationStatus.DRAFT}
      >
        {localization.publicationState.published}
      </Switch>
    </>
  );
};

export default PublishSwitch;
