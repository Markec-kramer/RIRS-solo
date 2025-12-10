import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

import LoginPage from '@/app/login/page';

describe('LoginPage', () => {
  afterEach(() => jest.restoreAllMocks());

  test('successful signIn shows success message and calls router', async () => {
    const { signIn } = require('next-auth/react');
    signIn.mockResolvedValue({ ok: true });
    const router = require('next/navigation').useRouter();

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByPlaceholderText(/geslo/i), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: /Prijava/i }));

    await waitFor(() => expect(screen.getByText('Prijavljen!')).toBeInTheDocument());
    // router.push is called after a short timeout in the component — wait for it
    await waitFor(() => expect(router.push).toHaveBeenCalledWith('/saved-searches'), { timeout: 1500 });
  });

  test('failed signIn shows error message', async () => {
    const { signIn } = require('next-auth/react');
    signIn.mockResolvedValue({ ok: false });

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByPlaceholderText(/geslo/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /Prijava/i }));

    await waitFor(() => expect(screen.getByText('Napačni podatki')).toBeInTheDocument());
  });
});
