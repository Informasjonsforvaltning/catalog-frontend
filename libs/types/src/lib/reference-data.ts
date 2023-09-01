export interface ReferenceDataCode {
  uri: string;
  code?: string;
  label?: Record<string, string>;
}

export interface ConceptStatuses {
  conceptStatuses: ReferenceDataCode[];
}
