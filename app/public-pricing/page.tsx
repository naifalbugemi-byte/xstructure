"use client";

import { Check, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

const publicPlans = [
  {
    name: "Creators Pro",
    price: "$49",
    credits: "150 credits / month",
    features: [
      "AI Image Studio (image generation, background removal, upscaling)",
      "AI Video Ads (short ads & promo videos)",
      "Template Library (customizable image & video templates)",
      "Smart Automated Publishing & Scheduling",
      "AI Content Agent (trends, captions, hashtags, posting plan)",
      "Brand Management Tools (logos, fonts, colors)",
      "Advanced Analytics (views, CTR, engagement tracking)",
      "Referral System Access ($4/month per referral)",
      "Team Collaboration (up to 5 members)",
      "Template Marketplace Access",
    ],
    popular: true,
    buttonText: "Get Started",
    buttonLink: "/signup",
  },
  {
    name: "Business",
    price: "Custom",
    credits: "Contact Sales",
    features: [
      "Unlimited projects & advanced AI features",
      "Custom branding & enterprise support",
      "Team management at scale",
      "Enterprise analytics & reporting",
      "Flexible credit packages",
    ],
    popular: false,
    buttonText: "Contact Sales",
    buttonLink: "/contact",
  },
];

export default function PublicPricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 py-20 px-4">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-bold text-white mb-6 font-inter">
          Flexible Plans for{" "}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Every Creator
          </span>
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto font-inter">
          Choose a plan that fits your needs. Start with Pro or contact us for
          Business solutions tailored to your team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {publicPlans.map((plan, idx) => (
          <div
            key={idx}
            className={`relative glass-morphism rounded-2xl border p-10 transition-all duration-300 hover:scale-105 ${
              plan.popular
                ? "border-blue-500/50 ring-2 ring-blue-500/20"
                : "border-slate-700/50"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center shadow-md">
                  <Star className="w-4 h-4 mr-1" />
                  Most Popular
                </div>
              </div>
            )}

            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-4 font-inter">
                {plan.name}
              </h3>
              <div className="flex items-center justify-center mb-2">
                <span className="text-5xl font-bold text-white font-inter">
                  {plan.price}
                </span>
                {plan.price !== "Custom" && (
                  <span className="text-slate-400 ml-2">/month</span>
                )}
              </div>
              <p className="text-blue-400 font-semibold font-inter">
                {plan.credits}
              </p>
            </div>

            <ul className="space-y-4 mb-8 text-left">
              {plan.features.map((f, i) => (
                <li
                  key={i}
                  className="flex items-center text-slate-300 font-inter"
                >
                  <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href={plan.buttonLink}
              className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center font-inter ${
                plan.popular
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-blue-500/25"
                  : "bg-slate-800 text-white hover:bg-slate-700"
              }`}
            >
              {plan.buttonText}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
