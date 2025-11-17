'use client';

import { ReferenceData } from '@catalog-frontend/types';
import { RecommendedDetailFields } from './recommended-detail-fields';
import { MinimizedDetailFields } from './minimized-detail-fields';

type Props = {
  referenceDataEnv: string;
  referenceData: ReferenceData;
};

export const DetailsSection = ({ referenceDataEnv, referenceData }: Props) => {
  const { datasetTypes, provenanceStatements, languages, frequencies } = referenceData;
  return (
    <div>
      <RecommendedDetailFields
        referenceDataEnv={referenceDataEnv}
        languages={languages}
      />
      <MinimizedDetailFields
        datasetTypes={datasetTypes}
        provenanceStatements={provenanceStatements}
        frequencies={frequencies}
      />
    </div>
  );
};
