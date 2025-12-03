import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import Providers from "./providers"; // če nimaš te datoteke, ta import odstrani

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Apart Alert",
  description: "Iskanje apartmajev z obvestili in shranjenimi iskanji",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-zinc-950 text-zinc-50 antialiased`}
      >
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Nav />
            <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
