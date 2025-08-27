import fetch from "node-fetch";

async function testRegister() {
  const res = await fetch("http://localhost:5000/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "care@xstructure.ai", name: "Naif" })
  });
  console.log("Register response:", await res.json());
}

async function testReset() {
  const res = await fetch("http://localhost:5000/api/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "care@xstructure.ai", name: "Naif" })
  });
  console.log("Reset response:", await res.json());
}

testRegister();
testReset();
