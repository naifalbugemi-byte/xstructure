import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { X, Gift, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface ReferralCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReferralCodeModal({ isOpen, onClose }: ReferralCodeModalProps) {
  const [referralCode, setReferralCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const canCreateCode = useQuery(api.referrals.canCreateReferralCode);
  const createReferralCode = useMutation(api.referrals.createReferralCode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralCode.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await createReferralCode({ referralCode: referralCode.trim() });
      if (result.success) {
        toast.success(`Referral code "${result.referralCode}" created successfully!`);
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create referral code");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Don't show modal if user can't create code
  if (!canCreateCode?.canCreate) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-morphism rounded-2xl p-8 w-full max-w-md mx-4 border border-emerald-500/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-3">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white font-inter">Create Referral Code</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-4 mb-4">
            <div className="flex items-center mb-2">
              <Sparkles className="w-5 h-5 text-emerald-400 mr-2" />
              <span className="text-emerald-400 font-semibold font-inter">Congratulations!</span>
            </div>
            <p className="text-slate-300 text-sm font-inter">
              You can now create your unique referral code and start earning $4/month for every active referral!
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2 font-inter">
              Your Referral Code
            </label>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none transition-all text-white placeholder-slate-400 font-inter font-mono text-lg text-center"
              placeholder="MYCODE123"
              maxLength={10}
              pattern="[A-Z0-9]{1,10}"
              required
            />
            <p className="text-xs text-slate-400 mt-2 font-inter">
              1-10 English letters and numbers only. This code is permanent and cannot be changed.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 text-white py-3 rounded-xl font-semibold hover:bg-slate-600 transition-colors font-inter"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!referralCode.trim() || isSubmitting}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all font-inter disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
