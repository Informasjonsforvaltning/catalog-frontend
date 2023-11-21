'use client';

import { Tag, Textarea, Textfield } from '@digdir/design-system-react';
import { Button, FormFieldCard } from '@catalog-frontend/ui';

import { localization } from '@catalog-frontend/utils';

import { Service } from '@catalog-frontend/types';

import styles from './service-form.module.css';

import { TrashIcon } from '@navikt/aksel-icons';
import { createNewPublicService } from '../../actions/public-services/actions';

type ServiceFormProps = {
  catalogId: string;
  service?: Service;
};

export const ServiceForm = ({ catalogId, service }: ServiceFormProps) => {
  const createPublicService = createNewPublicService.bind(null, catalogId);

  return (
    <>
      <div className='container'>
        <div className={styles.pageContainer}>
          <form action={createPublicService}>
            <div className={styles.formContainer}>
              <FormFieldCard
                title={localization.title}
                subtitle='Egenskapen brukes å til oppgi navn til en tjeneste'
              >
                <div>
                  <Textfield
                    defaultValue={service?.title.nb}
                    label={
                      <div>
                        <p>Tekst på bokmål</p>
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
              <FormFieldCard
                title={localization.description}
                subtitle='Egenskapen brukes til å oppgi en tekstlig beskrivelse av tjenesten'
              >
                <Textarea name='description.nb' />
              </FormFieldCard>
            </div>

            <div>
              <Button type='submit'>Lagre tjeneste</Button>
              {service ? (
                <Button
                  color='danger'
                  variant='secondary'
                >
                  <TrashIcon fontSize='1.5rem' />
                  Slett tjeneste
                </Button>
              ) : (
                <Button
                  color='danger'
                  variant='secondary'
                >
                  Avbryt
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ServiceForm;
