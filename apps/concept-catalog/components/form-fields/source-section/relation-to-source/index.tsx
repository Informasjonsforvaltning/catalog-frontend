'use client';

import { FC } from 'react';
import { Select, SingleSelectOption } from '@digdir/design-system-react';
import { localization as loc } from '@catalog-frontend/utils';
import { Field } from 'formik';
import styles from './relation-to-source.module.css';

export const relationToSourceOptions: SingleSelectOption[] = [
  { label: 'Egendefinert', value: 'egendefinert' },
  { label: 'Basert på kilde', value: 'basertPaaKilde' },
  { label: 'Sitat fra kilde', value: 'sitatFraKilde' },
];

interface Props {
  fieldName: string;
  readOnly?: boolean;
}

export const RelationToSource: FC<Props> = ({ fieldName, readOnly }) => {
  return (
    <div className={styles.fieldContainer}>
      {readOnly ? (
        <p>
          {loc.concept.relationToSource}:
          <Field
            name={fieldName}
            as='span'
          />
        </p>
      ) : (
        <Field
          name={fieldName}
          as={Select}
          label={loc.concept.relationToSource}
          options={relationToSourceOptions}
        />
      )}
    </div>
  );
};
