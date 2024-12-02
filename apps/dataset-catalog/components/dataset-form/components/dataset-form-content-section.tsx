'use client';
import { Dataset } from '@catalog-frontend/types';
import { FormContainer } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Heading, Textfield, Textarea, Button } from '@digdir/designsystemet-react';
import { MinusCircleIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { Field, FieldArray, useFormikContext } from 'formik';

export const ContentSection = () => {
  const { errors, values } = useFormikContext<Dataset>();

  return (
    <div>
      <Heading
        size='sm'
        spacing
      >
        {localization.datasetForm.heading.content}
      </Heading>
      <FormContainer>
        <FormContainer.Header
          title={localization.datasetForm.heading.standard}
          subtitle={localization.datasetForm.helptext.standard}
        />
        <FieldArray name='conformsTo'>
          {({ push, remove }) => (
            <>
              {values.conformsTo &&
                values.conformsTo.map((_, index) => (
                  <div key={index}>
                    <Field
                      as={Textfield}
                      name={`conformsTo[${index}].prefLabel.nb`}
                      label={localization.title}
                    />
                    <Field
                      as={Textfield}
                      name={`conformsTo[${index}].uri`}
                      label={localization.uri}
                      // @ts-expect-error: uri exists on the object
                      error={errors.conformsTo?.[index]?.uri || ''}
                    />
                    <Button
                      type='button'
                      onClick={() => remove(index)}
                      variant='tertiary'
                      color='danger'
                    >
                      <MinusCircleIcon />
                      {localization.remove}
                    </Button>
                  </div>
                ))}

              <div>
                <Button
                  type='button'
                  onClick={() => push({ prefLabel: { nb: '' }, uri: '' })}
                  variant='tertiary'
                >
                  <PlusCircleIcon />
                  {localization.button.addUrl}
                </Button>
              </div>
            </>
          )}
        </FieldArray>
        <FormContainer.Header
          title={localization.datasetForm.heading.relevance}
          subtitle={localization.datasetForm.helptext.relevance}
        />
        <Field
          as={Textarea}
          name='hasRelevanceAnnotation.hasBody.nb'
        />
        <FormContainer.Header
          title={localization.datasetForm.heading.completeness}
          subtitle={localization.datasetForm.helptext.completeness}
        />
        <Field
          as={Textarea}
          name='hasCompletenessAnnotation.hasBody.nb'
        />
        <FormContainer.Header
          title={localization.datasetForm.heading.accuracy}
          subtitle={localization.datasetForm.helptext.accuracy}
        />
        <Field
          as={Textarea}
          name='hasCompletenessAnnotation.hasBody.nb'
        />
        <FormContainer.Header
          title={localization.datasetForm.heading.availability}
          subtitle={localization.datasetForm.helptext.availability}
        />
        <Field
          as={Textarea}
          name='hasAvailabilityAnnotation.hasBody.nb'
        />
      </FormContainer>
    </div>
  );
};
