"use client";

import React, { useState } from 'react';
import { updateHomepageSection } from '@/lib/actions';

export default function HomepageManager({ homepage, categories }: { homepage: any[], categories: any[] }) {
  const [sections, setSections] = useState(homepage);
  const [saving, setSaving] = useState(false);

  const handleUpdate = (id: string, field: string, value: any) => {
    setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    for (const section of sections) {
      await updateHomepageSection(section.id, section);
    }
    setSaving(false);
    alert("Changes saved successfully!");
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
      <div className="bg-[#12141c] border border-gray-800 p-6 rounded-2xl shadow-xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">होमपेज लेआउट (Homepage Layout)</h1>
          <p className="text-gray-400">टुडेज़ टॉपिक, मेन सेक्शन और कैटेगरी ब्लॉक्स को यहाँ से मैनेज करें</p>
        </div>
        <button 
          onClick={handleSaveAll}
          disabled={saving}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-800 text-white font-bold px-8 py-3 rounded-xl shadow-xl transition-all active:scale-95"
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {sections.sort((a,b) => a.order - b.order).map((section) => (
          <div key={section.id} className={`bg-[#12141c] border ${section.isActive ? 'border-gray-800' : 'border-red-900/20 opacity-60'} rounded-2xl p-6 transition-all shadow-md`}>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-12 h-12 bg-[#0b0c10] border border-gray-800 text-red-500 rounded-xl flex items-center justify-center font-black text-xl">
                {section.order}
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Section Label</label>
                  <input 
                    className="w-full bg-[#0b0c10] border border-gray-800 rounded-lg p-3 text-white text-sm focus:border-red-500 outline-none transition-all" 
                    value={section.title || ''} 
                    onChange={e => handleUpdate(section.id, 'title', e.target.value)}
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Linked Category</label>
                  <select 
                    className="w-full bg-[#0b0c10] border border-gray-800 rounded-lg p-3 text-white text-sm outline-none" 
                    value={section.categorySlug || ''}
                    onChange={e => handleUpdate(section.id, 'categorySlug', e.target.value)}
                  >
                    <option value="">-- No Category --</option>
                    <option value="all">All Categories (Main Section)</option>
                    {categories.map((c: any) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Excluded (Slugs)</label>
                  <input 
                    className="w-full bg-[#0b0c10] border border-gray-800 rounded-lg p-3 text-white text-sm focus:border-red-500 outline-none transition-all" 
                    value={section.excludeCategories || ''}
                    onChange={e => handleUpdate(section.id, 'excludeCategories', e.target.value)}
                    placeholder="e.g. special, crime"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Block Type</label>
                  <div className="p-3 bg-[#1a1d26] border border-gray-800 rounded-lg text-gray-500 text-xs font-bold uppercase">
                    {section.sectionType}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 border-l border-gray-800 pl-6">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-gray-600 uppercase">Status</span>
                  <button 
                    onClick={() => handleUpdate(section.id, 'isActive', !section.isActive)}
                    className={`w-16 h-8 rounded-full relative transition-all ${section.isActive ? 'bg-green-600' : 'bg-gray-800'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${section.isActive ? 'left-9' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
