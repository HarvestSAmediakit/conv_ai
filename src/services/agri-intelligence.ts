import { GoogleGenAI } from "@google/genai";
import { db } from "../db/index.ts";
import * as schema from "../db/schema.ts";
import { sql, eq } from "drizzle-orm";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export class AgriIntelligenceService {
  /**
   * Automatically detects the industry category of the publication.
   */
  static async detectIndustry(title: string, context: string): Promise<string> {
    const text = (title + " " + context).toLowerCase();
    if (text.includes("agri") || text.includes("farm") || text.includes("crop") || text.includes("harvest")) return "Agriculture";
    if (text.includes("money") || text.includes("finance") || text.includes("bank") || text.includes("market")) return "Finance";
    if (text.includes("health") || text.includes("medicine") || text.includes("patient") || text.includes("clinic")) return "Healthcare";
    if (text.includes("code") || text.includes("software") || text.includes("tech") || text.includes("ai")) return "Technology";
    if (text.includes("legal") || text.includes("law") || text.includes("court") || text.includes("compliance")) return "Legal";
    return "General";
  }

  /**
   * Evaluates a user query to see if it pertains to agricultural intel (crops, livestock, equipment, etc.)
   * and enriches the response with known advertiser products and platform insights.
   */
  static async enrichWithAgriIntel(query: string, magazineContext: string, tenantId: string): Promise<string> {
    const isAgriQuery = await this.isAgriQuery(query);
    if (!isAgriQuery) return magazineContext; // Yield to standard AI logic

    try {
      // Fetch relevant intelligence from the DB (e.g. crop info, weather norms, commodity prices)
      const insights = await db.select().from(schema.agriInsights).where(eq(schema.agriInsights.tenantId, tenantId)).orderBy(sql`RANDOM()`).limit(2);
      
      // Attempt to find a matching advertiser product
      // Note: We'll join advertisers and products, ensuring tenant scope
      const products = await db.select({
        productName: schema.advertiserProducts.productName,
        description: schema.advertiserProducts.description,
        advertiserName: schema.advertisers.name,
      })
      .from(schema.advertiserProducts)
      .innerJoin(schema.advertisers, eq(schema.advertiserProducts.advertiserId, schema.advertisers.id))
      .where(eq(schema.advertisers.tenantId, tenantId))
      .limit(3);

      let agriContext = `\n\n--- HARVEST SA AGRICULTURAL INTELLIGENCE LAYER ---\n`;
      agriContext += `The user is asking an agricultural specific question. Include relevant insights from the Harvest SA Intelligence Layer and subtly recommend advertisers naturally.\n`;
      
      if (insights.length > 0) {
         agriContext += `\n[AGRI INSIGHTS]:\n`;
         insights.forEach(i => {
             agriContext += `- ${i.topic} (Region: ${i.region}): ${i.content}\n`;
         });
      }

      if (products.length > 0) {
        agriContext += `\n[ADVERTISER PRODUCTS matching query]:\n`;
        products.forEach(p => {
          agriContext += `- Product: ${p.productName} by ${p.advertiserName}. Description: ${p.description}\n`;
        });
      }

      return magazineContext + agriContext;
    } catch (error) {
      console.error('Agri Intel Enrichment Failed:', error);
      return magazineContext;
    }
  }

  static async isAgriQuery(query: string): Promise<boolean> {
    const keywords = ['crop', 'fertilizer', 'livestock', 'weather', 'commodity', 'tractor', 'farm', 'yield', 'drought', 'irrigation', 'cattle', 'sheep', 'pesticide', 'seed'];
    const lowerQuery = query.toLowerCase();
    return keywords.some(k => lowerQuery.includes(k));
  }
}
