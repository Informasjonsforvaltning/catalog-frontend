import { InferGetServerSidePropsType } from 'next';
import {useRouter} from 'next/router';
import { getToken } from "next-auth/jwt";
import {PageBanner, Breadcrumbs, breadcrumbT} from '@catalog-frontend/ui';
import {localization, getTranslateText as translate, hasOrganizationReadPermission} from '@catalog-frontend/utils';
import { getConcept } from '@catalog-frontend/data-access';
import { Concept } from '@catalog-frontend/types';

export const ConceptPage = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [catalogId] = router.query.catalogId ?? '';
  const pageSubtitle = catalogId ?? 'No title';

  const breadcrumbList = catalogId
    ? ([
        {
          href: `/${catalogId}`,
          text: localization.catalogType.concept,
        },
      ] as unknown as breadcrumbT[])
    : [];

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={pageSubtitle}
      />
      {translate(data?.anbefaltTerm.navn)}
    </>
  );
};

export async function getServerSideProps({ req, params }) {
	const token = await getToken({ req });
  const { catalogId, conceptId } = params;

  if(!hasOrganizationReadPermission(token?.access_token, catalogId)) {
    return {    
      notFound: true 
    };
  }

  const data: Concept = await getConcept(
    conceptId,
    `${token.access_token}`
  ).then(async (response) => {
    return response;
  });
  
  return {
    props: {
      data
    }
  };
}

export default ConceptPage;
