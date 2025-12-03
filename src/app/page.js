import Link from "next/link";

export default function Home() {
  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Apart Alert – shranjena iskanja in obveščanje o oglasih
        </h1>
        <p className="text-zinc-400 max-w-xl">
          Ustvari shranjeno iskanje, filtriraj oglase po svojih kriterijih in
          izberi, katero iskanje je trenutno aktivno.  
          Ta prototip prikazuje glavne funkcionalnosti aplikacije.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/saved-searches"
          className="border border-zinc-800 rounded-xl p-4 hover:border-zinc-500 hover:bg-zinc-900/40 transition flex flex-col justify-between"
        >
          <div>
            <h2 className="font-medium mb-1">Shranjena iskanja</h2>
            <p className="text-sm text-zinc-400">
              Dodaj, uredi ali aktiviraj iskanja (lokacija, cena, datumi…)
            </p>
          </div>
          <span className="mt-3 text-xs text-zinc-300">Pojdi na iskanja →</span>
        </Link>

        <Link
          href="/listings"
          className="border border-zinc-800 rounded-xl p-4 hover:border-zinc-500 hover:bg-zinc-900/40 transition flex flex-col justify-between"
        >
          <div>
            <h2 className="font-medium mb-1">Seznam oglasov</h2>
            <p className="text-sm text-zinc-400">
              Poglej mock oglase, filtriraj, sortiaj in naloži več rezultatov.
            </p>
          </div>
          <span className="mt-3 text-xs text-zinc-300">Poglej oglase →</span>
        </Link>

        <Link
          href="/login"
          className="border border-zinc-800 rounded-xl p-4 hover:border-zinc-500 hover:bg-zinc-900/40 transition flex flex-col justify-between"
        >
          <div>
            <h2 className="font-medium mb-1">Prijava / registracija</h2>
            <p className="text-sm text-zinc-400">
              Uporabnik se prijavi z emailom in geslom in nato začne z uporabo.
            </p>
          </div>
          <span className="mt-3 text-xs text-zinc-300">Prijavi se →</span>
        </Link>
      </div>

      <p className="text-xs text-zinc-500">
        * Funkcionalnosti so implementirane za potrebe seminarske naloge (mock
        podatki, SQLite baza, Next.js + Prisma + NextAuth).
      </p>
    </section>
  );
}
