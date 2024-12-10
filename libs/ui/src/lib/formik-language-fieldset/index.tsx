'use client';

import { ReactNode } from 'react';
import { localization } from '@catalog-frontend/utils';
import { Fieldset, Button, Box, Paragraph, Textfield, ErrorMessage } from '@digdir/designsystemet-react';
import { FastField, useFormikContext } from 'formik';

import styles from './formik-language-fieldset.module.scss';
import { ISOLanguage, LocalizedStrings } from '@catalog-frontend/types';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { TextareaWithPrefix } from '../textarea-with-prefix';
import _ from 'lodash';

type LanuguageFieldsetProps = {
  legend?: ReactNode;
  name: string;
  errorFieldLabel: string;
  requiredLanguages?: Omit<ISOLanguage, 'no'>[];
  as?: typeof Textfield | typeof TextareaWithPrefix;
};

const allowedLanguages = Object.freeze<ISOLanguage[]>(['nb', 'nn', 'en']);

export const FormikLanguageFieldset = ({
  legend,
  name,
  errorFieldLabel,
  requiredLanguages,
  as: renderAs = Textfield,
}: LanuguageFieldsetProps) => {
  const { errors, getFieldMeta, setFieldValue } = useFormikContext<Record<string, LocalizedStrings>>();

  const handleAddLanguage = (lang: string) => {
    setFieldValue(`${name}.${lang}`, '');
  };

  const handleRemoveLanguage = (lang: string) => {
    setFieldValue(`${name}.${lang}`, undefined);
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
        <div
          key={lang}
          className={styles.languageField}
        >
          <FastField
            as={renderAs}
            name={`${name}.${lang}`}
            size='sm'
            aria-label={localization.language[lang]}
            error={Boolean(_.get(errors, `${name}.${lang}`))}
            {...(renderAs === TextareaWithPrefix
              ? {
                  cols: 80,
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
                          <Button
                            variant='tertiary'
                            size='sm'
                            color='danger'
                            onClick={() => handleRemoveLanguage(lang)}
                          >
                            <TrashIcon
                              title={localization.icon.trash}
                              fontSize='1.5rem'
                            />
                            {localization.button.delete}
                          </Button>
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
            <Button
              variant='tertiary'
              size='sm'
              color='danger'
              onClick={() => handleRemoveLanguage(lang)}
            >
              <TrashIcon
                title={localization.button.delete}
                fontSize='1.5rem'
              />
              {localization.button.delete}
            </Button>
          )}
        </div>
      ))}
      <div className={styles.languageButtons}>
        {visibleLanguageButtons.map((lang) => (
          <Button
            key={lang}
            variant='tertiary'
            color='first'
            size='sm'
            onClick={() => handleAddLanguage(lang)}
          >
            <PlusCircleIcon fontSize='1rem' />
            {localization.language[lang] ?? '?'}
          </Button>
        ))}
      </div>

      {languagesWithError.length > 0 && (
        <ErrorMessage
          size='sm'
          error
        >{`${localization.formatString(localization.conceptForm.validation.languageRequired, { label: errorFieldLabel, language: languagesWithError.join(', ') })}`}</ErrorMessage>
      )}
    </Fieldset>
  );
};
