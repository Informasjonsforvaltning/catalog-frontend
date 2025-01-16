import { render } from '@testing-library/react';

import React from 'react';
import FormikReferenceDataCombobox from './index';

describe('FormikReferenceDataCombobox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <FormikReferenceDataCombobox
        selectedValuesSearchHits={[]}
        querySearchHits={[]}
        formikValues={[]}
      />,
    );
    expect(baseElement).toBeTruthy();
  });
});
