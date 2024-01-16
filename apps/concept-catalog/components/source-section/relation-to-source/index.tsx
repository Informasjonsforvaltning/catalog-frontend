'use client';

import { FC, ReactNode } from 'react';
import { Select } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Field } from 'formik';
import styles from './relation-to-source.module.css';
import { RelationshipWithSource } from '@catalog-frontend/types';

export interface RelationshipWithSourceOptions {
  displayValue: ReactNode | string;
  value: RelationshipWithSource;
}

export const relationToSourceOptions: RelationshipWithSourceOptions[] = [
  { displayValue: 'Egendefinert', value: 'egendefinert' },
  { displayValue: 'Basert på kilde', value: 'basertPaaKilde' },
  { displayValue: 'Sitat fra kilde', value: 'sitatFraKilde' },
];

interface Props {
  fieldName: string;
  readOnly?: boolean;
}

export const RelationToSource: FC<Props> = ({ fieldName, readOnly }) => {
  return (
    <div className={styles.fieldContainer}>
      {
        <Field
          name={fieldName}
          as={Select}
          label={localization.concept.relationToSource}
          size='small'
          readOnly={readOnly}
        >
          {relationToSourceOptions.map(({ displayValue, value }) => (
            <option
              key={value}
              value={value}
            >
              {displayValue}
            </option>
          ))}
        </Field>
      }
    </div>
  );
};
