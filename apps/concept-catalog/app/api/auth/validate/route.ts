import { authOptions, isValidSessionAndToken } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

const handler = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  const isValid = await isValidSessionAndToken(session);
  return new Response(null, { status: isValid ? 200 : 401 });
};

export { handler as GET };
