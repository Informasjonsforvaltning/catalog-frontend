'use client';

import { PageBanner } from '@catalog-frontend/ui';
import { useCatalogDesign } from '../../context/catalog-design';

export interface BannerProps {
  title: string;
  subtitle?: string;
  catalogId: string;
}

export const Banner = ({ title, subtitle, catalogId }: BannerProps) => {
  const dbDesign = useCatalogDesign();

  return (
    <PageBanner
      title={title}
      subtitle={subtitle ?? ''}
      logoDescription={(dbDesign?.hasLogo && dbDesign?.logoDescription) || ''}
      backgroundColor={dbDesign?.backgroundColor}
      fontColor={dbDesign?.fontColor}
      logo={(dbDesign?.hasLogo && `/api/design/${catalogId}/logo`) || undefined}
    />
  );
};
