"use client";

export default function Card({ title, children, className = "" }: any) {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow ${className}`}>
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      {children}
    </div>
  );
}
