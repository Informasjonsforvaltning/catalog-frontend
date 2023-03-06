import React from 'react';
import { render } from '@testing-library/react';
import {useSession} from "next-auth/react";
import Index from '../pages/index';

jest.mock("next-auth/react");

describe('Index', () => {
  it('should render successfully', () => {

    const mockSession = {
      expires: new Date(Date.now() + 2 * 86400).toISOString(),
      user: { username: "admin" }
    };
    (useSession as jest.Mock).mockReturnValueOnce([mockSession, 'authenticated']);

    const { baseElement } = render(<Index />);
    expect(baseElement).toBeTruthy();
  });
});
