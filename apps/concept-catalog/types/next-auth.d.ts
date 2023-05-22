import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT {
    access_token: string;
    id_token: string;
    refresh_token: string;
  }
}
