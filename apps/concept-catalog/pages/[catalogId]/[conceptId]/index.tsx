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
import { CheckboxGroup, CheckboxGroupVariant, Tabs } from '@digdir/design-system-react';

export const ConceptPage = ({
  hasPermission, data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const catalogId = (router.query.catalogId as string) ?? '';
  const pageSubtitle = catalogId ?? 'No title';

  const infoData2 = [
    ["ID", data?.id],
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
        {hasPermission ? (
          <>
            <DetailHeading 
              className={classes.detailHeading} 
              headingTitle={<h2>{translate(data?.anbefaltTerm?.navn)}</h2>} 
              subtitle={translate(data?.fagområde)} />
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
              <div>
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
                    <span>N/A</span>
                  </InfoCard.Item>
                  <InfoCard.Item label='Rettslig forklaring:'>
                    <span>N/A</span>
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

                <div className={classes.tabs}>
                  <Tabs
                    items={[
                      {
                        content: <p>Nulla nec rutrum libero. Curabitur lorem est, tempor nec iaculis in, egestas eu lacus. Ut malesuada risus ut ipsum consequat mattis. Donec quis nunc ut lorem suscipit pharetra. Nulla ornare sed nisl nec facilisis. Sed in lacinia elit. Sed et eleifend nisi. Sed egestas nulla lobortis sapien scelerisque, at venenatis risus elementum. Aliquam eleifend, metus non molestie viverra, erat sem ornare enim, nec suscipit nulla nisi vel dolor. Etiam volutpat sapien arcu. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla sollicitudin molestie leo sit amet faucibus. Sed interdum condimentum interdum. Praesent volutpat turpis mattis purus venenatis egestas. In iaculis condimentum fringilla. Duis dignissim turpis mattis tristique vulputate.</p>,
                        name: 'Kommentarer'
                      },
                      {
                        content: <p>Vestibulum nisl diam, tempus sit amet justo eu, semper facilisis dolor. Proin scelerisque tellus sit amet consectetur condimentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque et dui vehicula, semper arcu vitae, posuere odio. Pellentesque eu ante in elit semper pellentesque. Donec cursus eros non diam condimentum viverra. Pellentesque at odio lorem. Aenean ac enim et risus bibendum scelerisque et a purus. Donec ultricies, ex et ornare fringilla, turpis ex consectetur ante, ut porta libero metus quis magna. Nulla eu hendrerit ex, non dapibus quam. Nulla dictum ligula tellus, et elementum orci convallis sit amet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce dolor orci, sagittis vel elit eget, viverra ultrices nulla.</p>,
                        name: 'Endringshistorikk'
                      },
                      {
                        content: (
                          <InfoCard>
                            <InfoCard.Item>
                              <span>v1.2.1 - Testbegrep med mange metadata</span>                              
                            </InfoCard.Item>
                            <InfoCard.Item>
                              <span>v1.2.0 - Testbegrep med mange metadata</span>
                            </InfoCard.Item>
                            <InfoCard.Item>
                              <span>v1.1.0 - Begrep med mange metadata</span>
                            </InfoCard.Item>
                           </InfoCard>   
                        ),
                        name: 'Versjoner'
                      },
                    ]}
                  />
                </div>
              </div>  
              
              <InfoCard size='small'>
                {infoData2.map(([label, value]) => (
                  <InfoCard.Item key={`info-data-${label}`} label={label} labelColor='light'> 
                    <span>{value}</span>
                  </InfoCard.Item>
                ))}
              </InfoCard>
            </div>
          </>
        ) : (
          <div>{localization.noAccess}</div>
        )}
        
      </div>
    </>
  );
};

export async function getServerSideProps({req, params}) {
  const token = await getToken({req});
  const {catalogId, conceptId} = params;

  
  const hasPermission = token && hasOrganizationReadPermission(token.access_token, catalogId);
  const data: Concept | null = hasPermission ? await getConcept(
    conceptId,
    `${token.access_token}`
  ).then(async (response) => {
    return response || null;
  }) : null;

  return {
    props: {
      hasPermission,
      data,
    },
  };  
}

export default ConceptPage;
