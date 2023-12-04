export interface Organization {
  organizationId: string;
  name?: string;
  orgType?: string;
  orgPath?: string;
  prefLabel?: {
    nb?: string;
    nn?: string;
    en?: string;
  };
}
