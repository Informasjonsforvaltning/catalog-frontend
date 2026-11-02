"use client";

import { ReferenceData } from "@catalog-frontend/types";
import { RecommendedDetailFields } from "./recommended-detail-fields";
import { MinimizedDetailFields } from "./minimized-detail-fields";

type Props = {
  referenceData: ReferenceData;
  isMobility?: boolean;
};

export const DetailsSection = ({ referenceData, isMobility }: Props) => {
  const {
    datasetTypes,
    provenanceStatements,
    frequencies,
    currencies,
    qualityDimensions,
  } = referenceData;
  return (
    <div>
      <RecommendedDetailFields isMobility={isMobility} />
      <MinimizedDetailFields
        datasetTypes={datasetTypes}
        provenanceStatements={provenanceStatements}
        frequencies={frequencies}
        currencies={currencies}
        qualityDimensions={qualityDimensions}
        isMobility={isMobility}
      />
    </div>
  );
};
