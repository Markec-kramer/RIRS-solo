'use client';
import { useState } from 'react';

export default function TestPage() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  async function createTestSearch() {
    setError('');
    setResponse(null);

    const body = {
      // userId lahko izpustiš; API bo vzel prvega userja v bazi (dev fallback)
      name: 'Testno iskanje',
      location: 'Maribor',
      priceMin: 100,
      priceMax: 300,
      active: true,
    };

    const res = await fetch('/api/saved-searches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const txt = await res.text();
    try {
      const json = JSON.parse(txt || '{}');
      if (!res.ok) setError(json.error || txt || 'Napaka');
      else setResponse(json);
    } catch {
      setError(`Neveljaven JSON odgovor: ${txt}`);
    }
  }

  return (
    <main className="max-w-xl mx-auto p-10 space-y-6">
      <h1 className="text-2xl font-semibold">Test Save Search</h1>
      <button
        onClick={createTestSearch}
        className="bg-black text-white p-3 rounded hover:bg-gray-700"
      >
        Ustvari testno iskanje
      </button>

      {error && <p className="text-red-500">{error}</p>}
      {response && (
        <pre className="bg-gray-100 text-black p-4 rounded">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </main>
  );
}
