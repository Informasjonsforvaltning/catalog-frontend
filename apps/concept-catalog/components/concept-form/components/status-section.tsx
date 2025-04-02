'use client';

import { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import { Box, Radio } from '@digdir/designsystemet-react';
import { Concept, ReferenceDataCode } from '@catalog-frontend/types';
import { TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { capitalizeFirstLetter, getTranslateText, localization } from '@catalog-frontend/utils';
import { get, isEqual } from 'lodash';

type StatusSectionProps = {
  conceptStatuses: ReferenceDataCode[];
  markDirty?: boolean;
  readOnly?: boolean;
};

export const StatusSection = ({ conceptStatuses, markDirty = false, readOnly = false }: StatusSectionProps) => {
  const { errors, initialValues, values, setFieldValue } = useFormikContext<Concept>();
  const [value, setValue] = useState<string>(values.statusURI ?? conceptStatuses[0].uri);

  useEffect(() => {
    setFieldValue('statusURI', value);
  }, [value]);

  return (
    <Box>
      <Radio.Group
        size='sm'
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.status}
            changed={markDirty && !isEqual(get(initialValues, 'statusURI'), get(values, 'statusURI'))}
          >
            {localization.conceptForm.fieldLabel.status}
          </TitleWithHelpTextAndTag>
        }
        value={value}
        onChange={setValue}
        error={errors['statusURI']}
        readOnly={readOnly}
      >
        {conceptStatuses.map((status) => (
          <Radio
            key={status.uri}
            value={status.uri}
          >
            {capitalizeFirstLetter(getTranslateText(status.label) as string)}
          </Radio>
        ))}
      </Radio.Group>
    </Box>
  );
};
