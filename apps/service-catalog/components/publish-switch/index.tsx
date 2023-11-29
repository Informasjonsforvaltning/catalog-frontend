'use client';
import { localization } from '@catalog-frontend/utils';
import { Switch } from '@digdir/design-system-react';
import { publishPublicService } from '../../app/actions/public-services/actions';
import styles from './publish-switch.module.css';
import { publishService } from '../../app/actions/services/actions';

type ServiceFormProps = {
  catalogId: string;
  serviceId: string;
  isPublished: boolean;
  type: 'public-services' | 'services';
};

export const PublishSwitch = ({ catalogId, serviceId, isPublished, type }: ServiceFormProps) => {
  const handlePublishPublicService = () => {
    if (window.confirm(localization.serviceCatalog.confirmPublish)) {
      publishPublicService(catalogId, serviceId);
    }
  };

  const handlePublishService = () => {
    if (window.confirm(localization.serviceCatalog.confirmPublish)) {
      publishService(catalogId, serviceId);
    }
  };

  return (
    <>
      <Switch
        className={styles.center}
        value='published'
        size='small'
        position='right'
        readOnly={isPublished}
        checked={isPublished}
        onChange={() => (type === 'services' ? handlePublishService() : handlePublishPublicService())}
      >
        {localization.publicationState.published}
      </Switch>
    </>
  );
};

export default PublishSwitch;
