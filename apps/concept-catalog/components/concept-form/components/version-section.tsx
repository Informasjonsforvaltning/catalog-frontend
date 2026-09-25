import { VersionFieldset } from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";

type VersionSectionProps = {
  changed?: string[];
  readOnly?: boolean;
};

export const VersionSection = ({
  changed,
  readOnly = false,
}: VersionSectionProps) => {
  return (
    <div>
      <VersionFieldset
        name="versjonsnr"
        label={localization.conceptForm.fieldLabel.versionNumber}
        helpText={localization.conceptForm.helpText.versionNumber}
        changed={changed?.includes("versjonsnr")}
        readOnly={readOnly}
      />
      {/**
       * TODO Version note will be available as a modal dialog at a later stage.
       *
      <FieldsetDivider />
      <LanguageFieldset
        name='versjonsNote'
        as={TextareaWithPrefix}
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.versionNote}
          >
            {localization.conceptForm.fieldLabel.versionNote}
          </TitleWithHelpTextAndTag>
        }
      />
       */}
    </div>
  );
};
