'use client';

import { FC } from 'react';
import styles from './source-section.module.css';
import { localization as loc } from '@catalog-frontend/utils';
import { Definisjon, Kilde } from '@catalog-frontend/types';
import { FieldArray } from 'formik';
import { SourceForDefinitionField } from './source-for-definition';
import { Button } from '@digdir/design-system-react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { RelationToSource } from './relation-to-source';
import { ExistingSources } from './existing-sources';

interface Props {
  fieldName: string;
  definisjon: Definisjon;
  originalSources?: {
    forholdTilKilde: string;
    kilde: Kilde[];
  } | null;
  showOriginal: boolean;
}

export const SourceSection: FC<Props> = ({ originalSources, fieldName, showOriginal, definisjon }) => {
  return (
    <div className={styles.container}>
      {showOriginal && originalSources?.kilde.length > 0 && <ExistingSources sourceDescription={originalSources} />}
      {showOriginal && <h3 className={styles.editContentHeading}>{loc.changeRequest.editSources}</h3>}
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
                />
              ))}
            </div>
            <div>
              <Button
                icon={<PlusCircleIcon />}
                color='secondary'
                variant='filled'
                size='small'
                onClick={() => arrayHelpers.push({ uri: '', tekst: '' })}
              >
                {loc.formatString(loc.button.addWithFormat, { text: loc.concept.source.toLowerCase() })}
              </Button>
            </div>
          </>
        )}
      </FieldArray>
    </div>
  );
};
