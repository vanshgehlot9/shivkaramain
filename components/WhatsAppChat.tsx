import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Phone, Clock, CheckCircle, Zap } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { trackCTAClick } from '../lib/analytics';

interface WhatsAppChatProps {
  phoneNumber?: string;
  businessHours?: {
    start: string;
    end: string;
    timezone: string;
  };
}

export function WhatsAppChat({ 
  phoneNumber = "919521699090", // Default to a placeholder number
  businessHours = { start: "09:00", end: "18:00", timezone: "IST" }
}: WhatsAppChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true); // You can implement real-time status check

  const predefinedMessages = [
    {
      id: 1,
      text: "💻 Get instant quote for website development",
      action: "Hi! I need a quote for website development. Can you help?"
    },
    {
      id: 2,
      text: "📱 Mobile app development pricing",
      action: "Hi! I'm interested in mobile app development. What's the pricing?"
    },
    {
      id: 3,
      text: "🛍️ E-commerce store development",
      action: "Hi! I want to build an e-commerce store. Can we discuss?"
    },
    {
      id: 4,
      text: "🎯 Custom software solution",
      action: "Hi! I need a custom software solution for my business."
    },
    {
      id: 5,
      text: "📞 Schedule free consultation",
      action: "Hi! I'd like to schedule a free consultation call."
    }
  ];

  const handleMessageClick = (message: string) => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
    }
    setIsOpen(false);
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    return hours >= 9 && hours < 18; // Business hours check
  };

  return (
    <>
      {/* WhatsApp Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-[999]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 300 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-gradient-to-r from-emerald-600 to-green-600 text-white p-4 rounded-full shadow-xl transition-all duration-300 animate-floating"
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(16, 185, 129, 0.4)" }}
          whileTap={{ scale: 0.95 }}
        >
          <FaWhatsapp className="w-8 h-8" />
          
          {/* Online Status Indicator */}
          {isOnline && (
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}

          {/* Notification Badge */}
          <motion.div
            className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            1
          </motion.div>
        </motion.button>

        {/* Floating Message Preview */}
        <motion.div
          className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg p-3 max-w-xs mb-2"
          initial={{ opacity: 0, x: 50, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 3 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-900">Shivkara Digitals</span>
          </div>
          <p className="text-sm text-gray-600">
            👋 Hi! Need help with your project? Get instant quote on WhatsApp!
          </p>
          <div className="text-xs text-gray-400 mt-1">
            {getCurrentTime() ? "Online now" : "Usually replies within 1 hour"}
          </div>
        </motion.div>
      </motion.div>

      {/* WhatsApp Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-xl shadow-2xl overflow-hidden z-50"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                    <FaWhatsapp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Shivkara Digitals</h3>
                    <div className="flex items-center gap-1 text-emerald-100 text-sm">
                      <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
                      <span>{isOnline ? "Online" : "Usually replies within 1 hour"}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {/* Welcome Message */}
              <div className="mb-4">
                <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                  <p className="text-sm text-gray-800">
                    👋 Hi! Welcome to Shivkara Digitals. How can we help you today?
                  </p>
                  <div className="text-xs text-gray-500 mt-1">
                    Just now
                  </div>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Choose what you need help with:
                </p>
                
                {predefinedMessages.map((msg) => (
                  <motion.button
                    key={msg.id}
                    onClick={() => handleMessageClick(msg.action)}
                    className="w-full text-left bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg p-3 transition-colors group"
                    whileHover={{ scale: 1.02, boxShadow: "0 3px 10px rgba(16, 185, 129, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-800">{msg.text}</span>
                      <Zap className="w-4 h-4 text-emerald-600 group-hover:text-emerald-700" />
                    </div>
                  </motion.button>
                ))}

                {/* Custom Message Button */}
                <motion.button
                  onClick={() => handleMessageClick("Hi! I have a custom requirement. Can we discuss?")}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg p-3 font-medium transition-colors shadow-md"
                  whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(16, 185, 129, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  💬 Send Custom Message
                </motion.button>
              </div>

              {/* Business Info */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Business Hours</span>
                </div>
                <p className="text-sm text-blue-700">
                  Monday - Saturday: 9:00 AM - 6:00 PM (IST)
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Response time: Usually within 5 minutes during business hours
                </p>
              </div>

              {/* Trust Signals */}
              <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>50+ Projects</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>5.0★ Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>24hr Response</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-3 bg-gray-50">
              <p className="text-xs text-center text-gray-600">
                🔒 Your privacy is protected. We never share your information.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Auto-trigger component for exit intent
export function ExitIntentWhatsApp({ 
  enabled = true,
  delay = 0,
  phoneNumber = "919521699090"
}: { 
  enabled?: boolean, 
  delay?: number,
  phoneNumber?: string
}) {
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasShownOnce, setHasShownOnce] = useState(false);

  React.useEffect(() => {
    if (!enabled) return;
    
    // Add delay if specified
    let timeoutId: NodeJS.Timeout | null = null;
    if (delay > 0) {
      timeoutId = setTimeout(() => {
        setHasShownOnce(false); // Reset after delay
      }, delay * 1000);
    }
    
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShownOnce) {
        setShowExitIntent(true);
        setHasShownOnce(true); // Only show once per session
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [enabled, delay, hasShownOnce]);

  if (!showExitIntent) return null;

  return (
    <motion.div
      className="fixed top-24 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm"
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
    >
      <div className="flex items-center gap-3">
        <FaWhatsapp className="w-8 h-8" />
        <div>
          <h4 className="font-semibold">Wait! Before you go...</h4>
          <p className="text-sm text-green-100">Get instant quote on WhatsApp!</p>
        </div>
        <button
          onClick={() => setShowExitIntent(false)}
          className="ml-auto p-1 hover:bg-white/20 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-3 flex justify-between">
        <a 
          href={`https://wa.me/${phoneNumber}?text=Hi, I'm interested in getting a quote for my project.`} 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-green-500 hover:bg-green-100 transition-colors font-medium px-4 py-2 rounded-md flex-grow text-center"
          onClick={() => {
            setShowExitIntent(false);
            trackCTAClick("WhatsApp Chat", "exit_intent");
          }}
        >
          Chat Now
        </a>
        <button
          onClick={() => setShowExitIntent(false)} 
          className="ml-2 text-xs text-green-100 hover:text-white"
        >
          Maybe Later
        </button>
      </div>
    </motion.div>
  );
}
