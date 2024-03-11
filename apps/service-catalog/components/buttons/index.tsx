'use client';
import { localization } from '@catalog-frontend/utils';
import { Button, ButtonProps } from '@catalog-frontend/ui';
import { deletePublicService } from '../../app/actions/public-services/actions';
import { deleteService } from '../../app/actions/services/actions';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import styles from './buttons.module.css';

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

export const AddButton = ({ onClick, children, ...props }: ButtonProps) => {
  return (
    <div>
      <Button
        size='small'
        type='button'
        onClick={onClick}
        {...props}
      >
        <PlusCircleIcon />
        {children}
      </Button>
    </div>
  );
};
