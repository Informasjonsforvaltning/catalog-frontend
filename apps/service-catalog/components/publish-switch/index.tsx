'use client';
import { localization } from '@catalog-frontend/utils';
import { Switch } from '@digdir/designsystemet-react';
import { publishPublicService, unpublishPublicService } from '../../app/actions/public-services/actions';
import styles from './publish-switch.module.css';
import { publishService, unpublishService } from '../../app/actions/services/actions';

type ServiceFormProps = {
  catalogId: string;
  serviceId: string;
  isPublished: boolean;
  type: 'public-services' | 'services';
  disabled?: boolean;
};

export const PublishSwitch = ({ catalogId, serviceId, isPublished, type, disabled = false }: ServiceFormProps) => {
  const handlePublishPublicService = async () => {
    if (isPublished === false) {
      if (window.confirm(localization.serviceCatalog.confirmPublish)) {
        try {
          await publishPublicService(catalogId, serviceId);
        } catch (error) {
          window.alert(error);
        }
      }
    }

    if (isPublished === true) {
      if (window.confirm(localization.serviceCatalog.confirmUnpublish)) {
        try {
          await unpublishPublicService(catalogId, serviceId);
        } catch (error) {
          window.alert(error);
        }
      }
    }
  };

  const handlePublishService = async () => {
    if (isPublished === false) {
      if (window.confirm(localization.serviceCatalog.confirmPublish)) {
        try {
          await publishService(catalogId, serviceId);
        } catch (error) {
          window.alert(error);
        }
      }
    }

    if (isPublished === true) {
      if (window.confirm(localization.serviceCatalog.confirmUnpublish)) {
        try {
          await unpublishService(catalogId, serviceId);
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
        value='published'
        size='small'
        position='right'
        checked={isPublished}
        onChange={() => (type === 'services' ? handlePublishService() : handlePublishPublicService())}
        disabled={disabled}
      >
        {localization.publicationState.published}
      </Switch>
    </>
  );
};

export default PublishSwitch;
