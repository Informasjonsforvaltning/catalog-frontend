import { DataService } from '@catalog-frontend/types';
import { AddButton, FastFieldWithRef, FieldsetDivider, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Box, Fieldset, Textfield } from '@digdir/designsystemet-react';
import { FastField, FieldArray, useFormikContext } from 'formik';
import FieldsetWithDelete from '../../fieldset-with-delete';
import styles from '../data-service-form.module.css';
import React, { useEffect, useState } from 'react';

export const VersionSection = () => {
  const errors = useFormikContext<DataService>()?.errors;
  const [focus, setFocus] = useState<boolean | null>();
  const fieldRef = React.createRef<HTMLInputElement | HTMLTextAreaElement>();

  useEffect(() => {
    if (focus) {
      fieldRef?.current?.focus();
      setFocus(false);
    }
  }, [focus, fieldRef]);

  return (
    <Box>
      <FastField
        name='versionInfo'
        as={Textfield}
        size='sm'
        label={
          <TitleWithHelpTextAndTag
            tagTitle={localization.tag.recommended}
            tagColor='info'
            helpText={localization.dataServiceForm.helptext.version}
          >
            {localization.dataServiceForm.fieldLabel.version}
          </TitleWithHelpTextAndTag>
        }
        error={errors?.endpointUrl}
      />
    </Box>
  );
};
