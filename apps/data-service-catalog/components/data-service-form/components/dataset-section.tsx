"use client";
import { localization } from "@catalog-frontend/utils";
import { Box, Fieldset } from "@digdir/designsystemet-react";
import { DatasetCombobox, TitleWithHelpTextAndTag } from "@catalog-frontend/ui";

interface Props {
  searchEnv: string;
}

export const DatasetSection = ({ searchEnv }: Props) => {
  return (
    <Box>
      <Fieldset
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.dataServiceForm.helptext.servesDataset}
            tagTitle={localization.tag.recommended}
            tagColor="info"
          >
            {localization.dataServiceForm.fieldLabel.servesDataset}
          </TitleWithHelpTextAndTag>
        }
        size="sm"
      >
        <DatasetCombobox fieldLabel="servesDataset" searchEnv={searchEnv} />
      </Fieldset>
    </Box>
  );
};
