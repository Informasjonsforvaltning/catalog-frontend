import { NextRequest, NextResponse } from 'next/server';

const handler = async (req: NextRequest) => {
  return new Response('Pong', { status: 200 });
};

export { handler as GET };
