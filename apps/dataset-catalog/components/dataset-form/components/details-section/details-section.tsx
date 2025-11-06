"use client";

import { ReferenceData } from "@catalog-frontend/types";
import { RecommendedDetailFields } from "./recommended-detail-fields";
import { MinimizedDetailFields } from "./minimized-detail-fields";
import { Box } from "@digdir/designsystemet-react";

type Props = {
  referenceDataEnv: string;
  referenceData: ReferenceData;
};

export const DetailsSection = ({ referenceDataEnv, referenceData }: Props) => {
  const { datasetTypes, provenanceStatements, languages, frequencies } =
    referenceData;
  return (
    <Box>
      <RecommendedDetailFields
        referenceDataEnv={referenceDataEnv}
        languages={languages}
      />
      <MinimizedDetailFields
        datasetTypes={datasetTypes}
        provenanceStatements={provenanceStatements}
        frequencies={frequencies}
      />
    </Box>
  );
};
