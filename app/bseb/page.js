import BsebPageClient from "@/components/BsebPageClient";

export const metadata = {
  title: "BSEB Question Paper Generator — Bihar Board Exam Papers in Minutes",
  description:
    "Generate BSEB (Bihar Board) question papers strictly from the NCERT syllabus — pick class, subject, and chapters, then get MCQs, short/long answers, and an answer key in Hindi or English. Free to try.",
  keywords: [
    "BSEB question paper generator",
    "Bihar board question paper generator",
    "BSEB model paper maker",
    "Bihar board exam paper generator",
    "BSEB NCERT question paper",
  ],
  alternates: {
    canonical: "https://paperbanao.in/bseb",
  },
  openGraph: {
    title: "BSEB Question Paper Generator — Bihar Board Exam Papers in Minutes",
    description:
      "Build BSEB/NCERT-syllabus question papers in minutes, with answer keys, in Hindi or English.",
    url: "https://paperbanao.in/bseb",
    siteName: "PaperBanao",
    locale: "en_IN",
    type: "website",
  },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does this follow the BSEB syllabus exactly?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — every question is generated strictly from the class, subject, and chapters you select from the saved BSEB/NCERT syllabus, so nothing outside those chapters appears in the paper.",
      },
    },
    {
      "@type": "Question",
      name: "Can I generate question papers in Hindi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Choose Hindi, English, or Bilingual — the paper, including the answer key, is generated in your chosen language.",
      },
    },
    {
      "@type": "Question",
      name: "Is this BSEB question paper generator free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the first 5 question papers are free with no card required. After that, Pro unlocks unlimited papers for 30 days for a one-time ₹99 payment.",
      },
    },
    {
      "@type": "Question",
      name: "Can I add my school's letterhead and logo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — set your institute name, address, contact, and logo once in Settings, and every paper you generate is automatically formatted with your own letterhead.",
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <BsebPageClient />
    </>
  );
}
