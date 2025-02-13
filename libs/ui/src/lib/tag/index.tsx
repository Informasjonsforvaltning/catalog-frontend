import { ConceptStatusTag as TagConceptStatus, type ConceptStatusTagProps } from './concept-status/ConceptStatus';
import {
  ChangeRequestStatusTag as TagChangeRequestStatus,
  type ChangeRequestStatusTagProps,
} from './change-request-status/ChangeRequestStatus';
import { ServiceStatusTag as TagServiceStatus, type ServiceStatusTagProps } from './service-status/ServiceStatus';
import {
  DataServiceStatusTag as TagDataServiceStatus,
  type DataServiceStatusTagProps,
} from './data-service-status/DataServiceStatus';

type TagComponent = {
  ConceptStatus: typeof TagConceptStatus;
  ServiceStatus: typeof TagServiceStatus;
  ChangeRequestStatus: typeof TagChangeRequestStatus;
  DataServiceStatus: typeof TagDataServiceStatus;
};

const Tag: TagComponent = {
  ConceptStatus: TagConceptStatus,
  ServiceStatus: TagServiceStatus,
  ChangeRequestStatus: TagChangeRequestStatus,
  DataServiceStatus: TagDataServiceStatus,
};

Tag.ConceptStatus.displayName = `Tag.ConceptStatus`;
Tag.ChangeRequestStatus.displayName = `Tag.ChangeRequestStatus`;
Tag.ServiceStatus.displayName = 'Tag.ServiceStatus';
Tag.DataServiceStatus.displayName = 'Tag.DataServiceStatus';

export type { ConceptStatusTagProps, ChangeRequestStatusTagProps, ServiceStatusTagProps, DataServiceStatusTagProps };
export { Tag, TagConceptStatus, TagChangeRequestStatus, TagDataServiceStatus, TagServiceStatus };
