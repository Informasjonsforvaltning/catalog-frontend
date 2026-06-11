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
  const { datasetTypes, provenanceStatements, frequencies, currencies } =
    referenceData;
  return (
    <div>
      <RecommendedDetailFields
        referenceDataEnv={referenceDataEnv}
        isMobility={isMobility}
      />
      <MinimizedDetailFields
        datasetTypes={datasetTypes}
        provenanceStatements={provenanceStatements}
        frequencies={frequencies}
        currencies={currencies}
        isMobility={isMobility}
      />
    </div>
  );
};
