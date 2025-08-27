import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-5xl mx-auto flex justify-between items-center p-4">
        <Link href="/" className="font-bold text-lg">Xstructure</Link>
        <div className="space-x-4">
          <Link href="/signup" className="hover:text-blue-600">تسجيل</Link>
          <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
        </div>
      </div>
    </nav>
  );
}
