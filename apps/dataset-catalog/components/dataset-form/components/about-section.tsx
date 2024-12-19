import { Dataset } from '@catalog-frontend/types';
import {
  FormikLanguageFieldset,
  HelpMarkdown,
  LabelWithHelpTextAndTag,
  TextareaWithPrefix,
  TitleWithTag,
} from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Textfield, Label } from '@digdir/designsystemet-react';
import { Field, useFormikContext } from 'formik';
import { FieldsetDivider } from '@catalog-frontend/ui';
import { AccessRightFields } from './access-rights.tsx/dataset-form-access-rights-section';

export const AboutSection = () => {
  const errors = useFormikContext<Dataset>()?.errors;
  return (
    <>
      <FormikLanguageFieldset
        name={'title'}
        as={Textfield}
        requiredLanguages={['nb']}
        legend={
          <>
            <TitleWithTag
              title={
                <>
                  <Label size='sm'>{localization.title}</Label>
                  <HelpMarkdown title={'Tittel'}>
                    Tittelen skal være kortfattet, kunne stå alene og gi mening. Forkortelser skal skrives helt ut
                  </HelpMarkdown>
                </>
              }
              tagTitle={localization.tag.required}
            />
          </>
        }
      />

      <FormikLanguageFieldset
        name='description'
        as={TextareaWithPrefix}
        requiredLanguages={['nb']}
        legend={
          <TitleWithTag
            title={
              <>
                <Label size='sm'>{localization.description}</Label>
                <HelpMarkdown title={'Beskrivelse'}>
                  Beskrivelsen skal være kortfattet. Det bør fremgå hvilke opplysninger som utgjør kjernen i datasettet,
                  samt formålet til datasettet.
                </HelpMarkdown>
              </>
            }
            tagTitle={localization.tag.required}
          />
        }
      />

      <FieldsetDivider />

      <AccessRightFields />

      <FieldsetDivider />

      <Field
        as={Textfield}
        size='sm'
        type='date'
        name='issued'
        label={
          <LabelWithHelpTextAndTag
            tagTitle={localization.tag.recommended}
            helpText='Hjelpetext'
            helpTitle='Heisann'
            tagColor='info'
          >
            {localization.datasetForm.heading.releaseDate}
          </LabelWithHelpTextAndTag>
        }
      />
    </>
  );
};
