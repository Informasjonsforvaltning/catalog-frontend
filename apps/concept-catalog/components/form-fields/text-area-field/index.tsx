import { FC } from 'react';
import styles from './text-area-field.module.css';
import { Field } from 'formik';
import { localization as loc } from '@catalog-frontend/utils';
import { Textarea } from '@digdir/design-system-react';
import { LanguageIndicator } from '@catalog-frontend/ui';
import { ISOLanguage } from '@catalog-frontend/types';

interface Props {
  fieldName: string;
  language?: ISOLanguage;
  fieldType: string;
  originalText?: string;
  showOriginal?: boolean;
  rows?: number;
}

interface OriginalTextProps {
  originalText?: string;
}

const OriginalText: FC<OriginalTextProps> = ({ originalText }) => {
  return (
    <div className={styles.row}>
      {originalText ? <p>{originalText}</p> : <p className={styles.noValueText}>({loc.changeRequest.noValue})</p>}
    </div>
  );
};

export const TextAreaField: FC<Props> = ({
  fieldName,
  originalText,
  language,
  fieldType,
  showOriginal = false,
  rows = 1,
}) => {
  const fieldLabel = showOriginal
    ? loc
        .formatString(loc.changeRequest.proposedChange, {
          fieldType: fieldType,
          lang: loc.language[language]?.toLowerCase(),
        })
        .toString()
    : loc
        .formatString(loc.concept.formFieldLabel, {
          fieldType: fieldType,
          lang: loc.language[language]?.toLowerCase(),
        })
        .toString();

  return (
    <>
      <div className={styles.container}>
        <div>
          <LanguageIndicator language={language} />
        </div>
        <div className={styles.inputContainer}>
          {showOriginal && originalText && <OriginalText originalText={originalText} />}
          <div className={styles.row}>
            <Field
              name={fieldName}
              as={Textarea}
              label={fieldLabel}
              rows={rows}
              cols={90}
            />
          </div>
        </div>
      </div>
    </>
  );
};
