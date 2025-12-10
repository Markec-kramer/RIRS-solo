import React from 'react';
import { render, screen } from '@testing-library/react';

// mocks for next/navigation and next-auth
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: null })),
  signOut: jest.fn(),
  // allow tests to override
}));

import Nav from '@/app/components/Nav';

describe('Nav component', () => {
  test('renders main links', () => {
    render(<Nav />);
    expect(screen.getByText(/Apart Alert/i)).toBeInTheDocument();
    expect(screen.getByText('Domov')).toBeInTheDocument();
    expect(screen.getByText('Shranjena iskanja')).toBeInTheDocument();
    expect(screen.getByText('Oglasi')).toBeInTheDocument();
  });

  test('shows login/register when no session', () => {
    render(<Nav />);
    expect(screen.getByText('Prijava')).toBeInTheDocument();
    expect(screen.getByText('Registracija')).toBeInTheDocument();
  });

  test('shows logout when session exists', () => {
    const { useSession } = require('next-auth/react');
    useSession.mockImplementation(() => ({ data: { user: { email: 'a@b.com' } } }));
    render(<Nav />);
    expect(screen.getByText('Odjava')).toBeInTheDocument();
  });

  test('active link class applied based on pathname', () => {
    const nav = require('next/navigation');
    nav.usePathname.mockImplementation(() => '/listings/123');
    render(<Nav />);
    // Oglasi link should have active look (contains 'Oglasi')
    expect(screen.getByText('Oglasi')).toBeInTheDocument();
  });
});
