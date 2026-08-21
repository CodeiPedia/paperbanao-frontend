import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata = {
  title: "About Us",
  description: "PaperBanao is an AI-powered question paper generator built for Indian teachers and coaching institutes.",
};

export default function AboutPage() {
  return (
    <LegalPageLayout title="About Us">
      <p>
        PaperBanao was built to solve a problem faced by teachers and coaching institutes across India
        every single week: spending hours writing and formatting question papers by hand.
      </p>
      <p>
        We built an AI-powered tool that generates BSEB, CBSE, and NCERT-syllabus question papers —
        complete with MCQs, fill-in-the-blanks, short and long answer questions, and answer keys — in
        minutes instead of hours, in Hindi or English, formatted with your institute&apos;s own letterhead.
      </p>
      <p>
        PaperBanao is independently built and run out of Bihar, India, with the goal of making quality
        exam preparation tools accessible and affordable for every teacher and coaching institute,
        regardless of size or budget.
      </p>
      <p>
        We&apos;re a small, focused team, and every piece of feedback directly shapes what we build next.
        If you have ideas or requests, we&apos;d genuinely love to hear them — see the Contact page.
      </p>
    </LegalPageLayout>
  );
}
