import { messages, type Message, type InsertMessage } from "@shared/schema";

export interface IStorage {
  createMessage(message: InsertMessage & { answer: string, metadata: any }): Promise<Message>;
  getMessages(): Promise<Message[]>;
}

export class MemStorage implements IStorage {
  private messages: Message[];
  private currentId: number;

  constructor() {
    this.messages = [];
    this.currentId = 1;
  }

  async createMessage(message: InsertMessage & { answer: string, metadata: any }): Promise<Message> {
    const newMessage: Message = {
      id: this.currentId++,
      question: message.question,
      answer: message.answer,
      metadata: message.metadata,
      createdAt: new Date()
    };
    this.messages.push(newMessage);
    return newMessage;
  }

  async getMessages(): Promise<Message[]> {
    return this.messages;
  }
}

export const storage = new MemStorage();
