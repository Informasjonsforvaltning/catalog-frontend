export interface Terms {
  version: string;
  text: string;
}

export interface TermsAcceptation {
  orgId: string;
  acceptedVersion: string;
  acceptorName: string;
  acceptDate: string;
}
