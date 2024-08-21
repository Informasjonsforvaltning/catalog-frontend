import { getConcept } from '@catalog-frontend/data-access';
import { withWriteProtectedPage } from '../../../../utils/auth';
import { redirect, RedirectType } from 'next/navigation';

export default withWriteProtectedPage(
  ({ catalogId, conceptId }) => `/${catalogId}/${conceptId}/edit`,
  async ({ catalogId, conceptId, session }) => {
    const concept = await getConcept(`${conceptId}`, `${session?.accessToken}`).then((response) => {
      if (response.ok) return response.json();
    });
    if (!concept || concept.ansvarligVirksomhet?.id !== catalogId) {
      return redirect(`/notfound`, RedirectType.replace);
    }
    redirect(`${process.env.CONCEPT_CATALOG_GUI_BASE_URI}/${catalogId}/${conceptId}`);
  },
);
