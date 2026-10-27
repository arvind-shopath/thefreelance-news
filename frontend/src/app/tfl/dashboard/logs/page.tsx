"use client";

import React from 'react';

export default function LogsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
      <div className="bg-[#12141c] border border-gray-800 p-6 rounded-2xl shadow-xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Automation Logs</h1>
          <p className="text-gray-400">View real-time engine execution logs</p>
        </div>
        <button className="bg-red-600 text-white font-bold px-4 py-2 rounded shadow hover:bg-red-700">Refresh Logs</button>
      </div>
      <div className="bg-[#12141c] border border-gray-800 rounded-2xl p-6 text-left text-gray-400 py-10 font-mono text-sm overflow-auto h-64">
        <p className="text-green-500">[2026-04-18 01:05:12] Engine started successfully</p>
        <p>[2026-04-18 01:06:01] Fetching RSS feeds from Google News...</p>
        <p className="text-blue-400">[2026-04-18 01:06:05] Found 3 new articles.</p>
        <p>[2026-04-18 01:06:10] AI rewrite queued for article ID 1092...</p>
      </div>
    </div>
  );
}
