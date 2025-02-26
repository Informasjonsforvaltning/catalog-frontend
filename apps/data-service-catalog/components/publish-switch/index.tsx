'use client';
import { localization } from '@catalog-frontend/utils';
import { Switch } from '@digdir/designsystemet-react';
import { publishDataService, unpublishDataService } from '../../app/actions/actions';
import { DataService } from '@catalog-frontend/types';

type Props = {
  catalogId: string;
  dataService: DataService;
  disabled: boolean;
};

export const PublishSwitch = ({ catalogId, dataService, disabled }: Props) => {
  const handlePublishDataService = async () => {
    if (!dataService.published) {
      if (window.confirm(localization.datasetForm.alert.confirmPublish)) {
        try {
          await publishDataService(catalogId, dataService.id);
        } catch (error) {
          window.alert(error);
        }
      }
    }

    if (dataService.published) {
      if (window.confirm(localization.datasetForm.alert.confirmUnpublish)) {
        try {
          await unpublishDataService(catalogId, dataService.id);
        } catch (error) {
          window.alert(error);
        }
      }
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
      >
        {dataService.published ? localization.publicationState.published : localization.publicationState.unpublished}
      </Switch>
    </>
  );
};

export default PublishSwitch;
