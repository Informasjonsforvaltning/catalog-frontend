import { JsonPatchOperation } from './json-patch';

export interface ImportResult {
  id: string;
  created: string;
  catalogId: string;
  status: 'FAILED' | 'COMPLETED' | 'IN_PROGRESS' | 'CANCELLED' | 'PENDING_CONFIRMATION';
  extractionRecords?: ExtractionRecord[];
}

export interface ExtractionRecord {
  internalId: string;
  externalId: string;
  extractResult?: ExtractResult;
}

export interface ExtractResult {
  operations: JsonPatchOperation[];
  issues: ExtractIssue[];
}

export interface ExtractIssue {
  type: 'WARNING' | 'ERROR';
  message: string;
}
