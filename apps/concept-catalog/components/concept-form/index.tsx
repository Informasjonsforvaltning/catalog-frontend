'use client';
import { localization, trimObjectWhitespace } from '@catalog-frontend/utils';
import { Button, Heading, Tabs } from '@digdir/designsystemet-react';
import { Concept } from '@catalog-frontend/types';
import { FormLayout, useWarnIfUnsavedChanges } from '@catalog-frontend/ui';
import { Formik, Form } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { createConcept, updateConcept } from '../../app/actions/concept/actions';
import { useState } from 'react';
import { conceptValidationSchema as validationSchema } from './validation-schema';
import { TermSection } from './components/term-section';

type Props = {
  concept: Concept;
};

const mapPropsToValues = (concept: Concept) => {
  return concept;
};

export const ConceptForm = ({ concept }: Props) => {
  const { catalogId, conceptId } = useParams();
  const [isDirty, setIsDirty] = useState(false);
  const router = useRouter();

  useWarnIfUnsavedChanges({ unsavedChanges: isDirty });

  const handleCreate = (values: Concept) => {
    createConcept(values, catalogId.toString());
  };

  const handleUpdate = async (values: Concept) => {
    if ('id' in concept) {
      try {
        await updateConcept(catalogId.toString(), concept, values);
      } catch (error) {
        window.alert(`${localization.alert.updateFailed} ${error}`);
      }
    } else {
      handleCreate(values);
    }
  };

  const handleCancel = () => {
    router.push(
      concept.id ? `/catalogs/${catalogId}/${concept.id}` : `/catalogs/${catalogId}`,
    );
  };

  return (
    <Formik
      initialValues={mapPropsToValues(concept)}
      validationSchema={validationSchema}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={(values, { setSubmitting }) => {
        const trimmedValues = trimObjectWhitespace(values);
        conceptId === null ? handleCreate(trimmedValues) : handleUpdate(trimmedValues as Concept);
        setSubmitting(false);
      }}
    >
      {({ errors, values, dirty, handleSubmit, isValid }) => {
        setTimeout(() => setIsDirty(dirty), 0);

        return (
          <Form
            onSubmit={(e) => {
              if (!isValid) {
                e.preventDefault();
                window.alert(localization.datasetForm.alert.formError);
              } else {
                handleSubmit(e);
              }
            }}
          >
            <FormLayout>
              <FormLayout.ButtonsRow>
                <Button type='submit'>{localization.button.save}</Button>
                <Button
                  variant='secondary'
                  onClick={handleCancel}
                >
                  {localization.button.cancel}
                </Button>
              </FormLayout.ButtonsRow>
              <TermSection errors={errors} />
                            
            </FormLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ConceptForm;
