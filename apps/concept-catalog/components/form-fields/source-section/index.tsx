'use client';

import { FC } from 'react';
import styles from './source-section.module.css';
import { localization as loc } from '@catalog-frontend/utils';
import { Definisjon } from '@catalog-frontend/types';
import { FieldArray } from 'formik';
import { SourceForDefinitionField } from './source-for-definition';
import { Button } from '@digdir/design-system-react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { RelationToSource } from './relation-to-source';

interface Props {
  fieldName: string;
  definisjon?: Definisjon;
  readOnly: boolean;
}

export const SourceSection: FC<Props> = ({ fieldName, definisjon, readOnly }) => {
  return (
    <div className={styles.container}>
      <RelationToSource fieldName={`${fieldName}.forholdTilKilde`} />
      <FieldArray name={`${fieldName}.kilde`}>
        {(arrayHelpers) => (
          <>
            <div className={styles.listContainer}>
              {definisjon?.kildebeskrivelse?.kilde?.map((_, index) => (
                <SourceForDefinitionField
                  key={`${index}`}
                  sourceTitleFieldName={`${fieldName}.kilde[${index}].tekst`}
                  sourceUriFieldName={`${fieldName}.kilde[${index}].uri`}
                  deleteClickHandler={() => arrayHelpers.remove(index)}
                  readOnly={readOnly}
                />
              ))}
            </div>
            <div>
              {!readOnly && (
                <Button
                  icon={<PlusCircleIcon />}
                  color='second'
                  variant='secondary'
                  size='small'
                  onClick={() => arrayHelpers.push({ uri: '', tekst: '' })}
                >
                  {loc.formatString(loc.button.addWithFormat, { text: loc.concept.source.toLowerCase() })}
                </Button>
              )}
            </div>
          </>
        )}
      </FieldArray>
    </div>
  );
};
