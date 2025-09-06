import { Link, useLocation } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { 
  Home, 
  FolderOpen, 
  Image, 
  Video, 
  Calendar, 
  Store, 
  BarChart3, 
  Users, 
  CreditCard,
  Settings,
  LogOut,
  Sparkles,
  Share2
} from "lucide-react";
import { SignOutButton } from "../SignOutButton";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Image Studio", href: "/studio/image", icon: Image },
  { name: "Video Studio", href: "/studio/video", icon: Video },
  { name: "Scheduling", href: "/scheduling", icon: Calendar },
  { name: "Marketplace", href: "/marketplace", icon: Store },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Credits & Plans", href: "/credits", icon: CreditCard },
  { name: "Team", href: "/team", icon: Users },
  { name: "Referrals", href: "/referrals", icon: Share2 },
];

export default function Sidebar() {
  const location = useLocation();
  const profile = useQuery(api.profiles.getCurrentProfile);

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-950/95 backdrop-blur-xl border-r border-blue-500/20">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b border-blue-500/20">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white font-inter">Xstructure.ai</span>
          </div>
        </div>

        {/* Credits Display */}
        <div className="px-6 py-4 border-b border-blue-500/20">
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg p-3 border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-inter">Credits</p>
                <p className="text-lg font-bold text-white font-inter">{profile?.credits || 0}</p>
              </div>
              <div className="text-blue-400">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <Link
              to="/credits"
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-inter"
            >
              Buy more credits →
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 font-inter ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-white border border-blue-500/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 transition-colors ${
                    isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-300"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-blue-500/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">U</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white font-inter">User</p>
                <p className="text-xs text-slate-400 font-inter">Free Plan</p>
              </div>
            </div>
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
