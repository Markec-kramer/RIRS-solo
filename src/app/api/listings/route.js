export const runtime = 'nodejs';
import { NextResponse } from 'next/server';

// enostaven pseudo-random generator (determinističen po indexu)
function seedRand(i) {
  const x = Math.sin(i) * 10000;
  return x - Math.floor(x);
}

const CITIES = ['Maribor', 'Ljubljana', 'Koper', 'Celje', 'Kranj', 'Ptuj'];
const TITLES = [
  'Svetel studio', 'Udoben apartma', 'Center city flat', 'Mirna garsonjera',
  'Premium apartma', 'Družinski apartma', 'Business suite', 'Minimal loft'
];

// generiraj 120 “oglasov”
function generateAll() {
  const items = [];
  for (let i = 1; i <= 120; i++) {
    const r = seedRand(i);
    const city = CITIES[i % CITIES.length];
    const title = TITLES[i % TITLES.length];
    const price = 40 + Math.floor(r * 160); // 40–200 €
    const rating = Math.round((3 + r * 2) * 10) / 10; // 3.0–5.0
    const distance = Math.round((r * 9 + 0.5) * 10) / 10; // ~0.5–9.5 km
    items.push({
      id: `mock-${i}`,
      title: `${title} ${city}`,
      location: city,
      price,
      rating,
      distance,
      url: `https://example.com/listing/${i}`,
      image: `https://picsum.photos/seed/apart-${i}/480/320`,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    });
  }
  return items;
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10)));

    const location = (url.searchParams.get('location') || '').trim();
    const priceMin = url.searchParams.get('priceMin');
    const priceMax = url.searchParams.get('priceMax');

    // simuliraj malo zakasnitve (loading demo)
    await new Promise(r => setTimeout(r, 600));

    let all = generateAll();

    // filtri
    if (location) {
      all = all.filter(x => x.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (priceMin !== null && priceMin !== '' && !Number.isNaN(Number(priceMin))) {
      all = all.filter(x => x.price >= Number(priceMin));
    }
    if (priceMax !== null && priceMax !== '' && !Number.isNaN(Number(priceMax))) {
      all = all.filter(x => x.price <= Number(priceMax));
    }

    const total = all.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const items = all.slice(start, end);
    const hasMore = end < total;

    return NextResponse.json({ items, page, limit, total, hasMore });
  } catch (err) {
    console.error('GET /api/listings error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
