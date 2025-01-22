import { AccessRights, DataService, ReferenceDataCode } from '@catalog-frontend/types';
import { LabelWithHelpTextAndTag } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Combobox, Fieldset } from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';

const accessRightsOptions = [
  { value: AccessRights.PUBLIC, label: localization.accessRight.public },
  { value: AccessRights.RESTRICTED, label: localization.accessRight.restricted },
  { value: AccessRights.NON_PUBLIC, label: localization.accessRight.nonPublic },
];

type Props = { openLicenses?: ReferenceDataCode[] };

export const AccessSection = ({ openLicenses }: Props) => {
  const { values, setFieldValue } = useFormikContext<DataService>();

  return (
    <>
      <Fieldset
        legend={
          <LabelWithHelpTextAndTag
            helpAriaLabel={localization.dataServiceForm.fieldLabel.license}
            helpText={localization.dataServiceForm.helptext.license}
          >
            {localization.dataServiceForm.fieldLabel.license}
          </LabelWithHelpTextAndTag>
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
                key={`licence-${licenseRef.uri}-${i}`}
                value={licenseRef.uri}
              >
                {getTranslateText(licenseRef.label)}
              </Combobox.Option>
            ))}
        </Combobox>
      </Fieldset>

      <Fieldset
        legend={
          <LabelWithHelpTextAndTag
            helpAriaLabel={localization.dataServiceForm.fieldLabel.accessRights}
            helpText={localization.dataServiceForm.helptext.accessRights}
          >
            {localization.dataServiceForm.fieldLabel.accessRights}
          </LabelWithHelpTextAndTag>
        }
      >
        <Combobox
          size='sm'
          value={[values.accessRights ?? '']}
          onValueChange={(values) => setFieldValue('accessRights', values.toString())}
        >
          <Combobox.Option value=''>{`${localization.accessRight.none}`}</Combobox.Option>
          {accessRightsOptions.map((option) => (
            <Combobox.Option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </Combobox.Option>
          ))}
        </Combobox>
      </Fieldset>
    </>
  );
};
