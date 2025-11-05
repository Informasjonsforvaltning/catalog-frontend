"use client";

import { ReferenceData } from "@catalog-frontend/types";
import { RecommendedDetailFields } from "./recommended-detail-fields";
import { MinimizedDetailFields } from "./minimized-detail-fields";
import { Box } from "@digdir/designsystemet-react";

type Props = {
  referenceDataEnv: string;
  referenceData: ReferenceData;
  isMobility?: boolean;
};

export const DetailsSection = ({ referenceDataEnv, referenceData, isMobility }: Props) => {
  const { datasetTypes, provenanceStatements, languages, frequencies } = referenceData;
  return (
    <Box>
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
    </Box>
  );
};
