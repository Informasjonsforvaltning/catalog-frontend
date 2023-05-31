import { render } from '@testing-library/react';

import React from 'react';
import DropdownMenu from './components/dropdown-menu';

describe('DropdownMenu', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DropdownMenu
        isOpen={false}
        onClose={function (): void {
          throw new Error('Function not implemented.');
        }}
      />,
    );
    expect(baseElement).toBeTruthy();
  });
});
