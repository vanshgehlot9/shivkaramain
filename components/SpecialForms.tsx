"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Gift, CreditCard } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

interface OfferClaimFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  offerTitle: string;
  offerPrice: string;
  originalPrice: string;
  savings: string;
}

interface PlanSelectionFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  selectedPlan: string;
  planPrice: string;
  projectTimeline?: string;
}

interface OfferClaimFormProps {
  offerDetails?: {
    title: string;
    offerPrice: string;
    originalPrice: string;
    savings: string;
  };
  onSuccess?: () => void;
}

interface PlanSelectionFormProps {
  planDetails?: {
    name: string;
    price: string;
    period: string;
  };
  onSuccess?: () => void;
}

export function OfferClaimForm({ offerDetails, onSuccess }: OfferClaimFormProps) {
  const [formData, setFormData] = useState<OfferClaimFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    offerTitle: offerDetails?.title || "",
    offerPrice: offerDetails?.offerPrice || "",
    originalPrice: offerDetails?.originalPrice || "",
    savings: offerDetails?.savings || ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage("");

    try {
      await addDoc(collection(db, "submissions"), {
        ...formData,
        type: "offer_claim",
        timestamp: new Date(),
        status: "new"
      });

      setSubmitStatus('success');
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
        offerTitle: offerDetails?.title || "",
        offerPrice: offerDetails?.offerPrice || "",
        originalPrice: offerDetails?.originalPrice || "",
        savings: offerDetails?.savings || ""
      });
      
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus('error');
      setErrorMessage("Failed to claim offer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {offerDetails && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 mb-8 border border-green-200">
          <div className="flex items-start space-x-3">
            <Gift className="w-6 h-6 text-green-600 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{offerDetails.title}</h3>
              <div className="flex items-center space-x-4 mb-2">
                <span className="text-lg text-gray-500 line-through">{offerDetails.originalPrice}</span>
                <span className="text-2xl font-bold text-green-600">{offerDetails.offerPrice}</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Save {offerDetails.savings}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">
          Claim Your Special Offer
        </h2>
        <p className="text-gray-600">
          Fill out the form below to claim this exclusive offer. We'll get back to you within 24 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              placeholder="Your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              placeholder="+91 98765 43210"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              placeholder="Your company name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Details & Requirements *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none transition-all duration-300"
            placeholder="Tell us about your project requirements, timeline, and any specific needs..."
          />
        </div>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <motion.div
            className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700 font-medium">
              Offer claimed successfully! We'll contact you within 24 hours to discuss your project.
            </span>
          </motion.div>
        )}

        {submitStatus === 'error' && (
          <motion.div
            className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 font-medium">
              {errorMessage}
            </span>
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 rounded-lg font-semibold text-lg shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-xl'
          }`}
          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Claiming Offer...</span>
            </>
          ) : (
            <>
              <Gift className="w-5 h-5" />
              <span>Claim This Offer</span>
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}

export function PlanSelectionForm({ planDetails, onSuccess }: PlanSelectionFormProps) {
  const [formData, setFormData] = useState<PlanSelectionFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    selectedPlan: planDetails?.name || "",
    planPrice: planDetails?.price || "",
    projectTimeline: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage("");

    try {
      await addDoc(collection(db, "submissions"), {
        ...formData,
        type: "plan_selection",
        timestamp: new Date(),
        status: "new"
      });

      setSubmitStatus('success');
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
        selectedPlan: planDetails?.name || "",
        planPrice: planDetails?.price || "",
        projectTimeline: ""
      });
      
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus('error');
      setErrorMessage("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {planDetails && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8 border border-blue-200">
          <div className="flex items-start space-x-3">
            <CreditCard className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{planDetails.name}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-blue-600">{planDetails.price}</span>
                <span className="text-gray-600">/{planDetails.period}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">
          Get Started with Your Plan
        </h2>
        <p className="text-gray-600">
          Tell us about your project and we'll create a customized proposal for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="+91 98765 43210"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Your company name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Timeline
          </label>
          <select
            name="projectTimeline"
            value={formData.projectTimeline}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          >
            <option value="">Select timeline</option>
            <option value="asap">As soon as possible</option>
            <option value="1-month">Within 1 month</option>
            <option value="2-3-months">2-3 months</option>
            <option value="6-months">Within 6 months</option>
            <option value="flexible">Flexible timeline</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Details & Requirements *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all duration-300"
            placeholder="Describe your project requirements, features needed, target audience, and any specific preferences..."
          />
        </div>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <motion.div
            className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700 font-medium">
              Request submitted successfully! We'll send you a detailed proposal within 24 hours.
            </span>
          </motion.div>
        )}

        {submitStatus === 'error' && (
          <motion.div
            className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 font-medium">
              {errorMessage}
            </span>
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 rounded-lg font-semibold text-lg shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-xl'
          }`}
          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Submitting Request...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Get Started</span>
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}
