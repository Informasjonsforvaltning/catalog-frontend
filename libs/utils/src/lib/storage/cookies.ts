import { ChangeRequestsPageSettings, ConceptsPageSettings, DatasetsPageSettings, DataServicesPageSettings } from '@catalog-frontend/types';
import Cookies from 'js-cookie';

const cookieNameConceptsPageSettings = 'concepts-page-settings';
const cookieNameChangeRequestsPageSettings = 'change-requests-page-settings';
const cookieNameDatasetsPageSettings = 'datasets-page-settings';
const cookieNameDataServicesPageSettings = 'data-services-page-settings';

export const getServerPageSettings = <T>(name: string, cookieStore: any): T | undefined => {
  const cookieValue = cookieStore.get(name)?.value;
  let pageSettings = undefined;
  if (cookieValue) {
    try {
      return JSON.parse(cookieValue) as T;
    } catch {}
  }
  return undefined;
};

export const getServerConceptsPageSettings = (cookieStore: any) =>
  getServerPageSettings<ConceptsPageSettings>(cookieNameConceptsPageSettings, cookieStore);
export const getServerChangeRequestsPageSettings = (cookieStore: any) =>
  getServerPageSettings<ChangeRequestsPageSettings>(cookieNameChangeRequestsPageSettings, cookieStore);
export const getServerDatasetsPageSettings = (cookieStore: any) =>
  getServerPageSettings<DatasetsPageSettings>(cookieNameDatasetsPageSettings, cookieStore);
export const getServerDataServicesPageSettings = (cookieStore: any) =>
  getServerPageSettings<DataServicesPageSettings>(cookieNameDataServicesPageSettings, cookieStore);

export const setClientConceptsPageSettings = (settings: ConceptsPageSettings) =>
  Cookies.set(cookieNameConceptsPageSettings, JSON.stringify(settings));
export const setClientChangeRequestsPageSettings = (settings: ChangeRequestsPageSettings) =>
  Cookies.set(cookieNameChangeRequestsPageSettings, JSON.stringify(settings));
export const setClientDatasetsPageSettings = (settings: DatasetsPageSettings) =>
  Cookies.set(cookieNameDatasetsPageSettings, JSON.stringify(settings));
export const setClientDataServicesPageSettings = (settings: DataServicesPageSettings) =>
  Cookies.set(cookieNameDataServicesPageSettings, JSON.stringify(settings));
