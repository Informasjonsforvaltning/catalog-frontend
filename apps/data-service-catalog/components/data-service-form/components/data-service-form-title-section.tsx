import { DataService } from '@catalog-frontend/types';
import { FormContainer, TitleWithTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Heading, Textarea, Textfield } from '@digdir/designsystemet-react';
import { Field, FormikErrors } from 'formik';

type TitleSectionProps = {
  errors: FormikErrors<DataService>;
};

export const TitleSection = ({ errors }: TitleSectionProps) => {
  return (
    <div>
      <Heading
        size='sm'
        spacing
      >
        {localization.dataServiceForm.heading.titleAndDescription}
      </Heading>
      <FormContainer>
        <FormContainer.Header
          title={localization.title}
          subtitle={localization.dataServiceForm.helptext.title}
        />
        <Field
          as={Textfield}
          name='title.nb'
          label={
            <TitleWithTag
              title={localization.dataServiceForm.fieldLabel.title}
              tagTitle={localization.tag.required}
            />
          }
          error={errors?.title?.nb}
        />
        <FormContainer.Header
          title={localization.dataServiceForm.heading.description}
          subtitle={localization.dataServiceForm.helptext.description}
        />
        <Field
          as={Textarea}
          name='description.nb'
          label={
            <TitleWithTag
              title={localization.dataServiceForm.fieldLabel.description}
              tagTitle={localization.tag.required}
            />
          }
          error={errors?.description?.nb}
        />
      </FormContainer>
    </div>
  );
};
