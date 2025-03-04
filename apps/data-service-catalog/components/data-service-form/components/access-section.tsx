import { DataService, ReferenceDataCode } from '@catalog-frontend/types';
import { FieldsetDivider, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { accessRights, getTranslateText, localization } from '@catalog-frontend/utils';
import { Box, Radio } from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';
import { CostsTable } from './costs-table';

type Props = {
  openLicenses?: ReferenceDataCode[];
  currencies?: ReferenceDataCode[];
};

export const AccessSection = ({ openLicenses, currencies }: Props) => {
  const { values, setFieldValue } = useFormikContext<DataService>();

  return (
    <Box>
      <Radio.Group
        value={values?.license ?? ''}
        legend={
          <TitleWithHelpTextAndTag helpText={localization.dataServiceForm.helptext.license}>
            {localization.dataServiceForm.fieldLabel.license}
          </TitleWithHelpTextAndTag>
        }
        onChange={(selectedValues) => setFieldValue('license', selectedValues.toString())}
        size='sm'
      >
        <Radio value=''>{`${localization.dataServiceForm.noLicense}`}</Radio>
        {openLicenses &&
          openLicenses.map((licenseRef, i) => (
            <Radio
              key={`license-${licenseRef.uri}-${i}`}
              value={licenseRef.uri}
            >
              {getTranslateText(licenseRef.label)}
            </Radio>
          ))}
      </Radio.Group>

      <FieldsetDivider />

      <Radio.Group
        size='sm'
        legend={
          <TitleWithHelpTextAndTag helpText={localization.dataServiceForm.helptext.accessRights}>
            {localization.dataServiceForm.fieldLabel.accessRights}
          </TitleWithHelpTextAndTag>
        }
        value={values.accessRights ?? ''}
        onChange={(values) => setFieldValue('accessRights', values.toString())}
      >
        <Radio value=''>{`${localization.accessRight.none}`}</Radio>
        {accessRights.map((option) => (
          <Radio
            key={option.uri}
            value={option.uri}
          >
            {getTranslateText(option.label)}
          </Radio>
        ))}
      </Radio.Group>

      <FieldsetDivider />

      <CostsTable currencies={currencies} />
    </Box>
  );
};
