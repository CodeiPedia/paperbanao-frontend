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

  useEffect(() => {
    api.getMe().then(setStatus).catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="border-b border-slate-200 bg-[#17263D]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-serif text-xl font-bold text-white">
          <Logo size={28} />
          Paper<span className="text-amber-400">Banao</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-slate-200">
          <Link href="/dashboard" className="hover:text-amber-300">Generate</Link>
          <Link href="/bseb" className="hover:text-amber-300">BSEB Board</Link>
          <Link href="/digitize" className="hover:text-amber-300">Digitize</Link>
          <Link href="/history" className="hover:text-amber-300">History</Link>
          <Link href="/settings" className="hover:text-amber-300">Settings</Link>

          {status && (
            status.is_pro ? (
              <Link href="/upgrade" className="badge badge-pro">🌟 Pro</Link>
            ) : (
              <Link href="/upgrade" className="badge badge-free">
                🪙 {Math.max(0, FREE_LIMIT - status.papers_generated)}/{FREE_LIMIT} free
              </Link>
            )
          )}
          <Link href="/account" className="hover:text-amber-300">Account</Link>

          <button onClick={handleLogout} className="rounded border border-slate-500 px-3 py-1.5 hover:bg-slate-700">
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
