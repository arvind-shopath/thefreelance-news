import React from 'react';
import { getDb, addFeed, deleteFeed, toggleFeedStatus, apiFetch } from '@/lib/actions';
import GoogleNewsManager from '@/components/dashboard/GoogleNewsManager';

export default async function RssManager() {
  const db = await getDb();
  
  // Use apiFetch with admin token
  const res = await apiFetch('/feeds');
  const feeds = Array.isArray(res) ? res : (res?.data || []);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="bg-[#12141c] border border-gray-800 p-6 rounded-2xl shadow-xl flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
           <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-white mb-1 tracking-tighter uppercase">आरएसएस ऑटोमेशन <span className="text-red-600 italic">CENTER</span></h1>
          <p className="text-gray-400 font-medium">Google News और कस्टम RSS फीड्स से खबरें ऑटो-रीराइट, डिकोड और पब्लिश करें</p>
        </div>
        <div className="bg-green-500/10 text-green-500 px-4 py-2 rounded-xl text-xs font-black border border-green-500/20 flex items-center gap-2">
           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
           SYSTEM ACTIVE
        </div>
      </div>

      {/* Google News Hub & Single Pull Tester */}
      <GoogleNewsManager />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Feed Form */}
        <div className="bg-[#12141c] border border-gray-800 rounded-2xl p-8 shadow-2xl h-fit sticky top-8">
          <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-red-600 rounded-full"></span>
            नया फीड जोड़ें
          </h2>
          <form action={addFeed} className="flex flex-col gap-6">
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">फीड का नाम (Source Name)</label>
              <input name="name" required className="w-full bg-[#0b0c10] border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-red-600 transition-all font-medium" placeholder="e.g. Aaj Tak RSS" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">फीड URL (XML Link)</label>
              <input name="url" required className="w-full bg-[#0b0c10] border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-red-600 transition-all font-medium" placeholder="https://source.com/rss.xml" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">कैटेगरी सिलेक्शन (Category Mode)</label>
              <select name="category" className="w-full bg-[#0b0c10] border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-red-600 transition-all font-bold appearance-none cursor-pointer">
                <option value="auto">🤖 AI Dynamic Detection (Best)</option>
                {db.categories.map((c: any) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
              <p className="text-[10px] text-gray-500 mt-2 italic font-medium">AI Dynamic मोड में सिस्टम खुद तय करेगा कि खबर किस कैटेगरी की है।</p>
            </div>
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl mt-2 shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wider">
              फीड एक्टिवेट करें
            </button>
          </form>
        </div>

        {/* Feeds List */}
        <div className="lg:col-span-2 bg-[#12141c] border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
              सक्रिय फीड्स ({feeds.length})
            </h2>
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-black/30 px-3 py-1.5 rounded-full border border-gray-800">
               Total Sources: {feeds.length}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {feeds.map((feed: any) => (
              <div key={feed.id} className={`bg-[#0b0c10] border ${feed.isActive ? 'border-gray-800' : 'border-red-900/30 opacity-60'} p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group transition-all hover:border-gray-700 shadow-lg`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-white font-black text-lg tracking-tight truncate">{feed.name}</h3>
                    {feed.isActive ? (
                       <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    ) : (
                       <span className="text-[10px] bg-red-600/20 text-red-500 px-2 py-0.5 rounded font-black italic">PAUSED</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs truncate max-w-md font-medium mb-3">{feed.url}</p>
                  <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-1.5">
                       <span className="text-[10px] font-black text-gray-600 uppercase">Mode:</span>
                       <span className="text-[10px] bg-red-600/10 text-red-500 px-3 py-1 rounded-full border border-red-500/20 font-black">{feed.categoryStr === 'auto' ? 'AI DYNAMIC' : feed.categoryStr.toUpperCase()}</span>
                    </div>
                    <div className="h-4 w-px bg-gray-800"></div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                       <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                       <span className="text-[10px] font-bold">Last Sync: {feed.lastFetched ? new Date(feed.lastFetched).toLocaleTimeString() : 'Pending'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-800/50">
                  <form action={async () => { "use server"; await toggleFeedStatus(feed.id, feed.isActive); }}>
                     <button type="submit" className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs font-black transition-all border ${
                       feed.isActive 
                        ? 'bg-orange-600/10 text-orange-500 border-orange-500/20 hover:bg-orange-600 hover:text-white' 
                        : 'bg-green-600/10 text-green-500 border-green-500/20 hover:bg-green-600 hover:text-white'
                     }`}>
                       {feed.isActive ? 'PAUSE' : 'RESUME'}
                     </button>
                  </form>
                  <form action={async () => { "use server"; await deleteFeed(feed.id); }}>
                     <button type="submit" className="flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs font-black bg-red-600/10 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white transition-all">
                       DELETE
                     </button>
                  </form>
                </div>
              </div>
            ))}
            {feeds.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 bg-black/20 rounded-2xl border border-dashed border-gray-800">
                 <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4"/><path d="m16.2 4.2 2.8 2.8"/><path d="M18 12h4"/><path d="m16.2 19.8 2.8-2.8"/><path d="M12 18v4"/><path d="m4.2 19.8 2.8-2.8"/><path d="M2 12h4"/><path d="m4.2 4.2 2.8 2.8"/></svg>
                 </div>
                 <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">कोई सक्रिय फीड नहीं मिला</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
