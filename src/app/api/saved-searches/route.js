export const runtime = 'nodejs';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET – vsi zapisi
export async function GET() {
  try {
    const searches = await prisma.savedSearch.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(searches);
  } catch (err) {
    console.error('GET /saved-searches error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST – nov zapis
export async function POST(req) {
  try {
    const data = await req.json();
    if (!data.name) {
      return NextResponse.json({ error: 'Missing field: name' }, { status: 400 });
    }

    // DEV fallback: če userId ni poslan, vzemi prvega userja
    if (!data.userId) {
      const anyUser = await prisma.user.findFirst();
      if (!anyUser) {
        return NextResponse.json(
          { error: 'No users found. Create a user first or send userId.' },
          { status: 400 }
        );
      }
      data.userId = anyUser.id;
    } else {
      const exists = await prisma.user.findUnique({ where: { id: data.userId } });
      if (!exists) {
        return NextResponse.json({ error: `User ${data.userId} not found` }, { status: 400 });
      }
    }

    const saved = await prisma.savedSearch.create({ data });
    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    console.error('POST /saved-searches error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

// DELETE – izbriši po ID
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await prisma.savedSearch.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /saved-searches error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
