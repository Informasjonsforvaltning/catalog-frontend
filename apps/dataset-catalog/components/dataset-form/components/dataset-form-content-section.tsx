'use client';
import { Dataset } from '@catalog-frontend/types';
import { AddButton, FormContainer } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Heading, Textfield, Textarea, Button, Label, HelpText, Fieldset } from '@digdir/designsystemet-react';
import { MinusCircleIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { Field, FieldArray, useFormikContext } from 'formik';
import FieldsetWithDelete from '../../fieldset-with-delete';
import styles from '../dataset-form.module.css';

export const ContentSection = () => {
  const { errors, values } = useFormikContext<Dataset>();

  return (
    <div>
      <FieldArray name='conformsTo'>
        {({ push, remove }) => (
          <>
            <Fieldset legend={localization.datasetForm.heading.standard}>
              {values.conformsTo &&
                values.conformsTo.map((_, index) => (
                  <>
                    <div key={index}>
                      <FieldsetWithDelete onDelete={() => remove(index)}>
                        <Field
                          as={Textfield}
                          name={`conformsTo[${index}].prefLabel.nb`}
                          label={localization.title}
                        />
                        <Field
                          as={Textfield}
                          name={`conformsTo[${index}].uri`}
                          label={localization.link}
                          // @ts-expect-error: uri exists on the object
                          error={errors.conformsTo?.[index]?.uri || ''}
                        />
                      </FieldsetWithDelete>
                    </div>
                  </>
                ))}

              <AddButton onClick={() => push({ prefLabel: { nb: '' }, uri: '' })}>
                {localization.button.addUrl}
              </AddButton>
            </Fieldset>
          </>
        )}
      </FieldArray>

      <Field
        as={Textarea}
        name='hasRelevanceAnnotation.hasBody.nb'
        label={localization.datasetForm.heading.relevance}
      />

      <Field
        as={Textarea}
        name='hasCompletenessAnnotation.hasBody.nb'
        label={localization.datasetForm.heading.completeness}
      />

      <Field
        as={Textarea}
        name='hasCompletenessAnnotation.hasBody.nb'
        label={localization.datasetForm.heading.accuracy}
      />

      <Field
        as={Textarea}
        name='hasAvailabilityAnnotation.hasBody.nb'
        label={localization.datasetForm.heading.availability}
      />
    </div>
  );
};
