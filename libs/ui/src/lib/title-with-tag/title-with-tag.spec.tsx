import { render } from '@testing-library/react';
import React from 'react';

import { TitleWithTag } from './index';

describe('TitleWithTag', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <TitleWithTag
        title={'Title'}
        tagTitle={'Tag title'}
      />,
    );
    expect(baseElement).toBeTruthy();
  });
});
