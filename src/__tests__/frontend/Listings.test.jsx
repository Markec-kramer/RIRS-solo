import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

// mock next/navigation useSearchParams
jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(''),
}));

// simple fetch mock helper
function mockFetchWithItems(items = []) {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      text: async () => JSON.stringify({ items, page: 1, limit: items.length, total: items.length, hasMore: false }),
    })
  );
}

import ListingsPage from '@/app/listings/page';

describe('ListingsPage', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('fetches and displays items', async () => {
    const items = [
      { id: 'a1', title: 'Svetel studio Maribor', location: 'Maribor', price: 50, rating: 4.2, distance: 1.2, image: '', url: '#', createdAt: new Date().toISOString() },
    ];
    mockFetchWithItems(items);

    render(<ListingsPage />);

    await waitFor(() => expect(screen.getByText(/Svetel studio Maribor/i)).toBeInTheDocument());
  });

  test('apply filters triggers fetch', async () => {
    const items = [
      { id: 'b2', title: 'Udoben apartma Ljubljana', location: 'Ljubljana', price: 80, rating: 4.5, distance: 2.3, image: '', url: '#', createdAt: new Date().toISOString() },
    ];
    mockFetchWithItems(items);

    render(<ListingsPage />);

    const input = screen.getByPlaceholderText(/Lokacija/i);
    fireEvent.change(input, { target: { value: 'Ljubljana' } });
    const button = screen.getByText('Filtriraj');
    fireEvent.click(button);

    await waitFor(() => expect(screen.getByText(/Udoben apartma Ljubljana/i)).toBeInTheDocument());
  });

  test('sort select updates displayed order', async () => {
    const items = [
      { id: '1', title: 'A place', location: 'X', price: 200, rating: 4.0, distance: 5, image: '', url: '#', createdAt: new Date().toISOString() },
      { id: '2', title: 'B place', location: 'X', price: 50, rating: 3.5, distance: 2, image: '', url: '#', createdAt: new Date().toISOString() }
    ];
    mockFetchWithItems(items);

    render(<ListingsPage />);

    // wait for initial render (check a specific item to avoid ambiguous matches)
    await waitFor(() => expect(screen.getByText('A place')).toBeInTheDocument());

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'price' } });

    // after sorting by price, cheaper (B place) should appear
    await waitFor(() => expect(screen.getByText('B place')).toBeInTheDocument());
  });

  test('clear button resets filters and triggers fetch', async () => {
    const items = [
      { id: 'c3', title: 'Clear Test', location: 'C', price: 70, rating: 4.1, distance: 1.5, image: '', url: '#', createdAt: new Date().toISOString() },
    ];
    mockFetchWithItems(items);

    render(<ListingsPage />);

    const clearBtn = screen.getByText('Počisti');
    fireEvent.click(clearBtn);

    await waitFor(() => expect(screen.getByText(/Clear Test/i)).toBeInTheDocument());
  });
});
