'use client';

import { Tag, Textarea, Textfield } from '@digdir/design-system-react';
import { Button, FormFieldCard } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Service } from '@catalog-frontend/types';
import styles from './service-form.module.css';
import { TrashIcon } from '@navikt/aksel-icons';
import {
  createPublicService,
  deletePublicService,
  updatePublicService,
} from '../../app/actions/public-services/actions';
import { useRouter } from 'next/navigation';
import { createService, deleteService, updateService } from '../../app/actions/services/actions';

type ServiceFormProps = {
  catalogId: string;
  service?: Service;
  type: 'public-services' | 'services';
};

export const BasicServiceForm = ({ catalogId, service, type }: ServiceFormProps) => {
  const router = useRouter();

  const saveService = service ? updateService.bind(null, catalogId, service) : createService.bind(null, catalogId);

  const savePublicService = service
    ? updatePublicService.bind(null, catalogId, service)
    : createPublicService.bind(null, catalogId);

  const handleDeleteService = () => {
    if (service) {
      if (window.confirm(localization.serviceCatalog.form.confirmDelete)) {
        deleteService(catalogId, service.id);
      }
    }
  };

  const handleDeletePublicService = () => {
    if (service) {
      if (window.confirm(localization.serviceCatalog.form.confirmDelete)) {
        deletePublicService(catalogId, service.id);
      }
    }
  };

  return (
    <>
      <div className='container'>
        <form action={type === 'services' ? saveService : savePublicService}>
          <div className={styles.formCard}>
            <FormFieldCard
              title={localization.title}
              subtitle={localization.serviceCatalog.form.titleSubtitle}
            >
              <div>
                <Textfield
                  defaultValue={service?.title.nb}
                  label={
                    <div>
                      <p>{localization.serviceCatalog.form.titleLabel}</p>
                      <Tag
                        variant='secondary'
                        color='first'
                        size='small'
                      >
                        Må fylles ut
                      </Tag>
                    </div>
                  }
                  type='text'
                  name='title.nb'
                />
              </div>
            </FormFieldCard>
          </div>
          <FormFieldCard
            title={localization.description}
            subtitle={localization.serviceCatalog.form.descriptionSubtitle}
          >
            <Textarea name='description.nb' />
          </FormFieldCard>

          <div className={styles.buttonRow}>
            <Button type='submit'>{localization.serviceCatalog.form.save}</Button>
            {service ? (
              <Button
                color='danger'
                variant='secondary'
                onClick={() => (type === 'services' ? handleDeleteService() : handleDeletePublicService())}
              >
                <TrashIcon fontSize='1.5rem' />
                {localization.serviceCatalog.form.delete}
              </Button>
            ) : (
              <Button
                color='danger'
                variant='secondary'
                onClick={() => router.push(`/catalogs/${catalogId}/${type}`)}
              >
                {localization.button.cancel}
              </Button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default BasicServiceForm;
