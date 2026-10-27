"use client";

import React, { useState } from 'react';
import { updateCategory, addCategory, deleteCategory } from '@/lib/actions';

export default function CategoryManager({ categories }: { categories: any[] }) {
  const [cats, setCats] = useState(categories);
  const [saving, setSaving] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', slug: '', color: '#ef4444', parentId: null });

  const normalizeColor = (col: string | null | undefined): string => {
    if (!col) return '#dc2626';
    const trimmed = col.trim();
    if (trimmed.startsWith('#') && (trimmed.length === 7 || trimmed.length === 4)) return trimmed;
    if (trimmed.includes('blue')) return '#2563eb';
    if (trimmed.includes('green') || trimmed.includes('emerald')) return '#16a34a';
    if (trimmed.includes('orange')) return '#ea580c';
    if (trimmed.includes('amber')) return '#d97706';
    if (trimmed.includes('purple')) return '#9333ea';
    if (trimmed.includes('cyan') || trimmed.includes('sky')) return '#0284c7';
    if (trimmed.includes('pink')) return '#db2777';
    if (trimmed.includes('indigo')) return '#4f46e5';
    return '#dc2626';
  };

  const handleUpdate = (id: string, field: string, value: any) => {
    setCats(cats.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleSave = async (category: any) => {
    setSaving(true);
    await updateCategory(category.id, category);
    setSaving(false);
    alert("Category saved!");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure? This will delete the category!")) {
      setSaving(true);
      await deleteCategory(id);
      setCats(cats.filter(c => c.id !== id));
      setSaving(false);
    }
  };

  const handleAddNew = async () => {
    if (!newCat.name || !newCat.slug) return alert("Name and Slug are required!");
    setSaving(true);
    await addCategory(newCat);
    window.location.reload(); // Refresh to get new list
  };

  const parentCategories = cats.filter(c => !c.parentId);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
      <div className="bg-[#12141c] border border-gray-800 p-8 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-1 uppercase tracking-tighter">कैटेगरी मैनेजमेंट</h1>
          <p className="text-gray-400 font-medium">कैटेगरी और सब-कैटेगरी को यहाँ से एडिट और मैनेज करें</p>
        </div>
      </div>

      {/* Add New Section */}
      <div className="bg-[#12141c] border border-red-600/30 p-8 rounded-[2.5rem] shadow-xl">
        <h2 className="text-xl font-black text-white mb-6 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-6 bg-red-600 rounded-full"></span>
          नई कैटेगरी जोड़ें
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
          <div>
            <label className="text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest block">Name</label>
            <input 
              className="w-full bg-[#0b0c10] border border-gray-800 rounded-xl p-4 text-white text-sm focus:border-red-600 outline-none transition-all" 
              value={newCat.name} 
              onChange={e => {
                const name = e.target.value;
                const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                setNewCat({...newCat, name, slug});
              }}
              placeholder="e.g. बॉलीवुड"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest block">Slug (URL)</label>
            <input 
              className="w-full bg-[#0b0c10] border border-gray-800 rounded-xl p-4 text-white text-sm focus:border-red-600 outline-none transition-all" 
              value={newCat.slug} 
              onChange={e => setNewCat({...newCat, slug: e.target.value})}
              placeholder="e.g. bollywood"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest block">Parent</label>
            <select 
              className="w-full bg-[#0b0c10] border border-gray-800 rounded-xl p-4 text-white text-sm outline-none" 
              value={newCat.parentId || ''}
              onChange={e => setNewCat({...newCat, parentId: e.target.value || null} as any)}
            >
              <option value="">-- None (Parent) --</option>
              {parentCategories.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest block">Color</label>
            <div className="flex items-center gap-2">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-700 shrink-0">
                <input 
                  type="color" 
                  value={normalizeColor(newCat.color)} 
                  onChange={e => setNewCat({...newCat, color: e.target.value})}
                  className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer border-none bg-transparent" 
                />
              </div>
              <input 
                className="w-full bg-[#0b0c10] border border-gray-800 rounded-xl p-3.5 text-white font-mono text-xs focus:border-red-600 outline-none" 
                value={newCat.color}
                onChange={e => setNewCat({...newCat, color: e.target.value})}
              />
            </div>
          </div>
          <button 
            onClick={handleAddNew}
            disabled={saving}
            className="bg-red-600 hover:bg-red-700 text-white font-black px-6 py-4 rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-widest text-xs"
          >
            Add Category
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 pb-20">
        {cats.map((cat) => (
          <div key={cat.id} className="bg-[#12141c] border border-gray-800 rounded-[2rem] p-8 flex flex-col md:flex-row gap-8 items-center group hover:border-gray-700 transition-all">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
              <div>
                <label className="text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest block">Name</label>
                <input 
                  className="w-full bg-[#0b0c10] border border-gray-800 rounded-xl p-4 text-white text-sm focus:border-blue-600 outline-none" 
                  value={cat.name} 
                  onChange={e => handleUpdate(cat.id, 'name', e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest block">Slug</label>
                <input 
                  className="w-full bg-[#0b0c10]/50 border border-gray-800 rounded-xl p-4 text-gray-500 text-sm cursor-not-allowed" 
                  value={cat.slug} 
                  readOnly
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest block">Parent</label>
                <select 
                  className="w-full bg-[#0b0c10] border border-gray-800 rounded-xl p-4 text-white text-sm outline-none" 
                  value={cat.parentId || ''}
                  onChange={e => handleUpdate(cat.id, 'parentId', e.target.value || null)}
                >
                  <option value="">-- None (Parent) --</option>
                  {parentCategories.filter(p => p.id !== cat.id).map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest block">Color (रंग कोड)</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-gray-700 shrink-0 shadow">
                    <input 
                      type="color" 
                      value={normalizeColor(cat.color)} 
                      onChange={e => handleUpdate(cat.id, 'color', e.target.value)} 
                      className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer border-none bg-transparent" 
                    />
                  </div>
                  <input 
                    className="flex-1 bg-[#0b0c10] border border-gray-800 rounded-xl p-3.5 text-white font-mono text-sm focus:border-blue-500 outline-none" 
                    value={cat.color || ''} 
                    placeholder="#dc2626"
                    onChange={e => handleUpdate(cat.id, 'color', e.target.value)}
                  />
                  <div 
                    className="w-9 h-9 rounded-xl border border-white/20 shrink-0 shadow-md flex items-center justify-center text-white text-[10px] font-bold" 
                    style={{ backgroundColor: normalizeColor(cat.color) }}
                    title="रंग पूर्वावलोकन (Preview)"
                  >
                    ●
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <button 
                onClick={() => handleSave(cat)}
                className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-widest text-xs"
              >
                Save
              </button>
              <button 
                onClick={() => handleDelete(cat.id)}
                className="bg-gray-800 hover:bg-red-900 text-white p-4 rounded-xl transition-all active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2"></path></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
