import Link from "next/link";
import Logo from "@/components/Logo";

export default function AuthLayout({ children }) {
  return (
    <div className="ruled-bg flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Link href="/login" className="brand-wordmark mb-6 flex items-center gap-2 text-2xl">
        <Logo size={36} />
        Paper<span>Banao</span>
      </Link>
      {children}
    </div>
  );
}
