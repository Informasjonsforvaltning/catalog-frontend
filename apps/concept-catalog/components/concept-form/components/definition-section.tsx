import { Concept } from '@catalog-frontend/types';
import { FormContainer, TitleWithTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Heading, Textfield, Textarea } from '@digdir/designsystemet-react';
import { FastField, Field, FormikErrors } from 'formik';

type DefinitionSectionProps = {
  headingTitle: string;
};

export const DefinitionSection = ({ headingTitle }: DefinitionSectionProps) => {
  return (
    <div>
      <Heading
        size='sm'
        spacing
      >
        {headingTitle}
      </Heading>
      <FormContainer>
        <FormContainer.Header
          title={localization.title}
          subtitle={localization.datasetForm.helptext.title}
        />
        <FastField
          as={Textarea}
          name='definisjon.nb'
          label={
            <TitleWithTag
              title={localization.datasetForm.fieldLabel.description}
              tagTitle={localization.tag.required}
            />
          }
          error={errors?.definisjon?.text?.nb}
        />
      </FormContainer>
    </div>
  );
};
