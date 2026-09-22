import { ReferenceDataCode } from "@catalog-frontend/types";

import { Tag } from "@digdir/designsystemet-react";
import {
  capitalizeFirstLetter,
  getTranslateText,
} from "@catalog-frontend/utils";

type Props = {
  referenceDataURI?: string;
  referenceDataCodes?: ReferenceDataCode[];
  language: string;
};

export const ReferenceDataTag = ({
  referenceDataURI,
  referenceDataCodes,
  language,
}: Props) => {
  const code = referenceDataCodes?.find((s) => s.uri === referenceDataURI);
  return (
    <Tag data-color="info">
      {capitalizeFirstLetter(getTranslateText(code?.label, language), false) ||
        referenceDataURI}
    </Tag>
  );
};
