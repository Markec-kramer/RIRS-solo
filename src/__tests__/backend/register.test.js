// mock prisma and bcrypt for register route
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(async ({ where }) => null),
      create: jest.fn(async ({ data }) => ({ id: 'u-new', ...data })),
    }
  }
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(async (s) => 'hashed-' + s),
}));

import { POST } from '@/app/api/register/route';

describe('API /api/register', () => {
  test('missing fields returns 400', async () => {
    const req = { json: async () => ({}) };
    const res = await POST(req);
    expect(res.status).toBe(400);
    const text = await res.text();
    expect(text).toMatch(/Missing fields/i);
  });

  test('creates a user when valid', async () => {
    const req = { json: async () => ({ email: 'a@b.com', password: 'pass' }) };
    const res = await POST(req);
    expect(res.status).toBe(201);
    const text = await res.text();
    expect(text).toMatch(/User created/i);
  });
});
