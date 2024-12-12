import { Dataset } from '@catalog-frontend/types';
import { AddButton, FormikLanguageFieldset, TextareaWithPrefix, TitleWithTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Textfield, Fieldset } from '@digdir/designsystemet-react';
import { Field, FieldArray, useFormikContext } from 'formik';
import { FieldsetDivider } from '@catalog-frontend/ui';
import { AccessRightsForm } from './access-rights.tsx/dataset-form-access-rights-section';
import FieldsetWithDelete from '../../fieldset-with-delete';

export const AboutSection = () => {
  const errors = useFormikContext<Dataset>()?.errors;
  return (
    <>
      <Fieldset
        legend={
          <TitleWithTag
            title={localization.title}
            tagTitle={localization.tag.required}
          />
        }
      >
        <FormikLanguageFieldset
          name={'title'}
          as={Textfield}
          requiredLanguages={['nb']}
        />
      </Fieldset>
      <Fieldset
        legend={
          <TitleWithTag
            title={localization.description}
            tagTitle={localization.tag.required}
          />
        }
      >
        <FormikLanguageFieldset
          name='description'
          as={TextareaWithPrefix}
          requiredLanguages={['nb']}
        />
      </Fieldset>

      <FieldsetDivider />
      <AccessRightsForm />

      <FieldsetDivider />

      <Field
        as={Textfield}
        size='sm'
        type='date'
        name='issued'
        label={localization.datasetForm.heading.releaseDate}
      />
    </>
  );
};
