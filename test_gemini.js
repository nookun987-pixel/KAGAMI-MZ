require("dotenv").config();
const fs = require("fs");

async function main() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY / GOOGLE_API_KEY");
    process.exit(1);
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: 'Return strict JSON only: {"status":"OK","message":"Gemini reachable"}'
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0,
      responseMimeType: "application/json"
    }
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey
    },
    body: JSON.stringify(payload)
  });

  const raw = await res.text();
  fs.writeFileSync("gemini_test_result.json", raw, "utf8");

  console.log("HTTP", res.status);
  console.log(raw);

  if (!res.ok) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});