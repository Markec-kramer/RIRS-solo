'use client';
import { useEffect, useState } from 'react';

export default function SavedSearchesPage() {
  const [searches, setSearches] = useState([]);
  const [form, setForm] = useState({
    name: '',
    location: '',
    priceMin: '',
    priceMax: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔹 pridobi vsa iskanja ob nalaganju strani
  useEffect(() => {
    fetchSearches();
  }, []);

  async function fetchSearches() {
  setLoading(true);
  try {
    const res = await fetch('/api/saved-searches');
    const text = await res.text();
    const data = text ? JSON.parse(text) : [];
    setSearches(Array.isArray(data) ? data : []);
  } catch (e) {
    console.error('❌ fetchSearches error:', e);
    setSearches([]);
  }
  setLoading(false);
}



  async function handleSubmit(e) {
  e.preventDefault();
  setError('');
  setLoading(true);

  const body = {
    name: form.name,
    location: form.location || null,
    priceMin: form.priceMin ? Number(form.priceMin) : null,
    priceMax: form.priceMax ? Number(form.priceMax) : null,
    active: true,
  };

  const method = editingId ? 'PATCH' : 'POST';
  const url = editingId
    ? `/api/saved-searches/${editingId}`
    : `/api/saved-searches`;

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    // 🔹 Varno preberi odgovor (če je prazen, ne crasha)
    const text = await res.text();
    let json;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = null;
    }

    if (!res.ok) {
      setError(json?.error || text || 'Napaka pri shranjevanju');
    } else {
      await fetchSearches();
      setForm({ name: '', location: '', priceMin: '', priceMax: '' });
      setEditingId(null);
    }
  } catch (err) {
    console.error('❌ handleSubmit error:', err);
    setError(err.message || 'Neznana napaka');
  }

  setLoading(false);
}


  async function handleDelete(id) {
    if (!confirm('Ali res želiš izbrisati to iskanje?')) return;
    await fetch('/api/saved-searches', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchSearches();
  }

  function handleEdit(search) {
  setForm({
    name: search.name,
    location: search.location || '',
    priceMin: search.priceMin ?? '',
    priceMax: search.priceMax ?? '',
  });
  setEditingId(search.id); // <-- pomembno
}


  function handleClear() {
    setForm({ name: '', location: '', priceMin: '', priceMax: '' });
    setEditingId(null);
  }

async function handleToggleActive(id) {
  try {
    setError(''); // če imaš state setError
    const res = await fetch('/api/saved-searches/active', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    const text = await res.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      // ignore parse error
    }

    if (!res.ok) {
      setError(json?.error || text || 'Napaka pri nastavitvi aktivnega iskanja');
      return;
    }

    // json so posodobljena iskanja -> lahko jih kar nastavimo
    if (Array.isArray(json)) {
      setSearches(json);
    } else {
      // fallback: refetch
      await fetchSearches();
    }
  } catch (e) {
    setError(e.message || 'Neznana napaka pri nastavitvi aktivnega iskanja');
  }
}



  return (
  <main className="max-w-2xl mx-auto p-8 space-y-8">
    <h1 className="text-3xl font-semibold">
      Shranjena iskanja{' '}
      {editingId ? (
        <span className="text-sm opacity-70"> (urejam #{editingId})</span>
      ) : null}
    </h1>

    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="border p-2 w-full"
        placeholder="Ime iskanja"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        className="border p-2 w-full"
        placeholder="Lokacija"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
      />
      <div className="flex gap-2">
        <input
          className="border p-2 flex-1"
          placeholder="Cena od"
          value={form.priceMin}
          onChange={(e) =>
            setForm({ ...form, priceMin: e.target.value })
          }
          type="number"
        />
        <input
          className="border p-2 flex-1"
          placeholder="Cena do"
          value={form.priceMax}
          onChange={(e) =>
            setForm({ ...form, priceMax: e.target.value })
          }
          type="number"
        />
      </div>

      <div className="flex gap-3">
        <button
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {editingId ? 'Shrani spremembe' : 'Dodaj iskanje'}
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Počisti
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </form>

    <div>
      <h2 className="text-xl font-semibold mb-2">Obstoječa iskanja</h2>
      {loading ? (
        <p>Nalaganje...</p>
      ) : searches.length === 0 ? (
        <p>Ni shranjenih iskanj.</p>
      ) : (
        <ul className="space-y-3">
          {searches.map((s) => (
            <li
              key={s.id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-medium flex items-center gap-2">
                  {s.name}
                  {s.active && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                      Trenutno iskanje
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  {s.location || '–'} | {s.priceMin ?? 0}–{s.priceMax ?? 0} €
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Uredi
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Izbriši
                  </button>
                  <a
                    href={`/listings?location=${encodeURIComponent(
                      s.location || ''
                    )}&priceMin=${s.priceMin || ''}&priceMax=${
                      s.priceMax || ''
                    }`}
                    className="border px-3 py-1 rounded text-sm hover:bg-white/10"
                  >
                    Poglej rezultate
                  </a>
                </div>

                {/* Toggle Trenutno iskanje */}
                <label className="flex items-center gap-1 text-xs text-gray-700">
                  <input
                    type="radio"
                    name="activeSearch"
                    checked={s.active === true}
                    onChange={() => handleToggleActive(s.id)}
                  />
                  Trenutno iskanje
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </main>
);

}
