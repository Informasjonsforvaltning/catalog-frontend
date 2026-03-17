"use client";

import { ReferenceData } from "@catalog-frontend/types";
import { RecommendedDetailFields } from "./recommended-detail-fields";
import { MinimizedDetailFields } from "./minimized-detail-fields";

type Props = {
  referenceDataEnv: string;
  referenceData: ReferenceData;
  isMobility?: boolean;
};

export const DetailsSection = ({
  referenceDataEnv,
  referenceData,
  isMobility,
}: Props) => {
  const { datasetTypes, provenanceStatements, languages, frequencies } =
    referenceData;
  return (
    <div>
      <RecommendedDetailFields
        referenceDataEnv={referenceDataEnv}
        languages={languages}
        isMobility={isMobility}
      />
      <MinimizedDetailFields
        datasetTypes={datasetTypes}
        provenanceStatements={provenanceStatements}
        frequencies={frequencies}
        isMobility={isMobility}
      />
    </div>
  );
};
