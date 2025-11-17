import { ConceptStatusTag as TagConceptStatus, type ConceptStatusTagProps } from './concept-status/ConceptStatus';
import {
  ChangeRequestStatusTag as TagChangeRequestStatus,
  type ChangeRequestStatusTagProps,
} from './change-request-status/ChangeRequestStatus';
import { ServiceStatusTag as TagServiceStatus, type ServiceStatusTagProps } from './service-status/ServiceStatus';
import {
  ImportResultStatusTag as TagImportResultStatus,
  type ImportResultStatusTagProps,
} from './import-result-status/ImportResultStatus';
import {
  DataServiceStatusTag as TagDataServiceStatus,
  type DataServiceStatusTagProps,
} from './data-service-status/DataServiceStatus';
import { PublishedTag as TagPublishedTag, type PublishedTagProps } from './published-tag/PublishedTag';

type TagComponent = {
  ConceptStatus: typeof TagConceptStatus;
  ServiceStatus: typeof TagServiceStatus;
  ChangeRequestStatus: typeof TagChangeRequestStatus;
  ImportResultStatus: typeof TagImportResultStatus;
  DataServiceStatus: typeof TagDataServiceStatus;
  PublishedTag: typeof TagPublishedTag;
};

const Tag: TagComponent = {
  ConceptStatus: TagConceptStatus,
  ServiceStatus: TagServiceStatus,
  ChangeRequestStatus: TagChangeRequestStatus,
  ImportResultStatus: TagImportResultStatus,
  DataServiceStatus: TagDataServiceStatus,
  PublishedTag: TagPublishedTag,
};

Tag.ConceptStatus.displayName = `Tag.ConceptStatus`;
Tag.ChangeRequestStatus.displayName = `Tag.ChangeRequestStatus`;
Tag.ServiceStatus.displayName = 'Tag.ServiceStatus';
Tag.ImportResultStatus.displayName = 'Tag.ImportResultStatus';
Tag.DataServiceStatus.displayName = 'Tag.DataServiceStatus';
Tag.PublishedTag.displayName = 'Tag.PublishedTag';

export type {
  ConceptStatusTagProps,
  ChangeRequestStatusTagProps,
  ServiceStatusTagProps,
  ImportResultStatusTagProps,
  DataServiceStatusTagProps,
  PublishedTagProps,
};
export { Tag, TagConceptStatus, TagChangeRequestStatus, TagDataServiceStatus, TagImportResultStatus, TagServiceStatus, TagPublishedTag };
