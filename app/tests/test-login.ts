import fetch from "node-fetch";

async function main() {
  const res = await fetch("http://localhost:4000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "test@demo.com", password: "123456" }),
  });

  console.log("Login response:", await res.json());
}

main();
