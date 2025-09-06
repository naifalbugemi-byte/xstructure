import { useState, useEffect } from "react";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Copy, 
  Share2, 
  Mail, 
  Gift,
  Crown,
  Star,
  Plus
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import ReferralCodeModal from "@/components/ReferralCodeModal";
import { toast } from "sonner";

export default function Referrals() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const profile = useQuery(api.profiles.getCurrentProfile);
  const canCreateCode = useQuery(api.referrals.canCreateReferralCode);
  const referralStats = useQuery(api.referrals.getReferralStats);
  const userReferrals = useQuery(api.referrals.getUserReferrals);

  // Auto-show modal when user becomes eligible
  useEffect(() => {
    if (canCreateCode?.canCreate && !showCreateModal) {
      setShowCreateModal(true);
    }
  }, [canCreateCode?.canCreate]);

  const copyReferralLink = () => {
    if (!profile?.referralCode) return;
    const referralLink = `https://xstructure.ai/signup?ref=${profile.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard!");
  };

  const copyReferralCode = () => {
    if (!profile?.referralCode) return;
    navigator.clipboard.writeText(profile.referralCode);
    toast.success("Referral code copied to clipboard!");
  };

  const shareViaEmail = () => {
    if (!profile?.referralCode) return;
    const subject = "Join me on Xstructure.ai - AI-Powered Content Creation";
    const body = `Hey! I've been using Xstructure.ai for my content creation and it's amazing. You should check it out with my referral code: ${profile.referralCode}\n\nSign up here: https://xstructure.ai/signup?ref=${profile.referralCode}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
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
                <Users className="w-8 h-8 mr-3 text-emerald-400" />
                Referral Program
              </h1>
              <p className="text-slate-300 mt-1 font-inter">Earn $4/month for every active referral</p>
            </div>
            <div className="flex items-center space-x-4">
              {profile?.referralCode ? (
                <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl px-4 py-2">
                  <p className="text-emerald-400 font-semibold font-inter">Your Code: {profile.referralCode}</p>
                </div>
              ) : canCreateCode?.canCreate ? (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 flex items-center font-inter font-semibold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Code
                </button>
              ) : (
                <div className="bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-2">
                  <p className="text-slate-400 font-inter text-sm">
                    {canCreateCode?.reason || "Payment required to create referral code"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="glass-morphism rounded-2xl p-6 border border-emerald-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 font-inter">Total Referrals</p>
                  <p className="text-2xl font-bold text-white font-inter">{referralStats?.totalReferrals || 0}</p>
                </div>
                <div className="bg-emerald-500/20 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-green-400 font-inter">+{userReferrals?.filter(r => {
                  const signupDate = new Date(r.signupDate);
                  const thisMonth = new Date();
                  return signupDate.getMonth() === thisMonth.getMonth() && signupDate.getFullYear() === thisMonth.getFullYear();
                }).length || 0} this month</span>
              </div>
            </div>

            <div className="glass-morphism rounded-2xl p-6 border border-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 font-inter">Active Referrals</p>
                  <p className="text-2xl font-bold text-white font-inter">{referralStats?.activeReferrals || 0}</p>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-xl">
                  <Star className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <span className="text-slate-400 font-inter">Paying subscribers</span>
              </div>
            </div>

            <div className="glass-morphism rounded-2xl p-6 border border-cyan-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 font-inter">Monthly Earnings</p>
                  <p className="text-2xl font-bold text-white font-inter">${referralStats?.monthlyEarnings || 0}</p>
                </div>
                <div className="bg-cyan-500/20 p-3 rounded-xl">
                  <DollarSign className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-green-400 font-inter">Recurring income</span>
              </div>
            </div>

            <div className="glass-morphism rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 font-inter">Total Earned</p>
                  <p className="text-2xl font-bold text-white font-inter">${referralStats?.totalEarnings || 0}</p>
                </div>
                <div className="bg-purple-500/20 p-3 rounded-xl">
                  <Crown className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <span className="text-slate-400 font-inter">All time</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Share Your Code */}
            <div className="lg:col-span-1">
              {profile?.referralCode ? (
                <div className="glass-morphism rounded-2xl p-6 border border-emerald-500/20 mb-6">
                  <h2 className="text-lg font-semibold text-white mb-4 font-inter flex items-center">
                    <Share2 className="w-5 h-5 mr-2 text-emerald-400" />
                    Share Your Code
                  </h2>
                  
                  <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                    <p className="text-xs text-slate-400 mb-2 font-inter">Your Referral Code</p>
                    <div className="flex items-center justify-between bg-slate-900/50 rounded-lg p-3">
                      <span className="text-lg font-mono font-bold text-emerald-400">
                        {profile.referralCode}
                      </span>
                      <button
                        onClick={copyReferralCode}
                        className="text-emerald-400 hover:text-emerald-300 transition-colors ml-2"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                    <p className="text-xs text-slate-400 mb-2 font-inter">Optional Referral Link</p>
                    <div className="flex items-center justify-between bg-slate-900/50 rounded-lg p-3">
                      <span className="text-sm text-slate-300 truncate font-inter">
                        xstructure.ai/signup?ref={profile.referralCode}
                      </span>
                      <button
                        onClick={copyReferralLink}
                        className="text-emerald-400 hover:text-emerald-300 transition-colors ml-2"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={copyReferralCode}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center font-inter font-semibold"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Code
                    </button>
                    
                    <button
                      onClick={copyReferralLink}
                      className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl transition-colors flex items-center justify-center font-inter font-semibold"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </button>

                    <button
                      onClick={shareViaEmail}
                      className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl transition-colors flex items-center justify-center font-inter font-semibold"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Share via Email
                    </button>
                  </div>
                </div>
              ) : (
                <div className="glass-morphism rounded-2xl p-6 border border-slate-500/20 mb-6">
                  <h2 className="text-lg font-semibold text-white mb-4 font-inter flex items-center">
                    <Gift className="w-5 h-5 mr-2 text-slate-400" />
                    Create Your Referral Code
                  </h2>
                  <p className="text-slate-400 mb-4 font-inter">
                    {canCreateCode?.reason || "Complete your first payment to create a referral code and start earning!"}
                  </p>
                  {canCreateCode?.canCreate && (
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center font-inter font-semibold"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Code
                    </button>
                  )}
                </div>
              )}

              {/* How It Works */}
              <div className="glass-morphism rounded-2xl p-6 border border-blue-500/20">
                <h3 className="text-lg font-semibold text-white mb-4 font-inter flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-blue-400" />
                  How It Works
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5">1</div>
                    <div>
                      <p className="text-white font-medium font-inter">Share Your Code</p>
                      <p className="text-slate-400 text-sm font-inter">New users must enter your referral code to sign up</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5">2</div>
                    <div>
                      <p className="text-white font-medium font-inter">They Subscribe</p>
                      <p className="text-slate-400 text-sm font-inter">Your referrals create an account and get a paid plan</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5">3</div>
                    <div>
                      <p className="text-white font-medium font-inter">You Earn $4/Month</p>
                      <p className="text-slate-400 text-sm font-inter">Get paid monthly for each active subscriber</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Referrals List */}
            <div className="lg:col-span-2">
              <div className="glass-morphism rounded-2xl border border-blue-500/20">
                <div className="p-6 border-b border-blue-500/20">
                  <h2 className="text-lg font-semibold text-white font-inter">Your Referrals</h2>
                </div>
                <div className="p-6">
                  {userReferrals && userReferrals.length > 0 ? (
                    <div className="space-y-4">
                      {userReferrals.map((referral) => (
                        <div key={referral._id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold mr-4 font-inter">
                              {referral.refereeName.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-white font-inter">{referral.refereeName}</p>
                              <p className="text-sm text-slate-400 font-inter">{referral.refereeEmail}</p>
                              <p className="text-xs text-slate-500 font-inter">
                                Joined {new Date(referral.signupDate).toLocaleDateString()}
                                {referral.firstPaymentDate && (
                                  <span> • First payment {new Date(referral.firstPaymentDate).toLocaleDateString()}</span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center mb-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium font-inter ${
                                referral.status === 'active' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : referral.status === 'pending'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}>
                                {referral.status}
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-white font-inter">
                              ${referral.totalEarnings} earned
                            </p>
                            {referral.status === 'active' && (
                              <p className="text-xs text-emerald-400 font-inter">
                                +${referral.monthlyEarnings}/month
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2 font-inter">No Referrals Yet</h3>
                      <p className="text-slate-400 font-inter">
                        {profile?.referralCode 
                          ? "Start sharing your referral code to earn commissions" 
                          : "Create your referral code first to start earning"
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReferralCodeModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  );
}
