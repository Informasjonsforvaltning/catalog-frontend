import { localization } from '@catalog-frontend/utils';

export const getTranslatedStatus = (status: string) =>
  Object.entries(localization.changeRequest.status as Record<string, string>)
    .find(([key]) => key === status.toLowerCase())?.[1]
    .toString();
