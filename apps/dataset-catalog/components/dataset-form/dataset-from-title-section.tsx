import { Dataset } from '@catalog-frontend/types';
import { FormContainer, TitleWithTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Heading, Textfield, Textarea, Button } from '@digdir/designsystemet-react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Field, FieldArray, FormikErrors } from 'formik';

type TitleSectionProps = {
  errors: FormikErrors<Dataset>;
};

export const TitleSection = ({ errors }: TitleSectionProps) => {
  return (
    <div>
      <Heading
        size='sm'
        spacing
      >
        {localization.datasetForm.heading.titleAndDescription}
      </Heading>
      <FormContainer>
        <FormContainer.Header
          title={localization.title}
          subtitle={localization.datasetForm.helptext.title}
        />
        <Field
          as={Textfield}
          name='title.nb'
          label={
            <TitleWithTag
              title={localization.datasetForm.fieldLabel.title}
              tagTitle={localization.tag.required}
            />
          }
          error={errors?.title?.nb}
        />
        <FormContainer.Header
          title={localization.datasetForm.heading.description}
          subtitle={localization.datasetForm.helptext.description}
        />
        <Field
          as={Textarea}
          name='description.nb'
          label={
            <TitleWithTag
              title={localization.datasetForm.fieldLabel.description}
              tagTitle={localization.tag.required}
            />
          }
          error={errors?.description?.nb}
        />

        <FormContainer.Header
          title={localization.datasetForm.heading.landingPage}
          subtitle={localization.datasetForm.helptext.landingPage}
        />

        <FieldArray name='landingPage'>
          {(arrayHelpers) => (
            <>
              {arrayHelpers.form.values.landingPage &&
                arrayHelpers.form.values.landingPage.map((_: string, index: number) => (
                  <div key={`landingPage-${index}`}>
                    <Field
                      name={`landingPage[${index}]`}
                      label={localization.link}
                      as={Textfield}
                      error={errors?.landingPage?.[index]}
                    />
                  </div>
                ))}
              <div>
                <Button
                  type='button'
                  onClick={() => arrayHelpers.push('')}
                  variant='tertiary'
                >
                  <PlusCircleIcon />
                  {localization.button.addUrl}
                </Button>
              </div>
            </>
          )}
        </FieldArray>
      </FormContainer>
    </div>
  );
};
