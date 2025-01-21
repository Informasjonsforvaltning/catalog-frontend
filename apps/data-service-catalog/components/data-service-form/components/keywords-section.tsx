import {FormikLanguageFieldset, TitleWithTag} from "@catalog-frontend/ui";
import {localization} from "@catalog-frontend/utils";
import {HelpText, Paragraph} from "@digdir/designsystemet-react";

export const KeywordsSection = () => {
  return (
    <>
      <FormikLanguageFieldset
        name='keywords'
        legend={
          <TitleWithTag
            title={
              <>
                {localization.dataServiceForm.fieldLabel.keywords}
                <HelpText
                  title={localization.dataServiceForm.fieldLabel.keywords}
                  type='button'
                  size='sm'
                >
                  <Paragraph size='sm'>
                    {localization.dataServiceForm.helptext.keywords}
                  </Paragraph>
                </HelpText>
              </>
            }
            tagTitle={localization.tag.recommended}
            tagColor='info'
          />
        }
        multiple
      />
    </>
  );
};
