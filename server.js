import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

// Endpoint to get AQI advice
app.post("/ask-aqi", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",   // You can choose gpt-4o-mini or gpt-3.5
        messages: [
          { role: "system", content: "You are an expert environmental health advisor." },
          { role: "user", content: prompt }
        ],
        max_tokens: 300
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      const answer = data.choices[0].message?.content || "No answer returned";
      res.json({ answer, raw: data });
    } else {
      res.json({ answer: "No answer returned", raw: data });
    }

  } catch (err) {
    console.error("OpenRouter API error:", err);
    res.status(500).json({ error: "Failed to fetch LLM response from OpenRouter", details: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));