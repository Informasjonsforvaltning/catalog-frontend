'use client';
import { useState } from 'react';
import { localization } from '@catalog-frontend/utils';
import { Switch } from '@digdir/designsystemet-react';
import { ConfirmModal } from '@catalog-frontend/ui';
import { publishDataService, unpublishDataService } from '../../app/actions/actions';
import { DataService } from '@catalog-frontend/types';

type Props = {
  catalogId: string;
  dataService: DataService;
  disabled: boolean;
};

export const PublishSwitch = ({ catalogId, dataService, disabled }: Props) => {
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [showUnpublishConfirm, setShowUnpublishConfirm] = useState(false);

  const handlePublishDataService = async () => {
    if (!dataService.published) {
      setShowPublishConfirm(true);
    }

    if (dataService.published) {
      setShowUnpublishConfirm(true);
    }
  };

  const handleConfirmPublish = async () => {
    try {
      await publishDataService(catalogId, dataService.id);
      setShowPublishConfirm(false);
    } catch (error) {
      window.alert(error);
    }
  };

  const handleConfirmUnpublish = async () => {
    try {
      await unpublishDataService(catalogId, dataService.id);
      setShowUnpublishConfirm(false);
    } catch (error) {
      window.alert(error);
    }
  };

  return (
    <>
      <Switch
        size='small'
        position='right'
        onChange={() => handlePublishDataService()}
        checked={dataService.published}
        disabled={disabled}
        data-testid='data-service-publish-switch'
      >
        {dataService.published ? localization.publicationState.published : localization.publicationState.unpublished}
      </Switch>

      {showPublishConfirm && (
        <ConfirmModal
          title={localization.dataServiceForm.alert.confirmPublishTitle || 'Bekreft publisering'}
          content={localization.dataServiceForm.alert.confirmPublish}
          successButtonText={localization.button.publish || 'Publiser'}
          onSuccess={handleConfirmPublish}
          onCancel={() => setShowPublishConfirm(false)}
        />
      )}

      {showUnpublishConfirm && (
        <ConfirmModal
          title={localization.dataServiceForm.alert.confirmUnpublishTitle || 'Bekreft avpublisering'}
          content={localization.dataServiceForm.alert.confirmUnpublish}
          successButtonText={localization.button.unpublish || 'Avpubliser'}
          onSuccess={handleConfirmUnpublish}
          onCancel={() => setShowUnpublishConfirm(false)}
        />
      )}
    </>
  );
};

export default PublishSwitch;
