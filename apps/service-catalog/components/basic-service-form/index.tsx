'use client';

import { NativeSelect, Textarea, Textfield } from '@digdir/design-system-react';
import { Button, FormFieldCard } from '@catalog-frontend/ui';
import { localization, getTranslateText } from '@catalog-frontend/utils';
import { Output, ReferenceDataCode, Service, ServiceToBeCreated } from '@catalog-frontend/types';
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
import { validationSchema } from './validation-schema';

interface ServiceFormProps {
  catalogId: string;
  service?: Service;
  type: 'public-services' | 'services';
  statuses: ReferenceDataCode[];
}

export const BasicServiceForm = ({ catalogId, service, type, statuses }: ServiceFormProps) => {
  const router = useRouter();
  const initalValues = serviceTemplate(service);

  const handleProducesIds = (values: ServiceToBeCreated | Service) => {
    const serviceCopy = { ...values };
    let counter = 0;

    serviceCopy.produces?.forEach((p: Output) => {
      p.identifier = String(counter);
      counter++;
    });
    return serviceCopy;
  };

  const saveService = (values: Service | ServiceToBeCreated) => {
    let updatedService = values;
    if (updatedService.produces) {
      updatedService = handleProducesIds(values);
    }
    service
      ? updateService(catalogId, service, updatedService as Service)
      : createService(catalogId, updatedService as ServiceToBeCreated);
  };

  const savePublicService = (values: Service | ServiceToBeCreated) => {
    let updatedService = values;
    if (updatedService.produces) {
      updatedService = handleProducesIds(values);
    }
    service
      ? updatePublicService(catalogId, service, updatedService as Service)
      : createPublicService(catalogId, updatedService as ServiceToBeCreated);
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
          validationSchema={validationSchema}
        >
          {({ errors, values }) => (
            <Form>
              <div className={styles.formCard}>
                <FormFieldCard
                  title={localization.name}
                  subtitle={localization.serviceCatalog.form.titleSubtitle}
                >
                  <Field
                    as={Textfield}
                    label={localization.serviceCatalog.form.titleLabel}
                    type='text'
                    name={'title.nb'}
                    error={errors.title?.nb}
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
                              error={
                                errors?.produces &&
                                errors?.produces[index] &&
                                (errors?.produces as any)[index].title?.nb
                              }
                            />
                            <Field
                              name={`produces[${index}].description.nb`}
                              label={localization.description}
                              as={Textfield}
                              className={styles.pb2}
                              error={(errors?.produces as any)?.[index]?.description?.nb}
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
                    error={errors.contactPoints && (errors.contactPoints as any)[0].category?.nb}
                  />
                  <Field
                    name={'contactPoints[0].email'}
                    label={localization.email}
                    as={Textfield}
                    className={styles.pb2}
                    type='email'
                    error={errors.contactPoints && (errors.contactPoints as any)[0].email}
                  />
                  <Field
                    name={'contactPoints[0].telephone'}
                    label={localization.telephone}
                    as={Textfield}
                    className={styles.pb2}
                    type='tel'
                    error={errors.contactPoints && (errors.contactPoints as any)[0].telephone}
                  />
                  <Field
                    name={'contactPoints[0].contactPage'}
                    label={localization.contactPage}
                    as={Textfield}
                    className={styles.pb2}
                    type='text'
                    error={errors.contactPoints && (errors.contactPoints as any)[0].contactPage}
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
                  error={errors.homepage}
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
