import { DataService, ReferenceDataCode } from '@catalog-frontend/types';
import { FieldsetDivider, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { accessRights, getTranslateText, localization } from '@catalog-frontend/utils';
import { Radio } from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';
import { CostsTable } from './costs-table';

type Props = {
  openLicenses?: ReferenceDataCode[];
  currencies?: ReferenceDataCode[];
};

export const AccessSection = ({ openLicenses, currencies }: Props) => {
  const { values, setFieldValue } = useFormikContext<DataService>();

  return (
    <div>
      <Radio.Group
        value={values?.license ?? 'none'}
        legend={
          <TitleWithHelpTextAndTag helpText={localization.dataServiceForm.helptext.license}>
            {localization.dataServiceForm.fieldLabel.license}
          </TitleWithHelpTextAndTag>
        }
        onChange={(selectedValues) => setFieldValue('license', selectedValues.toString())}
        data-size='sm'
      >
        <Radio value='none'>{`${localization.dataServiceForm.noLicense}`}</Radio>
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
        data-size='sm'
        legend={
          <TitleWithHelpTextAndTag helpText={localization.dataServiceForm.helptext.accessRights}>
            {localization.dataServiceForm.fieldLabel.accessRights}
          </TitleWithHelpTextAndTag>
        }
        value={values.accessRights ?? 'none'}
        onChange={(values) => setFieldValue('accessRights', values.toString())}
      >
        <Radio value='none'>{`${localization.accessRight.none}`}</Radio>
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
    </div>
  );
};
