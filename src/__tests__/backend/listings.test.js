import { GET } from '@/app/api/listings/route';

describe('API /api/listings', () => {
  jest.setTimeout(10000);

  test('returns items with pagination and meta', async () => {
    const res = await GET({ url: 'http://localhost/api/listings?page=1&limit=5' });
    // NextResponse exposes json() and status
    const data = await res.json();
    expect(Array.isArray(data.items)).toBe(true);
    expect(data.page).toBe(1);
    expect(data.limit).toBe(5);
    expect(typeof data.total).toBe('number');
  });

  test('filters by location and price', async () => {
    const res = await GET({ url: 'http://localhost/api/listings?location=Maribor&priceMin=40&priceMax=200' });
    const data = await res.json();
    expect(data.items.every(i => i.location.toLowerCase().includes('maribor'))).toBe(true);
  });
});
