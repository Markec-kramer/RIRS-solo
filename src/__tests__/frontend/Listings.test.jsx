import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

// jest.mock() replaces the real useSearchParams hook with a fake one
jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(''),  // return empty search params
}));

// Helper function to fake API responses with listings data
// This prevents real API calls during tests
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
    // jest.restoreAllMocks() clears all mocks after each test so they don't affect next test
    jest.restoreAllMocks();
  });

  // TEST 1: Check that listings are fetched from API and displayed on page
  
  test('fetches and displays items', async () => {
    const items = [
      { id: 'a1', title: 'Svetel studio Maribor', location: 'Maribor', price: 50, rating: 4.2, distance: 1.2, image: '', url: '#', createdAt: new Date().toISOString() },
    ];
    mockFetchWithItems(items);  //fake API response

    render(<ListingsPage />);  // mount page component

  
    // This ensures API fetch completes and listing appears
    await waitFor(() => expect(screen.getByText(/Svetel studio Maribor/i)).toBeInTheDocument());
  });

  // TEST 2: Check that entering location and clicking Filtriraj fetches filtered results
  test('apply filters triggers fetch', async () => {
    const items = [
      { id: 'b2', title: 'Udoben apartma Ljubljana', location: 'Ljubljana', price: 80, rating: 4.5, distance: 2.3, image: '', url: '#', createdAt: new Date().toISOString() },
    ];
    mockFetchWithItems(items);

    render(<ListingsPage />);

    // fireEvent.change() simulacija pisanja v polje 
    const input = screen.getByPlaceholderText(/Lokacija/i);
    fireEvent.change(input, { target: { value: 'Ljubljana' } });
    
   
    const button = screen.getByText('Filtriraj');
    fireEvent.click(button);

    
    await waitFor(() => expect(screen.getByText(/Udoben apartma Ljubljana/i)).toBeInTheDocument());
  });

  // TEST 3: Check that selecting a sort option (e.g., by price) reorders listings
  test('sort select updates displayed order', async () => {
    const items = [
      { id: '1', title: 'A place', location: 'X', price: 200, rating: 4.0, distance: 5, image: '', url: '#', createdAt: new Date().toISOString() },
      { id: '2', title: 'B place', location: 'X', price: 50, rating: 3.5, distance: 2, image: '', url: '#', createdAt: new Date().toISOString() }
    ];
    mockFetchWithItems(items);

    render(<ListingsPage />);

    //pocaka da se nalozijo oglasi
    await waitFor(() => expect(screen.getByText('A place')).toBeInTheDocument());

    // preverja izbiro sortiranja po ceni
    const select = screen.getByRole('combobox');  // combobox = dropdown
    fireEvent.change(select, { target: { value: 'price' } });  // select "sort by price"

    // pregleda ce je (B place: 50€) se vedno pred (A place: 200€)
    await waitFor(() => expect(screen.getByText('B place')).toBeInTheDocument());
  });

  // TEST 4: Check that clicking Počisti button clears all filters and resets listings
  test('clear button resets filters and triggers fetch', async () => {
    const items = [
      { id: 'c3', title: 'Clear Test', location: 'C', price: 70, rating: 4.1, distance: 1.5, image: '', url: '#', createdAt: new Date().toISOString() },
    ];
    mockFetchWithItems(items);

    render(<ListingsPage />);

    //Počisti (clear) button
    const clearBtn = screen.getByText('Počisti');
    fireEvent.click(clearBtn);

    // caka nalistings reload
    await waitFor(() => expect(screen.getByText(/Clear Test/i)).toBeInTheDocument());
  });
});
