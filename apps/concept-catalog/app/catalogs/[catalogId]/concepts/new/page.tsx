import { RedirectType, redirect } from 'next/navigation';
import { withWriteProtectedPage } from '../../../../../utils/auth';

export const NewPage = withWriteProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/concepts/new`,
  async ({ catalogId }) => {
    //redirect(`${process.env.CONCEPT_CATALOG_GUI_BASE_URI}/${catalogId}/new`, RedirectType.push);
  },
);

export default NewPage;
