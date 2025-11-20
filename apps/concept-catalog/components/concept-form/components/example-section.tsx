import { Box } from "@digdir/designsystemet-react";
import {
  FormikLanguageFieldset,
  TextareaWithPrefix,
  TitleWithHelpTextAndTag,
} from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";

type ExampleSectionProps = {
  changed?: string[];
  readOnly?: boolean;
};

export const ExampleSection = ({
  changed,
  readOnly = false,
}: ExampleSectionProps) => {
  return (
    <Box>
      <FormikLanguageFieldset
        name="eksempel"
        as={TextareaWithPrefix}
        readOnly={readOnly}
        legend={
          <TitleWithHelpTextAndTag changed={changed?.includes("eksempel")}>
            {localization.conceptForm.fieldLabel.example}
          </TitleWithHelpTextAndTag>
        }
      />
    </Box>
  );
};
