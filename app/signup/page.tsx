"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isReferralValid, setIsReferralValid] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFirstUser, setIsFirstUser] = useState(false); // 👈 جديد

  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ تحقق إذا النظام فاضي (أول حساب)
  useEffect(() => {
    const checkFirstUser = async () => {
      try {
        const res = await fetch("/api/auth/check-first");
        const data = await res.json();
        setIsFirstUser(data.isFirstUser);
      } catch (err) {
        console.error(err);
      }
    };
    checkFirstUser();
  }, []);

  // ✅ Auto-fill referral code من الرابط
  useEffect(() => {
    const refFromUrl = searchParams.get("ref");
    if (refFromUrl) {
      setReferralCode(refFromUrl);
      validateReferral(refFromUrl);
    }
  }, [searchParams]);

  // 🔹 تحقق من الكود (فقط لو مو أول حساب)
  const validateReferral = async (code: string) => {
    if (!code || isFirstUser) return; // 👈 تجاهل للأدمن
    try {
      const res = await fetch(`/api/referrals/validate?code=${code}`);
      const data = await res.json();
      setIsReferralValid(data.valid);
    } catch (err) {
      console.error(err);
      setIsReferralValid(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFirstUser) {
      if (!referralCode || !isReferralValid) {
        alert("Please provide a valid referral code!");
        return;
      }
    }

    if (!acceptTerms) {
      setShowTermsError(true);
      return;
    } else {
      setShowTermsError(false);
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          referralCode: referralCode || null,
          email,
          password,
        }),
      });

      if (res.ok) {
        router.push("/public-pricing");
      } else {
        const error = await res.json();
        alert(error.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-4">
      <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          Join Xstructure.ai
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your full name"
            />
          </div>

          {/* Referral Code */}
          {!isFirstUser && (
            <div>
              <label className="block text-slate-300 mb-1 font-medium">
                Referral Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                onBlur={() => validateReferral(referralCode)}
                required
                readOnly={!!searchParams.get("ref")}
                className={`w-full px-4 py-3 rounded-xl bg-slate-800 border ${
                  isReferralValid === null
                    ? "border-slate-700"
                    : isReferralValid
                    ? "border-green-500"
                    : "border-red-500"
                } text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none`}
                placeholder="Enter referral code"
              />
              {isReferralValid === true && (
                <p className="text-green-400 text-sm mt-1">✅ Valid referral code</p>
              )}
              {isReferralValid === false && (
                <p className="text-red-400 text-sm mt-1">❌ Invalid referral code</p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Create a password"
            />
          </div>

          {/* Terms & Conditions */}
          <div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-slate-300 text-sm">
                I agree to the{" "}
                <a href="/terms" className="text-blue-400 hover:text-blue-300">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-blue-400 hover:text-blue-300">
                  Privacy Policy
                </a>
              </label>
            </div>
            {showTermsError && (
              <p className="text-red-400 text-sm mt-1">
                ❌ You must agree before creating an account
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
