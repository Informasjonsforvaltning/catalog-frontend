'use client';

import { FC } from 'react';
import { localization as loc } from '@catalog-frontend/utils';
import styles from './existing-sources.module.css';
import { Kilde } from '@catalog-frontend/types';
import { relationToSourceOptions } from '../relation-to-source';

interface Props {
  sourceDescription: {
    forholdTilKilde: string;
    kilde: Kilde[];
  } | null;
}

export const ExistingSources: FC<Props> = ({ sourceDescription }) => {
  const relationToSourceText = relationToSourceOptions.find(
    (option) => option.value === sourceDescription?.forholdTilKilde,
  );
  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>{loc.changeRequest.existingContent}</h3>
      <div className={styles.sourceListing}>
        <div className={styles.sourceEntry}>
          <p>
            {loc.concept.relationToSource}:<span className={styles.existingValue}> {relationToSourceText.label}</span>
          </p>
        </div>
        {sourceDescription?.kilde?.map((kilde) => (
          <div
            key={kilde.uri}
            className={styles.sourceEntry}
          >
            <p>
              {loc.changeRequest.sourceTitle}: <span className={styles.existingValue}>{kilde.tekst}</span>
            </p>
            <p>
              {loc.changeRequest.sourceLink}: <span className={styles.existingValue}>{kilde.uri}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
