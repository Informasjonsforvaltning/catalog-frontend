'use client';
import { Dataset } from '@catalog-frontend/types';
import { FormContainer, TitleWithTag } from '@catalog-frontend/ui';
import { Heading, Textfield, Chip, Button } from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';
import styles from './dataset-form.module.css';
import { useState } from 'react';
import { localization } from '@catalog-frontend/utils';

export const ConceptSection = () => {
  const { setFieldValue, values } = useFormikContext<Dataset>();
  const [inputValue, setInputValue] = useState<string>('');

  const addKeyword = () => {
    if (inputValue && !values.keywordList?.nb?.includes(inputValue)) {
      const updatedKeywords = [...(values.keywordList?.nb || []), inputValue];
      setFieldValue('keywordList.nb', updatedKeywords);
      setInputValue('');
    }
  };

  const removeKeyword = (keyword: string) => {
    const updatedKeywords = values.keywordList?.nb?.filter((item: string) => item !== keyword) || [];
    setFieldValue('keywordList.nb', updatedKeywords);
  };

  return (
    <div>
      <Heading
        size='sm'
        spacing
      >
        {localization.datasetForm.heading.concept}
      </Heading>
      <FormContainer>
        <FormContainer.Header
          title={localization.resourceType.concept}
          subtitle={localization.datasetForm.helptext.concept}
        />

        <FormContainer.Header
          title='Emneord'
          subtitle={localization.datasetForm.helptext.keyword}
        />
        <div className={styles.bottomRow}>
          <div className={styles.fullWidth}>
            <Textfield
              label={
                <TitleWithTag
                  title={localization.datasetForm.fieldLabel.keyword.nb}
                  tagTitle={localization.tag.recommended}
                  tagColor='info'
                />
              }
              name='keywordList.nb'
              type='text'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addKeyword();
                }
              }}
            />
          </div>
          <div className={styles.button}>
            <Button onClick={addKeyword}>{`${localization.add}...`}</Button>
          </div>
        </div>
        <Chip.Group>
          {values.keywordList?.nb &&
            values.keywordList.nb.map((value: string) => (
              <Chip.Removable
                key={value}
                onClick={() => removeKeyword(value)}
              >
                {value}
              </Chip.Removable>
            ))}
        </Chip.Group>
      </FormContainer>
    </div>
  );
};
