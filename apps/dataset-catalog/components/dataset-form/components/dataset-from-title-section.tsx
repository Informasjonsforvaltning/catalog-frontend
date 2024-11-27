import { Dataset } from '@catalog-frontend/types';
import { AddButton, FormikLanguageFieldset, TextareaWithPrefix, TitleWithTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Textfield, Fieldset } from '@digdir/designsystemet-react';
import { Field, FieldArray, useFormikContext } from 'formik';
import FieldsetWithDelete from '../../fieldset-with-delete';
import { FieldsetDivider } from '@catalog-frontend/ui';

export const TitleSection = () => {
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

      <FieldArray name='landingPage'>
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
      </FieldArray>
    </>
  );
};
