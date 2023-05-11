import { InferGetServerSidePropsType } from 'next';
import {useRouter} from 'next/router';
import { getToken } from "next-auth/jwt";
import {PageBanner, Breadcrumbs, breadcrumbT, InfoCard} from '@catalog-frontend/ui';
import {localization, getTranslateText as translate, hasOrganizationReadPermission} from '@catalog-frontend/utils';
import { getConcept } from '@catalog-frontend/data-access';
import { Concept } from '@catalog-frontend/types';
import cn from 'classnames';
import classes from './concept-page.module.css';

export const ConceptPage = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const catalogId = router.query.catalogId as string ?? '';
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
      <div className='container'>
        <div className={classes.definition}>
          <h3>Definisjon:</h3>
          <div>{translate(data?.definisjon.tekst)}</div>
          <div className={cn(classes.source)}>
            Kilde: <a href="#">Basert på Skatteetaten</a>
          </div>
        </div>
        
        <div className={classes.info}>
          <InfoCard>
            <InfoCard.Item label='Erstattet av:'>
              <span>Begrep x</span>
            </InfoCard.Item>
            <InfoCard.Item label='Merknad:'>
              <span>{translate(data?.merknad)}</span>
            </InfoCard.Item>
            <InfoCard.Item>
              <table>
                <tr>
                  <th>Column 1</th>
                  <th>Column 2</th>
                  <th>Column 3</th>
                </tr>
                <tr>
                  <td>1</td>
                  <td>2</td>
                  <td>3</td>
                </tr>
              </table>
            </InfoCard.Item>
          </InfoCard>
          <InfoCard size='small'>
            <InfoCard.Item label='ID' labelColor='light'> 
              <span>{data?.id}</span>
            </InfoCard.Item>
            <InfoCard.Item label='Publiseringsdato' labelColor='light'>              
              <span>Publisert i Felles datakatalog 31.01.2022</span>
            </InfoCard.Item>
            <InfoCard.Item label='Versjon' labelColor='light'>              
              <span>{data?.versjonsnr.major}.{data?.versjonsnr.minor}.{data?.versjonsnr.patch}</span>
            </InfoCard.Item>
            <InfoCard.Item label='Gyldighet' labelColor='light'>              
              <span>Fra/til: {data?.gyldigFom} - {data?.gyldigTom}</span>
            </InfoCard.Item>
          </InfoCard>
        </div>
      </div>
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

  const data: Concept|null = await getConcept(
    conceptId,
    `${token.access_token}`
  ).then(async (response) => {
    return response || null;
  });
  
  return {
    props: {
      data
    }
  };
}

export default ConceptPage;
