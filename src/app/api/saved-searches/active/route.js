export const runtime = 'nodejs';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// PATCH /api/saved-searches/active
export async function PATCH(req) {
  try {
    const body = await req.json();
    const id = body?.id;

    if (!id) {
      return NextResponse.json({ error: 'Manjka id' }, { status: 400 });
    }

    // najprej najdemo iskanje in uporabnika
    const search = await prisma.savedSearch.findUnique({ where: { id } });

    if (!search) {
      return NextResponse.json({ error: 'Iskanje ne obstaja' }, { status: 404 });
    }

    // v transakciji:
    // 1) vsa iskanja tega userja na active = false
    // 2) izbrano iskanje na active = true
    await prisma.$transaction([
      prisma.savedSearch.updateMany({
        where: { userId: search.userId },
        data: { active: false },
      }),
      prisma.savedSearch.update({
        where: { id },
        data: { active: true },
      }),
    ]);

    // vrnemo posodobljen seznam iskanj za tega userja
    const updated = await prisma.savedSearch.findMany({
      where: { userId: search.userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('❌ PATCH /api/saved-searches/active error:', err);
    return NextResponse.json(
      { error: err.message || 'Napaka pri nastavitvi aktivnega iskanja' },
      { status: 500 }
    );
  }
}
