'use client';

import { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import { Box, HelpText, Link, Paragraph, Radio } from '@digdir/designsystemet-react';
import { Concept } from '@catalog-frontend/types';
import { TitleWithTag } from '@catalog-frontend/ui';
import { capitalizeFirstLetter, getTranslateText, localization } from '@catalog-frontend/utils';

export const StatusSection = ({ conceptStatuses }) => {
  const { errors, values, setFieldValue } = useFormikContext<Concept>();
  const [value, setValue] = useState<string>(values.statusURI ?? conceptStatuses[0]);

  useEffect(() => {
    setFieldValue('statusURI', value);
  }, [value]);

  return (
    <Box>
      <Radio.Group
        size='sm'
        legend={
          <TitleWithTag
            title={
              <>
                {localization.conceptForm.fieldLabel.status}
                <HelpText
                  title={localization.conceptForm.fieldLabel.status}
                  type='button'
                  size='sm'
                >
                  <Paragraph size='sm'>
                    Egenskapen brukes til å oppgi status til et begrep. Begrepsstatus er basert på EUs kontrollerte
                    vokabular{' '}
                    <Link
                      href='https://op.europa.eu/en/web/eu-vocabularies/concept-scheme/-/resource?uri=http://publications.europa.eu/resource/authority/concept-status'
                      target='_blank'
                    >
                      Concept status
                    </Link>
                    .
                  </Paragraph>
                </HelpText>
              </>
            }
          />
        }
        value={value}
        onChange={setValue}
        error={errors['statusURI']}
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
