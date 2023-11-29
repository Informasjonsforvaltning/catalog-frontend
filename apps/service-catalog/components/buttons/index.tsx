'use client';
import { localization } from '@catalog-frontend/utils';
import { Button } from '@digdir/design-system-react';
import { deletePublicService } from '../../app/actions/public-services/actions';
import { deleteService } from '../../app/actions/services/actions';

type ServiceFormProps = {
  catalogId: string;
  serviceId: string;
  type: 'services' | 'public-services';
};

export const DeleteServiceButton = ({ catalogId, serviceId, type }: ServiceFormProps) => {
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
