import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import ServiceForm from '../../../../components/service-form';
import { Heading } from '@digdir/design-system-react';

export default async function NewPublicServicePage({ params }: Params) {
  const { catalogId } = params;
  return (
    <div className='container'>
      <Heading size='medium'>Informasjon om tjenesten</Heading>
      <ServiceForm catalogId={catalogId} />
    </div>
  );
}
