import { SubscriptionPlan } from './subscription-types';

// Subscription plans for the new system
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly-plan',
    name: 'Monthly Plan',
    type: 'monthly',
    price: 2500,
    currency: 'INR',
    services: ['hosting', 'seo', 'maintenance', 'support'],
    features: [
      'Professional Website Hosting',
      'SSL Certificate & Security',
      'SEO Optimization',
      'Regular Maintenance & Updates',
      '24/7 Technical Support',
      'Mobile Responsive Design',
      'Analytics & Performance Reports',
      'Email Support',
      'Content Management System',
      'Social Media Integration'
    ],
    stripeProductId: 'prod_monthly_plan',
    stripePriceId: 'price_monthly_plan',
    razorpayPlanId: 'plan_monthly_plan'
  },
  {
    id: 'yearly-plan',
    name: 'Yearly Plan',
    type: 'yearly',
    price: 19999,
    currency: 'INR',
    services: ['hosting', 'seo', 'maintenance', 'support'],
    features: [
      'Everything in Monthly Plan',
      'Priority Support',
      'Advanced SEO Strategies',
      'Monthly Performance Reviews',
      'Custom Feature Development',
      'Dedicated Account Manager',
      'Website Speed Optimization',
      'Security Monitoring',
      'Backup & Recovery Service',
      '33% Savings vs Monthly (₹30,000 vs ₹19,999)'
    ],
    popular: true,
    stripeProductId: 'prod_yearly_plan',
    stripePriceId: 'price_yearly_plan',
    razorpayPlanId: 'plan_yearly_plan'
  }
];

// Helper functions
export const getPlanById = (planId: string): SubscriptionPlan | undefined => {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
};

export const getPlansByType = (type: 'monthly' | 'quarterly' | 'yearly'): SubscriptionPlan[] => {
  return SUBSCRIPTION_PLANS.filter(plan => plan.type === type);
};

export const getPopularPlans = (): SubscriptionPlan[] => {
  return SUBSCRIPTION_PLANS.filter(plan => plan.popular);
};

export const calculateSavings = (yearlyPlan: SubscriptionPlan, monthlyPlan: SubscriptionPlan): number => {
  const monthlyTotal = monthlyPlan.price * 12;
  const savings = monthlyTotal - yearlyPlan.price;
  return Math.round((savings / monthlyTotal) * 100);
};

export const formatPrice = (price: number, currency: 'INR' | 'USD' = 'INR'): string => {
  if (currency === 'INR') {
    return `₹${price.toLocaleString('en-IN')}`;
  }
  return `$${(price / 100).toFixed(2)}`;
};

export const getPlanDisplayPrice = (plan: SubscriptionPlan): string => {
  const basePrice = formatPrice(plan.price, plan.currency);
  
  switch (plan.type) {
    case 'monthly':
      return `${basePrice}/month`;
    case 'quarterly':
      return `${basePrice}/quarter`;
    case 'yearly':
      return `${basePrice}/year`;
    default:
      return basePrice;
  }
};
