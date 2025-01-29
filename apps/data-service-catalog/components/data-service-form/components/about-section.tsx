import { FormikLanguageFieldset, LabelWithHelpTextAndTag, TextareaWithPrefix } from '@catalog-frontend/ui';
import { capitalizeFirstLetter, getTranslateText, localization } from '@catalog-frontend/utils';
import { Combobox, Fieldset, Textfield } from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';
import { DataService, ReferenceDataCode } from '@catalog-frontend/types';

type Props = { statuses?: ReferenceDataCode[] };

export const AboutSection = ({ statuses }: Props) => {
  const { values, setFieldValue } = useFormikContext<DataService>();

  return (
    <>
      <FormikLanguageFieldset
        name={'title'}
        as={Textfield}
        legend={
          <LabelWithHelpTextAndTag
            tagTitle={localization.tag.required}
            helpText={localization.dataServiceForm.helptext.title}
            helpAriaLabel={localization.dataServiceForm.fieldLabel.title}
          >
            {localization.dataServiceForm.fieldLabel.title}
          </LabelWithHelpTextAndTag>
        }
      />

      <FormikLanguageFieldset
        name='description'
        as={TextareaWithPrefix}
        legend={
          <LabelWithHelpTextAndTag
            helpText={localization.dataServiceForm.helptext.description}
            helpAriaLabel={localization.dataServiceForm.fieldLabel.description}
          >
            {localization.dataServiceForm.fieldLabel.description}
          </LabelWithHelpTextAndTag>
        }
      />

      <Fieldset
        legend={
          <LabelWithHelpTextAndTag
            helpAriaLabel={localization.dataServiceForm.fieldLabel.status}
            helpText={localization.dataServiceForm.helptext.status}
          >
            {localization.dataServiceForm.fieldLabel.status}
          </LabelWithHelpTextAndTag>
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
    </>
  );
};
