import { JsonPatchOperation } from "./json-patch";
import { Concept } from "./concept";

export enum ImportResutStatus {
  FAILED = "FAILED",
  COMPLETED = "COMPLETED",
  PARTIALLY_COMPLETED = "PARTIALLY_COMPLETED",
  IN_PROGRESS = "IN_PROGRESS",
  CANCELLED = "CANCELLED",
  CANCELLING = "CANCELLING",
  PENDING_CONFIRMATION = "PENDING_CONFIRMATION",
  SAVING = "SAVING",
}

export enum ConceptExtractionStatus {
  PENDING_CONFIRMATION = "PENDING_CONFIRMATION",
  CANCELLED = "CANCELLED",
  SAVING = "SAVING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  SAVING_FAILED = "SAVING_FAILED",
}

export interface ImportResult {
  id: string;
  created: string;
  catalogId: string;
  status: ImportResutStatus;
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
  conceptExtractionStatus: ConceptExtractionStatus;
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
  type: "WARNING" | "ERROR";
  message: string;
}
