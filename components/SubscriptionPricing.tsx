import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Check, 
  ArrowRight, 
  Star,
  Clock,
  Gift,
  Percent
} from "lucide-react";
import { SUBSCRIPTION_PLANS, formatPrice } from "../lib/subscription-plans";
import { trackCTAClick } from "../lib/analytics";

interface SubscriptionPricingProps {
  onGetStarted: (plan: any) => void;
  onCustomQuote: () => void;
}

export function SubscriptionPricing({ onGetStarted, onCustomQuote }: SubscriptionPricingProps) {
  const monthlyPlan = SUBSCRIPTION_PLANS.find(plan => plan.id === 'monthly-plan');
  const yearlyPlan = SUBSCRIPTION_PLANS.find(plan => plan.id === 'yearly-plan');
  const [viewState, setViewState] = useState<'default' | 'back' | 'view'>('default');

  if (!monthlyPlan || !yearlyPlan) {
    return null;
  }

  const handlePlanSelection = (plan: any) => {
    trackCTAClick(`Select ${plan.name}`, "subscription_pricing");
    // Calculate discounted price for special offer
    const discountedPrice = getDiscountedPrice(plan.price);
    // Redirect to payment page with plan and pricing details
    const paymentUrl = new URL('/payment', window.location.origin);
    paymentUrl.searchParams.set('plan', plan.id);
    paymentUrl.searchParams.set('originalPrice', plan.price.toString());
    paymentUrl.searchParams.set('discountedPrice', discountedPrice.toString());
    paymentUrl.searchParams.set('hasSpecialOffer', 'true');
    paymentUrl.searchParams.set('discount', '5');
    window.location.href = paymentUrl.toString();
  };

  // Calculate discounted prices for special offer (5% off)
  const getDiscountedPrice = (originalPrice: number) => {
    return Math.round(originalPrice * 0.95);
  };

  return (
      <motion.section
        className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-indigo-50"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
  <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-y-auto max-h-[70vh] sm:max-h-none">
          {/* UI for Back to Plan and View Plan */}
          {viewState === 'default' && (
            <button
              className="mb-4 px-4 py-2 bg-gray-200 rounded"
              onClick={() => setViewState('back')}
            >
              Back to Plan
            </button>
          )}
          {viewState === 'back' && (
            <button
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setViewState('view')}
            >
              View Plan
            </button>
          )}
          {viewState === 'view' ? (
            <React.Fragment>
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-2">Monthly Plans</h2>
                {/* Monthly Plan Card */}
                <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
                  <motion.div
                    className="group relative bg-white rounded-xl overflow-hidden shadow-xl border-2 border-gray-200"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{monthlyPlan.name}</h3>
                      <div className="mb-4">
                        <span className="text-base text-gray-400 line-through">₹{monthlyPlan.price.toLocaleString()}</span>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold ml-2">5% OFF</span>
                        <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mt-2">
                          ₹{getDiscountedPrice(monthlyPlan.price).toLocaleString()}<span className="text-base font-normal text-gray-600">/month</span>
                        </div>
                      </div>
                      <ul className="space-y-3 mb-6">
                        {monthlyPlan.features.map((feature, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center rounded-full bg-green-100 mt-0.5">
                              <Check className="w-2.5 h-2.5 text-green-600" />
                            </div>
                            <span className="text-gray-700 text-xs leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handlePlanSelection(monthlyPlan)}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg text-sm"
                      >
                        Get Started <ArrowRight className="ml-2 w-4 h-4 inline" />
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Yearly Plans</h2>
                <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
                  <motion.div
                    className="group relative bg-white rounded-xl overflow-hidden shadow-xl border-2 border-blue-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="p-4">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">{yearlyPlan.name}</h3>
                      <div className="mb-4">
                        <span className="text-base text-gray-400 line-through">₹{yearlyPlan.price.toLocaleString()}</span>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold ml-2">5% OFF</span>
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
                          ₹{getDiscountedPrice(yearlyPlan.price).toLocaleString()}<span className="text-base font-normal text-gray-600">/year</span>
                        </div>
                        <p className="text-xs text-green-600 font-semibold mt-2 bg-green-50 px-2 py-1 rounded-full inline-block">
                          Save ₹{(getDiscountedPrice(monthlyPlan.price) * 12 - getDiscountedPrice(yearlyPlan.price)).toLocaleString()} per year!
                        </p>
                      </div>
                      <ul className="space-y-3 mb-6">
                        {yearlyPlan.features.map((feature, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center rounded-full bg-blue-100 mt-0.5">
                              <Check className="w-2.5 h-2.5 text-blue-600" />
                            </div>
                            <span className="text-gray-700 text-xs leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handlePlanSelection(yearlyPlan)}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg text-sm"
                      >
                        Get Started <ArrowRight className="ml-2 w-4 h-4 inline" />
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {/* Special Launch Offer Banner */}
              <motion.div
                className="text-center mb-6 sm:mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* ...existing code... */}
              </motion.div>
              {/* ...existing code for plans and CTA... */}
            </React.Fragment>
    )}
  <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 fill-current" />
            <span className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
              Simple Pricing
            </span>
            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 fill-current" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2">
            Choose Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Perfect Plan</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
            All-inclusive website management with hosting, security, and support. No hidden fees, no setup costs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* Monthly Plan */}
          <motion.div
            className="group relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-gray-200 hover:border-blue-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: [-4, -8], scale: [1, 1.02] }}
          >
            {/* Background gradient effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br from-blue-600 to-purple-600"></div>
            
            {/* Top accent bar */}
            <div className="h-1.5 sm:h-2 w-full bg-gradient-to-r from-blue-400 to-purple-400 group-hover:from-blue-600 group-hover:to-purple-600 transition-colors duration-500"></div>
            
            {/* Plan Badge */}
            <div className="absolute top-3 sm:top-6 right-3 sm:right-6">
              <span className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow-md">
                Starter
              </span>
            </div>
            
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Plan Header */}
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">{monthlyPlan.name}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Perfect for getting started</p>
                
                {/* Price Display */}
                <div className="mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-base sm:text-lg text-gray-400 line-through">₹{monthlyPlan.price.toLocaleString()}</span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold shadow-sm">5% OFF</span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                    ₹{getDiscountedPrice(monthlyPlan.price).toLocaleString()}
                    <span className="text-base sm:text-lg font-normal text-gray-600">/month</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {monthlyPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3 group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: `${index * 50}ms` }}>
                    <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full bg-green-100 mt-0.5 group-hover:bg-green-200 transition-colors duration-300">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700 text-xs sm:text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                onClick={() => handlePlanSelection(monthlyPlan)}
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group/button text-sm sm:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover/button:opacity-100 transition-opacity duration-500"></span>
                <span className="relative flex items-center justify-center">
                  Get Started <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover/button:translate-x-1 transition-transform duration-300" />
                </span>
              </motion.button>
            </div>
          </motion.div>

          {/* Yearly Plan */}
          <motion.div
            className="group relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 border-2 border-blue-300 hover:border-blue-500 lg:scale-105 z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: [-4, -8], scale: [1, 1.03] }}
          >
            {/* Background gradient effect */}
            <div className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity duration-500 bg-gradient-to-br from-blue-600 to-purple-600"></div>
            
            {/* Top accent bar */}
            <div className="h-1.5 sm:h-2 w-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
            
            {/* Popular Badge */}
            <div className="absolute top-3 sm:top-6 right-3 sm:right-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-medium shadow-lg animate-pulse">
                Most Popular
              </span>
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
              {/* Plan Header */}
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">{yearlyPlan.name}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Best value for growing businesses</p>
                
                {/* Price Display */}
                <div className="mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-base sm:text-lg text-gray-400 line-through">₹{yearlyPlan.price.toLocaleString()}</span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold shadow-sm">5% OFF</span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ₹{getDiscountedPrice(yearlyPlan.price).toLocaleString()}
                    <span className="text-base sm:text-lg font-normal text-gray-600">/year</span>
                  </div>
                  <p className="text-xs sm:text-sm text-green-600 font-semibold mt-2 bg-green-50 px-2 sm:px-3 py-1 rounded-full inline-block">
                    Save ₹{(getDiscountedPrice(monthlyPlan.price) * 12 - getDiscountedPrice(yearlyPlan.price)).toLocaleString()} per year!
                  </p>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {yearlyPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3 group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: `${index * 50}ms` }}>
                    <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full bg-blue-100 mt-0.5 group-hover:bg-blue-200 transition-colors duration-300">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600" />
                    </div>
                    <span className="text-gray-700 text-xs sm:text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                onClick={() => handlePlanSelection(yearlyPlan)}
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group/button text-sm sm:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover/button:opacity-100 transition-opacity duration-500"></span>
                <span className="relative flex items-center justify-center">
                  Get Started <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover/button:translate-x-1 transition-transform duration-300" />
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 px-4">
            Need something custom? We'd love to help you build the perfect solution.
          </p>
          <motion.button
            onClick={onCustomQuote}
            className="px-6 sm:px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 text-sm sm:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Custom Quote
          </motion.button>
        </motion.div>
      </div>
  </motion.section>
  );
}

