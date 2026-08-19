import { createFileRoute } from "@tanstack/react-router";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "node:fs/promises";
import * as path from "node:path";

export const Route = createFileRoute("/api/public/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { message, history } = body;

          // Read the Gemini API Key from settings.json
          const settingsPath = path.join(process.cwd(), "src/data/settings.json");
          const settingsData = await fs.readFile(settingsPath, "utf-8");
          const settings = JSON.parse(settingsData);
          const apiKey = settings.geminiApiKey || process.env.GEMINI_API_KEY;

          if (!apiKey) {
            return new Response(
              JSON.stringify({
                reply: "The store owner hasn't configured the AI Chatbot yet. Please click 'Talk to a human' to chat with us on WhatsApp!",
              }),
              { headers: { "Content-Type": "application/json" } }
            );
          }

          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({
            model: "gemini-3.5-flash",
            systemInstruction: `You are a helpful customer support assistant for Narayan Collection, a premium men's fashion store selling shirts, tees, jeans, baggy wear, and ethnic wear. 
            Keep your answers concise, friendly, and helpful. 
            - We offer Cash on Delivery (COD) across India.
            - Shipping takes 3-5 business days.
            - We have a 7-day return policy.
            - If the user asks something you don't know, or wants to talk to a human, gently tell them to click the 'Talk to a human' button below.`,
          });

          // Convert history to Gemini format
          const formattedHistory = (history || []).map((msg: any) => ({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }],
          }));

          const chat = model.startChat({
            history: formattedHistory,
          });

          const result = await chat.sendMessage(message);
          const reply = result.response.text();

          return new Response(JSON.stringify({ reply }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Chat API error:", error);
          return new Response(
            JSON.stringify({
              reply: "I'm having a little trouble thinking right now. Please click 'Talk to a human' to reach us on WhatsApp!",
            }),
            { headers: { "Content-Type": "application/json" }, status: 500 }
          );
        }
      },
    },
  },
});
