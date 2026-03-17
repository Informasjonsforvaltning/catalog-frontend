import { localization } from "@catalog-frontend/utils";
import { Tag } from "@digdir/designsystemet-react";
import { PublicationStatus } from "@catalog-frontend/types";

type StatusTagProps = {
  approved: boolean;
};

export const StatusTag = ({ approved, ...props }: StatusTagProps) => {
  return (
    <Tag
      data-size="sm"
      data-color={approved ? "success" : "warning"}
      {...props}
    >
      {
        localization.datasetCatalog.status?.[
          approved ? PublicationStatus.APPROVE : PublicationStatus.DRAFT
        ]
      }
    </Tag>
  );
};

export default StatusTag;
