import { getConceptStatuses } from '@catalog-frontend/data-access';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const response = await getConceptStatuses();
    if (response.status !== 200) {
      throw new Error();
    }
    const jsonResponse = await response.json();
    return new Response(JSON.stringify(jsonResponse), { status: response.status });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Failed to get concept statuses' }), { status: 500 });
  }
}
