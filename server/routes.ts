import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateAnswer } from "./lib/openai";
import { insertMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/messages", async (_req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
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
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
