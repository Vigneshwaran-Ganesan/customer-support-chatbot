import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateAnswer } from "./lib/openai";
import { insertMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/messages", async (_req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const body = insertMessageSchema.parse(req.body);
      const aiResponse = await generateAnswer(body.question);

      const message = await storage.createMessage({
        ...body,
        answer: aiResponse.answer,
        metadata: aiResponse.metadata
      });

      res.json(message);
    } catch (error: any) {
      const statusCode = error.status || 400;
      const errorMessage = error.message || "Failed to process message";
      res.status(statusCode).json({ error: errorMessage });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}