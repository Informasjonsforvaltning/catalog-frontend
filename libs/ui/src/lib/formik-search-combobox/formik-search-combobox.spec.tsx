import { render } from '@testing-library/react';

import React from 'react';
import FormikSearchCombobox from './index';

describe('FormikSearchCombobox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <FormikSearchCombobox
        selectedValuesSearchHits={[]}
        querySearchHits={[]}
        formikValues={[]}
      />,
    );
    expect(baseElement).toBeTruthy();
  });
});
