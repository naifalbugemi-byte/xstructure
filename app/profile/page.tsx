"use client";

import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("/api/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white shadow rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>
        {user ? (
          <div className="space-y-4">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Credits:</strong> {user.credits}</p>
            <p><strong>Country:</strong> {user.country || "Unknown"}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
