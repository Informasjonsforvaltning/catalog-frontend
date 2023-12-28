'use client';
import { localization } from '@catalog-frontend/utils';
import { Button } from '@digdir/design-system-react';
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

type AddProps = {
  onClick: () => void;
  children: string;
};

export const AddButton = ({ onClick, children, ...props }: AddProps) => {
  return (
    <div>
      <Button
        icon={<PlusCircleIcon />}
        size='small'
        type='button'
        onClick={onClick}
        {...props}
      >
        {children}
      </Button>
    </div>
  );
};
