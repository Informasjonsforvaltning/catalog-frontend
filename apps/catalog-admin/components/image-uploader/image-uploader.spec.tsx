import { render } from '@testing-library/react';

import ImageUploader from '.';

describe('ImageUploader', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ImageUploader />);
    expect(baseElement).toBeTruthy();
  });
});
