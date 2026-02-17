import { DataService, ReferenceDataCode } from "@catalog-frontend/types";
import {
  FieldsetDivider,
  TitleWithHelpTextAndTag,
} from "@catalog-frontend/ui-v2";
import { accessRights, localization } from "@catalog-frontend/utils";
import { Fieldset } from "@digdir/designsystemet-react";
import { useFormikContext } from "formik";
import { CostsTable } from "./costs-table";
import { ReferenceDataRadioGroup } from "@data-service-catalog/components/data-service-form/components/reference-data-radio-group";

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
        <ReferenceDataRadioGroup
          selected={values?.license}
          codes={openLicenses ?? []}
          selectCode={(selected) =>
            setFieldValue("license", selected.toString())
          }
          noneLabel={localization.dataServiceForm.noLicense}
        />
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

      <CostsTable currencies={currencies} />
    </div>
  );
};
