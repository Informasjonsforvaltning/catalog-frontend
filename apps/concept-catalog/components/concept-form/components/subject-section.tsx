import { FastField, useFormikContext } from 'formik';
import { Alert, Combobox, Heading, Paragraph, Textfield } from '@digdir/designsystemet-react';
import { Code, Concept } from '@catalog-frontend/types';
import { FormikLanguageFieldset, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import styles from '../concept-form.module.scss';
import { getParentPath } from '../../../utils/codeList';

type SubjectSectionProps = {
  codes: Code[] | undefined;
};
export const SubjectSection = ({ codes }: SubjectSectionProps) => {
  const { errors, values, setFieldValue } = useFormikContext<Concept>();

  const selected = values.fagområdeKoder?.filter((v) => codes?.find((code) => code.id === v));

  return (
    <div>
      <div className={styles.fieldSet}>

        {codes === undefined && values.fagområdeKoder?.length && (
          <Alert severity='warning'>
            <Heading level={3} size='xxsmall' spacing>
              {localization.conceptForm.alert.warning}
            </Heading>
            <Paragraph size='sm'>
              {localization.conceptForm.alert.codeListToText}
            </Paragraph>
          </Alert>
        )}
        
        {codes !== undefined && values.fagområde?.length && (
          <Alert severity='warning'>
            <Heading level={3} size='xxsmall' spacing>
              {localization.conceptForm.alert.warning}
            </Heading>
            <Paragraph size='sm'>
              {localization.conceptForm.alert.textToCodeList}
            </Paragraph>
          </Alert>
        )}

        {codes === undefined ? (
          <FormikLanguageFieldset
            name='fagområde'
            errorMessage={localization.conceptForm.validation.languageRequired}
            errorArgs={{ label: localization.conceptForm.fieldLabel.subject }}
            legend={
              <TitleWithHelpTextAndTag
                tagTitle={localization.tag.recommended}
                tagColor='info'
                helpText={localization.conceptForm.helpText.subject}
              >
                {localization.conceptForm.fieldLabel.subjectLabel}
              </TitleWithHelpTextAndTag>
            }
            multiple
          />
        ) : (
          <Combobox
            multiple
            size='sm'
            hideClearButton
            label={
              <TitleWithHelpTextAndTag
                tagTitle={localization.tag.recommended}
                tagColor='info'
                helpText={localization.conceptForm.helpText.subject}
              >
                {localization.conceptForm.fieldLabel.subjectLabel}
              </TitleWithHelpTextAndTag>
            }
            value={selected ?? []}
            onValueChange={(value) => setFieldValue('fagområdeKoder', value)}
            error={errors.fagområdeKoder}
          >
            <Combobox.Empty>Fant ingen treff</Combobox.Empty>
            {codes?.map((code) => {
              const parentPath = getParentPath(code, codes);
              return (
                <Combobox.Option
                  key={code.id}
                  value={code.id}
                  description={parentPath.length > 0 ? `Overordnet: ${parentPath.join(' - ')}` : ''}
                >
                  {code.name.nb}
                </Combobox.Option>
              );
            })}
          </Combobox>
        )}
      </div>
    </div>
  );
};
