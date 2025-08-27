"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function ProjectDetails({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/projects/${params.id}`).then(r => r.json()).then(setProject);
  }, [params.id]);

  if (!project) return <p>جاري التحميل...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{project.name}</h1>
      <p>{project.desc}</p>

      {/* Timeline */}
      <div>
        <h2 className="text-xl font-semibold mb-2">الجدولة</h2>
        <div className="space-y-3">
          {project.schedules.map((s: any, i: number) => (
            <motion.div
              key={i}
              className={`p-4 rounded-lg shadow ${s.status === "scheduled" ? "bg-blue-100" :
                s.status === "pending" ? "bg-yellow-100" :
                s.status === "published" ? "bg-green-100" : "bg-red-100"}`}
              whileHover={{ scale: 1.02 }}
            >
              <p>{s.content}</p>
              <small>{s.platform} • {new Date(s.date).toLocaleString()}</small>
              <p>الحالة: {s.status}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-2">الإحصائيات</h2>
        <BarChart width={500} height={250} data={project.stats}>
          <XAxis dataKey="platform" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="views" fill="#6366F1" />
          <Bar dataKey="likes" fill="#10B981" />
        </BarChart>
      </div>

      {/* Team */}
      <div>
        <h2 className="text-xl font-semibold mb-2">الفريق</h2>
        <ul>
          {project.members.map((m: any, i: number) => (
            <li key={i} className="flex items-center gap-2 p-2 border-b">
              <span className="font-bold">{m.user.email}</span>
              <span className="text-sm text-gray-500">({m.role})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
