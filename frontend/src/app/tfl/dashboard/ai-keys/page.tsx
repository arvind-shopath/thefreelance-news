import React from 'react';
import AiKeysManager from '@/components/dashboard/AiKeysManager';
import { apiFetch } from '@/lib/actions';

export const metadata = {
  title: 'AI API Keys (Gemini) | The Freelance Dashboard',
};

export default async function AiKeysPage() {
  const keysResponse = await apiFetch('/ai-keys');
  const initialKeys = Array.isArray(keysResponse) ? keysResponse : (keysResponse?.data || []);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 animate-in fade-in duration-500">
      {/* Top Banner */}
      <div className="bg-[#12141c] border border-gray-800 p-6 rounded-2xl shadow-xl flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
            <rect x="4" y="8" width="16" height="12" rx="2"/>
            <path d="M2 14h2"/>
            <path d="M20 14h2"/>
            <path d="M15 13v2"/>
            <path d="M9 13v2"/>
          </svg>
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-white mb-1 tracking-tighter uppercase">
            एआई एपीआई कीज <span className="text-red-600 italic">MANAGER</span>
          </h1>
          <p className="text-gray-400 font-medium">
            Google Gemini API Keys का पूल प्रबंधित करें — ऑटोमैटिक रोटेशन, लोड बैलेंसिंग और जीरो-डाउनटाइम
          </p>
        </div>
        <div className="bg-green-500/10 text-green-500 px-4 py-2 rounded-xl text-xs font-black border border-green-500/20 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          AUTO-ROTATION ON
        </div>
      </div>

      <AiKeysManager initialKeys={initialKeys} />
    </div>
  );
}
