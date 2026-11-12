import { getD1Client } from './d1Client.js';
import dotenv from 'dotenv';
dotenv.config();

// The Freelance - 100% Native Cloudflare D1 Database Engine
export function getSupabase(): any {
  return getD1Client();
}
