"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/projects/list").then(r => r.json()).then(setProjects);
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {projects.map((p, i) => (
        <motion.div
          key={i}
          className="relative w-full h-48 cursor-pointer [perspective:1000px]"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            className="absolute w-full h-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-white rounded-2xl shadow-lg [transform-style:preserve-3d]"
            whileHover={{ rotateY: 180 }}
            transition={{ duration: 0.6 }}
          >
            {/* Front */}
            <div className="absolute w-full h-full flex flex-col justify-center items-center p-4 [backface-visibility:hidden]">
              <h2 className="text-xl font-bold">{p.name}</h2>
              <p>{p.desc}</p>
            </div>
            {/* Back */}
            <div className="absolute w-full h-full flex flex-col justify-center items-center p-4 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white text-gray-800 rounded-2xl">
              <p>📅 {p.schedulesCount} بوست مجدول</p>
              <a href={`/projects/${p.id}`} className="bg-indigo-600 text-white mt-3 px-4 py-2 rounded-lg">دخول المشروع</a>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
