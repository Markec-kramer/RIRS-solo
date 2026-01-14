import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// jest.mock() replaces next-auth/react signIn function with a fake one
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),  // fake signIn — tests will control its behavior
}));

// Shared mock for router.push so both component and test can reference same function
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

import LoginPage from '@/app/login/page';


describe('LoginPage', () => {
  
  afterEach(() => jest.restoreAllMocks());

  // TEST 1: Check successful login shows success message and redirects to /saved-searches
  
  test('successful signIn shows success message and calls router', async () => {
    const { signIn } = require('next-auth/react');
    // mockResolvedValue()  return { ok: true }
    signIn.mockResolvedValue({ ok: true });
    const router = require('next/navigation').useRouter();

    render(<LoginPage />);  
    
    // fireEvent.change() tipkanje v okno za email in geslo
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByPlaceholderText(/geslo/i), { target: { value: 'pass' } });
    
    // login button
    fireEvent.click(screen.getByRole('button', { name: /Prijava/i }));

    // waitFor() caka na  success message (max 1000ms)
    await waitFor(() => expect(screen.getByText('Prijavljen!')).toBeInTheDocument());
    
    
    await waitFor(() => expect(router.push).toHaveBeenCalledWith('/saved-searches'), { timeout: 1500 });
  });

  // TEST 2: Check failed login shows error message
  
  test('failed signIn shows error message', async () => {
    const { signIn } = require('next-auth/react');
    
    signIn.mockResolvedValue({ ok: false });

    render(<LoginPage />);
    
    // Simulacija napacnih vnosov
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByPlaceholderText(/geslo/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /Prijava/i }));

    // caka na error message
    await waitFor(() => expect(screen.getByText('Napačni podatki')).toBeInTheDocument());
  });
});
