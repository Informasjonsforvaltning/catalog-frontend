import { DataService, ReferenceDataCode } from '@catalog-frontend/types';
import { FieldsetDivider, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { accessRights, getTranslateText, localization } from '@catalog-frontend/utils';
import { Box, Combobox, Fieldset } from '@digdir/designsystemet-react';
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
      <Fieldset
        legend={
          <TitleWithHelpTextAndTag helpText={localization.dataServiceForm.helptext.license}>
            {localization.dataServiceForm.fieldLabel.license}
          </TitleWithHelpTextAndTag>
        }
      >
        <Combobox
          value={[values?.license ?? '']}
          portal={false}
          onValueChange={(selectedValues) => setFieldValue('license', selectedValues.toString())}
          size='sm'
        >
          <Combobox.Option value=''>{`${localization.dataServiceForm.noLicense}`}</Combobox.Option>
          {openLicenses &&
            openLicenses.map((licenseRef, i) => (
              <Combobox.Option
                key={`license-${licenseRef.uri}-${i}`}
                value={licenseRef.uri}
              >
                {getTranslateText(licenseRef.label)}
              </Combobox.Option>
            ))}
        </Combobox>
      </Fieldset>

      <FieldsetDivider />

      <Fieldset
        legend={
          <TitleWithHelpTextAndTag helpText={localization.dataServiceForm.helptext.accessRights}>
            {localization.dataServiceForm.fieldLabel.accessRights}
          </TitleWithHelpTextAndTag>
        }
      >
        <Combobox
          size='sm'
          value={[values.accessRights ?? '']}
          onValueChange={(values) => setFieldValue('accessRights', values.toString())}
        >
          <Combobox.Option value=''>{`${localization.accessRight.none}`}</Combobox.Option>
          {accessRights.map((option) => (
            <Combobox.Option
              key={option.uri}
              value={option.uri}
            >
              {getTranslateText(option.label)}
            </Combobox.Option>
          ))}
        </Combobox>
      </Fieldset>

      <FieldsetDivider />

      <CostsTable currencies={currencies} />
    </Box>
  );
};
