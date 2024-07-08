'use client';
import { localization } from '@catalog-frontend/utils';
import { Button } from '@catalog-frontend/ui';
import { deletePublicService } from '../../app/actions/public-services/actions';
import { deleteService } from '../../app/actions/services/actions';

type DeleteProps = {
  catalogId: string;
  serviceId: string;
  type: 'services' | 'public-services';
};

export const DeleteServiceButton = ({ catalogId, serviceId, type }: DeleteProps) => {
  const handleDelete = () => {
    if (window.confirm(localization.serviceCatalog.form.confirmDelete)) {
      type === 'public-services' ? deletePublicService(catalogId, serviceId) : deleteService(catalogId, serviceId);
    }
  };

  return (
    <Button
      size='small'
      color={'danger'}
      onClick={handleDelete}
    >
      {localization.button.delete}
    </Button>
  );
};
