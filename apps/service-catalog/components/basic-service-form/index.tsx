'use client';

import { Textarea, Textfield } from '@digdir/designsystemet-react';
import { Button, FormContainer, Select } from '@catalog-frontend/ui';
import { localization, getTranslateText } from '@catalog-frontend/utils';
import { ISOLanguage, Output, ReferenceDataCode, Service, ServiceToBeCreated } from '@catalog-frontend/types';
import styles from './service-form.module.css';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import {
  createPublicService,
  deletePublicService,
  updatePublicService,
} from '../../app/actions/public-services/actions';
import { useRouter } from 'next/navigation';
import { createService, deleteService, updateService } from '../../app/actions/services/actions';
import { Field, FieldArray, Form, Formik } from 'formik';
import { serviceTemplate, emptyProduces } from './service-template';
import { validationSchema } from './validation-schema';

interface ServiceFormProps {
  catalogId: string;
  service?: Service;
  type: 'public-services' | 'services';
  statuses: ReferenceDataCode[];
}

const formLanguages: ISOLanguage[] = ['nb', 'nn', 'en'];

export const BasicServiceForm = ({ catalogId, service, type, statuses }: ServiceFormProps) => {
  const router = useRouter();
  const initialValues = serviceTemplate(service);

  const handleProducesIds = (values: ServiceToBeCreated | Service) => {
    const serviceCopy = { ...values };
    let counter = 0;

    serviceCopy.produces?.forEach((p: Output) => {
      p.identifier = String(counter);
      counter++;
    });
    return serviceCopy;
  };

  const saveService = async (values: Service | ServiceToBeCreated) => {
    try {
      let updatedService = values;

      if (updatedService.produces) {
        updatedService = handleProducesIds(values);
      }
      service
        ? await handleUpdateService(updatedService as Service)
        : await handleCreateService(updatedService as ServiceToBeCreated);
    } catch (error) {
      window.alert(error);
    }
  };

  const savePublicService = (values: Service | ServiceToBeCreated) => {
    let updatedService = values;
    if (updatedService.produces) {
      updatedService = handleProducesIds(values);
    }
    service
      ? handleUpdatePublicService(updatedService as Service)
      : handleCreatePublicService(updatedService as ServiceToBeCreated);
  };

  const handleUpdateService = async (values: Service | ServiceToBeCreated) => {
    let updatedService = values;
    if (updatedService.produces) {
      updatedService = handleProducesIds(values);
    }

    if (catalogId) {
      try {
        service && (await updateService(catalogId, service, updatedService as Service));
        router.push(`/catalogs/${catalogId}/services/${service?.id}`);
      } catch (error) {
        window.alert(`${localization.alert.updateFailed} ${error}`);
      }
    } else {
      createService(catalogId, updatedService as ServiceToBeCreated);
    }
  };

  const handleUpdatePublicService = async (values: Service | ServiceToBeCreated) => {
    let updatedService = values;
    if (updatedService.produces) {
      updatedService = handleProducesIds(values);
    }

    if (catalogId) {
      try {
        service && (await updatePublicService(catalogId, service, updatedService as Service));
        router.push(`/catalogs/${catalogId}/public-services/${service?.id}`);
      } catch (error) {
        window.alert(`${localization.alert.updateFailed} ${error}`);
      }
    } else {
      createPublicService(catalogId, updatedService as ServiceToBeCreated);
    }
  };

  const handleDeleteService = async () => {
    if (service) {
      if (window.confirm(localization.serviceCatalog.form.confirmDelete)) {
        try {
          await deleteService(catalogId, service.id);
        } catch (error) {
          window.alert(error);
        }
      }
    }
  };

  const handleDeletePublicService = async () => {
    if (service) {
      if (window.confirm(localization.serviceCatalog.form.confirmDelete)) {
        try {
          await deletePublicService(catalogId, service.id);
        } catch (error) {
          window.alert(error);
        }
      }
    }
  };

  const handleCreatePublicService = async (values: ServiceToBeCreated) => {
    if (!catalogId) return;
    try {
      const serviceId = await createPublicService(catalogId.toString(), values);

      if (serviceId) {
        router.push(`/catalogs/${catalogId}/public-services/${serviceId}`);
      } else {
        window.alert(`${localization.alert.fail}`);
      }
    } catch (error) {
      window.alert(`${localization.alert.fail} ${error}`);
    }
  };

  const handleCreateService = async (values: ServiceToBeCreated) => {
    if (!catalogId) return;
    try {
      const serviceId = await createService(catalogId, values);

      if (serviceId) {
        router.push(`/catalogs/${catalogId}/services/${serviceId}`);
      } else {
        window.alert(`${localization.alert.fail}`);
      }
    } catch (error) {
      window.alert(`${localization.alert.fail} ${error}`);
    }
  };

  function handleSubmit(values: any): void {
    type === 'services' ? saveService(values) : savePublicService(values);
  }

  return (
    <div className='container'>
      <Formik
        onSubmit={(values) => handleSubmit(values)}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({ errors, values }) => (
          <Form>
            <div className={styles.formCard}>
              <FormContainer variant='third'>
                <FormContainer.Header
                  title={localization.name}
                  subtitle={localization.serviceCatalog.form.titleSubtitle}
                />
                {formLanguages.map((language) => (
                  <Field
                    as={Textfield}
                    label={localization.formatString(localization.concept.formFieldLabel, {
                      fieldType: localization.name,
                      lang: localization.language[language]?.toLowerCase(),
                    })}
                    type='text'
                    name={`title.${language}`}
                    key={`name-${language}`}
                    error={errors.title?.nb}
                  />
                ))}

                <FormContainer.Header
                  title={localization.description}
                  subtitle={localization.serviceCatalog.form.descriptionSubtitle}
                />
                {formLanguages.map((language) => (
                  <Field
                    name={`description.${language}`}
                    as={Textarea}
                    label={localization.formatString(localization.concept.formFieldLabel, {
                      fieldType: localization.description,
                      lang: localization.language[language]?.toLowerCase(),
                    })}
                    key={`description-${language}`}
                  />
                ))}

                <FormContainer.Header
                  title={localization.serviceCatalog.produces}
                  subtitle={localization.serviceCatalog.form.descriptionProduces}
                />
                <FieldArray name={`produces`}>
                  {(arrayHelpers: any) => (
                    <>
                      {values.produces &&
                        values.produces.map((_, index: number) => (
                          <div
                            key={`produces-${index}`}
                            className={styles.fieldArray}
                          >
                            {formLanguages.map((language) => (
                              <div key={`produces-title-${index}-${language}`}>
                                <Field
                                  name={`produces[${index}].title.${language}`}
                                  label={localization.formatString(localization.concept.formFieldLabel, {
                                    fieldType: localization.name,
                                    lang: localization.language[language]?.toLowerCase(),
                                  })}
                                  as={Textfield}
                                  className={styles.pb2}
                                  error={
                                    errors?.produces &&
                                    errors?.produces[index] &&
                                    (errors?.produces as any)[index].title?.nb
                                  }
                                />
                              </div>
                            ))}
                            {formLanguages.map((language) => (
                              <div key={`produces-description-${index}-${language}`}>
                                <Field
                                  name={`produces[${index}].description.${language}`}
                                  label={localization.formatString(localization.concept.formFieldLabel, {
                                    fieldType: localization.description,
                                    lang: localization.language[language]?.toLowerCase(),
                                  })}
                                  as={Textfield}
                                  className={styles.pb2}
                                  error={(errors?.produces as any)?.[index]?.description?.nb}
                                />
                              </div>
                            ))}

                            <Button
                              type='button'
                              variant='secondary'
                              color='danger'
                              onClick={() => arrayHelpers.remove(index)}
                              key={`produces-button-${index}`}
                            >
                              <>
                                <TrashIcon />
                                <span>{localization.button.delete}</span>
                              </>
                            </Button>
                          </div>
                        ))}
                      <div>
                        <Button onClick={() => arrayHelpers.push(emptyProduces[0])}>
                          <>
                            <PlusCircleIcon />
                            {localization.button.addRelation}
                          </>
                        </Button>
                      </div>
                    </>
                  )}
                </FieldArray>

                <FormContainer.Header title={localization.serviceCatalog.contactPoint} />
                <div>
                  {formLanguages.map((language) => (
                    <Field
                      name={`contactPoints[0].category.${language}`}
                      label={localization.formatString(localization.concept.formFieldLabel, {
                        fieldType: localization.category,
                        lang: localization.language[language]?.toLowerCase(),
                      })}
                      as={Textfield}
                      className={styles.pb2}
                      type='text'
                      key={`category-${language}`}
                      error={errors.contactPoints && (errors.contactPoints as any)[0].category?.nb}
                    />
                  ))}
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

                <FormContainer.Header title='Status' />
                <Field
                  as={Select}
                  name='status'
                >
                  <option value={undefined}>Ingen status</option>
                  {statuses.map((status) => (
                    <option
                      key={`status-${status.code}`}
                      value={status.uri}
                    >
                      {getTranslateText(status.label)}
                    </option>
                  ))}
                </Field>

                <FormContainer.Header
                  title={localization.homepage}
                  subtitle={localization.serviceCatalog.form.homepageDescription}
                />
                <Field
                  name={'homepage'}
                  label={localization.serviceCatalog.form.homepageLabel}
                  as={Textfield}
                  className={styles.pb2}
                  type='text'
                  error={errors.homepage}
                />
              </FormContainer>

              <div className={styles.buttonRow}>
                <Button type='submit'>{localization.serviceCatalog.form.save}</Button>
                {service ? (
                  <Button
                    color='danger'
                    variant='secondary'
                    size='small'
                    onClick={() => (type === 'services' ? handleDeleteService() : handleDeletePublicService())}
                  >
                    <>
                      <TrashIcon fontSize='1.5rem' />
                      {localization.serviceCatalog.form.delete}
                    </>
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
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BasicServiceForm;
