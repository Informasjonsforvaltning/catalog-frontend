import { withWriteProtectedPage } from '../../../../utils/auth';
import { redirect } from 'next/navigation';

export default withWriteProtectedPage(
  ({ catalogId, conceptId }) => `/${catalogId}/${conceptId}/edit`,
  async ({ catalogId, conceptId }) => {
    redirect(`${process.env.CONCEPT_CATALOG_GUI_BASE_URI}/${catalogId}/${conceptId}`);
  },
);
