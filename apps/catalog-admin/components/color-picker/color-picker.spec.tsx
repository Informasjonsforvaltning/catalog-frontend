import { render } from '@testing-library/react';

import ColorPicker from '.';

describe('ColorPicker', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ColorPicker />);
    expect(baseElement).toBeTruthy();
  });
});
