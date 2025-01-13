import { DataService } from '@catalog-frontend/types';
import { LabelWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Textfield } from '@digdir/designsystemet-react';
import { FastField, useFormikContext } from 'formik';

export const EndpointSection = () => {
  const errors = useFormikContext<DataService>()?.errors;
  return (
    <>
      <FastField
        name='endpointUrl'
        as={Textfield}
        size='sm'
        label={
          <LabelWithHelpTextAndTag
            tagTitle={localization.tag.required}
            helpText={localization.dataServiceForm.helptext.endpoint}
            helpAriaLabel={localization.dataServiceForm.fieldLabel.endpoint}
          >
            {localization.dataServiceForm.fieldLabel.endpoint}
          </LabelWithHelpTextAndTag>
        }
        error={errors?.endpointUrl}
      />
    </>
  );
};
