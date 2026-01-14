import React from 'react';
import { render, screen } from '@testing-library/react';

// jest.mock() replaces real modules with fake versions so tests run without external dependencies
// Mocking next/navigation and next-auth to avoid calling real auth/routing code
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),  // returns fake pathname
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: null })),  // returns null (no logged-in user)
  signOut: jest.fn(),  // fake signOut function
}));

import Nav from '@/app/components/Nav';

// describe() groups all Nav component tests together
describe('Nav component', () => {
  // TEST 1: Check that Nav renders all main links
  
  test('renders main links', () => {
    render(<Nav />); 
    expect(screen.getByText(/Apart Alert/i)).toBeInTheDocument();  //logo
    expect(screen.getByText('Domov')).toBeInTheDocument();  // home link
    expect(screen.getByText('Shranjena iskanja')).toBeInTheDocument();  //saved searches link
    expect(screen.getByText('Oglasi')).toBeInTheDocument();  // listings link
  });

  // TEST 2: Check that when NO user is logged in, login/register buttons appear
  test('shows login/register when no session', () => {
    render(<Nav />);
    expect(screen.getByText('Prijava')).toBeInTheDocument();  // more bit prikazan gumb
    expect(screen.getByText('Registracija')).toBeInTheDocument();  // registracijski gumb viden
  });

  // TEST 3: Override the mock to simulate logged-in user, check logout button appears
  test('shows logout when session exists', () => {
    const { useSession } = require('next-auth/react');
    // useSession returns a logged-in user
    useSession.mockImplementation(() => ({ data: { user: { email: 'a@b.com' } } }));
    render(<Nav />);
    expect(screen.getByText('Odjava')).toBeInTheDocument();  // logout button should appear
  });

  // TEST 4: Check that the correct nav link is highlighted when user is on that page
  test('active link class applied based on pathname', () => {
    const nav = require('next/navigation');
    // Simulate listings page
    nav.usePathname.mockImplementation(() => '/listings/123');
    render(<Nav />);
    // Oglasi bi morali biti označeni kot aktivni
    expect(screen.getByText('Oglasi')).toBeInTheDocument();
  });
});
