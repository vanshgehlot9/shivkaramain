import Link from 'next/link';

export const metadata = {
  title: 'Cancellation & Refund Policy - Shivkara Digital',
  description: 'Shivkara Digital cancellation and refund terms for monthly and yearly plans, plus launch offer details.',
};

export default function CancellationPolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-16">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-3xl font-bold mb-4">Shivkara Digital – Cancellation & Refund Policy</h1>
        <p className="text-gray-700 mb-4">At Shivkara Digital, we value transparency and customer trust. Our subscription plans are designed to be flexible so you can choose what works best for your business. You can cancel your subscription at any time depending on your plan type. For the Monthly Plan (₹2,499/month), you may cancel anytime before your next billing cycle, and your access will remain active until the end of the current month. Please note that payments already made are non-refundable, and we do not issue refunds for partial months. For the Yearly Plan (₹19,999/year), you are eligible for a full refund if you cancel within 7 days of purchase. After this period, no refunds will be provided, but you will continue to enjoy full access until the end of your subscription.</p>

        <p className="text-gray-700 mb-4">If you signed up under our Special Launch Offer (valid till 31st October 2025), please note that cancellation before the delivery of the FREE Social Media Starter Pack will void this benefit, and discounts offered during the launch period are non-refundable. Cancellations can be made easily via email at <a href="mailto:info@shivkaradigital.com" className="text-blue-600 underline">info@shivkaradigital.com</a> or through your client dashboard (if applicable). Domains, third-party services, or add-ons purchased separately are non-refundable. Refunds due to technical issues or failure to deliver services will be reviewed on a case-by-case basis.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Quick Summary</h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>
            <strong>Monthly Plan (₹2,499):</strong> Cancel anytime before renewal. No refunds for partial months.
          </li>
          <li>
            <strong>Yearly Plan (₹19,999):</strong> Full refund if canceled within 7 days. After 7 days, no refunds but access continues until term ends.
          </li>
          <li>
            <strong>Special Launch Offer (till 31st Oct 2025):</strong> Cancel before delivery → lose FREE Social Media Starter Pack. 5% discount is non-refundable.
          </li>
          <li>Domains & third-party add-ons are non-refundable. Refunds only in case of service failure (case-by-case).</li>
          <li>Cancel via email: <a href="mailto:info@shivkaradigital.com" className="text-blue-600 underline">info@shivkaradigital.com</a> or via client dashboard.</li>
        </ul>

        <div className="mt-8 flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">Back to home</Link>
          <a href="mailto:info@shivkaradigital.com" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Contact Support</a>
        </div>
      </div>
    </main>
  );
}
