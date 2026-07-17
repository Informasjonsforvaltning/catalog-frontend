"use client";

import { DataService, ReferenceDataCode } from "@catalog-frontend/types";
import {
  CostsTable,
  FieldsetDivider,
  SingleSuggestionSelect,
  TitleWithHelpTextAndTag,
} from "@catalog-frontend/ui";
import {
  accessRights,
  getTranslateText,
  localization,
} from "@catalog-frontend/utils";
import { Fieldset } from "@digdir/designsystemet-react";
import { useFormikContext } from "formik";
import { useMemo } from "react";
import { ReferenceDataRadioGroup } from "@data-service-catalog/components/data-service-form/components/reference-data-radio-group";

const PRIORITY_LICENCE_CODES = ["CC0", "CC_BY_4_0"];

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

  const licenseOptions = useMemo(() => {
    const sortedLicences = sortLicences(openLicenses ?? []);
    const options = sortedLicences.map((license) => ({
      value: license.uri,
      label: getTranslateText(license.label),
    }));

    if (
      values.license &&
      values.license !== "none" &&
      !sortedLicences.some((license) => license.uri === values.license)
    ) {
      return [{ value: values.license, label: values.license }, ...options];
    }

    return options;
  }, [openLicenses, values.license]);

  return (
    <div>
      <SingleSuggestionSelect
        emptyMessage={localization.search.noHits}
        fieldsetLegend={
          <TitleWithHelpTextAndTag
            helpText={localization.dataServiceForm.helptext.license}
          >
            {localization.dataServiceForm.fieldLabel.license}
          </TitleWithHelpTextAndTag>
        }
        onValueChange={(value) => setFieldValue("license", value ?? "")}
        options={licenseOptions}
        placeholder={`${localization.search.search}...`}
        value={
          values.license && values.license !== "none"
            ? values.license
            : undefined
        }
      />

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
