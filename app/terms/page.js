import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using PaperBanao's question paper generator service.",
};

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms & Conditions">
      <p className="text-xs text-slate-400">Last updated: August 2026</p>

      <p>
        These Terms &amp; Conditions (&quot;Terms&quot;) govern your use of PaperBanao (&quot;we&quot;,
        &quot;us&quot;, &quot;the Service&quot;), accessible at paperbanao.in. By creating an account or
        using the Service, you agree to these Terms.
      </p>

      <h2 className="text-lg font-semibold text-[#17263D]">1. The Service</h2>
      <p>
        PaperBanao is an AI-assisted tool that helps teachers and coaching institutes generate question
        papers, digitize handwritten papers, and export them for printing. Content is generated using
        AI and is provided as a starting point — you are responsible for reviewing generated papers for
        accuracy before use in any examination.
      </p>

      <h2 className="text-lg font-semibold text-[#17263D]">2. Accounts</h2>
      <p>
        You must provide accurate information when creating an account and are responsible for keeping
        your login credentials secure. You are responsible for all activity under your account.
      </p>

      <h2 className="text-lg font-semibold text-[#17263D]">3. Acceptable Use</h2>
      <p>
        You agree not to use the Service to generate unlawful, harmful, or plagiarized content, to
        attempt to disrupt or reverse-engineer the Service, or to share your account credentials with
        others to circumvent usage limits.
      </p>

      <h2 className="text-lg font-semibold text-[#17263D]">4. Plans &amp; Payment</h2>
      <p>
        The Free plan allows a limited number of question papers. The Pro plan is a one-time payment
        granting unlimited paper generation (subject to fair-use limits) for 30 days from the date of
        purchase. Pro access does not auto-renew — you will need to purchase again after it expires if
        you wish to continue. See our Refund Policy for details on cancellations and refunds.
      </p>

      <h2 className="text-lg font-semibold text-[#17263D]">5. Content Ownership</h2>
      <p>
        You retain ownership of the input you provide (subjects, topics, uploaded photos, institute
        branding) and the question papers generated for you. We do not claim ownership of your
        generated content.
      </p>

      <h2 className="text-lg font-semibold text-[#17263D]">6. Limitation of Liability</h2>
      <p>
        The Service is provided &quot;as is&quot;. AI-generated content may occasionally contain errors,
        and we do not guarantee that generated papers are free of mistakes or perfectly aligned with any
        specific syllabus. We are not liable for any loss arising from reliance on generated content
        without independent review.
      </p>

      <h2 className="text-lg font-semibold text-[#17263D]">7. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of the Service after changes are
        posted constitutes acceptance of the updated Terms.
      </p>

      <h2 className="text-lg font-semibold text-[#17263D]">8. Governing Law</h2>
      <p>These Terms are governed by the laws of India.</p>

      <h2 className="text-lg font-semibold text-[#17263D]">9. Contact</h2>
      <p>Questions about these Terms? Reach us via the Contact page.</p>
    </LegalPageLayout>
  );
}
