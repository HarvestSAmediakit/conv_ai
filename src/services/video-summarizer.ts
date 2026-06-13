import { GoogleGenAI } from "@google/genai";
import { db } from "../db/index.ts";
import * as schema from "../db/schema.ts";
import { v4 as uuidv4 } from "uuid";

const genAI = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export interface VideoHighlight {
  timestamp: string;
  text: string;
}

export interface VideoSummaryResult {
  id: string;
  summary: string;
  highlights: VideoHighlight[];
}

export class VideoSummarizerService {
  static async summarizeVideo(
    tenantId: string,
    title: string,
    youtubeUrl: string,
    transcript: string
  ): Promise<VideoSummaryResult> {
    const id = uuidv4();

    const prompt = `
      You are an expert video content analyzer. 
      Analyze the following video transcript and provide a concise summary (2-3 sentences) and exactly 4 key highlights with timestamps.
      
      TITLE: ${title}
      TRANSCRIPT: ${transcript}
      
      Response Format (JSON):
      {
        "summary": "...",
        "highlights": [
          {"timestamp": "MM:SS", "text": "..."},
          ...
        ]
      }
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Extract JSON from response (handling potential markdown blocks)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response for video summary");
    }
    
    const data = JSON.parse(jsonMatch[0]);

    await db.insert(schema.videoSummaries).values({
      id,
      tenantId,
      title,
      youtubeUrl,
      transcript,
      summary: data.summary,
      highlights: JSON.stringify(data.highlights),
      status: 'completed'
    });

    return {
      id,
      summary: data.summary,
      highlights: data.highlights
    };
  }
}
