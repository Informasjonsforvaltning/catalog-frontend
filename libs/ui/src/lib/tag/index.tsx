import { ConceptStatusTag as TagConceptStatus, type ConceptStatusTagProps } from './concept-status/ConceptStatus';
import {
  ChangeRequestStatusTag as TagChangeRequestStatus,
  type ChangeRequestStatusTagProps,
} from './change-request-status/ChangeRequestStatus';
import { ServiceStatusTag as TagServiceStatus, type ServiceStatusTagProps } from './service-status/ServiceStatus';

type TagComponent = {
  ConceptStatus: typeof TagConceptStatus;
  ServiceStatus: typeof TagServiceStatus;
  ChangeRequestStatus: typeof TagChangeRequestStatus;
};

const Tag: TagComponent = {
  ConceptStatus: TagConceptStatus,
  ServiceStatus: TagServiceStatus,
  ChangeRequestStatus: TagChangeRequestStatus,
};

Tag.ConceptStatus.displayName = `Tag.ConceptStatus`;
Tag.ChangeRequestStatus.displayName = `Tag.ChangeRequestStatus`;
Tag.ServiceStatus.displayName = 'Tag.ServiceStatus';

export type { ConceptStatusTagProps, ChangeRequestStatusTagProps, ServiceStatusTagProps };
export { Tag, TagConceptStatus, TagChangeRequestStatus };
