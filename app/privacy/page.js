import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata = {
  title: "Privacy Policy",
  description: "How PaperBanao collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <p className="text-xs text-slate-400">Last updated: August 2026</p>

      <p>
        This Privacy Policy explains what data PaperBanao (&quot;we&quot;, &quot;us&quot;) collects when
        you use paperbanao.in, and how we use and protect it.
      </p>

      <h2 className="text-lg font-semibold text-[#17263D]">1. Information We Collect</h2>
      <p>We collect the following when you use the Service:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Account information: username, email address, and password (stored securely, hashed).</li>
        <li>Institute details you provide: institute name, address, contact number, logo, and teacher name — used only to brand your generated papers.</li>
        <li>Question papers you generate or save, and photos you upload for digitization.</li>
        <li>Payment information: processed directly by Razorpay, our payment partner. We do not store your card, UPI, or bank details on our servers.</li>
      </ul>

      <h2 className="text-lg font-semibold text-[#17263D]">2. How We Use Your Information</h2>
      <p>
        We use your information to operate the Service — generating and formatting your papers,
        authenticating your account, sending you verification codes and important account emails, and
        processing payments for the Pro plan.
      </p>

      <h2 className="text-lg font-semibold text-[#17263D]">3. Third-Party Services</h2>
      <p>We rely on the following trusted third-party services to run PaperBanao:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Supabase — our database, for storing account and paper data.</li>
        <li>Razorpay — for processing payments.</li>
        <li>Resend — for sending signup verification and account emails.</li>
        <li>Google Gemini API — for generating question paper content from the topics and instructions you provide.</li>
      </ul>
      <p>Each of these providers has its own privacy practices governing the data they process on our behalf.</p>

      <h2 className="text-lg font-semibold text-[#17263D]">4. Data Retention</h2>
      <p>
        Question papers saved to your Cloud History are automatically deleted after 30 days. Your
        account information is retained as long as your account remains active.
      </p>

      <h2 className="text-lg font-semibold text-[#17263D]">5. Your Rights</h2>
      <p>
        You may request deletion of your account and associated data at any time by contacting us — see
        the Contact page.
      </p>

      <h2 className="text-lg font-semibold text-[#17263D]">6. Security</h2>
      <p>
        We use industry-standard practices to protect your data, including password hashing and
        encrypted connections (HTTPS) for all traffic to and from the Service.
      </p>

      <h2 className="text-lg font-semibold text-[#17263D]">7. Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. Material changes will be reflected here with an updated date.</p>

      <h2 className="text-lg font-semibold text-[#17263D]">8. Contact</h2>
      <p>Questions about this policy? Reach us via the Contact page.</p>
    </LegalPageLayout>
  );
}
