import {InferGetServerSidePropsType} from 'next';
import {useRouter} from 'next/router';
import {getToken} from 'next-auth/jwt';
import {
  PageBanner,
  Breadcrumbs,
  breadcrumbT,
  InfoCard,
  DetailHeading,
} from '@catalog-frontend/ui';
import {
  localization,
  getTranslateText as translate,
  hasOrganizationReadPermission,
} from '@catalog-frontend/utils';
import {getConcept} from '@catalog-frontend/data-access';
import {Concept} from '@catalog-frontend/types';
import cn from 'classnames';
import classes from './concept-page.module.css';
import { CheckboxGroup, CheckboxGroupVariant } from '@digdir/design-system-react';

export const ConceptPage = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const catalogId = (router.query.catalogId as string) ?? '';
  const pageSubtitle = catalogId ?? 'No title';

  const infoData2 = [
    ["ID", data.id],
    ["Publiseringsdato", 'N/A'],
    ["Versjon", `${data?.versjonsnr.major}.${data?.versjonsnr.minor}.${data?.versjonsnr.patch}`], 
    ["Gyldighet", `Fra/til: ${data?.gyldigFom} - ${data?.gyldigTom}`],
    ["Tildelt", 'N/A'],
    ["Sist oppdatert", 'N/A'],
    ["Opprettet", 'N/A'],
    ["Merkelapp", 'N/A'],
    ["Begrepsansvarlig", 'N/A'],
    ["Godkjenner", 'N/A'],
    ["Opprettet av", 'N/A'],
  ];

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
        <DetailHeading 
          className={classes.detailHeading} 
          headingTitle={<h2>{translate(data.anbefaltTerm?.navn)}</h2>} 
          subtitle={translate(data.fagområde)} />
        <div className={classes.status}><span>Godkjent</span></div>
        <div className={classes.languages}>
        <CheckboxGroup           
          compact={false}
          description='Velg én eller flere språk.'
          disabled={false}
          items={[
            { checked: false, label: 'Bokmål', name: 'nb' },
            { checked: false, label: 'Nynorsk', name: 'nn' },
            { checked: false, label: 'Engelsk', name: 'en' },
          ]}
          variant={CheckboxGroupVariant.Horizontal} />
        </div>
        <div className={classes.definition}>
          <h3>Definisjon:</h3>
          <div>{translate(data?.definisjon.tekst)}</div>
          <div className={cn(classes.source)}>
            Kilde: <a href="#">Basert på Skatteetaten</a>
          </div>
        </div>

        <div className={classes.info}>
          <InfoCard>
            <InfoCard.Item label="Erstattet av:">
              <span>Begrep x</span>
            </InfoCard.Item>
            <InfoCard.Item label="Merknad:">
              <span>{translate(data?.merknad)}</span>
            </InfoCard.Item>
            <InfoCard.Item label='Eksempel:'>
              <span>{translate(data?.eksempel)}</span>
            </InfoCard.Item>
            <InfoCard.Item label='Folkelig forklaring:'>
              <span>?</span>
            </InfoCard.Item>
            <InfoCard.Item label='Rettslig forklaring:'>
              <span>?</span>
            </InfoCard.Item>
            <InfoCard.Item>
              <table>
                <thead>
                  <tr>
                    <th>Forkortelse:</th>
                    <th>Tillatt term:</th>
                    <th>Frarådet term:</th>
                  </tr>
                </thead>  
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                  </tr>
                </tbody>
              </table>
            </InfoCard.Item>
            <InfoCard.Item label='Verdiområde:'>
              <span>N/A</span>
            </InfoCard.Item>
            <InfoCard.Item label='Interne felt:'>
              <span>N/A</span>
            </InfoCard.Item>
          </InfoCard>
          <InfoCard size='small'>
            {infoData2.map(([label, value]) => (
              <InfoCard.Item key={`info-data-${label}`} label={label} labelColor='light'> 
                <span>{value}</span>
              </InfoCard.Item>
            ))}
          </InfoCard>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps({req, params}) {
  const token = await getToken({req});
  const {catalogId, conceptId} = params;

  if(!token || !hasOrganizationReadPermission(token.access_token, catalogId)) {
    return {    
      notFound: true 
    };
  }

  const data: Concept | null = await getConcept(
    conceptId,
    `${token.access_token}`
  ).then(async (response) => {
    return response || null;
  });

  return {
    props: {
      data,
    },
  };
}

export default ConceptPage;
