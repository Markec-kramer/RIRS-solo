export const runtime = 'nodejs';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return new Response('Missing fields', { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return new Response('User already exists', { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { email, password: hash },
    });

    return new Response('User created', { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response('Server error', { status: 500 });
  }
}
