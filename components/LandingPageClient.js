"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/Logo";

export default function LandingPageClient() {
  const { isAuthed, checked } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (checked && isAuthed) {
      router.replace("/dashboard");
    }
  }, [checked, isAuthed, router]);

  // Don't gate rendering on the auth check — anonymous visitors (the common
  // case for a public landing page) should see content immediately. We only
  // redirect away once we've confirmed the visitor is actually logged in.
  if (checked && isAuthed) {
    return <div className="min-h-screen" />;
  }

  return (
    <div>
      {/* NAV */}
      <header className="landing-nav">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="brand-wordmark flex items-center gap-2 text-xl">
            <Logo size={30} />
            Paper<span>Banao</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/login" className="text-slate-600 hover:text-[#17263D]">Log in</Link>
            <Link href="/signup" className="btn-primary px-4 py-2 text-sm">Try Free</Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="landing-hero ruled-bg">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="eyebrow mb-3">AI Question Paper Generator</div>
          <h1 className="mb-4 text-4xl leading-tight">
            Build a full exam paper before your chai gets cold.
          </h1>
          <p className="mx-auto mb-7 max-w-xl text-slate-600">
            Generate custom question papers — MCQs, fill-in-the-blanks, short and long answer —
            for RRB, SSC, UPSC, Banking, and school-level exams. Or upload a handwritten paper and
            we&apos;ll digitize it. Word, PDF, and your institute&apos;s letterhead — done in minutes.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/signup" className="btn-primary">Try PaperBanao Free</Link>
            <Link href="#pricing" className="btn-secondary">See Pricing</Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <h2 className="mb-2 text-2xl">Everything a coaching institute actually needs</h2>
        <p className="mb-6 text-sm text-slate-500">Not just a chatbot with a prompt box — a purpose-built tool for exam paper creation.</p>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="f-icon">📝</div>
            <h3 className="mb-1 text-base">Custom Paper Generation</h3>
            <p className="text-sm text-slate-500">Pick subject, class, topics, question types and exact marks distribution.</p>
          </div>
          <div className="feature-card">
            <div className="f-icon">📷</div>
            <h3 className="mb-1 text-base">Handwritten → Digital</h3>
            <p className="text-sm text-slate-500">Photograph a handwritten paper and get a clean, formatted digital version.</p>
          </div>
          <div className="feature-card">
            <div className="f-icon">🔄</div>
            <h3 className="mb-1 text-base">Edit &amp; Regenerate</h3>
            <p className="text-sm text-slate-500">Don&apos;t like a question? Regenerate just that one, answer key stays in sync.</p>
          </div>
          <div className="feature-card">
            <div className="f-icon">🏫</div>
            <h3 className="mb-1 text-base">Your Letterhead, Saved</h3>
            <p className="text-sm text-slate-500">Save your institute name, logo, and language once — every paper is auto-branded.</p>
          </div>
          <div className="feature-card">
            <div className="f-icon">🌐</div>
            <h3 className="mb-1 text-base">Hindi, English, Bilingual</h3>
            <p className="text-sm text-slate-500">Generate papers in the language your students actually study in.</p>
          </div>
          <div className="feature-card">
            <div className="f-icon">☁️</div>
            <h3 className="mb-1 text-base">Cloud History</h3>
            <p className="text-sm text-slate-500">Every paper is saved to your account — come back and re-download anytime.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-[#E4DFD2] bg-white py-14">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-6 text-2xl">How it works</h2>
          <div className="steps-row">
            <div>
              <div className="step-num">1</div>
              <h3 className="mb-1 text-base">Tell it what you need</h3>
              <p className="text-sm text-slate-500">Subject, class, topics, question types — or upload a handwritten photo instead.</p>
            </div>
            <div>
              <div className="step-num">2</div>
              <h3 className="mb-1 text-base">Review &amp; tweak</h3>
              <p className="text-sm text-slate-500">Edit any question by hand, or regenerate the ones you don&apos;t like.</p>
            </div>
            <div>
              <div className="step-num">3</div>
              <h3 className="mb-1 text-base">Download &amp; print</h3>
              <p className="text-sm text-slate-500">Export as Word or PDF with your letterhead, ready to print.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="mx-auto max-w-3xl px-6 py-14">
        <h2 className="mb-2 text-2xl">Pricing</h2>
        <p className="mb-6 text-sm text-slate-500">Simple, one plan. Cancel any time — nothing auto-renews.</p>
        <div className="pricing-grid-landing">
          <div className="plan-card">
            <div className="tag">Free Trial</div>
            <div className="price">₹0</div>
            <p className="text-sm text-slate-500">5 question papers to try, no card required.</p>
          </div>
          <div className="plan-card pro">
            <div className="flex items-center gap-2">
              <span className="tag">Pro — 30 Days</span>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">50% OFF</span>
            </div>
            <div className="price">
              ₹99 <span className="text-lg text-slate-400 line-through">₹199</span> <span className="text-base text-slate-500">/ 30 days</span>
            </div>
            <p className="text-sm text-slate-500">Unlimited papers for 30 days. One-time payment.</p>
            <p className="mt-1 text-xs italic text-slate-400">Cheaper than a pizza. 🍕</p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link href="/signup" className="btn-primary">Get Started</Link>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="mb-2 text-2xl">Stop spending your Sunday on question papers.</h2>
          <p>Try PaperBanao free — 5 papers, no card required.</p>
          <Link href="/signup" className="btn-primary">Try PaperBanao Free</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#17263D] py-8 text-center text-sm text-slate-300">
        <div className="mb-2 flex items-center justify-center gap-2 font-serif text-lg font-bold text-white">
          <Logo size={22} />
          <span>PaperBanao</span>
        </div>
        © {new Date().getFullYear()} PaperBanao. Made in India, for India.
      </footer>
    </div>
  );
}
