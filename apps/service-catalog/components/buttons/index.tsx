'use client';
import { localization } from '@catalog-frontend/utils';
import { Button } from '@digdir/design-system-react';
import { deletePublicService } from '../../app/actions/public-services/actions';

type ServiceFormProps = {
  catalogId: string;
  serviceId: string;
};

export const DeletePublicServiceButton = ({ catalogId, serviceId }: ServiceFormProps) => {
  const handleDelete = () => {
    if (window.confirm(localization.serviceCatalog.form.confirmDelete)) {
      deletePublicService(catalogId, serviceId);
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
