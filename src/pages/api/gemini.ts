// /pages/api/gemini.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { askGemini } from "@/utils/gemini"; // Adjust the import if needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    console.log("Prompt received:", prompt);
    const response = await askGemini(prompt);
    console.log("Gemini Response:", response);
    return res.status(200).json({ response });
  } catch (err) {
    console.error("Gemini Error:", err);
    return res.status(500).json({ error: "Failed to get response from gemini" }); 
  }
}  