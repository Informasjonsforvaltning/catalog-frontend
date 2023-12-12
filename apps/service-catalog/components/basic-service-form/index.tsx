'use client';

import { NativeSelect, Textarea, Textfield } from '@digdir/design-system-react';
import { Button, FormFieldCard } from '@catalog-frontend/ui';
import { localization, getTranslateText } from '@catalog-frontend/utils';
import { Output, ReferenceDataCode, Service } from '@catalog-frontend/types';
import styles from './service-form.module.css';
import { TrashIcon } from '@navikt/aksel-icons';
import {
  createPublicService,
  deletePublicService,
  updatePublicService,
} from '../../app/actions/public-services/actions';
import { useRouter } from 'next/navigation';
import { createService, deleteService, updateService } from '../../app/actions/services/actions';
import { Field, FieldArray, Form, Formik } from 'formik';
import { AddButton } from '../buttons';
import { serviceTemplate, emptyProduces } from './service-template';

type ServiceFormProps = {
  catalogId: string;
  service?: Service;
  type: 'public-services' | 'services';
  statuses: ReferenceDataCode[];
};

export const BasicServiceForm = ({ catalogId, service, type, statuses }: ServiceFormProps) => {
  const router = useRouter();
  const initalValues = serviceTemplate(service);

  const handleProducesIds = (values: any) => {
    const serviceCopy = { ...values };
    let counter = 0;

    serviceCopy.produces.forEach((p: Output) => {
      p.identifier = String(counter);
      counter++;
    });
    return serviceCopy;
  };

  const saveService = (values: any) => {
    const updatedService = handleProducesIds(values);
    service ? updateService(catalogId, service, updatedService) : createService(catalogId, updatedService);
  };

  const savePublicService = (values: any) => {
    const updatedService = handleProducesIds(values);
    service ? updatePublicService(catalogId, service, updatedService) : createPublicService(catalogId, updatedService);
  };

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

  function handleSubmit(values: any): void {
    type === 'services' ? saveService(values) : savePublicService(values);
  }

  return (
    <>
      <div className='container'>
        <Formik
          onSubmit={(values) => handleSubmit(values)}
          initialValues={initalValues}
        >
          {({ values }) => (
            <Form>
              <div className={styles.formCard}>
                <FormFieldCard
                  title={localization.title}
                  subtitle={localization.serviceCatalog.form.titleSubtitle}
                >
                  <Field
                    as={Textfield}
                    label={<p>{localization.serviceCatalog.form.titleLabel}</p>}
                    type='text'
                    name={'title.nb'}
                  />
                </FormFieldCard>
              </div>
              <FormFieldCard
                title={localization.description}
                subtitle={localization.serviceCatalog.form.descriptionSubtitle}
              >
                <Field
                  name='description.nb'
                  as={Textarea}
                />
              </FormFieldCard>

              <FormFieldCard
                title={localization.serviceCatalog.produces}
                subtitle={localization.serviceCatalog.form.descriptionProduces}
              >
                <FieldArray name={`produces`}>
                  {(arrayHelpers: any) => (
                    <>
                      {values.produces &&
                        values?.produces.map((_, index: number) => (
                          <div
                            key={`produces-${index}`}
                            className={styles.fieldArray}
                          >
                            <Field
                              name={`produces[${index}].title.nb`}
                              label={localization.title}
                              as={Textfield}
                              className={styles.pb2}
                            />
                            <Field
                              name={`produces[${index}].description.nb`}
                              label={localization.description}
                              as={Textfield}
                              className={styles.pb2}
                            />

                            <Button
                              type='button'
                              variant='secondary'
                              icon={<TrashIcon />}
                              color='danger'
                              onClick={() => arrayHelpers.remove(index)}
                            >
                              {localization.button.delete}
                            </Button>
                          </div>
                        ))}
                      <AddButton onClick={() => arrayHelpers.push(emptyProduces[0])}>
                        {localization.button.addRelation}
                      </AddButton>
                    </>
                  )}
                </FieldArray>
              </FormFieldCard>
              <FormFieldCard title={localization.serviceCatalog.contactPoint}>
                <div>
                  <Field
                    name={'contactPoints[0].category.nb'}
                    label={localization.category}
                    as={Textfield}
                    className={styles.pb2}
                    type='text'
                  />
                  <Field
                    name={'contactPoints[0].email'}
                    label={localization.email}
                    as={Textfield}
                    className={styles.pb2}
                    type='email'
                  />
                  <Field
                    name={'contactPoints[0].telephone'}
                    label={localization.telephone}
                    as={Textfield}
                    className={styles.pb2}
                    type='tel'
                  />
                  <Field
                    name={'contactPoints[0].contactPage'}
                    label={localization.contactPage}
                    as={Textfield}
                    className={styles.pb2}
                    type='text'
                  />
                </div>
              </FormFieldCard>
              <FormFieldCard title='Status'>
                <Field
                  as={NativeSelect}
                  name='status'
                >
                  <option value={undefined}>Ingen status</option>
                  {statuses.map((status) => (
                    <option
                      key={status.code}
                      value={status.uri}
                    >
                      {getTranslateText(status.label)}
                    </option>
                  ))}
                </Field>
              </FormFieldCard>

              <FormFieldCard
                title={localization.homepage}
                subtitle={localization.serviceCatalog.form.homepageDescription}
              >
                <Field
                  name={'homepage'}
                  label={localization.serviceCatalog.form.homepageLabel}
                  as={Textfield}
                  className={styles.pb2}
                  type='text'
                />
              </FormFieldCard>

              <div className={styles.buttonRow}>
                <Button type='submit'>{localization.serviceCatalog.form.save}</Button>
                {service ? (
                  <Button
                    color='danger'
                    variant='secondary'
                    size='small'
                    onClick={() => (type === 'services' ? handleDeleteService() : handleDeletePublicService())}
                  >
                    <TrashIcon fontSize='1.5rem' />
                    {localization.serviceCatalog.form.delete}
                  </Button>
                ) : (
                  <Button
                    color='danger'
                    variant='secondary'
                    size='small'
                    onClick={() => router.push(`/catalogs/${catalogId}/${type}`)}
                  >
                    {localization.button.cancel}
                  </Button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default BasicServiceForm;
