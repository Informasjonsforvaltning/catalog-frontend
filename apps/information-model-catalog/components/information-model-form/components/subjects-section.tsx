import {
  ConceptSuggestionSelect,
  TitleWithHelpTextAndTag,
} from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";
import { Fieldset } from "@digdir/designsystemet-react";

type Props = {
  searchEnv: string;
};

export const SubjectsSection = ({ searchEnv }: Props) => {
  return (
    <Fieldset data-size="sm">
      <Fieldset.Legend>
        <TitleWithHelpTextAndTag
          helpText={localization.informationModelForm.helptext.subjects}
        >
          {localization.informationModelForm.fieldLabel.subjects}
        </TitleWithHelpTextAndTag>
      </Fieldset.Legend>
      <ConceptSuggestionSelect fieldLabel="subjects" searchEnv={searchEnv} />
    </Fieldset>
  );
};
