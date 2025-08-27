"use client";

export default function Button({ children, onClick, className = "", type = "button" }: any) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition ${className}`}
    >
      {children}
    </button>
  );
}
