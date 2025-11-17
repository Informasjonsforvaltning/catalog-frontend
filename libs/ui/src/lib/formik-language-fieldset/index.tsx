'use client';

import { ReactNode, Ref, useEffect, useRef, useState } from 'react';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Fieldset, Card, Paragraph, Textfield, ValidationMessage } from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';

import styles from './formik-language-fieldset.module.scss';
import { ISOLanguage, LocalizedStrings } from '@catalog-frontend/types';
import { TextareaWithPrefix } from '../textarea-with-prefix';
import { AddButton, DeleteButton } from '../button';
import React from 'react';
import { FormikMultivalueTextfield } from '../formik-multivalue-textfield';
import { FastFieldWithRef } from '../formik-fast-field-with-ref';
import TitleWithHelpTextAndTag from '../title-with-help-text-and-tag';
import { get } from 'lodash';

type LanuguageFieldsetProps = {
  legend?: ReactNode;
  name: string;
  requiredLanguages?: Omit<ISOLanguage, 'no'>[];
  as?: typeof Textfield | typeof TextareaWithPrefix;
  ref?: Ref<HTMLInputElement | HTMLTextAreaElement | null>;
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
  ref,
  multiple = false,
  readOnly = false,
  showError = true,
}: LanuguageFieldsetProps) => {
  const { errors, getFieldMeta, setFieldValue } = useFormikContext<Record<string, LocalizedStrings>>();
  const [focus, setFocus] = useState<string | null>();

  const visibleLanguageFields = allowedLanguages.filter((lang) => {
    const metadata = getFieldMeta(`${name}.${lang}`);
    return requiredLanguages?.includes(lang) || metadata.value !== undefined;
  });

  const languageRefs = useRef(
    allowedLanguages.reduce(
      (acc, lang, index) => {
        if (ref && visibleLanguageFields.includes(lang) && !Object.values(acc).includes(ref)) {
          acc[lang] = ref;
        } else {
          acc[lang] = React.createRef<HTMLInputElement | HTMLTextAreaElement>();
        }
        return acc;
      },
      {} as Record<string, Ref<HTMLInputElement | HTMLTextAreaElement | null>>,
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

  const visibleLanguageButtons = allowedLanguages.filter((lang) => !visibleLanguageFields.includes(lang));

  const langErrors = allowedLanguages
    .filter((lang) => get(errors, `${name}.${lang}`))
    .map((lang) => get(errors, `${name}.${lang}`));

  const hasError = (lang: string) => {
    if (get(errors, `${name}.${lang}`)) {
      return true;
    } else if (langErrors.length === 0 && get(errors, name)) {
      return true;
    }
    return false;
  };

  const getError = () => {
    if (langErrors.length > 0) {
      return langErrors.map((error, index) => <div key={`error-${index}`}>{getTranslateText(error)}</div>);
    }

    if (get(errors, name)) {
      return getTranslateText(get(errors, name));
    }

    return null;
  };

  useEffect(() => {
    if (focus) {
      const ref = languageRefs.current[focus];
      if (ref && 'current' in ref && ref.current) {
        ref.current.focus();
      }
    }
  }, [focus]);

  return (
    <Fieldset
      className={styles.fieldset}
      readOnly={readOnly}
      data-size='sm'
    >
      {legend && <Fieldset.Legend>{legend}</Fieldset.Legend>}
      {visibleLanguageFields.map((lang) => (
        <div key={lang}>
          {multiple ? (
            <FormikMultivalueTextfield
              ref={languageRefs.current[lang] as React.RefObject<HTMLInputElement>}
              label={<TitleWithHelpTextAndTag>{localization.language[lang]}</TitleWithHelpTextAndTag>}
              name={`${name}.${lang}`}
              prefix={localization.language[lang]}
              aria-label={localization.language[lang]}
              showDeleteButton
              onDeleteButtonClicked={() => handleRemoveLanguage(lang)}
              readOnly={readOnly}
              error={hasError(lang)}
            />
          ) : (
            <Card
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
                            data-size='sm'
                            variant='short'
                          >
                            {localization.language[lang]}
                          </Paragraph>
                          {!requiredLanguages?.includes(lang) && !readOnly && (
                            <Card>
                              <DeleteButton onClick={() => handleRemoveLanguage(lang)} />
                            </Card>
                          )}
                        </>
                      ),
                    }
                  : {
                      prefix: localization.language[lang],
                    })}
              />
              {!requiredLanguages?.includes(lang) && renderAs !== TextareaWithPrefix && !readOnly && (
                <DeleteButton onClick={() => handleRemoveLanguage(lang)} />
              )}
            </Card>
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
        <ValidationMessage
          data-size='sm'
          error
        >
          {getError()}
        </ValidationMessage>
      )}
    </Fieldset>
  );
};
