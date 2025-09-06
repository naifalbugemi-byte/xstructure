import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2,
  Calendar,
  Filter,
  Download,
  Instagram,
  Youtube,
  Facebook,
  MessageSquare
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

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

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedMetric, setSelectedMetric] = useState('views');
  
  const analyticsData = useQuery(api.analytics.getAnalyticsData, { timeRange });
  const platformStats = useQuery(api.analytics.getPlatformStats);
  const dashboardStats = useQuery(api.analytics.getDashboardStats);

  const metrics = [
    { key: 'views', label: 'Views', icon: Eye, color: 'text-blue-400' },
    { key: 'likes', label: 'Likes', icon: Heart, color: 'text-red-400' },
    { key: 'comments', label: 'Comments', icon: MessageCircle, color: 'text-green-400' },
    { key: 'shares', label: 'Shares', icon: Share2, color: 'text-purple-400' },
  ];

  const getMetricValue = (data: any[], metric: string) => {
    return data?.reduce((sum, item) => sum + (item[metric] || 0), 0) || 0;
  };

  const getGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
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
                <BarChart3 className="w-8 h-8 mr-3 text-cyan-400" />
                Analytics Dashboard
              </h1>
              <p className="text-slate-300 mt-1 font-inter">Track your content performance across all platforms</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-slate-800/50 rounded-lg p-1">
                {[
                  { key: '7d', label: '7 Days' },
                  { key: '30d', label: '30 Days' },
                  { key: '90d', label: '90 Days' },
                ].map((range) => (
                  <button
                    key={range.key}
                    onClick={() => setTimeRange(range.key as any)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors font-inter ${
                      timeRange === range.key 
                        ? 'bg-cyan-600 text-white' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
              <button className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-2 rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center font-inter font-semibold">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric) => {
              const MetricIcon = metric.icon;
              const value = getMetricValue(analyticsData || [], metric.key);
              const previousValue = Math.floor(value * 0.85); // Mock previous period
              const growth = getGrowthRate(value, previousValue);
              
              return (
                <div key={metric.key} className="glass-morphism rounded-2xl p-6 border border-blue-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400 font-inter">{metric.label}</p>
                      <p className="text-2xl font-bold text-white font-inter">
                        {value.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-blue-500/20 p-3 rounded-xl">
                      <MetricIcon className={`w-6 h-6 ${metric.color}`} />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-green-400 font-inter">+{growth}%</span>
                    <span className="text-slate-400 ml-1 font-inter">vs last period</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Performance Chart */}
            <div className="lg:col-span-2">
              <div className="glass-morphism rounded-2xl border border-cyan-500/20">
                <div className="p-6 border-b border-cyan-500/20">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white font-inter">Performance Overview</h2>
                    <div className="flex bg-slate-800/50 rounded-lg p-1">
                      {metrics.map((metric) => (
                        <button
                          key={metric.key}
                          onClick={() => setSelectedMetric(metric.key)}
                          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors font-inter ${
                            selectedMetric === metric.key 
                              ? 'bg-cyan-600 text-white' 
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {metric.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {/* Mock Chart Area */}
                  <div className="h-64 bg-slate-800/30 rounded-xl flex items-center justify-center border border-slate-700/50">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400 font-inter">Chart visualization would go here</p>
                      <p className="text-slate-500 text-sm font-inter">Showing {selectedMetric} over {timeRange}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Breakdown */}
            <div className="space-y-6">
              <div className="glass-morphism rounded-2xl border border-emerald-500/20">
                <div className="p-6 border-b border-emerald-500/20">
                  <h3 className="text-lg font-semibold text-white font-inter">Platform Performance</h3>
                </div>
                <div className="p-6">
                  {platformStats && platformStats.length > 0 ? (
                    <div className="space-y-4">
                      {platformStats.map((platform) => {
                        const PlatformIcon = platformIcons[platform.platform as keyof typeof platformIcons];
                        return (
                          <div key={platform.platform} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 bg-gradient-to-r ${platformColors[platform.platform as keyof typeof platformColors]} rounded-lg flex items-center justify-center mr-3`}>
                                <PlatformIcon className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-white capitalize font-inter">{platform.platform}</p>
                                <p className="text-xs text-slate-400 font-inter">{platform.posts} posts</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-white font-inter">
                                {platform.views.toLocaleString()}
                              </p>
                              <div className="flex items-center text-xs">
                                <TrendingUp className="w-3 h-3 text-green-400 mr-1" />
                                <span className="text-green-400 font-inter">+{platform.growthRate}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm font-inter">No platform data available</p>
                  )}
                </div>
              </div>

              {/* Top Performing Content */}
              <div className="glass-morphism rounded-2xl border border-purple-500/20">
                <div className="p-6 border-b border-purple-500/20">
                  <h3 className="text-lg font-semibold text-white font-inter">Top Content</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {[
                      { title: "AI Marketing Tips", views: 2400, platform: "instagram" },
                      { title: "Content Strategy Guide", views: 1800, platform: "youtube" },
                      { title: "Social Media Trends", views: 1200, platform: "facebook" },
                    ].map((content, index) => {
                      const PlatformIcon = platformIcons[content.platform as keyof typeof platformIcons];
                      return (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                          <div className="flex items-center">
                            <div className={`w-6 h-6 bg-gradient-to-r ${platformColors[content.platform as keyof typeof platformColors]} rounded-md flex items-center justify-center mr-3`}>
                              <PlatformIcon className="w-3 h-3 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white font-inter">{content.title}</p>
                              <p className="text-xs text-slate-400 font-inter">{content.views.toLocaleString()} views</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
