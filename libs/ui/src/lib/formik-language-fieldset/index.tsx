'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Fieldset, Box, Paragraph, Textfield, ErrorMessage } from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';

import styles from './formik-language-fieldset.module.scss';
import { ISOLanguage, LocalizedStrings } from '@catalog-frontend/types';
import { TextareaWithPrefix } from '../textarea-with-prefix';
import { AddButton, DeleteButton } from '../button';
import _ from 'lodash';
import React from 'react';
import { FormikMultivalueTextfield } from '../formik-multivalue-textfield';
import { FastFieldWithRef } from '../formik-fast-field-with-ref';

type LanuguageFieldsetProps = {
  legend?: ReactNode;
  name: string;
  requiredLanguages?: Omit<ISOLanguage, 'no'>[];
  as?: typeof Textfield | typeof TextareaWithPrefix;
  multiple?: boolean;
  readOnly?: boolean;
  showError?: boolean;
};

const allowedLanguages = Object.freeze<ISOLanguage[]>(['nb', 'nn', 'en']);

export const FormikLanguageFieldset = ({
  legend,
  name,
  requiredLanguages,
  as: renderAs = Textfield,
  multiple = false,
  readOnly = false,
  showError = true,
}: LanuguageFieldsetProps) => {
  const { errors, getFieldMeta, setFieldValue } = useFormikContext<Record<string, LocalizedStrings>>();
  const [focus, setFocus] = useState<string | null>();
  const languageRefs = useRef(
    allowedLanguages.reduce(
      (acc, lang) => {
        acc[lang] = React.createRef<HTMLInputElement | HTMLTextAreaElement>();
        return acc;
      },
      {} as Record<string, React.RefObject<HTMLInputElement | HTMLTextAreaElement>>,
    ),
  );

  const handleAddLanguage = (lang: string) => {
    setFieldValue(`${name}.${lang}`, multiple ? [] : multiple ? [] : '');
    setFocus(lang);
  };

  const handleRemoveLanguage = (lang: string) => {
    setFieldValue(`${name}.${lang}`, undefined);
    setFocus(null);
  };

  const visibleLanguageFields = allowedLanguages.filter((lang) => {
    const metadata = getFieldMeta(`${name}.${lang}`);
    return requiredLanguages?.includes(lang) || metadata.value !== undefined;
  });

  const visibleLanguageButtons = allowedLanguages.filter((lang) => !visibleLanguageFields.includes(lang));

  const langErrors = allowedLanguages
    .filter((lang) => _.get(errors, `${name}.${lang}`))
    .map((lang) => _.get(errors, `${name}.${lang}`));

  const hasError = (lang: string) => {
    if (_.get(errors, `${name}.${lang}`)) {
      return true;
    } else if (langErrors.length === 0 && _.get(errors, name)) {
      return true;
    }
    return false;
  };

  const getError = () => {
    if (langErrors.length > 0) {
      return langErrors.map((error) => <div>{getTranslateText(error)}</div>);
    }

    if (_.get(errors, name)) {
      return getTranslateText(_.get(errors, name));
    }

    return null;
  };

  useEffect(() => {
    if (focus) {
      languageRefs.current[focus]?.current?.focus();
    }
  }, [focus]);

  return (
    <Fieldset
      className={styles.fieldset}
      legend={legend}
      readOnly={readOnly}
      size='sm'
    >
      {visibleLanguageFields.map((lang) => (
        <div key={lang}>
          {multiple ? (
            <FormikMultivalueTextfield
              ref={languageRefs.current[lang] as React.RefObject<HTMLInputElement>}
              name={`${name}.${lang}`}
              prefix={localization.language[lang]}
              aria-label={localization.language[lang]}
              showDeleteButton
              onDeleteButtonClicked={() => handleRemoveLanguage(lang)}
              readOnly={readOnly}
              error={hasError(lang)}
            />
          ) : (
            <Box
              key={lang}
              className={styles.languageField}
            >
              <FastFieldWithRef
                as={renderAs}
                ref={languageRefs.current[lang]}
                name={`${name}.${lang}`}
                aria-label={localization.language[lang]}
                error={hasError(lang)}
                readOnly={readOnly}
                {...(renderAs === TextareaWithPrefix
                  ? {
                      cols: 110,
                      prefix: (
                        <>
                          <Paragraph
                            size='sm'
                            variant='short'
                          >
                            {localization.language[lang]}
                          </Paragraph>
                          {!readOnly && !requiredLanguages?.includes(lang) && (
                            <Box>
                              <DeleteButton onClick={() => handleRemoveLanguage(lang)} />
                            </Box>
                          )}
                        </>
                      ),
                    }
                  : {
                      prefix: localization.language[lang],
                    })}
              />
              {!readOnly && !requiredLanguages?.includes(lang) && renderAs !== TextareaWithPrefix && (
                <DeleteButton onClick={() => handleRemoveLanguage(lang)} />
              )}
            </Box>
          )}
        </div>
      ))}
      {!readOnly && (
        <div className={styles.languageButtons}>
          {visibleLanguageButtons.map((lang) => (
            <AddButton
              key={lang}
              onClick={() => handleAddLanguage(lang)}
            >
              {localization.language[lang] ?? '?'}
            </AddButton>
          ))}
        </div>
      )}

      {showError && getError() && (
        <ErrorMessage
          size='sm'
          error
        >
          {getError()}
        </ErrorMessage>
      )}
    </Fieldset>
  );
};
