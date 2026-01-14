// jest.mock() replaces the real prisma module with a fake one
// This prevents actual database queries and writes during tests
jest.mock('@/lib/prisma', () => ({
  prisma: {
    savedSearch: {
      findMany: jest.fn(async () => [{ id: 's1', name: 'Test', userId: 'u1' }]),  // fake data
      create: jest.fn(async ({ data }) => ({ id: 'new', ...data })),  // fake create
      delete: jest.fn(async () => ({})),  // fake delete
    },
    user: {
      findFirst: jest.fn(async () => ({ id: 'u1' })),  // fake find first user
      findUnique: jest.fn(async ({ where }) => (where && where.id === 'u1' ? { id: 'u1' } : null)),  // return user only if id matches
    }
  }
}));

import { GET, POST, DELETE } from '@/app/api/saved-searches/route';


describe('API /api/saved-searches', () => {
  // TEST 1: Check that GET returns array of saved searches
  test('GET returns saved searches', async () => {
    const res = await GET();  // klice GET route handler (no request needed)
    const json = await res.json();
    
    expect(Array.isArray(json)).toBe(true);  // odgovor mora biti array
    expect(json[0].name).toBe('Test');  // prvi mora imeti name 'Test'
  });

  // TEST 2: Check that POST without name field returns 400 error
  
  test('POST missing name returns 400', async () => {
    const req = { json: async () => ({}) };  // brez name field
    const res = await POST(req);
    const data = await res.json();
    
    expect(res.status).toBe(400);  // return 400 Bad Request
    expect(data.error).toMatch(/Missing field/i);  // error message
  });

  // TEST 3: Check that POST with name creates search with fallback user
  
  test('POST creates with fallback userId', async () => {
    const req = { json: async () => ({ name: 'My search' }) };  // samo ime brez userId
    const res = await POST(req);
    const data = await res.json();
    
    expect(res.status).toBe(201);  // return 201 Created
    expect(data.name).toBe('My search');  // name should be preserved
  });

  // TEST 4: Check that DELETE without id returns 400 error
  test('DELETE missing id returns 400', async () => {
    const req = { json: async () => ({}) };  // prazen body brez id
    const res = await DELETE(req);
    const data = await res.json();
    
    expect(res.status).toBe(400);  // return 400 Bad Request
  });

  // TEST 5: Check that POST with invalid userId returns 400 error
  
  test('POST with invalid userId returns 400', async () => {
    const req = { json: async () => ({ name: 'Bad', userId: 'does-not-exist' }) };  // nonexistent userId
    const res = await POST(req);
    const data = await res.json();
    
    expect(res.status).toBe(400);  // return 400 Bad Request
    expect(data.error).toMatch(/not found/i);  // error pove da uporabnik ne obstaja
  });

  // TEST 6: Check that DELETE with valid id succeeds and returns ok: true
  test('DELETE with id returns ok true', async () => {
    const req = { json: async () => ({ id: 's1' }) };  // validen id
    const res = await DELETE(req);
    const data = await res.json();
    
    expect(res.status).toBe(200);  //return 200 OK
    expect(data.ok).toBe(true);  // should have ok: true
  });
});
