import { FormContainer } from '@catalog-frontend/ui';
import { Textfield } from '@digdir/designsystemet-react';

export default async function NewDatasetSeriesPage() {
  return (
    <div className='container'>
      <FormContainer>
        <FormContainer.Header title='test' />
        <Textfield />
      </FormContainer>
    </div>
  );
}
