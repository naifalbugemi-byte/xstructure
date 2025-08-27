import fetch from "node-fetch";

async function main() {
  const res = await fetch("http://localhost:4000/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "test@demo.com", name: "Tester", password: "123456" }),
  });

  console.log("Register response:", await res.json());
}

main();
