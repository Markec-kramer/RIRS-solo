'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setMsg('...');
    const res = await signIn('credentials', { email, password, redirect: false });

    if (res?.ok) {
      setMsg('Prijavljen!');
      setSuccess(true);

      // ➜ preusmeri uporabnika na shranjena iskanja
      setTimeout(() => {
        router.push('/saved-searches');
      }, 800);

    } else {
      setMsg('Napačni podatki');
      setSuccess(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold mb-4">Prijava</h1>

      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full border p-2 rounded bg-transparent"
          placeholder="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded bg-transparent"
          type="password"
          placeholder="geslo"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="w-full border p-2 rounded hover:bg-gray-800">
          Prijava
        </button>
      </form>

      <p className="mt-3 text-sm">{msg}</p>

      {/* ✔️ dodatni gumbi po uspešni prijavi */}
      {success && (
        <div className="space-y-4 mt-6 p-4 border rounded bg-gray-50/10">
          <p className="text-sm text-green-500">
            Prijava uspešna! Nadaljuj:
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/saved-searches"
              className="w-full bg-black text-white px-4 py-2 rounded text-center"
            >
              Ustvari shranjeno iskanje
            </Link>
            <Link
              href="/listings"
              className="w-full border px-4 py-2 rounded text-center"
            >
              Poglej oglase
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
