import {
  ConceptStatusTag as TagConceptStatus,
  type ConceptStatusTagProps,
} from "./concept-status/ConceptStatus";
import {
  ChangeRequestStatusTag as TagChangeRequestStatus,
  type ChangeRequestStatusTagProps,
} from "./change-request-status/ChangeRequestStatus";
import {
  ServiceStatusTag as TagServiceStatus,
  type ServiceStatusTagProps,
} from "./service-status/ServiceStatus";
import {
  ImportResultStatusTag as TagImportResultStatus,
  type ImportResultStatusTagProps,
} from "./import-result-status/ImportResultStatus";
import {
  DataServiceStatusTag as TagDataServiceStatus,
  type DataServiceStatusTagProps,
} from "./data-service-status/DataServiceStatus";
import {
  ProductStatusTag as TagProductStatus,
  type ProductStatusTagProps,
} from "./product-status/ProductStatus";

type TagComponent = {
  ConceptStatus: typeof TagConceptStatus;
  ServiceStatus: typeof TagServiceStatus;
  ChangeRequestStatus: typeof TagChangeRequestStatus;
  ImportResultStatus: typeof TagImportResultStatus;
  DataServiceStatus: typeof TagDataServiceStatus;
  ProductStatus: typeof TagProductStatus;
};

const Tag: TagComponent = {
  ConceptStatus: TagConceptStatus,
  ServiceStatus: TagServiceStatus,
  ChangeRequestStatus: TagChangeRequestStatus,
  ImportResultStatus: TagImportResultStatus,
  DataServiceStatus: TagDataServiceStatus,
  ProductStatus: TagProductStatus,
};

Tag.ConceptStatus.displayName = "Tag.ConceptStatus";
Tag.ChangeRequestStatus.displayName = "Tag.ChangeRequestStatus";
Tag.ServiceStatus.displayName = "Tag.ServiceStatus";
Tag.ImportResultStatus.displayName = "Tag.ImportResultStatus";
Tag.DataServiceStatus.displayName = "Tag.DataServiceStatus";
Tag.ProductStatus.displayName = "Tag.ProductStatus";

export type {
  ConceptStatusTagProps,
  ChangeRequestStatusTagProps,
  ServiceStatusTagProps,
  ImportResultStatusTagProps,
  DataServiceStatusTagProps,
  ProductStatusTagProps,
};
export {
  Tag,
  TagConceptStatus,
  TagChangeRequestStatus,
  TagDataServiceStatus,
  TagImportResultStatus,
  TagServiceStatus,
  TagProductStatus,
};
