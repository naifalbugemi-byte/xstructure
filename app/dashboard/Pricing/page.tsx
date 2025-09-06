import { useState } from "react";
import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  Image as ImageIcon,
  Video,
  Sparkles,
  CreditCard
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";

const plans = [
  {
    name: "Starter",
    price: 9,
    credits: 50,
    popular: false,
    features: [
      "50 Credits per month",
      "Image Studio access",
      "Video Studio access",
      "Basic templates",
      "Email support",
      "1 project"
    ]
  },
  {
    name: "Pro",
    price: 29,
    credits: 200,
    popular: true,
    features: [
      "200 Credits per month",
      "All Studio features",
      "Premium templates",
      "AI branding tools",
      "Priority support",
      "5 projects",
      "Team collaboration"
    ]
  },
  {
    name: "Business",
    price: 99,
    credits: 1000,
    popular: false,
    features: [
      "1000 Credits per month",
      "Unlimited projects",
      "Advanced AI features",
      "Custom branding",
      "Dedicated support",
      "Team management",
      "Analytics & insights"
    ]
  }
];

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const profile = useQuery(api.profiles.getCurrentProfile);
  const addCredits = useMutation(api.profiles.addCredits);

  const handlePurchase = async (plan: typeof plans[0]) => {
    setIsProcessing(true);
    setSelectedPlan(plan.name);

    try {
      // In a real app, this would integrate with Stripe or another payment processor
      // For demo purposes, we'll just add the credits directly
      await addCredits({
        amount: plan.credits,
        description: `${plan.name} plan purchase - ${plan.credits} credits`
      });

      toast.success(`Successfully purchased ${plan.name} plan! ${plan.credits} credits added.`);
    } catch (error) {
      toast.error("Purchase failed. Please try again.");
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Get the credits you need to create amazing content
            </p>
            
            {/* Current Credits */}
            <div className="inline-flex items-center bg-slate-800/50 rounded-full px-6 py-3 border border-blue-500/20">
              <Zap className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-white font-semibold">
                Current Balance: {profile?.credits || 0} Credits
              </span>
            </div>
          </div>

          {/* Credit Usage Info */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-blue-500/20 p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-blue-400" />
              Credit Usage
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Image Export</h3>
                  <p className="text-slate-400">1 credit per image</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Video className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Video Export</h3>
                  <p className="text-slate-400">5 credits per video</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-slate-900/50 backdrop-blur-xl rounded-xl border p-8 transition-all duration-300 hover:scale-105 ${
                  plan.popular 
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                    : 'border-slate-700 hover:border-blue-500/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-slate-400 ml-2">/month</span>
                  </div>
                  <div className="flex items-center justify-center text-blue-400">
                    <Zap className="w-4 h-4 mr-1" />
                    <span className="font-semibold">{plan.credits} Credits</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-slate-300">
                      <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(plan)}
                  disabled={isProcessing && selectedPlan === plan.name}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isProcessing && selectedPlan === plan.name ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Get Started
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-16 bg-slate-900/50 backdrop-blur-xl rounded-xl border border-blue-500/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  What are credits used for?
                </h3>
                <p className="text-slate-400">
                  Credits are used to export your creations from our studios. Each image export costs 1 credit, and each video export costs 5 credits.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Do credits expire?
                </h3>
                <p className="text-slate-400">
                  No, your credits never expire. You can use them whenever you're ready to export your content.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Can I change my plan?
                </h3>
                <p className="text-slate-400">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Is there a free trial?
                </h3>
                <p className="text-slate-400">
                  New users get 10 free credits to try out our platform. No credit card required to get started.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
