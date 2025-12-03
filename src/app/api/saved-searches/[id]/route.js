export const runtime = 'nodejs';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(req, context) {
  try {
    // 1) poskusi iz params
    let id = context?.params?.id;

    // 2) poskusi iz URL-ja (fallback, včasih params manjka v dev)
    if (!id) {
      try {
        const u = new URL(req.url);
        const seg = u.pathname.split('/'); // /api/saved-searches/<id>
        id = seg[seg.length - 1];
      } catch {}
    }

    // 3) poskusi iz body-ja (še zadnji fallback)
    let body = {};
    try {
      body = await req.json();
      if (!id && body?.id) id = body.id;
    } catch {
      // brez body-ja je ok (npr. PATCH samo za toggle)
    }

    if (!id || id === '[id]') {
      return NextResponse.json({ error: 'Manjka ID' }, { status: 400 });
    }

    // normalizacija podatkov
    const data = {};
    if (body.name !== undefined) data.name = String(body.name).trim();

    if (body.location !== undefined) {
      const loc = String(body.location).trim();
      data.location = loc.length ? loc : null;
    }

    const toIntOrNull = (v) => {
      if (v === '' || v === null || v === undefined) return null;
      const n = Number(v);
      return Number.isNaN(n) ? null : Math.trunc(n);
    };
    if (body.priceMin !== undefined) data.priceMin = toIntOrNull(body.priceMin);
    if (body.priceMax !== undefined) data.priceMax = toIntOrNull(body.priceMax);
    if (body.radiusKm !== undefined) data.radiusKm = toIntOrNull(body.radiusKm);
    if (body.guests !== undefined) data.guests = toIntOrNull(body.guests);
    if (body.active !== undefined) data.active = Boolean(body.active);

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Ni sprememb za posodobitev' }, { status: 400 });
    }

    const updated = await prisma.savedSearch.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('❌ PATCH /api/saved-searches/[id] error:', err);
    return NextResponse.json({ error: err.message || 'Napaka pri posodobitvi' }, { status: 500 });
  }
}
