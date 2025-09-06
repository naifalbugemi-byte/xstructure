import React, { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function SignupForm() {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [referralValidation, setReferralValidation] = useState<{
    valid: boolean;
    error?: string;
    referrerName?: string;
  } | null>(null);

  const validateReferralCode = useQuery(
    api.referrals.validateReferralCode,
    referralCode.trim() ? { referralCode: referralCode.trim() } : "skip"
  );

  // Update validation state when query result changes
  React.useEffect(() => {
    if (validateReferralCode) {
      setReferralValidation(validateReferralCode);
    }
  }, [validateReferralCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!referralCode.trim()) {
      toast.error("Referral code required.");
      return;
    }

    if (!referralValidation?.valid) {
      toast.error(referralValidation?.error || "Invalid referral code.");
      return;
    }

    setIsLoading(true);
    try {
      await signIn("password", { 
        email, 
        password, 
        flow: "signUp",
        referralCode: referralCode.trim().toUpperCase()
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-morphism rounded-2xl p-8 border border-blue-500/20">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Referral Code Field - Required */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2 font-inter">
            Referral Code <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              className={`auth-input-field font-mono text-center ${
                referralCode.trim() && referralValidation
                  ? referralValidation.valid
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                    : 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : ''
              }`}
              placeholder="Enter referral code"
              maxLength={10}
              required
            />
            {referralCode.trim() && referralValidation && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {referralValidation.valid ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            )}
          </div>
          {referralCode.trim() && referralValidation && (
            <p className={`text-sm mt-2 font-inter ${
              referralValidation.valid ? 'text-green-400' : 'text-red-400'
            }`}>
              {referralValidation.valid 
                ? `Valid code from ${referralValidation.referrerName}` 
                : referralValidation.error
              }
            </p>
          )}
          <p className="text-xs text-slate-400 mt-1 font-inter">
            A referral code is required to create an account
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2 font-inter">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input-field"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2 font-inter">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input-field pr-12"
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !referralValidation?.valid}
          className="auth-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-slate-400 font-inter">
          Already have an account?{" "}
          <button
            onClick={() => window.location.href = "/login"}
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
