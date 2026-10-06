export default function Contact() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <a
          href="/"
          className="mb-8 inline-block text-sm text-gray-400 hover:text-white"
        >
          ← Back to Kivnexo
        </a>

        <h1 className="text-4xl font-bold">Contact Kivnexo</h1>

        <p className="mt-4 text-gray-400 leading-7">
          Have a question, need help with your account, or want to contact
          Kivnexo? You can reach us through email or WhatsApp.
        </p>

        {/* Email Support */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold">Email Support</h2>

          <p className="mt-3 text-gray-400">
            For general questions, account-related support, or other
            inquiries, contact us at:
          </p>

          <a
            href="mailto:pkbsivamservices@gmail.com"
            className="mt-4 inline-block font-medium text-white underline underline-offset-4 hover:text-gray-300"
          >
            pkbsivamservices@gmail.com
          </a>
        </div>

        {/* WhatsApp Support */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold">WhatsApp Support</h2>

          <p className="mt-3 text-gray-400">
            Need quick assistance? Contact our support team through WhatsApp.
          </p>

          <a
            href="https://wa.me/919943410292?text=Hello%20Kivnexo%20Support%2C%20I%20need%20help."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-gray-200"
          >
            Chat on WhatsApp →
          </a>
        </div>

        {/* Contact Guidelines */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold">Before Contacting Us</h2>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-400">
            <li>Include your Kivnexo account email when applicable.</li>
            <li>Clearly explain the issue or question.</li>
            <li>Never send your password, OTP, PIN, or other sensitive credentials.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}