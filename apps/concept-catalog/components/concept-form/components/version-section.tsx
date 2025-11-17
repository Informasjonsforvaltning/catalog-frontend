import { VersionFieldset } from './version-fieldset';

type VersionSectionProps = {
  changed?: string[];
  readOnly?: boolean;
};

export const VersionSection = ({ changed, readOnly = false }: VersionSectionProps) => {
  return (
    <div>
      <VersionFieldset
        name='versjonsnr'
        changed={changed}
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
