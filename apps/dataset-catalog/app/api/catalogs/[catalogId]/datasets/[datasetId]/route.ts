import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@catalog-frontend/utils';
import { deleteDataset } from '@catalog-frontend/data-access';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ catalogId: string; datasetId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { catalogId, datasetId } = await context.params;

    if (!catalogId || !datasetId) {
      return NextResponse.json({ error: 'Catalog ID and Dataset ID are required' }, { status: 400 });
    }

    const response = await deleteDataset(catalogId, datasetId, `${session.accessToken}`);
    if (!response.ok) {
      console.error('[DELETE DATASET] API call failed with status:', response.status);
      return NextResponse.json({ error: 'Failed to delete dataset' }, { status: response.status });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[DELETE DATASET] Error:', error);
    return NextResponse.json({ error: 'Failed to delete dataset' }, { status: 500 });
  }
}
