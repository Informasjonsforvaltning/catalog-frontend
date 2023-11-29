'use client';
import { localization } from '@catalog-frontend/utils';
import { Switch } from '@digdir/design-system-react';
import { publishPublicService } from '../../app/actions/public-services/actions';
import styles from './publish-switch.module.css';

type ServiceFormProps = {
  catalogId: string;
  serviceId: string;
  isPublished: boolean;
};

export const PublishSwitch = ({ catalogId, serviceId, isPublished }: ServiceFormProps) => {
  const handlePublishPublicService = () => {
    if (window.confirm(localization.serviceCatalog.confirmPublish)) {
      publishPublicService(catalogId, serviceId);
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
        onChange={() => handlePublishPublicService()}
      >
        {localization.publicationState.published}
      </Switch>
    </>
  );
};

export default PublishSwitch;
