import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

export class GeminiService {
  private keys: string[] = [];
  private currentKeyIndex = 0;
  private readonly models = [
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-3.8-flash',
    'gemini-flash-lite-latest',
  ];

  constructor() {
    const rawKeys = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || '';
    this.keys = rawKeys
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    if (this.keys.length === 0) {
      console.warn('⚠️ No GEMINI_API_KEYS configured! AI generation will fail without a valid key.');
    } else {
      console.log(`🤖 [GeminiService] Initialized with ${this.keys.length} API key(s) in rotation pool.`);
    }
  }

  /**
   * Execute an AI prompt with automatic Multi-Key & Multi-Model rotation.
   * If a key encounters 429 (rate-limit / quota exhausted), it immediately skips to the next key.
   */
  async generateText(prompt: string, isJson: boolean = false): Promise<string> {
    if (this.keys.length === 0) {
      throw new Error('No Gemini API keys found in GEMINI_API_KEYS environment variable.');
    }

    const totalKeys = this.keys.length;
    let lastError: any = null;

    for (let attempt = 0; attempt < totalKeys; attempt++) {
      const keyIndex = (this.currentKeyIndex + attempt) % totalKeys;
      const apiKey = this.keys[keyIndex];
      const genAI = new GoogleGenerativeAI(apiKey);

      for (const modelName of this.models) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: isJson
              ? { responseMimeType: 'application/json', temperature: 0.2 }
              : { temperature: 0.3 },
          });

          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 35000);

          const result = await model.generateContent(prompt, { signal: controller.signal });
          clearTimeout(timer);
          const responseText = result.response.text();

          if (responseText && responseText.trim().length > 0) {
            // Success: update active key index for future calls
            this.currentKeyIndex = keyIndex;
            return responseText.trim();
          }
        } catch (err: any) {
          lastError = err;
          const msg = (err.message || '').toLowerCase();

          // 429 quota exhaustion: skip immediately to the next key
          if (msg.includes('429') || msg.includes('quota') || msg.includes('resource_exhausted')) {
            console.warn(
              `⚠️ [KeyRotation] Key [${apiKey.slice(0, 6)}...${apiKey.slice(-4)}] quota exceeded (429). Switching to next key...`
            );
            break; // Break inner model loop, proceed to next key
          }

          // 404 model not supported on this key -> try next model on same key
          if (msg.includes('404') || msg.includes('not found')) {
            continue;
          }

          console.warn(`[Gemini] Model ${modelName} failed on key ${keyIndex}: ${err.message}`);
        }
      }
    }

    throw new Error(`All Gemini keys and models exhausted. Last error: ${lastError?.message || 'Unknown'}`);
  }

  /**
   * Safe JSON parse helper that strips markdown fences (```json ... ```)
   */
  async generateJson<T>(prompt: string): Promise<T> {
    const raw = await this.generateText(prompt, true);
    const cleaned = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    try {
      return JSON.parse(cleaned) as T;
    } catch (e: any) {
      console.error('Failed to parse Gemini JSON output:', cleaned.slice(0, 300));
      throw new Error(`JSON parse error from Gemini: ${e.message}`);
    }
  }
}

export const gemini = new GeminiService();
