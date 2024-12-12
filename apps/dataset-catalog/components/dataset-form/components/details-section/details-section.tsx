'use client';

import { FieldsetDivider } from '@catalog-frontend/ui';
import { useFormikContext } from 'formik';
import { Dataset, ReferenceData } from '@catalog-frontend/types';
import { RecommendedDetailFields } from './recommended-detail-fields';
import { HiddenDetailFields } from './hidden-detail-fields';

type Props = {
  referenceDataEnv: string;
  referenceData: ReferenceData;
};

export const DetailsSection = ({ referenceDataEnv, referenceData }: Props) => {
  const { datasetTypes, provenanceStatements, languages, frequencies } = referenceData;
  return (
    <>
      <RecommendedDetailFields
        referenceDataEnv={referenceDataEnv}
        languages={languages}
      />
      <FieldsetDivider />
      <div>
        <HiddenDetailFields
          datasetTypes={datasetTypes}
          provenanceStatements={provenanceStatements}
          frequencies={frequencies}
        />
      </div>
    </>
  );
};
