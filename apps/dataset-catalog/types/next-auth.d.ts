import Session from "next-auth";

import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    error?: string;
    accessToken?: string;
    accessTokenExpiresAt?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    id_token: string;
    refresh_token: string;
    expires_at: number;
  }
}
