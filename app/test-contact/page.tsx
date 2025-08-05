import { ContactForm } from "../../components/ContactForm";

export default function TestContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Test Contact Form</h1>
          <p className="text-gray-600">
            Use this page to test the contact form submission. 
            Messages will be saved to Firebase and visible in the admin panel.
          </p>
          <a 
            href="/admin" 
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Admin Panel
          </a>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
