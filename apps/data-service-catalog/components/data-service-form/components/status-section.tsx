import { DataService, ReferenceDataCode } from "@catalog-frontend/types";
import { FieldsetDivider, TitleWithHelpTextAndTag } from "@catalog-frontend/ui";
import {
  capitalizeFirstLetter,
  getTranslateText,
  localization,
} from "@catalog-frontend/utils";
import { Box, Radio } from "@digdir/designsystemet-react";
import { useFormikContext } from "formik";

type Props = {
  statuses?: ReferenceDataCode[];
  availabilities?: ReferenceDataCode[];
};

export const StatusSection = ({ statuses, availabilities }: Props) => {
  const { values, setFieldValue } = useFormikContext<DataService>();

  return (
    <Box>
      <Radio.Group
        value={values?.status ?? "none"}
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.dataServiceForm.helptext.status}
          >
            {localization.dataServiceForm.fieldLabel.status}
          </TitleWithHelpTextAndTag>
        }
        onChange={(selectedValues) =>
          setFieldValue("status", selectedValues.toString())
        }
        size="sm"
      >
        <Radio value="none">{`${localization.dataServiceForm.noStatus}`}</Radio>
        {statuses &&
          statuses.map((statusRef, i) => (
            <Radio key={`licence-${statusRef.uri}-${i}`} value={statusRef.uri}>
              {capitalizeFirstLetter(
                getTranslateText(statusRef.label)?.toString(),
              )}
            </Radio>
          ))}
      </Radio.Group>

      <FieldsetDivider />

      <Radio.Group
        value={values?.availability ?? "none"}
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.dataServiceForm.helptext.availability}
            tagColor={"info"}
            tagTitle={localization.tag.recommended}
          >
            {localization.dataServiceForm.fieldLabel.availability}
          </TitleWithHelpTextAndTag>
        }
        onChange={(selectedValues) =>
          setFieldValue("availability", selectedValues.toString())
        }
        size="sm"
      >
        <Radio value="none">{`${localization.dataServiceForm.noAvailability}`}</Radio>
        {availabilities &&
          availabilities.map((availabilityRef, i) => (
            <Radio
              key={`availability-${availabilityRef.uri}-${i}`}
              value={availabilityRef.uri}
            >
              {capitalizeFirstLetter(
                getTranslateText(availabilityRef.label)?.toString(),
              )}
            </Radio>
          ))}
      </Radio.Group>
    </Box>
  );
};
