import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

async function testHF() {
  try {
    const prompt = "Hello world!";

    const response = await fetch("https://router.huggingface.co/models/google/flan-t5-small", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 20 }
      })
    });

    const text = await response.text();
    console.log("Raw response:", text);

  } catch (err) {
    console.error("HF error:", err);
  }
}

testHF();