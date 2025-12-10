'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';


export default function ListingsPage() {
  const searchParams = useSearchParams();  
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [sortBy, setSortBy] = useState(''); // '', 'price', 'rating', 'distance', 'newest'


  // filtri
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [priceMin, setPriceMin] = useState(searchParams.get('priceMin') || '');
  const [priceMax, setPriceMax] = useState(searchParams.get('priceMax') || '');

  function sortItems(items, sortBy) {
  // delaj na kopiji, da ne mutiraš originala
  const arr = [...items];

  switch (sortBy) {
    case 'price': // cena naraščajoče
      arr.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      break;
    case 'rating': // ocena padajoče
      arr.sort((a, b) => (b.rating ?? -Infinity) - (a.rating ?? -Infinity));
      break;
    case 'distance': // razdalja naraščajoče
      arr.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
      break;
    case 'newest': // novejši prej
      arr.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    default:
    // brez sortiranja – ohrani vrstni red
  }

  return arr;
}

function handleSortChange(e) {
    const value = e.target.value;
    setSortBy(value);
    setItems(prev => sortItems(prev, value)); // lokalno sortiranje
  }



  async function fetchPage(p = 1, replace = false) {
  try {
    setErr('');
    setLoading(true);

    const params = new URLSearchParams();
    params.set('page', String(p));
    params.set('limit', '20');
    if (location) params.set('location', location);
    if (priceMin) params.set('priceMin', String(priceMin));
    if (priceMax) params.set('priceMax', String(priceMax));

    const res = await fetch(`/api/listings?${params.toString()}`);
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
      setErr(data?.error || text || 'Napaka pri pridobivanju oglasov');
      setLoading(false);
      return;
    }

    const nextItems = data?.items ?? [];

    setItems(prev => {
      const merged = replace ? nextItems : [...prev, ...nextItems];
      return sortItems(merged, sortBy); // 🔹 lokalno sortiranje
    });

    setHasMore(Boolean(data?.hasMore));
    setPage(p);
  } catch (e) {
    setErr(e?.message || 'Neznana napaka');
  } finally {
    setLoading(false);
  }
}


  // ob prvem renderju naloži prvo stran
  useEffect(() => {
    fetchPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, priceMin, priceMax]);

  function applyFilters(e) {
    e.preventDefault();
    // ob spremembi filtrov resetiraj list in naloži ponovno od strani 1
    fetchPage(1, true);
  }

  return (
  <main className="max-w-4xl mx-auto p-6 space-y-6">
    <h1 className="text-3xl font-bold">Seznam oglasov je tukaj</h1>
    <p>
      
    </p>

    {/* Filtri */}
    <form onSubmit={applyFilters} className="grid gap-3 sm:grid-cols-4">
      <input
        className="border p-2 rounded bg-transparent"
        placeholder="Lokacija (npr. Maribor)"
        value={location}
        onChange={e => setLocation(e.target.value)}
      />
      <input
        type="number"
        className="border p-2 rounded bg-transparent"
        placeholder="Cena od"
        value={priceMin}
        onChange={e => setPriceMin(e.target.value)}
      />
      <input
        type="number"
        className="border p-2 rounded bg-transparent"
        placeholder="Cena do"
        value={priceMax}
        onChange={e => setPriceMax(e.target.value)}
      />
      <div className="flex gap-2">
        <button className="border px-4 py-2 rounded hover:bg-white/10">
          Filtriraj
        </button>
        <button
          type="button"
          onClick={() => {
            setLocation('');
            setPriceMin('');
            setPriceMax('');
            fetchPage(1, true);
          }}
          className="border px-4 py-2 rounded hover:bg-white/10"
        >
          Počisti
        </button>
      </div>
    </form>

    {/* Sortiranje */}
    <div className="flex justify-between items-center">
      <p className="text-sm opacity-70">
        {sortBy
          ? `Razvrščeno po: ${
              sortBy === 'price'
                ? 'ceni'
                : sortBy === 'rating'
                ? 'oceni'
                : sortBy === 'distance'
                ? 'razdalji'
                : 'novosti'
            }`
          : 'Brez razvrščanja'}
      </p>

      <select
        value={sortBy}
        onChange={handleSortChange}
        className="border rounded px-3 py-2 bg-transparent text-sm"
      >
        <option value="">Brez razvrščanja</option>
        <option value="price">Cena (nizka → visoka)</option>
        <option value="rating">Ocena (visoka → nizka)</option>
        <option value="distance">Razdalja (bližje → dlje)</option>
        <option value="newest">Novost (novejši → starejši)</option>
      </select>
    </div>

    {/* Error / Loading */}
    {err && <p className="text-red-500">{err}</p>}
    {loading && <p className="opacity-75">Loading…</p>}

    {/* Seznam oglasov */}
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map(card => (
        <li key={card.id} className="border rounded-lg overflow-hidden">
          <a href={card.url} target="_blank" rel="noreferrer">
            {/* slika */}
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-40 object-cover"
            />
            {/* vsebina */}
            <div className="p-3 space-y-1">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{card.title}</h3>
                <span className="text-sm opacity-80">{card.location}</span>
              </div>
              <div className="text-sm opacity-80">
                {card.price} € • ⭐ {card.rating} • {card.distance} km
              </div>
            </div>
          </a>
        </li>
      ))}
    </ul>

    {/* Load more */}
    <div className="flex justify-center">
      {hasMore ? (
        <button
          disabled={loading}
          onClick={() => fetchPage(page + 1)}
          className="border px-5 py-2 rounded hover:bg-white/10 disabled:opacity-60"
        >
          {loading ? 'Nalaganje…' : 'Load more'}
        </button>
      ) : (
        <p className="opacity-70">Ni več rezultatov.</p>
      )}
    </div>
  </main>
);

}
