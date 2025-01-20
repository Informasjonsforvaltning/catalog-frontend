'use client';

import { ReactNode, useState } from 'react';
import { localization } from '@catalog-frontend/utils';
import { Fieldset, Box, Paragraph, Textfield, ErrorMessage, Chip } from '@digdir/designsystemet-react';
import { FastField, useFormikContext } from 'formik';

import styles from './formik-language-fieldset.module.scss';
import { ISOLanguage, LocalizedStrings } from '@catalog-frontend/types';
import { TextareaWithPrefix } from '../textarea-with-prefix';
import { AddButton, DeleteButton } from '../button';
import _ from 'lodash';

type LanuguageFieldsetProps = {
  legend?: ReactNode;
  name: string;
  errorMessage?: string;
  errorFieldLabel: string;
  requiredLanguages?: Omit<ISOLanguage, 'no'>[];
  as?: typeof Textfield | typeof TextareaWithPrefix;
  multiple?: boolean;
};

const allowedLanguages = Object.freeze<ISOLanguage[]>(['nb', 'nn', 'en']);

export const FormikLanguageFieldset = ({
  legend,
  name,
  errorMessage,
  errorFieldLabel,
  requiredLanguages,
  as: renderAs = Textfield,
  multiple = false,
}: LanuguageFieldsetProps) => {
  const { errors, values, getFieldMeta, setFieldValue } = useFormikContext<Record<string, LocalizedStrings>>();
  const [textValue, setTextValue] = useState<Record<string, string>>({});

  const handleAddLanguage = (lang: string) => {
    setFieldValue(`${name}.${lang}`, multiple ? [] : multiple ? [] : '');
  };

  const handleRemoveLanguage = (lang: string) => {
    setFieldValue(`${name}.${lang}`, undefined);
  };

  const handleOnChangeTextValue = (value: string, lang: string) => {
    setTextValue((prev) => ({ ...prev, ...{ [lang]: value } }));
  };

  const handleAddTextValue = (lang: string) => {
    if (Boolean(textValue[lang]) === true) {
      const textValues = [...(values?.[name]?.[lang] as string[]), textValue[lang]];
      setFieldValue(`${name}.${lang}`, textValues);
      setTextValue((prev) => ({ ...prev, ...{ [lang]: '' } }));
    }
  };

  const handleRemoveTextValue = (index: number, lang: string) => {
    const textValues = [...(values?.[name]?.[lang] as string[])];
    textValues.splice(index, 1);
    setFieldValue(`${name}.${lang}`, textValues);
  };

  const visibleLanguageFields = allowedLanguages.filter((lang) => {
    const metadata = getFieldMeta(`${name}.${lang}`);
    return requiredLanguages?.includes(lang) || metadata.value !== undefined;
  });

  const visibleLanguageButtons = allowedLanguages.filter((lang) => !visibleLanguageFields.includes(lang));
  const languagesWithError = allowedLanguages
    .filter((lang) => _.get(errors, `${name}.${lang}`))
    .map((lang) => localization.language[lang]);
  
  return (
    <Fieldset
      legend={legend}
      size='sm'
    >
      {visibleLanguageFields.map((lang) => (
        <div key={lang}>
          {multiple ? (
            <>
              <Box key={lang} className={styles.languageField}>
                <Textfield
                  size='sm'
                  aria-label={localization.language[lang]}
                  prefix={localization.language[lang]}
                  value={textValue[lang]}
                  onChange={(e) => handleOnChangeTextValue(e.target.value, lang)}
                  onKeyDown={(e) => {
                    if (e.code === 'Enter') {
                      handleAddTextValue(lang);
                    }
                  }}
                  onBlur={() => handleAddTextValue(lang)}
                />
                <AddButton
                  variant='secondary'
                  disabled={Boolean(textValue[lang]) === false}
                  onClick={() => handleAddTextValue(lang)}
                />
                <DeleteButton onClick={() => handleRemoveLanguage(lang)} />
              </Box>
              <Chip.Group size='sm'>
                {(values?.[name]?.[lang] as string[] | undefined)?.map((v, i) => (
                  <Chip.Removable
                    key={`chip-${i}`}
                    onClick={() => handleRemoveTextValue(i, lang)}
                  >
                    {v}
                  </Chip.Removable>
                ))}
              </Chip.Group>
            </>
          ) : (
            <Box key={lang} className={styles.languageField}>
              <FastField
                as={renderAs}
                name={`${name}.${lang}`}
                size='sm'
                aria-label={localization.language[lang]}
                error={Boolean(_.get(errors, `${name}.${lang}`))}
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
                          {!requiredLanguages?.includes(lang) && (
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
              {!requiredLanguages?.includes(lang) && renderAs !== TextareaWithPrefix && (
                <DeleteButton onClick={() => handleRemoveLanguage(lang)} />
              )}
            </Box>
          )}
        </div>
      ))}
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

      {languagesWithError.length > 0 && (
        <ErrorMessage
          size='sm'
          error
        >
          {errorMessage
            ? `${localization.formatString(errorMessage, { label: errorFieldLabel, language: languagesWithError.join(', ') })}`
            : `This field (${languagesWithError.join(', ')}) is required`}
        </ErrorMessage>
      )}
    </Fieldset>
  );
};
