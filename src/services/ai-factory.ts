import { GoogleGenAI } from "@google/genai";
import { db } from "../db/index.ts";
import * as schema from "../db/schema.ts";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export class AIFactoryService {
  /**
   * Transforms a Magazine into a complete Digital Ecosystem
   * Generated: Interactive Website, Podcast Scripts, SEO Packs, and Social Media content
   */
  static async generateEcosystem(magazineId: string, tenantId: string) {
    const [magazine] = await db.select().from(schema.magazines).where(eq(schema.magazines.id, magazineId));
    if (!magazine) throw new Error("Magazine not found");

    const context = magazine.aiContext || "Specialized content regarding publishing.";
    const title = magazine.title;

    try {
      const prompt = `
        You are ConvoMag AI Content Studio. Generate a complete digital marketing ecosystem and content pack for the magazine: "${title}".
        
        Context: ${context.substring(0, 8000)}

        Return a JSON object with:
        1. website_headline: A punchy marketing headline.
        2. website_subheadline: A descriptive subheadline.
        3. podcast_script: A 3-minute introductory podcast script.
        4. blog_post: A 500-word SEO-optimized blog post summarizing the main value proposition.
        5. email_newsletter: A structured email newsletter for subscribers.
        6. seo_keywords: An array of 12 high-value keywords.
        7. meta_description: A 160-char meta description.
        8. social_posts: An array of 5 posts (LinkedIn, X, Instagram, Facebook, Meta).
        9. ad_copy: A set of 3 headlines and descriptions for paid search/social ads.
      `;

      const result = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
      });
      const outputRaw = result.text || "";
      
      // Basic JSON extraction
      const jsonMatch = outputRaw.match(/\{[\s\S]*\}/);
      const data = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

      if (!data) throw new Error("Failed to parse AI output");

      // Save to Ecosystem table
      const ecoId = magazineId; 
      const now = new Date();

      await db.insert(schema.generatedEcosystems)
        .values({
          id: ecoId,
          magazineId,
          tenantId,
          websiteStatus: 'active',
          websiteUrl: `/eco/${magazine.slug}`,
          podcastStatus: 'ready',
          socialPackJson: JSON.stringify({ 
            social: data.social_posts, 
            blog: data.blog_post, 
            email: data.email_newsletter,
            ads: data.ad_copy
          }),
          seoPackJson: JSON.stringify({ 
            keywords: data.seo_keywords, 
            meta: data.meta_description, 
            headline: data.website_headline, 
            sub: data.website_subheadline 
          }),
          lastGeneratedAt: now,
        })
        .onConflictDoUpdate({
          target: schema.generatedEcosystems.id,
          set: {
            websiteStatus: 'active',
            socialPackJson: JSON.stringify({ 
              social: data.social_posts, 
              blog: data.blog_post, 
              email: data.email_newsletter,
              ads: data.ad_copy
            }),
            seoPackJson: JSON.stringify({ 
              keywords: data.seo_keywords, 
              meta: data.meta_description, 
              headline: data.website_headline, 
              sub: data.website_subheadline 
            }),
            lastGeneratedAt: now,
          }
        });

      return { id: ecoId, status: 'success', data };
    } catch (err) {
      console.error("AI Factory Error:", err);
      throw err;
    }
  }
}
