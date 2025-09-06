import { Link } from "react-router-dom";
import { 
  Sparkles, 
  Image, 
  Video, 
  Calendar, 
  BarChart3, 
  Users, 
  Zap, 
  Check, 
  Star,
  ArrowRight,
  Palette,
  Store,
  Wand2,
  Filter,
  Layers,
  Crop,
  Type,
  Music,
  Target,
  Scissors,
  PaintBucket,
  Sparkles as Magic,
  Brush,
  Eye,
  Sliders,
  Grid,
  Move,
  RotateCw,
  Volume2,
  Play,
  Download,
  Share2
} from "lucide-react";

const features = [
  {
    icon: Image,
    title: "AI Image Studio",
    description: "Upload product images and blend them with professional templates. Auto-apply brand colors, logos, and typography.",
    cost: "1 credit per image",
    enhanced: [
      "AI upscaling & enhancement",
      "Background removal & replacement", 
      "Style transfer & artistic filters",
      "Smart cropping & resizing",
      "Noise reduction & sharpening",
      "Photo restoration & colorization",
      "Brand asset integration",
      "Layer-based editing"
    ]
  },
  {
    icon: Video,
    title: "AI Video Studio", 
    description: "Generate promotional videos from templates, edit with AI, and merge multiple clips into high-quality exports.",
    cost: "5 credits per video",
    enhanced: [
      "AI video generation from text",
      "Auto video stabilization",
      "Smart slow-motion creation",
      "Background removal for videos",
      "AI color grading & enhancement",
      "Audio sync & noise reduction",
      "Multi-track timeline editing",
      "Professional transitions & effects"
    ]
  },
  {
    icon: Palette,
    title: "AI Branding",
    description: "Ingest brand assets and automatically apply them to all templates for consistent brand identity.",
    popular: true
  },
  {
    icon: Wand2,
    title: "AI Suggestions",
    description: "Get smart recommendations for hashtags, captions, and optimal posting times for each platform.",
    badge: "Smart"
  },
  {
    icon: Store,
    title: "Template Marketplace",
    description: "Buy and sell AI-ready templates using credits. Sellers can withdraw earnings seamlessly.",
    badge: "Monetize"
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Schedule posts across all platforms with AI-recommended peak times for maximum engagement.",
    badge: "Automation"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track performance with detailed insights across projects and integrations.",
    badge: "Insights"
  },
  {
    icon: Users,
    title: "Project Management",
    description: "Organize all your content, analytics, and assets in beautifully designed project workspaces.",
    badge: "Organization"
  }
];

