"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Shield, 
  Check, 
  Loader2, 
  AlertCircle,
  ArrowLeft,
  Globe,
  Zap,
  Headphones,
  Monitor
} from 'lucide-react';
import { SUBSCRIPTION_PLANS, getPlanById, formatPrice, getPlanDisplayPrice } from '../../lib/subscription-plans';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import Link from 'next/link';

interface PaymentFormData {
  domain: string;
  contactEmail: string;
  contactName: string;
  contactPhone: string;
  billingAddress: string;
  planId: string;
  gateway: 'stripe' | 'razorpay';
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<PaymentFormData>({
    domain: '',
    contactEmail: '',
    contactName: '',
    contactPhone: '',
    billingAddress: '',
    planId: '',
    gateway: 'razorpay'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'plan-selection' | 'details' | 'payment'>('plan-selection');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [pricingInfo, setPricingInfo] = useState<{
    originalPrice: number;
    discountedPrice: number;
    hasSpecialOffer: boolean;
    discount: number;
  } | null>(null);

  useEffect(() => {
    const domain = searchParams.get('domain');
    const planId = searchParams.get('plan');
    const originalPrice = searchParams.get('originalPrice');
    const discountedPrice = searchParams.get('discountedPrice');
    const hasSpecialOffer = searchParams.get('hasSpecialOffer') === 'true';
    const discount = searchParams.get('discount');
    
    if (domain) {
      setFormData(prev => ({ ...prev, domain }));
    }
    
    if (planId) {
      const plan = getPlanById(planId);
      if (plan) {
        setSelectedPlan(plan);
        setFormData(prev => ({ ...prev, planId }));
        setStep('details');
        
        // Set pricing info if special offer parameters are present
        if (originalPrice && discountedPrice && hasSpecialOffer && discount) {
          setPricingInfo({
            originalPrice: parseInt(originalPrice),
            discountedPrice: parseInt(discountedPrice),
            hasSpecialOffer: true,
            discount: parseInt(discount)
          });
        }
      }
    }
  }, [searchParams]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.domain) {
      newErrors.domain = 'Domain is required';
    } else if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(formData.domain)) {
      newErrors.domain = 'Please enter a valid domain';
    }

    if (!formData.contactEmail) {
      newErrors.contactEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email';
    }

    if (!formData.contactName) {
      newErrors.contactName = 'Name is required';
    }

    if (!formData.contactPhone) {
      newErrors.contactPhone = 'Phone number is required';
    }

    if (!formData.planId) {
      newErrors.planId = 'Please select a plan';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create payment session
      const response = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to payment gateway
        if (formData.gateway === 'stripe' && result.stripeUrl) {
          window.location.href = result.stripeUrl;
        } else if (formData.gateway === 'razorpay' && result.razorpayOptions) {
          // Initialize Razorpay checkout
          const razorpay = new (window as any).Razorpay(result.razorpayOptions);
          razorpay.open();
        }
      } else {
        setErrors({ form: result.error || 'Payment initialization failed' });
      }
    } catch (error) {
      setErrors({ form: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderPlanSelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select the perfect subscription plan for your website. All plans include hosting, SSL certificates, and 24/7 support.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {SUBSCRIPTION_PLANS.filter(plan => plan.type === 'monthly').map((plan) => (
          <motion.div
            key={plan.id}
            className={`relative rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 ${
              plan.popular 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              setSelectedPlan(plan);
              setFormData(prev => ({ ...prev, planId: plan.id }));
              setStep('details');
            }}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="mb-2">
                {pricingInfo && pricingInfo.hasSpecialOffer ? (
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="text-lg text-gray-400 line-through">₹{pricingInfo.originalPrice.toLocaleString()}</span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                        {pricingInfo.discount}% OFF
                      </span>
                    </div>
                    <div>
                      <span className="text-3xl font-bold text-blue-600">₹{pricingInfo.discountedPrice.toLocaleString()}</span>
                      <span className="text-gray-600 ml-1">/{plan.type}</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="text-3xl font-bold text-gray-900">{formatPrice(plan.price)}</span>
                    <span className="text-gray-600 ml-1">/{plan.type}</span>
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-sm">Perfect for growing businesses</p>
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.slice(0, 6).map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
              Select Plan
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-gray-600 mb-4">Need quarterly or yearly billing?</p>
        <Button variant="outline" onClick={() => setStep('details')}>
          View All Plans
        </Button>
      </div>
    </div>
  );

  const renderDetailsForm = () => (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => setStep('plan-selection')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Plans
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Complete Your Subscription</h1>
        {selectedPlan && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            {pricingInfo && pricingInfo.hasSpecialOffer && (
              <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg mb-3 text-sm font-medium text-center">
                🎉 Special Launch Offer - {pricingInfo.discount}% OFF (Valid till 31st October 2025)
              </div>
            )}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-blue-900">{selectedPlan.name}</h3>
                <p className="text-blue-700 text-sm">{selectedPlan.services.join(', ')}</p>
              </div>
              <div className="text-right">
                {pricingInfo && pricingInfo.hasSpecialOffer ? (
                  <div>
                    <div className="text-sm text-gray-500 line-through">₹{pricingInfo.originalPrice.toLocaleString()}</div>
                    <div className="text-2xl font-bold text-green-600">₹{pricingInfo.discountedPrice.toLocaleString()}</div>
                    <div className="text-xs text-green-600">Save ₹{(pricingInfo.originalPrice - pricingInfo.discountedPrice).toLocaleString()}</div>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-blue-900">{getPlanDisplayPrice(selectedPlan)}</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Website Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="domain">Domain Name *</Label>
              <Input
                id="domain"
                placeholder="example.com"
                value={formData.domain}
                onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
                className={errors.domain ? 'border-red-500' : ''}
              />
              {errors.domain && (
                <p className="text-red-500 text-sm mt-1">{errors.domain}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contactName">Full Name *</Label>
              <Input
                id="contactName"
                placeholder="John Doe"
                value={formData.contactName}
                onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                className={errors.contactName ? 'border-red-500' : ''}
              />
              {errors.contactName && (
                <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="contactEmail">Email Address *</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="john@example.com"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                className={errors.contactEmail ? 'border-red-500' : ''}
              />
              {errors.contactEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>
              )}
            </div>

            <div>
              <Label htmlFor="contactPhone">Phone Number *</Label>
              <Input
                id="contactPhone"
                placeholder="+91 9876543210"
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                className={errors.contactPhone ? 'border-red-500' : ''}
              />
              {errors.contactPhone && (
                <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>
              )}
            </div>

            <div>
              <Label htmlFor="billingAddress">Billing Address</Label>
              <Input
                id="billingAddress"
                placeholder="Street, City, State, Country"
                value={formData.billingAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, billingAddress: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={formData.gateway}
              onValueChange={(value) => setFormData(prev => ({ ...prev, gateway: value as 'stripe' | 'razorpay' }))}
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="razorpay" id="razorpay" />
                <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Razorpay (India)</div>
                      <div className="text-sm text-gray-600">UPI, Cards, NetBanking, Wallets</div>
                    </div>
                    <Shield className="w-5 h-5 text-green-500" />
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="stripe" id="stripe" />
                <Label htmlFor="stripe" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Stripe (International)</div>
                      <div className="text-sm text-gray-600">Credit/Debit Cards</div>
                    </div>
                    <Shield className="w-5 h-5 text-green-500" />
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {errors.form && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-5 h-5" />
            {errors.form}
          </div>
        )}

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep('plan-selection')}
            className="flex-1"
          >
            Back to Plans
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Proceed to Payment
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Special Offer Banner */}
        {pricingInfo && pricingInfo.hasSpecialOffer && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 mb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-lg font-bold">🎉 Special Launch Offer - {pricingInfo.discount}% OFF!</span>
            </div>
            <p className="text-sm opacity-90">
              Valid till 31st October 2025 • FREE Social Media Starter Pack included
            </p>
          </div>
        )}
        
        {step === 'plan-selection' && renderPlanSelection()}
        {step === 'details' && renderDetailsForm()}
      </div>
    </div>
  );
}
