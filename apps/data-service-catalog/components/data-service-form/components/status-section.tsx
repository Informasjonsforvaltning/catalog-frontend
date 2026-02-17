import { DataService, ReferenceDataCode } from "@catalog-frontend/types";
import {
  FieldsetDivider,
  TitleWithHelpTextAndTag,
} from "@catalog-frontend/ui-v2";
import { localization } from "@catalog-frontend/utils";
import { Fieldset } from "@digdir/designsystemet-react";
import { useFormikContext } from "formik";
import { ReferenceDataRadioGroup } from "@data-service-catalog/components/data-service-form/components/reference-data-radio-group";

type Props = {
  statuses?: ReferenceDataCode[];
  availabilities?: ReferenceDataCode[];
};

export const StatusSection = ({ statuses, availabilities }: Props) => {
  const { values, setFieldValue } = useFormikContext<DataService>();

  return (
    <div>
      <Fieldset>
        <Fieldset.Legend>
          <TitleWithHelpTextAndTag
            helpText={localization.dataServiceForm.helptext.status}
          >
            {localization.dataServiceForm.fieldLabel.status}
          </TitleWithHelpTextAndTag>
        </Fieldset.Legend>
        <ReferenceDataRadioGroup
          selected={values?.status}
          codes={statuses ?? []}
          selectCode={(selected) =>
            setFieldValue("status", selected.toString())
          }
          noneLabel={localization.dataServiceForm.noStatus}
        />
      </Fieldset>

      <FieldsetDivider />

      <Fieldset>
        <Fieldset.Legend>
          <TitleWithHelpTextAndTag
            helpText={localization.dataServiceForm.helptext.availability}
            tagColor="info"
            tagTitle={localization.tag.recommended}
          >
            {localization.dataServiceForm.fieldLabel.availability}
          </TitleWithHelpTextAndTag>
        </Fieldset.Legend>

        <ReferenceDataRadioGroup
          selected={values?.availability}
          codes={availabilities ?? []}
          selectCode={(selected) =>
            setFieldValue("availability", selected.toString())
          }
          noneLabel={localization.dataServiceForm.noAvailability}
        />
      </Fieldset>
    </div>
  );
};
