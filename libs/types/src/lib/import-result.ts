import { JsonPatchOperation } from './json-patch';
import { Concept } from './concept';

export interface ImportResult {
  id: string;
  created: string;
  catalogId: string;
  status: 'FAILED' | 'COMPLETED' | 'PARTIALLY_COMPLETED' | 'IN_PROGRESS' | 'CANCELLED' |
    'CANCELLING' | 'PENDING_CONFIRMATION' | 'SAVING';
  extractionRecords?: ExtractionRecord[];
  conceptExtractions: ConceptExtraction[];
  totalConcepts: number;
  extractedConcepts: number;
  savedConcepts: number;
  failureMessage: string;
}

export interface ConceptExtraction {
  extractionRecord: ExtractionRecord;
  concept: Concept;
  conceptExtractionStatus: 'PENDING_CONFIRMATION' | 'SAVING' | 'COMPLETED' | 'FAILED';
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
