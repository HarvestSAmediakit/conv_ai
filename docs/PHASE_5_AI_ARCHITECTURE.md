# CONVOMAG AI™: Phase 5 - Complete AI & RAG Architecture

## 1. AI Architecture Overview
ConvoMag AI uses a multi-model, routing-based architecture to optimize for capability, cost, and latency. The core AI engine powers the Conversational Chat, Voice Barge-in, Synthetic Podcast, and Advertiser Contextualization.

## 2. Model Routing Strategy
- **Gemini 1.5 Pro**: Used for complex semantic reasoning, long-context window tasks (summarizing whole magazines), and deep RAG synthesis.
- **Gemini 1.5 Flash**: Used for high-volume, low-latency tasks like Metadata Extraction, Entity Recognition, and routing decisions.
- **Claude 3.5 Sonnet**: Fallback reasoning engine for specialized editorial or highly nuanced conversational tasks.
- **OpenAI / ElevenLabs / Google TTS**: Used for Text-to-Speech synthesis for the Voice Companion and Podcast Engine.
- **Google STT / Deepgram**: Used for Speech-to-Text transcription with sub-300ms latency to enable voice barge-in.

## 3. RAG (Retrieval-Augmented Generation) Pipeline

### 3.1. Ingestion Pipeline
1. **Document Upload**: PDF is uploaded to S3.
2. **Text Extraction & OCR**: AWS Textract or open-source equivalents extract text, preserving layout structure, reading order, and identifying images/ads.
3. **Chunking**: Text is chunked semantically. E.g., article by article, section by section, ensuring overlapping contexts (e.g., 500 tokens with 50-token overlap).
4. **Embedding Generation**: `text-embedding-004` (Gemini) generates vector embeddings for each chunk.
5. **Vector Storage**: Embeddings are stored in **Pinecone** (or pgvector) along with rich metadata: `issueId`, `pageNumber`, `articleTitle`, `isAd`.

### 3.2. Retrieval Pipeline
1. **User Query**: Reader asks "What's the best herbicide for maize?"
2. **Query Expansion & Intent Recognition**: Gemini Flash clarifies the query context.
3. **Vector Search**: Pinecone is queried using the expanded user query embedding to find top-K matching chunks.
4. **Agri-Intelligence Enrichment**: The system cross-references the query with the `agri_insights` and `advertiser_products` tables. If a relevant advertiser (like Kynoch) exists, their product info is added to the prompt context.
5. **Synthesis**: Gemini 1.5 Pro generates the final response, citing the specific `pageNumber` from the retrieved chunks.

## 4. Voice Processing & Barge-in Architecture
- **WebSockets**: The client establishes a continuous WebSocket connection.
- **Streaming STT**: The user's microphone audio is streamed to Deepgram for real-time transcription.
- **VAD (Voice Activity Detection)**: The system detects when the user starts speaking. If the AI is currently narrating, the VAD triggers a "Barge-in" event, instantly halting the TTS stream on the client.
- **Streaming Response**: The LLM streams its response back, which is simultaneously fed into the streaming TTS engine, returning audio chunks to the client for near-instant playback.

## 5. Security & Hallucination Prevention
- **Strict Prompting**: System prompts explicitly instruct the AI to *only* use provided context.
- **Confidence Thresholds**: RAG retrieval has a minimum similarity score threshold. If no context matches, the AI defaults to "I cannot find this information in the current publication."
- **Advertiser Guardrails**: Advertiser insertions are strictly context-driven. The AI will not randomly insert ads if they don't match the semantic intent of the query.
