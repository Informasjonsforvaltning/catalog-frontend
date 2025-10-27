import { render } from '@testing-library/react';

import { FormLayout } from './index';
import '../../../__mocks__/intersection-observer';

describe('FormLayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <FormLayout>
        <p>form</p>
      </FormLayout>,
    );
    expect(baseElement).toBeTruthy();
  });
});
