'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Nav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-lg font-semibold tracking-tight">
            Apart Alert
          </span>
          <span className="text-xs text-zinc-400 hidden sm:inline">
            demo aplikacija
          </span>
        </Link>

        {/* Glavni linki */}
        <div className="flex items-center gap-2 text-sm">

          {/* Domov */}
          <NavLink href="/" pathname={pathname} label="Domov" />

          {/* Shr. iskanja */}
          <NavLink href="/saved-searches" pathname={pathname} label="Shranjena iskanja" />

          {/* Oglasi */}
          <NavLink href="/listings" pathname={pathname} label="Oglasi" />

          {/* Če je uporabnik PRIJAVLJEN → Odjava */}
          {session ? (
            <button
              onClick={() => signOut()}
              className="px-3 py-1.5 rounded-full transition text-zinc-300 hover:bg-red-600/80 hover:text-white"
            >
              Odjava
            </button>
          ) : (
            <>
              {/* Če NI prijavljen → pokaži Prijava + Registracija */}
              <NavLink href="/login" pathname={pathname} label="Prijava" />
              <NavLink href="/register" pathname={pathname} label="Registracija" />
            </>
          )}

        </div>
      </nav>
    </header>
  );
}

/* 🟦 Majhen helper za active state */
function NavLink({ href, pathname, label }) {
  const active =
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-full transition ${
        active
          ? "bg-zinc-100 text-zinc-900"
          : "text-zinc-300 hover:bg-zinc-800"
      }`}
    >
      {label}
    </Link>
  );
}
