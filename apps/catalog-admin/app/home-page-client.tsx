"use client";

import { Breadcrumbs, NavigationCard } from "@catalog-frontend/ui";

const HomePageClient = ({ organizations, catalogPortalUrl }: any) => {
  return (
    <>
      <Breadcrumbs catalogPortalUrl={catalogPortalUrl} />
      <div>
        <div className="card">
          {organizations.length === 0 && <div>Du har ikke tilgang</div>}
          {organizations.map((organization: any) => (
            <NavigationCard
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
