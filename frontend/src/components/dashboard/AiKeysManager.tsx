"use client";

import React, { useState, useTransition } from 'react';
import { addAiKey, toggleAiKeyStatus, deleteAiKey, testAiKeyAction } from '@/lib/actions';

interface AiKeyItem {
  id: string;
  maskedKey: string;
  label?: string;
  isActive: boolean;
  errorCount: number;
  lastUsed?: string | null;
  createdAt: string;
}

export default function AiKeysManager({ initialKeys }: { initialKeys: AiKeyItem[] }) {
  const [keys, setKeys] = useState<AiKeyItem[]>(initialKeys);
  const [newKey, setNewKey] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [testResult, setTestResult] = useState<{ [id: string]: { success: boolean; message: string } | null }>({});
  const [testingKey, setTestingKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formMsg, setFormMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Handle Add Key
  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) return;

    setFormMsg(null);
    setTestingKey('new');

    try {
      // First test the key
      const check = await testAiKeyAction(newKey.trim());
      if (!check?.success) {
        setFormMsg({
          type: 'error',
          text: `चेतावनी: यह API Key अमान्य है या काम नहीं कर रही: ${check?.message || 'अज्ञात त्रुटि'}`
        });
        setTestingKey(null);
        return;
      }

      // Add to server
      const formData = new FormData();
      formData.append('key', newKey.trim());
      formData.append('label', newLabel.trim() || `Gemini Key ${keys.length + 1}`);

      startTransition(async () => {
        const res = await addAiKey(formData);
        if (res?.id) {
          setKeys(prev => [res, ...prev]);
          setNewKey("");
          setNewLabel("");
          setFormMsg({
            type: 'success',
            text: 'नई Gemini API Key सफलतापूर्वक जोड़ी गई और टेस्ट सफल रहा!'
          });
        } else {
          setFormMsg({
            type: 'error',
            text: res?.message || 'Key जोड़ने में त्रुटि हुई।'
          });
        }
        setTestingKey(null);
      });
    } catch (err: any) {
      setFormMsg({ type: 'error', text: err.message || 'त्रुटि हुई।' });
      setTestingKey(null);
    }
  };

  // Handle Toggle Active
  const handleToggle = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleAiKeyStatus(id, currentStatus);
      setKeys(prev =>
        prev.map(k => (k.id === id ? { ...k, isActive: !currentStatus } : k))
      );
    });
  };

  // Handle Delete
  const handleDelete = (id: string) => {
    if (!confirm("क्या आप वाकई इस API Key को हटाना चाहते हैं?")) return;
    startTransition(async () => {
      await deleteAiKey(id);
      setKeys(prev => prev.filter(k => k.id !== id));
    });
  };

  const activeCount = keys.filter(k => k.isActive).length;

  return (
    <div className="flex flex-col gap-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#12141c] border border-gray-800 p-6 rounded-2xl">
          <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">कुल API Keys</div>
          <div className="text-4xl font-black text-white">{keys.length}</div>
          <div className="text-xs text-gray-500 mt-2">पूल में रजिस्टर्ड कुल कुंजियाँ</div>
        </div>

        <div className="bg-[#12141c] border border-green-500/20 p-6 rounded-2xl">
          <div className="text-green-400 text-xs font-bold uppercase tracking-wider mb-2">सक्रिय (Active) Keys</div>
          <div className="text-4xl font-black text-green-500">{activeCount}</div>
          <div className="text-xs text-green-500/70 mt-2">ऑटो-रोटेशन और लोड बैलेंसिंग के लिए तैयार</div>
        </div>

        <div className="bg-[#12141c] border border-blue-500/20 p-6 rounded-2xl">
          <div className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">फेलओवर सुरक्षा (Failover)</div>
          <div className="text-4xl font-black text-blue-400">{activeCount > 1 ? 'सक्रिय 🛡️' : '1 Key (और जोड़ें)'}</div>
          <div className="text-xs text-blue-400/70 mt-2">
            {activeCount > 1 ? 'कोटा खत्म होने पर ऑटो स्विच होगा' : 'निरंतर काम के लिए कम से कम 2-3 कीज रखें'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form: Add New Key */}
        <div className="bg-[#12141c] border border-gray-800 rounded-2xl p-6 shadow-2xl h-fit sticky top-6">
          <h2 className="text-xl font-black text-white mb-2 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-red-600 rounded-full"></span>
            नई Gemini API Key जोड़ें
          </h2>
          <p className="text-xs text-gray-400 mb-6">
            जितनी चाहें उतनी Gemini API Keys जोड़ सकते हैं। सिस्टम लोड बैलेंस और ऑटो-रोटेशन करेगा।
          </p>

          {formMsg && (
            <div className={`p-4 rounded-xl text-xs font-bold mb-6 border ${
              formMsg.type === 'success' 
                ? 'bg-green-500/10 text-green-400 border-green-500/30' 
                : 'bg-red-500/10 text-red-400 border-red-500/30'
            }`}>
              {formMsg.text}
            </div>
          )}

          <form onSubmit={handleAddKey} className="flex flex-col gap-5">
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">
                लेबल / नाम (उदा. Backup Key 2)
              </label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Primary / Account 2 / Backup"
                className="w-full bg-[#0b0c10] border border-gray-800 rounded-xl p-3.5 text-white outline-none focus:border-red-600 transition-all font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Gemini API Key <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-[#0b0c10] border border-gray-800 rounded-xl p-3.5 text-white outline-none focus:border-red-600 transition-all font-mono text-sm"
              />
              <p className="text-[11px] text-gray-500 mt-2">
                मुफ़्त Gemini API Key पाने के लिए{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:underline"
                >
                  Google AI Studio
                </a>{" "}
                पर जाएँ।
              </p>
            </div>

            <button
              type="submit"
              disabled={testingKey === 'new' || isPending}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black py-4 rounded-xl mt-2 shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all hover:scale-[1.01] active:scale-[0.99] uppercase tracking-wider text-sm flex items-center justify-center gap-2"
            >
              {testingKey === 'new' ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  जाँच एवं सुरक्षित किया जा रहा है...
                </>
              ) : (
                'टेस्ट करें और Key जोड़ें'
              )}
            </button>
          </form>

          {/* Guide Box */}
          <div className="mt-8 pt-6 border-t border-gray-800/80">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-300 mb-3 flex items-center gap-2">
              💡 यह कैसे काम करता है?
            </h3>
            <ul className="text-xs text-gray-400 space-y-2 list-disc list-inside">
              <li>जब भी कोई आर्टिकल ऑटो-राइट या आज का मुद्दा जनरेट होता है, सक्रिय कीज में से उपयोग किया जाता है।</li>
              <li>यदि किसी एक Key का कोटा (Rate Limit) समाप्त होता है, तो सिस्टम बिना रुके स्वतः अगली Key पर स्विच कर जाता है।</li>
              <li>इससे आपकी ऑटोमेशन और समाचार पब्लिशिंग कभी नहीं रुकती।</li>
            </ul>
          </div>
        </div>

        {/* Keys List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-[#12141c] border border-gray-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <span className="w-1.5 h-5 bg-red-600 rounded-full"></span>
                पंजीकृत Gemini Keys ({keys.length})
              </h2>
              <span className="text-xs text-gray-500">सुरक्षित एन्क्रिप्टेड स्टोरेज</span>
            </div>

            {keys.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                कोई API Key नहीं मिली। कृपया बाईं ओर फॉर्म से अपनी पहली Gemini Key जोड़ें।
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {keys.map((k, idx) => (
                  <div
                    key={k.id}
                    className={`border rounded-xl p-5 transition-all ${
                      k.isActive 
                        ? 'bg-[#0e1017] border-gray-800 hover:border-gray-700' 
                        : 'bg-[#0a0b0e] border-gray-900 opacity-60'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      {/* Left: Info */}
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                          k.isActive ? 'bg-red-600/20 text-red-400 border border-red-500/30' : 'bg-gray-800 text-gray-500'
                        }`}>
                          #{idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-base">
                              {k.label || `Gemini Key #${idx + 1}`}
                            </span>
                            {k.isActive ? (
                              <span className="bg-green-500/10 text-green-400 text-[10px] font-black px-2 py-0.5 rounded border border-green-500/20">
                                ACTIVE
                              </span>
                            ) : (
                              <span className="bg-gray-800 text-gray-400 text-[10px] font-black px-2 py-0.5 rounded">
                                INACTIVE
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-xs text-gray-400 mt-1 flex items-center gap-2">
                            <span>{k.maskedKey}</span>
                            <span className="text-gray-600">•</span>
                            <span className="text-gray-500 text-[11px]">
                              {k.lastUsed ? `अंतिम उपयोग: ${new Date(k.lastUsed).toLocaleTimeString('hi-IN')}` : 'अभी तक उपयोग नहीं'}
                            </span>
                            {k.errorCount > 0 && (
                              <>
                                <span className="text-gray-600">•</span>
                                <span className="text-amber-500 text-[11px]">त्रुटियाँ: {k.errorCount}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-3">
                        {/* Toggle active */}
                        <button
                          onClick={() => handleToggle(k.id, k.isActive)}
                          disabled={isPending}
                          className={`text-xs px-3 py-2 rounded-lg font-bold transition-all ${
                            k.isActive
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                              : 'bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20'
                          }`}
                        >
                          {k.isActive ? 'निष्क्रिय करें' : 'सक्रिय करें'}
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={() => handleDelete(k.id)}
                          disabled={isPending}
                          className="text-xs px-3 py-2 rounded-lg font-bold bg-red-600/10 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white transition-all"
                        >
                          हटाएं
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
