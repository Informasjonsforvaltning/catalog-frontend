export enum EntityEnum {
  CONCEPT = 'concept',
  EVENT = 'event',
}

export enum PublicationStatus {
  DRAFT = 'DRAFT',
  PUBLISH = 'PUBLISH',
  APPROVE = 'APPROVE',
}

export enum AccessRights {
  CONFIDENTIAL = 'http://publications.europa.eu/resource/authority/access-right/CONFIDENTIAL',
  NON_PUBLIC = 'http://publications.europa.eu/resource/authority/access-right/NON_PUBLIC',
  NORMAL = 'http://publications.europa.eu/resource/authority/access-right/NORMAL',
  PUBLIC = 'http://publications.europa.eu/resource/authority/access-right/PUBLIC',
  RESTRICTED = 'http://publications.europa.eu/resource/authority/access-right/RESTRICTED',
  SENSITIVE = 'http://publications.europa.eu/resource/authority/access-right/SENSITIVE',
}

export enum SpecializedType {
  SERIES = 'SERIES',
}
