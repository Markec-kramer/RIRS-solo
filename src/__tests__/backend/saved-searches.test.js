// mock prisma module used by saved-searches route
jest.mock('@/lib/prisma', () => ({
  prisma: {
    savedSearch: {
      findMany: jest.fn(async () => [{ id: 's1', name: 'Test', userId: 'u1' }]),
      create: jest.fn(async ({ data }) => ({ id: 'new', ...data })),
      delete: jest.fn(async () => ({})),
    },
    user: {
      findFirst: jest.fn(async () => ({ id: 'u1' })),
      findUnique: jest.fn(async ({ where }) => (where && where.id === 'u1' ? { id: 'u1' } : null)),
    }
  }
}));

import { GET, POST, DELETE } from '@/app/api/saved-searches/route';

describe('API /api/saved-searches', () => {
  test('GET returns saved searches', async () => {
    const res = await GET();
    const json = await res.json();
    expect(Array.isArray(json)).toBe(true);
    expect(json[0].name).toBe('Test');
  });

  test('POST missing name returns 400', async () => {
    const req = { json: async () => ({}) };
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toMatch(/Missing field/i);
  });

  test('POST creates with fallback userId', async () => {
    const req = { json: async () => ({ name: 'My search' }) };
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.name).toBe('My search');
  });

  test('DELETE missing id returns 400', async () => {
    const req = { json: async () => ({}) };
    const res = await DELETE(req);
    const data = await res.json();
    expect(res.status).toBe(400);
  });

  test('POST with invalid userId returns 400', async () => {
    const req = { json: async () => ({ name: 'Bad', userId: 'does-not-exist' }) };
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toMatch(/not found/i);
  });

  test('DELETE with id returns ok true', async () => {
    const req = { json: async () => ({ id: 's1' }) };
    const res = await DELETE(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
  });
});
