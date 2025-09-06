"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Image,
  Video,
  BarChart3,
  Calendar,
  Store,
  Users,
  TrendingUp,
  Eye,
  Heart,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { apiFetch } from "@/lib/api";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // 🟢 1. بيانات المستخدم
        const me = await apiFetch("/api/auth/me", { method: "GET" });
        setUser(me);

        // 🟢 2. المشاريع
        const userProjects = await apiFetch("/api/projects", { method: "GET" });
        setProjects(userProjects || []);

        // 🟢 3. إحصائيات
        const stats = await apiFetch("/api/analytics/dashboard", { method: "GET" }).catch(() => null);
        setAnalytics(stats);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p>⚠️ Please log in to continue</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      <Sidebar />

      <div className="flex-1 ml-64">
        {/* ===== Header ===== */}
        <header className="bg-slate-800/50 backdrop-blur-xl border-b border-purple-500/20 px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {user.name || user.email}!
              </h1>
              <p className="text-slate-300 mt-1">
                You have {user.credits} credits remaining
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/studio/image"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <Image className="w-4 h-4 mr-2" /> Image Studio
              </Link>
              <Link
                href="/studio/video"
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <Video className="w-4 h-4 mr-2" /> Video Studio
              </Link>
            </div>
          </div>
        </header>

        {/* ===== Content ===== */}
        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Views"
              value={analytics?.totalViews || 0}
              icon={<Eye className="w-6 h-6 text-blue-600" />}
              color="bg-blue-100"
              change="+12% vs last month"
            />
            <StatCard
              title="Engagement"
              value={analytics?.totalEngagement || 0}
              icon={<Heart className="w-6 h-6 text-purple-600" />}
              color="bg-purple-100"
              change="+8% vs last month"
            />
            <StatCard
              title="Projects"
              value={projects.length}
              icon={<BarChart3 className="w-6 h-6 text-orange-600" />}
              color="bg-orange-100"
              change="Active projects"
            />
            <StatCard
              title="Credits"
              value={user.credits}
              icon={<Store className="w-6 h-6 text-green-600" />}
              color="bg-green-100"
              change="Available to use"
            />
          </div>

          {/* Projects + Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Projects */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
                <Link href="/projects" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View all
                </Link>
              </div>
              <div className="p-6">
                {projects.length > 0 ? (
                  <div className="space-y-4">
                    {projects.slice(0, 3).map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects/${project.id}`}
                        className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                          <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{project.name}</h3>
                          <p className="text-sm text-gray-600">{project.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                    <p className="text-gray-600 mb-4">Create your first project to get started</p>
                    <Link
                      href="/projects/create"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Create Project
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6 text-gray-500 text-sm">No recent activity yet</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickAction href="/studio/image" icon={<Image className="w-6 h-6 text-blue-600" />} label="Create Image" />
              <QuickAction href="/studio/video" icon={<Video className="w-6 h-6 text-purple-600" />} label="Create Video" />
              <QuickAction href="/marketplace" icon={<Store className="w-6 h-6 text-green-600" />} label="Browse Templates" />
              <QuickAction href="/team" icon={<Users className="w-6 h-6 text-orange-600" />} label="Invite Team" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, change }: any) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>{icon}</div>
      </div>
      <div className="flex items-center mt-4 text-sm text-gray-600">{change}</div>
    </div>
  );
}

function QuickAction({ href, icon, label }: any) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
    >
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">{icon}</div>
      <span className="font-medium text-gray-900">{label}</span>
    </Link>
  );
}
