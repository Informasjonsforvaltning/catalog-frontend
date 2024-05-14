import React from 'react';
import { render } from '@testing-library/react';
import { Header } from '.';

// Mock useRouter and useParams:
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
  useParams() {
    return {
      catalogId: '1234',
    };
  },
}));

// Mock useSession:
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: { user: { name: 'John Doe' } } })),
}));

describe('Header', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Header />);
    expect(baseElement).toBeTruthy();
    expect(baseElement).toMatchSnapshot();
  });
});
