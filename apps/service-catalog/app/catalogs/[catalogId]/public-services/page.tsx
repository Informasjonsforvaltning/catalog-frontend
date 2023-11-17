import { Service } from '@catalog-frontend/types';
import { SearchHit, SearchHitContainer } from '@catalog-frontend/ui';
import { getTranslateText } from '@catalog-frontend/utils';
import { getPublicServices } from '../../../actions/public-services/actions';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import styles from './public-service-page.module.css';

export default async function PublicServiceSearchHitsPage({ params }: Params) {
  const { catalogId } = params;
  const services = await getPublicServices(catalogId);

  return (
    <div className='container'>
      <SearchHitContainer
        searchHits={
          services &&
          services.map((service: Service) => (
            <div
              className={styles.searchHitCard}
              key={service.id}
            >
              <SearchHit
                title={getTranslateText(service.title)}
                description={getTranslateText(service.description)}
              />
            </div>
          ))
        }
        onPageChange={() => console.log('endrer side:P')}
        noSearchHits={services?.length < 1}
      />
    </div>
  );
}
