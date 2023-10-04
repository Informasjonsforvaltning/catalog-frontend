export interface JsonPatchOperation {
  op: string;
  path: string;
  value: string | number | Record<string, string>;
}
