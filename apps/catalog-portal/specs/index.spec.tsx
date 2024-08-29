import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('Home', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(<Home />);
    expect(baseElement).toBeTruthy();
  });
});
