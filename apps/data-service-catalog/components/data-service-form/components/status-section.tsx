import { DataService, ReferenceDataCode } from '@catalog-frontend/types';
import { TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { capitalizeFirstLetter, getTranslateText, localization } from '@catalog-frontend/utils';
import { Combobox, Fieldset } from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';

type Props = {
  statuses?: ReferenceDataCode[];
  availabilities?: ReferenceDataCode[];
};

export const StatusSection = ({ statuses, availabilities }: Props) => {
  const { values, setFieldValue } = useFormikContext<DataService>();

  return (
    <>
      <Fieldset
        legend={
          <TitleWithHelpTextAndTag helpText={localization.dataServiceForm.helptext.status}>
            {localization.dataServiceForm.fieldLabel.status}
          </TitleWithHelpTextAndTag>
        }
      >
        <Combobox
          value={[values?.status ?? '']}
          portal={false}
          onValueChange={(selectedValues) => setFieldValue('status', selectedValues.toString())}
          size='sm'
        >
          <Combobox.Option value=''>{`${localization.dataServiceForm.noStatus}`}</Combobox.Option>
          {statuses &&
            statuses.map((statusRef, i) => (
              <Combobox.Option
                key={`licence-${statusRef.uri}-${i}`}
                value={statusRef.uri}
              >
                {capitalizeFirstLetter(getTranslateText(statusRef.label)?.toString())}
              </Combobox.Option>
            ))}
        </Combobox>
      </Fieldset>

      <Fieldset
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.dataServiceForm.helptext.availability}
            tagColor={'info'}
            tagTitle={localization.tag.recommended}
          >
            {localization.dataServiceForm.fieldLabel.availability}
          </TitleWithHelpTextAndTag>
        }
      >
        <Combobox
          value={[values?.availability ?? '']}
          portal={false}
          onValueChange={(selectedValues) => setFieldValue('availability', selectedValues.toString())}
          size='sm'
        >
          <Combobox.Option value=''>{`${localization.dataServiceForm.noAvailability}`}</Combobox.Option>
          {availabilities &&
            availabilities.map((availabilityRef, i) => (
              <Combobox.Option
                key={`availability-${availabilityRef.uri}-${i}`}
                value={availabilityRef.uri}
              >
                {capitalizeFirstLetter(getTranslateText(availabilityRef.label)?.toString())}
              </Combobox.Option>
            ))}
        </Combobox>
      </Fieldset>
    </>
  );
};
