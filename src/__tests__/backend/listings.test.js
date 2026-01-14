import { GET } from '@/app/api/listings/route';


describe('API /api/listings', () => {
  jest.setTimeout(10000);  // increase timeout to 10s for API route tests

  // TEST 1: Check that GET returns paginated items with correct metadata
  
  test('returns items with pagination and meta', async () => {
   
    const res = await GET({ url: 'http://localhost/api/listings?page=1&limit=5' });
    const data = await res.json();  
    
    // expect()  preveri strukturo in vsebino odgovora
    expect(Array.isArray(data.items)).toBe(true);  // items should be an array
    expect(data.page).toBe(1);  // page number
    expect(data.limit).toBe(5);  // items per page
    expect(typeof data.total).toBe('number');  // total count should be a number
  });

  // TEST 2: Check that GET filters items by location and price range
  test('filters by location and price', async () => {
    const res = await GET({ url: 'http://localhost/api/listings?location=Maribor&priceMin=40&priceMax=200' });
    const data = await res.json();
    
    
    // every() vsi elementi v items morajo ustrezati pogojem
    expect(data.items.every(i => i.location.toLowerCase().includes('maribor'))).toBe(true);
  });
});