const plans = [
  {
    name: "Creators Pro",
    price: "$49",
    period: "/month",
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
    buttonText: "Get Started",
    buttonLink: "/signup"
  },
  {
    name: "Business",
    price: null,
    period: null,
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
    buttonText: "Contact Sales",
    buttonLink: "/contact"
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white font-inter">Xstructure.ai</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-slate-300 hover:text-white transition-colors font-inter"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 font-inter font-semibold"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-inter">
              Create Content with
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> AI Power</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto font-inter">
              Generate stunning images and videos, schedule posts across platforms, and grow your brand with our AI-powered content creation suite.
            </p>
            
            {/* Credit Information */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-slate-300 mb-12">
              <div className="flex items-center bg-slate-800/50 rounded-lg px-4 py-2">
                <Image className="w-5 h-5 mr-2 text-blue-400" />
                <span className="font-inter">Images: 1 credit each</span>
              </div>
              <div className="flex items-center bg-slate-800/50 rounded-lg px-4 py-2">
                <Video className="w-5 h-5 mr-2 text-purple-400" />
                <span className="font-inter">Videos: 5 credits each</span>
              </div>
            </div>

            {/* Enhanced Studio Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
              {/* Image Studio Preview */}
              <div className="glass-morphism rounded-2xl p-6 border border-blue-500/20">
                <div className="flex items-center mb-4">
                  <Image className="w-6 h-6 text-blue-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white font-inter">Enhanced Image Studio</h3>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <Wand2 className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                    <span className="text-xs text-slate-300">AI Enhance</span>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <Scissors className="w-4 h-4 text-green-400 mx-auto mb-1" />
                    <span className="text-xs text-slate-300">Remove BG</span>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <Brush className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                    <span className="text-xs text-slate-300">Style Transfer</span>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <Zap className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                    <span className="text-xs text-slate-300">Upscale 4x</span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm font-inter">Professional image editing with AI-powered tools</p>
              </div>

              {/* Video Studio Preview */}
              <div className="glass-morphism rounded-2xl p-6 border border-purple-500/20">
                <div className="flex items-center mb-4">
                  <Video className="w-6 h-6 text-purple-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white font-inter">Enhanced Video Studio</h3>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <Target className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                    <span className="text-xs text-slate-300">Stabilize</span>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <Filter className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                    <span className="text-xs text-slate-300">AI Color</span>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <Music className="w-4 h-4 text-green-400 mx-auto mb-1" />
                    <span className="text-xs text-slate-300">Audio Sync</span>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <Layers className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                    <span className="text-xs text-slate-300">Multi-Track</span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm font-inter">Advanced video editing with AI enhancements</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 font-inter">Everything You Need</h2>
            <p className="text-xl text-slate-300 font-inter">Powerful tools to create, schedule, and analyze your content</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="glass-morphism rounded-2xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group">
                <div className="flex items-start justify-between mb-6">
                  <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl p-4 w-fit group-hover:scale-110 transition-transform">
                    <feature.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  {feature.popular && (
                    <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      POPULAR
                    </span>
                  )}
                  {feature.badge && (
                    <span className="bg-slate-800 text-slate-300 text-xs font-semibold px-3 py-1 rounded-full">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 font-inter">{feature.title}</h3>
                <p className="text-slate-300 mb-4 font-inter">{feature.description}</p>
                {feature.cost && (
                  <p className="text-sm text-blue-400 font-semibold font-inter mb-4">{feature.cost}</p>
                )}
                {feature.enhanced && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-200 font-inter">Enhanced Features:</p>
                    <div className="grid grid-cols-2 gap-1">
                      {feature.enhanced.map((item, idx) => (
                        <div key={idx} className="flex items-center text-xs text-slate-400">
                          <Check className="w-3 h-3 text-green-400 mr-1 flex-shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 font-inter">Choose Your Plan</h2>
            <p className="text-xl text-slate-300 font-inter">Professional tools for creators and businesses</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <div key={index} className={`glass-morphism rounded-2xl p-8 border transition-all duration-300 hover:scale-105 ${
                plan.popular ? 'border-blue-500/50 ring-2 ring-blue-500/20' : 'border-slate-700/50'
              }`}>
                {plan.popular && (
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6 text-center">
                    MOST POPULAR
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2 font-inter">{plan.name}</h3>
                  {plan.price ? (
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-5xl font-bold text-white font-inter">{plan.price}</span>
                      <span className="text-slate-400 ml-2 font-inter">{plan.period}</span>
                    </div>
                  ) : (
                    <div className="mb-2">
                      <span className="text-3xl font-bold text-white font-inter">By Request</span>
                    </div>
                  )}
                  <p className="text-blue-400 font-semibold font-inter">{plan.credits}</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-slate-300 font-inter">
                      <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.buttonLink}
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center font-inter ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
                      : 'bg-slate-800 text-white hover:bg-slate-700'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-morphism rounded-3xl p-12 border border-blue-500/20">
            <h2 className="text-4xl font-bold text-white mb-6 font-inter">
              Ready to Transform Your Content?
            </h2>
            <p className="text-xl text-slate-300 mb-8 font-inter">
              Join thousands of creators using AI to build their brands and grow their audience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center font-inter font-semibold text-lg"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/pricing"
                className="bg-slate-800 text-white px-8 py-4 rounded-xl hover:bg-slate-700 transition-all duration-300 flex items-center justify-center font-inter font-semibold text-lg"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-500/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white font-inter">Xstructure.ai</span>
            </div>
            <div className="flex space-x-6 text-slate-400">
              <a href="#" className="hover:text-white transition-colors font-inter">Privacy</a>
              <a href="#" className="hover:text-white transition-colors font-inter">Terms</a>
              <a href="#" className="hover:text-white transition-colors font-inter">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-400 font-inter">
            <p>&copy; 2024 Xstructure.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
