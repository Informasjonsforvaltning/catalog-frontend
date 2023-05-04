import React from 'react';
import {render} from '@testing-library/react';
import Header from '.';
import {withRouter} from 'next/router';
describe('Header', () => {
  it('should render successfully', () => {
    const {baseElement} = render(withRouter(<Header />));
    expect(baseElement).toBeTruthy();
    expect(baseElement).toMatchSnapshot();
  });
});
