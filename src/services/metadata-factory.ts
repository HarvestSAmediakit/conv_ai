import { GoogleGenAI } from "@google/genai";
import { db } from "../db/index.ts";
import * as schema from "../db/schema.ts";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface PublicationMetadata {
  title: string;
  category: string;
  summary: string;
  keyTopics: string[];
  entities: string[];
  suggestedAIPersonality: string;
}

import { ingestDocument } from "./ai";

export class MetadataFactory {
  /**
   * Deeply extracts metadata from a publication's raw text.
   */
  static async extractFromText(text: string): Promise<PublicationMetadata> {
    try {
      const prompt = `
        Analyze the following text from a digital magazine and extract high-level metadata for indexing.
        
        TEXT:
        ${text.substring(0, 50000)} // Analyze first 50k chars for efficiency
        
        Return exactly a JSON object with the following fields:
        "title": string,
        "category": string (e.g. Technology, Lifestyle, Agriculture, Finance),
        "summary": string (2-3 sentences),
        "keyTopics": string[],
        "entities": string[] (Brands, people, or products mentioned),
        "suggestedAIPersonality": string (A description of the tone an AI companion should have for this mag)
      `;

      const result = await genAI.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json"
        }
      });
      
      const jsonText = result.text || "{}";
      return JSON.parse(jsonText);
    } catch (err) {
      console.error("Metadata extraction failed:", err);
      return {
        title: "Untitled Publication",
        category: "General",
        summary: "Digital publication content.",
        keyTopics: [],
        entities: [],
        suggestedAIPersonality: "Helpful assistant"
      };
    }
  }

  /**
   * Processes a new document, extracts metadata, indexes for RAG, and updates the magazine record.
   */
  static async processPublication(magazineId: string, extractedText: string) {
    console.log(`[MetadataFactory] Running deep analysis and RAG ingestion for ${magazineId}...`);
    
    // 1. Extract metadata intelligence
    const metadata = await this.extractFromText(extractedText);
    
    // 2. Index for RAG (Similarity Search)
    try {
      await ingestDocument("tenant_default", magazineId, "extracted_text.txt", extractedText);
      console.log(`[MetadataFactory] RAG Ingestion successful for ${magazineId}`);
    } catch (err) {
       console.error("[MetadataFactory] RAG Ingestion failed:", err);
    }
    
    // 3. Update Magazine Metadata
    try {
      await db.update(schema.magazines)
        .set({
          aiPersonality: metadata.suggestedAIPersonality,
          aiContext: `CATEGORY: ${metadata.category}\nSUMMARY: ${metadata.summary}\nTOPICS: ${metadata.keyTopics.join(", ")}\nENTITIES: ${metadata.entities.join(", ")}`,
        })
        .where(eq(schema.magazines.id, magazineId));
      console.log(`[MetadataFactory] Deep analysis and database update completed for ${magazineId}`);
    } catch (err) {
      console.error("[MetadataFactory] Failed to update database:", err);
    }
  }
}
