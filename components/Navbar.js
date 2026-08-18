"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import Logo from "@/components/Logo";

const FREE_LIMIT = 5;

export default function Navbar() {
  const { logout } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    api.getMe().then(setStatus).catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navLinks = (
    <>
      <Link href="/dashboard" className="hover:text-amber-300" onClick={() => setMenuOpen(false)}>Generate</Link>
      <Link href="/bseb" className="hover:text-amber-300" onClick={() => setMenuOpen(false)}>BSEB Board</Link>
      <Link href="/digitize" className="hover:text-amber-300" onClick={() => setMenuOpen(false)}>Digitize</Link>
      <Link href="/history" className="hover:text-amber-300" onClick={() => setMenuOpen(false)}>History</Link>
      <Link href="/settings" className="hover:text-amber-300" onClick={() => setMenuOpen(false)}>Settings</Link>

      {status && (
        status.is_pro ? (
          <Link href="/upgrade" className="badge badge-pro" onClick={() => setMenuOpen(false)}>🌟 Pro</Link>
        ) : (
          <Link href="/upgrade" className="badge badge-free" onClick={() => setMenuOpen(false)}>
            🪙 {Math.max(0, FREE_LIMIT - status.papers_generated)}/{FREE_LIMIT} free
          </Link>
        )
      )}
      <Link href="/account" className="hover:text-amber-300" onClick={() => setMenuOpen(false)}>Account</Link>

      <button onClick={handleLogout} className="rounded border border-slate-500 px-3 py-1.5 text-left hover:bg-slate-700">
        Logout
      </button>
    </>
  );

  return (
    <header className="border-b border-slate-200 bg-[#17263D]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-serif text-xl font-bold text-white">
          <Logo size={28} />
          Paper<span className="text-amber-400">Banao</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 text-sm text-slate-200 md:flex">
          {navLinks}
        </nav>

        {/* Mobile hamburger button */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded text-white md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <nav className="flex flex-col gap-3 border-t border-slate-700 px-4 py-4 text-sm text-slate-200 md:hidden">
          {navLinks}
        </nav>
      )}
    </header>
  );
}
