import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  Plus, 
  Instagram, 
  Youtube, 
  Facebook,
  MessageSquare,
  Eye,
  Heart,
  Share2,
  MoreVertical,
  Edit,
  Trash2
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";

const platformIcons = {
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  threads: MessageSquare,
};

const platformColors = {
  instagram: "from-pink-500 to-purple-600",
  youtube: "from-red-500 to-red-600",
  facebook: "from-blue-500 to-blue-600",
  threads: "from-gray-700 to-gray-800",
};

export default function Scheduling() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  
  const scheduledPosts = useQuery(api.posts.getRecentPosts);
  const recentPosts = useQuery(api.posts.getRecentPosts);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-400 bg-blue-500/20';
      case 'published': return 'text-green-400 bg-green-500/20';
      case 'failed': return 'text-red-400 bg-red-500/20';
      case 'pending_approval': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
                <Calendar className="w-8 h-8 mr-3 text-blue-400" />
                Content Scheduling
              </h1>
              <p className="text-slate-300 mt-1 font-inter">Manage your automated posting schedule</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-slate-800/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors font-inter ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  List View
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors font-inter ${
                    viewMode === 'calendar' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Calendar
                </button>
              </div>
              <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center font-inter font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Post
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="glass-morphism rounded-2xl p-6 border border-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 font-inter">Scheduled Posts</p>
                  <p className="text-2xl font-bold text-white font-inter">
                    {scheduledPosts?.length || 0}
                  </p>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="glass-morphism rounded-2xl p-6 border border-cyan-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 font-inter">This Week</p>
                  <p className="text-2xl font-bold text-white font-inter">12</p>
                </div>
                <div className="bg-cyan-500/20 p-3 rounded-xl">
                  <Calendar className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
            </div>

            <div className="glass-morphism rounded-2xl p-6 border border-emerald-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 font-inter">Published Today</p>
                  <p className="text-2xl font-bold text-white font-inter">3</p>
                </div>
                <div className="bg-emerald-500/20 p-3 rounded-xl">
                  <Eye className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="glass-morphism rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 font-inter">Avg. Engagement</p>
                  <p className="text-2xl font-bold text-white font-inter">4.2%</p>
                </div>
                <div className="bg-purple-500/20 p-3 rounded-xl">
                  <Heart className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Scheduled Posts */}
            <div className="lg:col-span-2">
              <div className="glass-morphism rounded-2xl border border-blue-500/20">
                <div className="p-6 border-b border-blue-500/20">
                  <h2 className="text-lg font-semibold text-white font-inter">Upcoming Posts</h2>
                </div>
                <div className="p-6">
                  {scheduledPosts && scheduledPosts.length > 0 ? (
                    <div className="space-y-4">
                      {scheduledPosts.slice(0, 8).map((post) => {
                        const PlatformIcon = platformIcons[post.platform as keyof typeof platformIcons];
                        return (
                          <div key={post._id} className="flex items-center p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-blue-500/30 transition-all">
                            <div className={`w-10 h-10 bg-gradient-to-r ${platformColors[post.platform as keyof typeof platformColors]} rounded-lg flex items-center justify-center mr-4`}>
                              <PlatformIcon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-medium text-white font-inter capitalize">{post.platform}</p>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)} font-inter`}>
                                  {post.status}
                                </span>
                              </div>
                              <p className="text-sm text-slate-300 font-inter truncate">{post.content.caption}</p>
                              <p className="text-xs text-slate-400 mt-1 font-inter">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {formatDate(post.scheduledFor)}
                              </p>
                            </div>
                            <button className="text-slate-400 hover:text-white transition-colors ml-4">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2 font-inter">No Scheduled Posts</h3>
                      <p className="text-slate-400 font-inter">Schedule your first post to get started</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="space-y-6">
              {/* Quick Schedule */}
              <div className="glass-morphism rounded-2xl p-6 border border-cyan-500/20">
                <h3 className="text-lg font-semibold text-white mb-4 font-inter">Quick Schedule</h3>
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-xl hover:shadow-lg transition-all flex items-center font-inter">
                    <Instagram className="w-5 h-5 mr-3" />
                    Schedule for Instagram
                  </button>
                  <button className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-xl hover:shadow-lg transition-all flex items-center font-inter">
                    <Youtube className="w-5 h-5 mr-3" />
                    Schedule for YouTube
                  </button>
                  <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-xl hover:shadow-lg transition-all flex items-center font-inter">
                    <Facebook className="w-5 h-5 mr-3" />
                    Schedule for Facebook
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="glass-morphism rounded-2xl border border-emerald-500/20">
                <div className="p-6 border-b border-emerald-500/20">
                  <h3 className="text-lg font-semibold text-white font-inter">Recent Activity</h3>
                </div>
                <div className="p-6">
                  {recentPosts && recentPosts.length > 0 ? (
                    <div className="space-y-3">
                      {recentPosts?.slice(0, 5).map((post: any) => (
                        <div key={post._id} className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            post.status === 'published' ? 'bg-green-400' :
                            post.status === 'scheduled' ? 'bg-blue-400' :
                            post.status === 'failed' ? 'bg-red-400' : 'bg-yellow-400'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm text-white font-inter">
                              {post.status === 'published' ? 'Published' : 
                               post.status === 'scheduled' ? 'Scheduled' :
                               post.status === 'failed' ? 'Failed' : 'Pending'} on {post.platform}
                            </p>
                            <p className="text-xs text-slate-400 font-inter">
                              {new Date(post._creationTime).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm font-inter">No recent activity</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
