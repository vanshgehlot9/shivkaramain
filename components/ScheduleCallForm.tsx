import { useState } from "react";
import { Calendar as CalendarIcon, Clock as ClockIcon, Users as UsersIcon, CheckCircle as CheckCircleIcon } from "lucide-react";

interface ScheduleCallFormProps {
  onSuccess: () => void;
}

export function ScheduleCallForm({ onSuccess }: ScheduleCallFormProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const slots = [
    {
      label: "Quick Chat (15 min)",
      desc: "Perfect for initial discussions",
      icon: <ClockIcon className="w-5 h-5 text-gray-400" />,
    },
    {
      label: "Project Discussion (30 min)",
      desc: "Detailed project planning",
      icon: <UsersIcon className="w-5 h-5 text-gray-400" />,
    },
    {
      label: "Technical Review (45 min)",
      desc: "Deep technical consultation",
      icon: <CheckCircleIcon className="w-5 h-5 text-gray-400" />,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/schedule-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, slot: selectedSlot, notes }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to schedule call");
      }
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold mb-2">Call Scheduled!</h3>
        <p className="text-gray-600">Thank you. We will contact you at your selected time slot.</p>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-lavender to-pink rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CalendarIcon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold mb-2">Book a Free Consultation</h3>
        <p className="text-gray-600">Choose a time that works best for you.</p>
      </div>
      <div className="grid gap-4">
        {slots.map((slot) => (
          <div
            key={slot.label}
            className={`p-4 border rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
              selectedSlot === slot.label
                ? "border-lavender bg-lavender/10"
                : "border-gray-200 hover:border-lavender"
            }`}
            onClick={() => setSelectedSlot(slot.label)}
          >
            <div>
              <h4 className="font-semibold">{slot.label}</h4>
              <p className="text-sm text-gray-600">{slot.desc}</p>
            </div>
            {slot.icon}
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="text"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <input
        type="tel"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender"
        placeholder="Phone (optional)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <textarea
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender"
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
      />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-lavender to-pink text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
        disabled={loading || !selectedSlot}
      >
        {loading ? "Scheduling..." : "Schedule Now"}
      </button>
    </form>
  );
}
