import LandingPageClient from "@/components/LandingPageClient";

export const metadata = {
  title: "PaperBanao — AI Question Paper Generator for Teachers | BSEB, CBSE, NCERT",
  description:
    "Generate BSEB, CBSE, and NCERT-syllabus question papers in minutes. MCQs, fill-in-the-blanks, short and long answer questions with answer keys, in Hindi or English. Free to try, no card needed.",
  keywords: [
    "question paper generator",
    "BSEB question paper generator",
    "AI question paper maker",
    "Hindi question paper generator",
    "CBSE model paper generator",
    "NCERT question paper maker",
    "Bihar board question paper",
    "coaching institute question paper software",
    "exam paper generator India",
  ],
  alternates: {
    canonical: "https://paperbanao.in",
  },
  openGraph: {
    title: "PaperBanao — AI Question Paper Generator for Teachers",
    description:
      "Build a full exam paper — BSEB, CBSE, or NCERT syllabus, Hindi or English — before your chai gets cold.",
    url: "https://paperbanao.in",
    siteName: "PaperBanao",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "PaperBanao — AI Question Paper Generator for Teachers",
    description: "Generate BSEB/CBSE/NCERT-syllabus question papers in minutes, with answer keys, in Hindi or English.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PaperBanao",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  url: "https://paperbanao.in",
  description:
    "AI-powered question paper generator for teachers and coaching institutes, supporting BSEB, CBSE, and NCERT syllabuses in Hindi and English.",
  offers: {
    "@type": "Offer",
    price: "99",
    priceCurrency: "INR",
    description: "Pro plan — unlimited question papers for 30 days",
  },
  areaServed: "IN",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LandingPageClient />
    </>
  );
}
