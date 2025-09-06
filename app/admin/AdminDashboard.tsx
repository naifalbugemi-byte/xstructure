import { useState } from "react";
import Sidebar from "../@/components/Sidebar";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Crown,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const user = useQuery(api.auth.loggedInUser);

  // Mock admin data
  const adminStats = {
    totalUsers: 12450,
    activeUsers: 8920,
    totalRevenue: 45680,
    monthlyRevenue: 12340,
    totalTemplates: 1250,
    pendingApprovals: 23,
  };

  const tabs = [
    { id: "overview", name: "Overview", icon: Activity },
    { id: "users", name: "Users", icon: Users },
    { id: "templates", name: "Templates", icon: Crown },
    { id: "revenue", name: "Revenue", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Crown className="w-8 h-8 mr-3 text-yellow-600" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage users, templates, and platform analytics
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-red-50 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-red-700">
                  {adminStats.pendingApprovals} pending approvals
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {adminStats.totalUsers.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500">+12%</span>
                    <span className="text-gray-600 ml-1">vs last month</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Users</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {adminStats.activeUsers.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Activity className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500">+8%</span>
                    <span className="text-gray-600 ml-1">vs last month</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${adminStats.monthlyRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <DollarSign className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500">+15%</span>
                    <span className="text-gray-600 ml-1">vs last month</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Templates</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {adminStats.totalTemplates.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-lg">
                      <Crown className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <AlertTriangle className="w-4 h-4 text-orange-500 mr-1" />
                    <span className="text-orange-500">{adminStats.pendingApprovals}</span>
                    <span className="text-gray-600 ml-1">pending approval</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {[
                    { type: "user", message: "New user registration: john@example.com", time: "2 minutes ago", status: "success" },
                    { type: "template", message: "Template submitted for approval: Modern Social Post", time: "15 minutes ago", status: "pending" },
                    { type: "payment", message: "Payment processed: $40 from user@example.com", time: "1 hour ago", status: "success" },
                    { type: "template", message: "Template approved: Business Presentation", time: "2 hours ago", status: "success" },
                    { type: "user", message: "User suspended: spam@example.com", time: "3 hours ago", status: "warning" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-500' :
                        activity.status === 'pending' ? 'bg-yellow-500' :
                        activity.status === 'warning' ? 'bg-red-500' : 'bg-gray-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-600">{activity.time}</p>
                      </div>
                      <div className="flex items-center">
                        {activity.status === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {activity.status === 'pending' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                        {activity.status === 'warning' && <XCircle className="w-4 h-4 text-red-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Other tabs would be implemented similarly */}
          {activeTab !== "overview" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {tabs.find(tab => tab.id === activeTab)?.name} Management
              </h3>
              <p className="text-gray-600">
                This section is under development. Advanced admin features coming soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
