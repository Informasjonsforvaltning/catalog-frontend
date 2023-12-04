'use client';

import { Breadcrumbs, Card } from '@catalog-frontend/ui';

const HomePageClient = ({ organizations }) => {
  return (
    <>
      <Breadcrumbs />
      <div>
        <div className='card'>
          {organizations.length === 0 && <div>Du har ikke tilgang</div>}
          {organizations.map((organization) => (
            <Card
              key={organization.organizationId}
              title={organization.name}
              href={`/catalogs/${organization.organizationId}`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePageClient;
