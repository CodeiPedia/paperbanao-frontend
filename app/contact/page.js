import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with the PaperBanao team for support, feedback, or questions.",
};

export default function ContactPage() {
  return (
    <LegalPageLayout title="Contact Us">
      <p>
        Have a question, ran into an issue, or just want to say hello? We&apos;d love to hear from you.
      </p>

      <div className="rounded border border-slate-200 bg-white p-5">
        <p className="mb-2">
          <strong>Email:</strong>{" "}
          <a href="mailto:sk142464@gmail.com" className="text-amber-700 hover:underline">
            sk142464@gmail.com
          </a>
        </p>
        <p>
          <strong>Phone:</strong>{" "}
          <a href="tel:+919310038172" className="text-amber-700 hover:underline">
            +91 93100 38172
          </a>
        </p>
      </div>

      <p>
        We typically respond within 24–48 hours. For issues related to a specific payment or account,
        please include the email address you signed up with so we can look into it faster.
      </p>
    </LegalPageLayout>
  );
}
