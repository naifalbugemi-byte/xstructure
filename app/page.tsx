"use client";
import { motion, useMotionValue, useTransform, useScroll } from "framer-motion";
import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import AIPlayground from "@/components/AIPlayground"; // 🧪 المكوّن الجديد

export default function LandingPage() {
  // 🖱️ Interactive Background
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(
    mouseY,
    [0, typeof window !== "undefined" ? window.innerHeight : 1000],
    [15, -15]
  );
  const rotateY = useTransform(
    mouseX,
    [0, typeof window !== "undefined" ? window.innerWidth : 1000],
    [-15, 15]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // 📜 Parallax Scroll
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -150]);

  return (
    <div className="relative min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* 🌌 خلفية Interactive */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-cyan-500/20 to-purple-700/30"
        style={{ rotateX, rotateY }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-3xl"
        style={{ x: rotateY, y: rotateX }}
      />

      {/* 🌟 Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-screen space-y-6 px-6">
        <motion.img
          src="/Xstructure.ai logo.png"
          alt="Xstructure Logo"
          className="w-36 h-36"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Xstructure.ai
        </motion.h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl">
          المنصة العالمية لإدارة{" "}
          <span className="font-bold text-white">
            البراند، المشاريع، والنشر التلقائي
          </span>{" "}
          بقوة الذكاء الاصطناعي.
        </p>
        <div className="flex gap-4 mt-6">
          <Button className="px-6 py-3 text-lg bg-indigo-600 hover:bg-indigo-700">
            🚀 ابدأ الآن
          </Button>
          <Button
            variant="outline"
            className="px-6 py-3 text-lg text-white border-gray-400 hover:bg-gray-800"
          >
            👀 شاهد العرض
          </Button>
        </div>
      </div>

      {/* 💡 Features مع Parallax */}
      <section ref={ref} className="relative z-10 py-20 bg-gray-950">
        <motion.h2
          className="text-3xl font-bold text-center mb-12"
          style={{ y: y1 }}
        >
          ماذا يقدم Xstructure.ai؟
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
          {[
            {
              title: "AI Branding",
              desc: "تصميم الهوية والشعارات والمحتوى الذكي تلقائياً.",
            },
            {
              title: "Projects",
              desc: "إدارة الحملات والمشاريع مع فريقك وجدولة المحتوى.",
            },
            {
              title: "Auto Publishing",
              desc: "نشر تلقائي لليوتيوب، انستجرام، فيسبوك، ثريدز.",
            },
            {
              title: "Marketplace",
              desc: "بيع وشراء القوالب والمنتجات الرقمية بالكريدتس.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              className="bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-indigo-500/50"
              whileHover={{ scale: 1.05 }}
              style={{ y: y2 }}
            >
              <h3 className="text-xl font-bold mb-3 text-indigo-400">
                {f.title}
              </h3>
              <p className="text-gray-300">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🧪 AI Playground */}
      <AIPlayground />

      {/* 💰 Pricing مع Parallax */}
      <section className="relative z-10 py-20 bg-gray-950">
        <motion.h2
          className="text-3xl font-bold text-center mb-12"
          style={{ y: y1 }}
        >
          اختر باقتك
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-6">
          {[
            {
              name: "Standard",
              price: "99 SAR / 25 USD",
              features: [
                "1000 Credits",
                "100 طلب بالدقيقة",
                "نشر 3 منصات",
              ],
            },
            {
              name: "Pro",
              price: "199 SAR / 50 USD",
              features: [
                "5000 Credits",
                "500 طلب بالدقيقة",
                "نشر غير محدود",
              ],
            },
          ].map((p, i) => (
            <motion.div
              key={i}
              className="bg-gradient-to-br from-indigo-600 to-cyan-500 text-white rounded-2xl p-8 shadow-lg"
              whileHover={{ scale: 1.05 }}
              style={{ y: y2 }}
            >
              <h3 className="text-2xl font-bold mb-4">{p.name}</h3>
              <p className="text-4xl font-extrabold mb-6">{p.price}</p>
              <ul className="space-y-2 mb-6">
                {p.features.map((f, i2) => (
                  <li key={i2}>✅ {f}</li>
                ))}
              </ul>
              <Button className="w-full bg-white text-indigo-600 hover:bg-gray-200">
                اشترك الآن
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 📍 Footer */}
      <footer className="relative z-10 py-10 text-center text-gray-400 border-t border-gray-800">
        <p>© 2025 Xstructure.ai - جميع الحقوق محفوظة</p>
        <div className="flex gap-4 justify-center mt-3">
          <a href="/privacy">الخصوصية</a>
          <a href="/terms">الشروط</a>
          <a href="/contact">تواصل معنا</a>
        </div>
      </footer>
    </div>
  );
}
