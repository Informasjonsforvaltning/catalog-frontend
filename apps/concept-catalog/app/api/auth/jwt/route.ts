import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  if (!token || token?.expires_at < Date.now() / 1000) {
    return new Response('Unauthorized', { status: 401 });
  }

  return new Response(JSON.stringify(token), { status: 200 });
}

export const getTokenFromServer = async () =>
  await fetch('/api/auth/jwt')
    .then((res) => res.json())
    .catch((err) => console.error(err));
