import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata = {
  title: "Refund & Cancellation Policy",
  description: "PaperBanao's refund and cancellation policy for the Pro plan.",
};

export default function RefundPage() {
  return (
    <LegalPageLayout title="Refund & Cancellation Policy">
      <p className="text-xs text-slate-400">Last updated: August 2026</p>

      <h2 className="text-lg font-semibold text-[#17263D]">Free Plan</h2>
      <p>The Free plan (5 question papers) requires no payment, so there is nothing to refund or cancel.</p>

      <h2 className="text-lg font-semibold text-[#17263D]">Pro Plan</h2>
      <p>
        The Pro plan is a <strong>one-time payment</strong> that grants unlimited question paper
        generation (subject to fair-use limits) for <strong>30 days</strong> from the date of purchase.
        It does not auto-renew — there is no recurring subscription to cancel.
      </p>
      <p>
        Because Pro access is activated instantly upon successful payment, <strong>refunds are
        generally not provided</strong> once the Pro plan has been activated on your account.
      </p>

      <h2 className="text-lg font-semibold text-[#17263D]">Exceptions</h2>
      <p>We will review and process a refund in the following cases:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>You were charged but your Pro access was not activated due to a technical error on our end.</li>
        <li>You were charged more than once for the same purchase (duplicate payment).</li>
      </ul>
      <p>
        To request a refund under these circumstances, contact us within 7 days of the payment via the
        Contact page, including your registered email and payment reference. Approved refunds are
        processed back to the original payment method through Razorpay and may take 5–7 business days
        to reflect, depending on your bank.
      </p>
    </LegalPageLayout>
  );
}
