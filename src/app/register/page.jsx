'use client';
import { useState } from 'react';

export default function RegisterPage() {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [msg,setMsg] = useState('');
  async function submit(e){
    e.preventDefault();
    const res = await fetch('/api/register',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email, password })
    });
    setMsg(res.ok ? 'Registriran!' : `Napaka: ${await res.text()}`);
  }
  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Registracija</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="email"
               value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded" type="password" placeholder="geslo"
               value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full border p-2 rounded hover:bg-gray-50">Ustvari račun</button>
      </form>
      <p className="mt-3 text-sm">{msg}</p>
    </div>
  );
}
