// jest.mock() replaces the real prisma and bcrypt modules with fake ones
// This prevents actual database writes and password hashing during tests
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(async ({ where }) => null),  // pretend user doesn't exist
      create: jest.fn(async ({ data }) => ({ id: 'u-new', ...data })),  // fake user creation
    }
  }
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(async (s) => 'hashed-' + s),  // fake password hashing
}));

import { POST } from '@/app/api/register/route';


describe('API /api/register', () => {
  // TEST 1: Check that missing email or password returns 400 error
  
  test('missing fields returns 400', async () => {
    const req = { json: async () => ({}) };  // brez e maila in gesla
    const res = await POST(req);  // klic rute
    
    expect(res.status).toBe(400);  // return 400 Bad Request
    const text = await res.text();
    expect(text).toMatch(/Missing fields/i);  // error message
  });

  // TEST 2: Check that valid email and password creates user and returns 201
  
  test('creates a user when valid', async () => {
    const req = { json: async () => ({ email: 'a@b.com', password: 'pass' }) };  // valid input
    const res = await POST(req);  // klice route
    
    expect(res.status).toBe(201);  // return 201 Created
    const text = await res.text();
    expect(text).toMatch(/User created/i);  // odgovor vsebuje sporočilo
  });
});
