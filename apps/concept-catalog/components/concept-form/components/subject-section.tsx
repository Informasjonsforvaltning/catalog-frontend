import { useFormikContext } from 'formik';
import { Alert, Button, Combobox, Heading, Paragraph } from '@digdir/designsystemet-react';
import { Code, Concept } from '@catalog-frontend/types';
import { FormikLanguageFieldset, FormikMultivalueTextfield, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import styles from '../concept-form.module.scss';
import { getParentPath } from '../../../utils/codeList';
import { ReactNode } from 'react';
import { get, isEmpty, isEqual } from 'lodash';

type SubjectSectionProps = {
  codes: Code[] | undefined;
  markDirty?: boolean;
  readOnly?: boolean;
};
export const SubjectSection = ({ codes, markDirty, readOnly }: SubjectSectionProps) => {
  const { initialValues, errors, values, setFieldValue } = useFormikContext<Concept>();

  const selected = values.fagområdeKoder?.filter((v) => codes?.find((code) => code.id === v));
  const codeListActivated = codes !== undefined;

  const fieldIsChanged = (name: string) => {
    const a = get(initialValues, name);
    const b = get(values, name);
    if (isEmpty(a) && isEmpty(b)) {
      return false;
    }
    return markDirty && !isEqual(a, b);
  };

  const ConflictAlert = () => {
    if (!codeListActivated && !isEmpty(values.fagområdeKoder)) {
      return (
        <Alert
          size='sm'
          severity='warning'
        >
          <Heading
            level={3}
            size='xxsmall'
            spacing
          >
            {localization.conceptForm.alert.warning}
          </Heading>
          <Paragraph size='sm'>{localization.conceptForm.alert.codeListToText}</Paragraph>
          <div className={styles.topMargin2}>
            <Button
              size='sm'
              variant='secondary'
              disabled={readOnly}
              onClick={() => setFieldValue('fagområdeKoder', [])}
            >
              Slett koder
            </Button>
          </div>
        </Alert>
      );
    }

    if (codeListActivated && !isEmpty(values.fagområde)) {
      return (
        <Alert
          size='sm'
          severity='warning'
        >
          <Heading
            level={3}
            size='xxsmall'
            spacing
          >
            {localization.conceptForm.alert.warning}
          </Heading>
          <Paragraph size='sm'>{localization.conceptForm.alert.textToCodeList}</Paragraph>
          <div className={styles.topMargin2}>
            <Button
              size='sm'
              variant='secondary'
              disabled={readOnly}
              onClick={() => setFieldValue('fagområde', null)}
            >
              Slett fritekst verdier
            </Button>
          </div>
        </Alert>
      );
    }
    return null;
  };

  const Fields = () => {
    const fields: ReactNode[] = [];

    if (!codeListActivated || !isEmpty(values.fagområde)) {
      fields.push(
        <FormikLanguageFieldset
          key='fagområde'
          name='fagområde'
          multiple
          readOnly={codeListActivated || readOnly}
          showError={!codeListActivated}
          legend={
            <TitleWithHelpTextAndTag
              {...(!codeListActivated
                ? {
                    tagTitle: localization.tag.recommended,
                    tagColor: 'info',
                  }
                : {})}
              helpText={localization.conceptForm.helpText.subjectFree}
              changed={fieldIsChanged('fagområde')}
            >
              {localization.conceptForm.fieldLabel.subjectFree}
            </TitleWithHelpTextAndTag>
          }
        />,
      );
    }

    const codeListLabel = (
      <TitleWithHelpTextAndTag
        {...(codeListActivated
          ? {
              tagTitle: localization.tag.recommended,
              tagColor: 'info',
            }
          : {})}
        helpText={localization.conceptForm.helpText.subjectCodeList}
        changed={fieldIsChanged('fagområdeKoder')}
      >
        {localization.conceptForm.fieldLabel.subjectCodeList}
      </TitleWithHelpTextAndTag>
    );

    if (codeListActivated) {
      fields.push(
        <Combobox
          key='fagområdeKoder'
          multiple
          size='sm'
          hideClearButton
          readOnly={!codeListActivated || readOnly}
          label={codeListLabel}
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
        </Combobox>,
      );
    } else if (!isEmpty(values.fagområdeKoder)) {
      fields.push(
        <FormikMultivalueTextfield
          key='fagområdeKoder'
          name='fagområdeKoder'
          label={codeListLabel}
          readOnly
        />,
      );
    }

    return codeListActivated ? fields : fields.reverse();
  };

  return (
    <div>
      <div className={styles.fieldSet}>
        <ConflictAlert />
        <Fields />
      </div>
    </div>
  );
};
