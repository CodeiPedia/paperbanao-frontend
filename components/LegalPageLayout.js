import Link from "next/link";
import Logo from "@/components/Logo";

export default function LegalPageLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-[#FAF7F0]">
      <header className="border-b border-slate-200 bg-[#17263D] py-4">
        <div className="mx-auto flex max-w-3xl items-center px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold text-white">
            <Logo size={26} />
            Paper<span className="text-amber-400">Banao</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="mb-6 text-2xl font-bold text-[#17263D]">{title}</h1>
        <div className="prose-legal space-y-4 text-sm leading-relaxed text-slate-700">
          {children}
        </div>
        <div className="mt-10">
          <Link href="/" className="text-sm text-amber-700 hover:underline">← Back to Home</Link>
        </div>
      </main>

      <footer className="bg-[#17263D] py-8 text-center text-sm text-slate-300">
        <div className="mb-2 flex items-center justify-center gap-2 font-serif text-lg font-bold text-white">
          <Logo size={22} />
          <span>PaperBanao</span>
        </div>
        <div className="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
          <Link href="/about" className="hover:text-white">About Us</Link>
          <Link href="/contact" className="hover:text-white">Contact Us</Link>
          <Link href="/terms" className="hover:text-white">Terms &amp; Conditions</Link>
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/refund" className="hover:text-white">Refund Policy</Link>
        </div>
        © {new Date().getFullYear()} PaperBanao. Made in India, for India.
      </footer>
    </div>
  );
}
