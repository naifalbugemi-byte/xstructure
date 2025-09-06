import { useState } from "react";
import { 
  CreditCard, 
  Zap, 
  Crown, 
  Check, 
  ShoppingCart,
  Image,
  Video
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";

const creditPackages = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 50,
    price: 9.99,
    bonus: 0,
    popular: false,
  },
  {
    id: "creator",
    name: "Creator Pack",
    credits: 150,
    price: 24.99,
    bonus: 25,
    popular: true,
  },
  {
    id: "professional",
    name: "Professional Pack",
    credits: 300,
    price: 49.99,
    bonus: 75,
    popular: false,
  },
  {
    id: "enterprise",
    name: "Enterprise Pack",
    credits: 1000,
    price: 149.99,
    bonus: 300,
    popular: false,
  },
];

const subscriptionPlans = [
  {
    id: "creators-pro",
    name: "Creators Pro",
    price: 49,
    credits: "300 credits/month",
    features: [
      "300 AI images (1 credit each)",
      "60 AI videos (5 credits each)",
      "Premium templates",
      "Advanced scheduling",
      "Team collaboration (5 members)",
      "Priority support",
      "Brand management tools",
      "Advanced analytics"
    ],
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    price: null,
    credits: "Custom credits allocation",
    features: [
      "Unlimited AI images & videos",
      "Unlimited team members",
      "White-label solution",
      "API access",
      "Dedicated support",
      "Custom integrations",
      "Advanced security features",
      "SLA guarantee"
    ],
    popular: false,
  },
];

export default function CreditsAndPlans() {
  const [activeTab, setActiveTab] = useState<'credits' | 'plans'>('credits');
  const [selectedCredits, setSelectedCredits] = useState(creditPackages[1]);
  const [selectedPlan, setSelectedPlan] = useState(subscriptionPlans[0]);
  
  const profile = useQuery(api.profiles.getCurrentProfile);
  const creditTransactions = useQuery(api.profiles.getCreditTransactions);
  const addCredits = useMutation(api.profiles.addCredits);

  const handlePurchaseCredits = async (pack: typeof creditPackages[0]) => {
    try {
      await addCredits({
        amount: pack.credits + pack.bonus,
        description: `Purchased ${pack.name}`,
      });
      toast.success(`Successfully purchased ${pack.credits + pack.bonus} credits!`);
    } catch (error) {
      toast.error("Failed to purchase credits");
    }
  };

  const handleSubscribe = async (plan: typeof subscriptionPlans[0]) => {
    toast.info("Subscription feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-slate-950/90 backdrop-blur-xl border-b border-blue-500/20 px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white font-inter flex items-center">
                <CreditCard className="w-8 h-8 mr-3 text-blue-400" />
                Credits & Plans
              </h1>
              <p className="text-slate-300 mt-1 font-inter">
                Current Balance: {profile?.credits || 0} credits
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-slate-800/50 rounded-lg p-2 text-sm text-slate-300">
                <Image className="w-4 h-4 inline mr-1" />
                Image = 1 credit
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2 text-sm text-slate-300">
                <Video className="w-4 h-4 inline mr-1" />
                Video = 5 credits
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-slate-800/50 rounded-lg p-1 max-w-md">
            {[
              { id: 'credits', label: 'Buy Credits', icon: Zap },
              { id: 'plans', label: 'Subscription Plans', icon: Crown }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md transition-colors font-inter ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Credits Tab */}
          {activeTab === 'credits' && (
            <div className="space-y-8">
              {/* Credit Packages */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-6 font-inter">Credit Packages</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {creditPackages.map((pack) => (
                    <div
                      key={pack.id}
                      className={`glass-morphism rounded-2xl p-6 border transition-all hover:scale-105 ${
                        pack.popular 
                          ? 'border-blue-500/50 ring-2 ring-blue-500/20' 
                          : 'border-slate-700/50'
                      }`}
                    >
                      {pack.popular && (
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 text-center">
                          MOST POPULAR
                        </div>
                      )}
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-white mb-2 font-inter">{pack.name}</h3>
                        <div className="text-3xl font-bold text-white mb-1 font-inter">${pack.price}</div>
                        <div className="text-slate-400 text-sm mb-4 font-inter">
                          {pack.credits} credits
                          {pack.bonus > 0 && (
                            <span className="text-green-400"> + {pack.bonus} bonus</span>
                          )}
                        </div>
                        <button
                          onClick={() => handlePurchaseCredits(pack)}
                          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl hover:shadow-lg transition-all font-inter font-semibold"
                        >
                          <ShoppingCart className="w-4 h-4 inline mr-2" />
                          Purchase
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="glass-morphism rounded-2xl border border-slate-700/50">
                <div className="p-6 border-b border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white font-inter">Recent Transactions</h3>
                </div>
                <div className="p-6">
                  {creditTransactions && creditTransactions.length > 0 ? (
                    <div className="space-y-3">
                      {creditTransactions.slice(0, 10).map((transaction) => (
                        <div key={transaction._id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                          <div>
                            <p className="text-white font-medium font-inter">{transaction.description}</p>
                            <p className="text-slate-400 text-sm font-inter">
                              {new Date(transaction._creationTime).toLocaleDateString()}
                            </p>
                          </div>
                          <div className={`font-semibold font-inter ${
                            transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount} credits
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-center py-8 font-inter">No transactions yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Plans Tab */}
          {activeTab === 'plans' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6 font-inter">Subscription Plans</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {subscriptionPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`glass-morphism rounded-2xl p-8 border transition-all hover:scale-105 ${
                      plan.popular 
                        ? 'border-blue-500/50 ring-2 ring-blue-500/20' 
                        : 'border-slate-700/50'
                    }`}
                  >
                    {plan.popular && (
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6 text-center">
                        MOST POPULAR
                      </div>
                    )}
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-white mb-2 font-inter">{plan.name}</h3>
                      {plan.price ? (
                        <div className="flex items-baseline justify-center mb-2">
                          <span className="text-5xl font-bold text-white font-inter">${plan.price}</span>
                          <span className="text-slate-400 ml-2 font-inter">/month</span>
                        </div>
                      ) : (
                        <div className="mb-2">
                          <span className="text-3xl font-bold text-white font-inter">By Request</span>
                        </div>
                      )}
                      <p className="text-blue-400 font-semibold font-inter">{plan.credits}</p>
                    </div>
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-slate-300 font-inter">
                          <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleSubscribe(plan)}
                      className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center font-inter ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
                          : 'bg-slate-800 text-white hover:bg-slate-700'
                      }`}
                    >
                      {plan.price ? 'Subscribe Now' : 'Contact Sales'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
