import {
  DataService,
  Option,
  ReferenceDataCode,
} from "@catalog-frontend/types";
import {
  CostsTable,
  FieldsetDivider,
  TitleWithHelpTextAndTag,
} from "@catalog-frontend/ui";
import {
  accessRights,
  getTranslateText,
  localization,
} from "@catalog-frontend/utils";
import { Combobox, Fieldset } from "@digdir/designsystemet-react";
import { useFormikContext } from "formik";
import { ReferenceDataRadioGroup } from "@data-service-catalog/components/data-service-form/components/reference-data-radio-group";

const PRIORITY_LICENCE_CODES = ["CC0", "CC_BY_4_0"];

const containsFilter = (inputValue: string, option: Option): boolean =>
  option.label.toLowerCase().includes(inputValue.toLowerCase());

const sortLicences = (licences: ReferenceDataCode[]): ReferenceDataCode[] =>
  [...licences].sort((a, b) => {
    const a_priority = PRIORITY_LICENCE_CODES.indexOf(a.code ?? "");
    const b_priority = PRIORITY_LICENCE_CODES.indexOf(b.code ?? "");
    if (a_priority !== -1 || b_priority !== -1) {
      return (
        (a_priority === -1 ? Infinity : a_priority) -
        (b_priority === -1 ? Infinity : b_priority)
      );
    }
    return getTranslateText(a.label)
      .toString()
      .localeCompare(getTranslateText(b.label).toString());
  });

type Props = {
  openLicenses?: ReferenceDataCode[];
  currencies?: ReferenceDataCode[];
};

export const AccessSection = ({ openLicenses, currencies }: Props) => {
  const { values, setFieldValue } = useFormikContext<DataService>();

  return (
    <div>
      <Fieldset>
        <Fieldset.Legend>
          <TitleWithHelpTextAndTag
            helpText={localization.dataServiceForm.helptext.license}
          >
            {localization.dataServiceForm.fieldLabel.license}
          </TitleWithHelpTextAndTag>
        </Fieldset.Legend>
        <Combobox
          value={
            values?.license && values.license !== "none" ? [values.license] : []
          }
          portal={false}
          onValueChange={(selectedValues) =>
            setFieldValue("license", selectedValues.toString())
          }
          filter={containsFilter}
          placeholder={`${localization.search.search}...`}
        >
          <Combobox.Empty>{localization.search.noHits}</Combobox.Empty>
          {values?.license &&
            values.license !== "none" &&
            !openLicenses?.some((l) => l.uri === values.license) && (
              <Combobox.Option value={values.license}>
                {values.license}
              </Combobox.Option>
            )}
          {sortLicences(openLicenses ?? []).map((license, i) => (
            <Combobox.Option
              key={`license-${license.uri}-${i}`}
              value={license.uri}
            >
              {getTranslateText(license.label)}
            </Combobox.Option>
          ))}
        </Combobox>
      </Fieldset>

      <FieldsetDivider />

      <Fieldset>
        <Fieldset.Legend>
          <TitleWithHelpTextAndTag
            helpText={localization.dataServiceForm.helptext.accessRights}
          >
            {localization.dataServiceForm.fieldLabel.accessRights}
          </TitleWithHelpTextAndTag>
        </Fieldset.Legend>
        <ReferenceDataRadioGroup
          selected={values?.accessRights}
          codes={accessRights ?? []}
          selectCode={(selected) =>
            setFieldValue("accessRights", selected.toString())
          }
          noneLabel={localization.accessRight.none}
        />
      </Fieldset>

      <FieldsetDivider />

      <CostsTable
        currencies={currencies}
        helpText={localization.dataServiceForm.helptext.costs}
      />
    </div>
  );
};
