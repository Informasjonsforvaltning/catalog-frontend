import { Dataset } from "@catalog-frontend/types";
import { FieldsetDivider, TitleWithHelpTextAndTag } from "@catalog-frontend/ui";
import {
  accessRights,
  getTranslateText,
  localization,
} from "@catalog-frontend/utils";
import { Fieldset, Radio, useRadioGroup } from "@digdir/designsystemet-react";
import { useFormikContext } from "formik";
import { ApplicableLegislationTable } from "./applicable-legislation/applicable-legislation-table";

export const AccessRightFields = () => {
  const { values, setFieldValue } = useFormikContext<Dataset>();

  const { getRadioProps } = useRadioGroup({
    value: values?.accessRight || "none",
    onChange: (nextValue) => setFieldValue("accessRight", nextValue.toString()),
  });

  return (
    <>
      <div>
        <Fieldset data-size="sm">
          <Fieldset.Legend>
            <TitleWithHelpTextAndTag
              helpText={localization.datasetForm.helptext.accessRights}
              tagColor="info"
              tagTitle={localization.tag.recommended}
            >
              {localization.access}
            </TitleWithHelpTextAndTag>
          </Fieldset.Legend>
          <Radio
            {...getRadioProps("none")}
            label={`${localization.accessRight.none}`}
          />
          {accessRights?.map((option, index) => (
            <Radio
              key={`${option.uri}-${index}`}
              {...getRadioProps(option.uri)}
              label={getTranslateText(option.label)}
            />
          ))}
        </Fieldset>
        <FieldsetDivider />
        <ApplicableLegislationTable />
      </div>
    </>
  );
};
