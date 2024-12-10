import { Dataset } from '@catalog-frontend/types';
import { FormikLanguageFieldset, TextareaWithPrefix, TitleWithTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Textfield, Fieldset } from '@digdir/designsystemet-react';
import { Field, useFormikContext } from 'formik';
import { FieldsetDivider } from '@catalog-frontend/ui';
import { AccessRightsForm } from './access-rights.tsx/dataset-form-access-rights-section';

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
        type='date'
        name='issued'
        label={localization.datasetForm.heading.releaseDate}
      />

      {/* <FieldArray name='landingPage'>
        {(arrayHelpers) => (
          <>
            {arrayHelpers.form.values.landingPage &&
              arrayHelpers.form.values.landingPage.map((_: string, index: number) => (
                <div key={`landingPage-${index}`}>
                  <FieldsetWithDelete onDelete={() => arrayHelpers.remove(index)}>
                    <Field
                      name={`landingPage[${index}]`}
                      label={localization.datasetForm.heading.landingPage}
                      as={Textfield}
                      error={errors?.landingPage?.[index]}
                    />
                  </FieldsetWithDelete>
                </div>
              ))}

            <AddButton onClick={() => arrayHelpers.push('')}>{localization.button.addUrl}</AddButton>
          </>
        )}
      </FieldArray> */}
    </>
  );
};
