"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Project {
  id: string;
  name: string;
  desc?: string;
  schedules: {
    content: string;
    platform: string;
    date: string;
    status: string;
  }[];
  stats: {
    platform: string;
    views: number;
    likes: number;
  }[];
  members: {
    user: { email: string };
    role: string;
  }[];
}

export default function ProjectDetails({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${params.id}`);
        if (!res.ok) throw new Error("فشل تحميل المشروع");
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  if (loading) return <div className="p-6">⏳ جاري التحميل...</div>;
  if (!project) return <div className="p-6 text-red-600">❌ المشروع غير موجود</div>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* عنوان المشروع */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold text-purple-700">{project.name}</h1>
        {project.desc && <p className="mt-2 text-gray-600">{project.desc}</p>}
      </div>

      {/* الجدولة */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">📅 الجدولة</h2>
        <div className="space-y-3">
          {project.schedules && project.schedules.length > 0 ? (
            project.schedules.map((s, i) => (
              <motion.div
                key={i}
                className={`p-4 rounded-lg shadow border 
                  ${s.status === "scheduled"
                    ? "bg-blue-100 border-blue-300"
                    : s.status === "pending"
                    ? "bg-yellow-100 border-yellow-300"
                    : s.status === "published"
                    ? "bg-green-100 border-green-300"
                    : "bg-red-100 border-red-300"
                  }`}
                whileHover={{ scale: 1.02 }}
              >
                <p className="font-medium">{s.content}</p>
                <small className="text-gray-600">
                  {s.platform} • {new Date(s.date).toLocaleString("ar-SA")}
                </small>
                <p className="text-sm mt-1">الحالة: {s.status}</p>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500">لا توجد مهام مجدولة</p>
          )}
        </div>
      </div>

      {/* الإحصائيات */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">📊 الإحصائيات</h2>
        {project.stats && project.stats.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={project.stats}>
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#6366F1" name="المشاهدات" />
              <Bar dataKey="likes" fill="#10B981" name="الإعجابات" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">لا توجد بيانات إحصائية بعد</p>
        )}
      </div>

      {/* الفريق */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">👥 الفريق</h2>
        {project.members && project.members.length > 0 ? (
          <ul className="divide-y">
            {project.members.map((m, i) => (
              <li key={i} className="flex items-center gap-3 py-2">
                <span className="font-bold">{m.user.email}</span>
                <span className="text-sm text-gray-500">({m.role})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">لا يوجد أعضاء مسجلين في هذا المشروع</p>
        )}
      </div>
    </div>
  );
}
