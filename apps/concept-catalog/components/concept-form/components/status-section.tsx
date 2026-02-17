"use client";

import { useEffect, useState } from "react";
import { useFormikContext } from "formik";
import {
  Fieldset,
  Radio,
  ValidationMessage,
  useRadioGroup,
} from "@digdir/designsystemet-react";
import { Concept, ReferenceDataCode } from "@catalog-frontend/types";
import { TitleWithHelpTextAndTag } from "@catalog-frontend/ui-v2";
import {
  capitalizeFirstLetter,
  getTranslateText,
  localization,
} from "@catalog-frontend/utils";

type StatusSectionProps = {
  conceptStatuses: ReferenceDataCode[];
  changed?: string[];
  readOnly?: boolean;
};

export const StatusSection = ({
  conceptStatuses,
  changed,
  readOnly = false,
}: StatusSectionProps) => {
  const { errors, initialValues, values, setFieldValue } =
    useFormikContext<Concept>();
  const [value, setValue] = useState<string>(
    values.statusURI ?? conceptStatuses[0].uri,
  );

  useEffect(() => {
    setFieldValue("statusURI", value);
  }, [value]);

  const { getRadioProps, validationMessageProps } = useRadioGroup({
    value,
    onChange: (nextValue) => setValue(nextValue),
    error: errors["statusURI"],
    readOnly,
  });

  return (
    <div>
      <Fieldset data-size="sm">
        <Fieldset.Legend>
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.status}
            changed={changed?.includes("statusURI")}
          >
            {localization.conceptForm.fieldLabel.status}
          </TitleWithHelpTextAndTag>
        </Fieldset.Legend>
        {conceptStatuses.map((status) => (
          <Radio
            key={status.uri}
            {...getRadioProps(status.uri)}
            label={capitalizeFirstLetter(getTranslateText(status.label))}
          />
        ))}
        <ValidationMessage {...validationMessageProps} />
      </Fieldset>
    </div>
  );
};
