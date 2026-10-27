'use client';

import React, { useState, useEffect } from 'react';
import { StateElectionCardData } from '@/components/election/StateElectionCard';
import { ParliamentPartySeat } from '@/components/election/ParliamentHemicycle';

export default function ElectionDashboardPage() {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [headerTitle, setHeaderTitle] = useState<string>('विधानसभा चुनाव 2026: ताज़ा रुझान व नतीजे');
  const [headerBadge, setHeaderBadge] = useState<string>('🔴 LIVE ELECTION DESK');
  const [states, setStates] = useState<StateElectionCardData[]>([]);

  const [activeStateIndex, setActiveStateIndex] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // AI Fetch Assistant state
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [aiQuery, setAiQuery] = useState<string>('');
  const [isAiFetching, setIsAiFetching] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Load config on mount
  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/election');
      if (res.ok) {
        const data = await res.json();
        setIsActive(Boolean(data.isActive));
        setHeaderTitle(data.headerTitle || 'विधानसभा चुनाव 2026: ताज़ा रुझान व नतीजे');
        setHeaderBadge(data.headerBadge || '🔴 LIVE ELECTION DESK');
        setStates(data.states || []);
      }
    } catch (err: any) {
      console.error('Failed to load election config:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Save config
  const handleSave = async (overrideIsActive?: boolean) => {
    setIsSaving(true);
    setSaveMessage(null);
    const activeToSave = overrideIsActive !== undefined ? overrideIsActive : isActive;

    try {
      // User Rule: जिसके नंबर ज्यादा होंगे वो ऊपर हो जाएगा (Rank #1 first, #2 next, #3 next)
      const normalizedStates = states.map((st) => {
        const sortedParties = [...st.parties].sort((a, b) => {
          const bTotal = Number(b.totalSeats !== undefined ? b.totalSeats : (b.won || 0) + (b.lead || 0));
          const aTotal = Number(a.totalSeats !== undefined ? a.totalSeats : (a.won || 0) + (a.lead || 0));
          if (bTotal !== aTotal) return bTotal - aTotal;
          if ((b.won || 0) !== (a.won || 0)) return (b.won || 0) - (a.won || 0);
          if ((b.lead || 0) !== (a.lead || 0)) return (b.lead || 0) - (a.lead || 0);
          return (Number(b.voteShare) || 0) - (Number(a.voteShare) || 0);
        });
        const autoDeclared = sortedParties.reduce((sum, p) => sum + (Number(p.won || 0) + Number(p.lead || 0)), 0);
        return {
          ...st,
          parties: sortedParties,
          declaredSeats: autoDeclared,
        };
      });

      setStates(normalizedStates);

      const payload = {
        isActive: activeToSave,
        headerTitle,
        headerBadge,
        states: normalizedStates,
      };

      const res = await fetch('/api/v1/election', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsActive(activeToSave);
        setSaveMessage({
          text: activeToSave
            ? '🟢 इलेक्शन रिजल्ट सफलतापूर्वक वेबसाइट पर लाइव कर दिया गया है!'
            : '⚪ इलेक्शन रिजल्ट सफलतापूर्वक सुरक्षित हुआ (वेबसाइट पर ऑफ है)।',
          type: 'success',
        });
      } else {
        setSaveMessage({ text: data.message || 'सुरक्षित करने में त्रुटि हुई', type: 'error' });
      }
    } catch (err: any) {
      setSaveMessage({ text: 'नेटवर्क त्रुटि: ' + err.message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // Open live website preview in new tab
  const handleOpenWebsitePreview = async () => {
    await handleSave();
    window.open('/?preview=election', '_blank');
  };

  // Add new state (Up to 6 states)
  const handleAddState = () => {
    if (states.length >= 6) {
      alert('अधिकतम 6 राज्य ही एक साथ जोड़े जा सकते हैं।');
      return;
    }

    const stateNumber = states.length + 1;
    const newState: StateElectionCardData = {
      id: `state-${Date.now()}`,
      stateName: `नया राज्य ${stateNumber}`,
      stateNameEn: `State ${stateNumber}`,
      mapUrl: '',
      totalSeats: 243,
      declaredSeats: 0,
      majority: 122, // Math.floor(243 / 2) + 1
      statusText: 'रुझान जारी',
      lastUpdated: 'शुरुआती रुझान',
      sourceText: 'स्रोत: भारत निर्वाचन आयोग (ECI)',
      parties: [
        {
          id: `p-${Date.now()}-1`,
          name: 'गठबंधन A (NDA)',
          shortName: 'NDA',
          color: '#F97316',
          won: 0,
          lead: 0,
          totalSeats: 0,
          voteShare: undefined,
        },
        {
          id: `p-${Date.now()}-2`,
          name: 'गठबंधन B (INDIA)',
          shortName: 'INDIA',
          color: '#2563EB',
          won: 0,
          lead: 0,
          totalSeats: 0,
          voteShare: undefined,
        },
        {
          id: `p-${Date.now()}-3`,
          name: 'अन्य (Others)',
          shortName: 'OTH',
          color: '#64748B',
          won: 0,
          lead: 0,
          totalSeats: 0,
          voteShare: undefined,
        },
      ],
    };

    const nextStates = [...states, newState];
    setStates(nextStates);
    setActiveStateIndex(nextStates.length - 1);
  };

  // Remove state
  const handleRemoveState = (index: number) => {
    if (confirm(`क्या आप वाकई '${states[index].stateName}' को हटाना चाहते हैं?`)) {
      const nextStates = states.filter((_, i) => i !== index);
      setStates(nextStates);
      if (activeStateIndex >= nextStates.length) {
        setActiveStateIndex(Math.max(0, nextStates.length - 1));
      }
    }
  };

  // Update State Field
  const updateStateField = (field: keyof StateElectionCardData, value: any) => {
    setStates(prev => {
      const copy = [...prev];
      const currentState = { ...copy[activeStateIndex] };

      if (field === 'totalSeats') {
        const total = Number(value) || 0;
        currentState.totalSeats = total;
        // Automatic Majority calculation: Math.floor(totalSeats / 2) + 1
        currentState.majority = Math.floor(total / 2) + 1;
      } else {
        (currentState as any)[field] = value;
      }

      copy[activeStateIndex] = currentState;
      return copy;
    });
  };

  // Add party to current state
  const handleAddParty = () => {
    const currentState = states[activeStateIndex];
    if (!currentState) return;

    const newParty: ParliamentPartySeat = {
      id: `p-${Date.now()}`,
      name: 'नई पार्टी',
      shortName: 'PTY',
      color: '#10B981',
      won: 0,
      lead: 0,
      totalSeats: 0,
      voteShare: undefined,
    };

    updateStateField('parties', [...currentState.parties, newParty]);
  };

  // User Rule: Sort parties by seats descending (Rank #1 first, #2 next, #3 next)
  const handleSortPartiesBySeats = () => {
    const cur = states[activeStateIndex];
    if (!cur) return;
    const sorted = [...cur.parties].sort((a, b) => {
      const bTotal = Number(b.totalSeats !== undefined ? b.totalSeats : (b.won || 0) + (b.lead || 0));
      const aTotal = Number(a.totalSeats !== undefined ? a.totalSeats : (a.won || 0) + (a.lead || 0));
      if (bTotal !== aTotal) return bTotal - aTotal;
      if ((b.won || 0) !== (a.won || 0)) return (b.won || 0) - (a.won || 0);
      if ((b.lead || 0) !== (a.lead || 0)) return (b.lead || 0) - (a.lead || 0);
      return (Number(b.voteShare) || 0) - (Number(a.voteShare) || 0);
    });
    updateStateField('parties', sorted);
  };

  // Remove party from current state
  const handleRemoveParty = (pIdx: number) => {
    const currentState = states[activeStateIndex];
    if (!currentState) return;
    const nextParties = currentState.parties.filter((_, i) => i !== pIdx);
    updateStateField('parties', nextParties);
  };

  // Update Party Field
  const updatePartyField = (pIdx: number, field: keyof ParliamentPartySeat, value: any) => {
    const currentState = states[activeStateIndex];
    if (!currentState) return;

    const nextParties = [...currentState.parties];
    const currentParty = { ...nextParties[pIdx] };

    if (field === 'voteShare') {
      // User Rule: Only set voteShare if user actually entered a number. If cleared, set to undefined.
      const val = value === '' || value === null || value === undefined ? undefined : Number(value);
      currentParty.voteShare = isNaN(val as any) ? undefined : val;
    } else if (field === 'won' || field === 'lead') {
      const numVal = Number(value) || 0;
      (currentParty as any)[field] = numVal;
      // Auto-compute total seats = won + lead
      const won = field === 'won' ? numVal : currentParty.won;
      const lead = field === 'lead' ? numVal : currentParty.lead;
      currentParty.totalSeats = won + lead;
    } else {
      (currentParty as any)[field] = value;
    }

    nextParties[pIdx] = currentParty;

    // User Rule: Automatically calculate declaredSeats (रुझान/नतीजे सीटें) from all parties
    const autoDeclared = nextParties.reduce((sum, p) => sum + (Number(p.won || 0) + Number(p.lead || 0)), 0);

    setStates(prev => {
      const copy = [...prev];
      const cur = { ...copy[activeStateIndex] };
      cur.parties = nextParties;
      cur.declaredSeats = autoDeclared;
      copy[activeStateIndex] = cur;
      return copy;
    });
  };

  // Upload Map or Logo image
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);

    try {
      const res = await fetch('/api/v1/media/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data?.data?.url) {
        callback(data.data.url);
      } else {
        alert('इमेज अपलोड नहीं हो सकी।');
      }
    } catch (err: any) {
      alert('अपलोड त्रुटि: ' + err.message);
    }
  };

  // AI Auto-Fill State
  const handleAiFetch = async () => {
    if (!aiQuery.trim()) return;
    setIsAiFetching(true);
    setAiError(null);

    try {
      const res = await fetch('/api/v1/election/ai-fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queryOrUrl: aiQuery }),
      });
      const data = await res.json();
      if (data?.success && data?.stateData) {
        // Add or replace state
        if (states.length === 0) {
          setStates([data.stateData]);
          setActiveStateIndex(0);
        } else {
          // Replace current or append
          const copy = [...states];
          copy[activeStateIndex] = {
            ...data.stateData,
            id: copy[activeStateIndex]?.id || `state-${Date.now()}`,
          };
          setStates(copy);
        }
        setAiModalOpen(false);
        setAiQuery('');
      } else {
        setAiError(data?.message || 'एआई डेटा नहीं निकाल सका।');
      }
    } catch (err: any) {
      setAiError('त्रुटि: ' + err.message);
    } finally {
      setIsAiFetching(false);
    }
  };

  const currentState = states[activeStateIndex];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗳️</span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              इलेक्शन रिजल्ट मैनेजमेंट (Live Election Results)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            वेबसाइट के शीर्ष पर संसद/विधानसभा स्टाइल हाफ-सर्कल सीट व वोट शेयर डिस्प्ले करें (1 से 6 राज्य)
          </p>
        </div>

        {/* Global Master Switch & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Master ON/OFF Switch */}
          <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
            <div className="text-right">
              <span className="text-xs font-black block text-white">
                वेबसाइट डिस्प्ले स्थिति
              </span>
              <span className={`text-[10px] font-bold ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                {isActive ? '🟢 वेबसाइट पर लाइव' : '⚪ वेबसाइट पर ऑफ'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                isActive ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
              title={isActive ? 'क्लिक करके ऑफ करें' : 'क्लिक करके लाइव करें'}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isActive ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Quick AI Fill Button */}
          <button
            onClick={() => setAiModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md flex items-center gap-1.5 transition cursor-pointer"
            title="इलेक्शन कमीशन या किसी वेबसाइट से डेटा एआई से भरवाएं"
          >
            <span>🤖</span>
            <span>AI से डेटा भरवाएं</span>
          </button>

          {/* Live Website Preview Button */}
          <button
            onClick={handleOpenWebsitePreview}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-xs font-black bg-cyan-600 hover:bg-cyan-700 text-white shadow-md flex items-center gap-1.5 transition cursor-pointer"
            title="वर्तमान बदलावों को सुरक्षित करके वेबसाइट होमपेज पर लाइव प्रीव्यू देखें"
          >
            <span>👁️</span>
            <span>वेबसाइट पर लाइव प्रीव्यू देखें</span>
          </button>

          {/* Save Draft / Publish Button */}
          <button
            onClick={() => handleSave()}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            {isSaving ? 'सुरक्षित हो रहा है...' : '💾 सुरक्षित करें (Save)'}
          </button>
        </div>
      </div>

      {/* Save Notification Toast */}
      {saveMessage && (
        <div
          className={`p-4 rounded-xl border text-xs font-bold flex items-center justify-between animate-fadeIn ${
            saveMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
              : 'bg-red-950/80 border-red-800 text-red-200'
          }`}
        >
          <span>{saveMessage.text}</span>
          <button
            onClick={() => setSaveMessage(null)}
            className="text-white hover:text-slate-300 font-bold px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* Editor Sub-Header Banner with Website Preview Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 px-4 py-3 rounded-xl shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold text-sm">✏️</span>
          <span className="text-xs font-black text-white">
            इलेक्शन फॉर्म व डेटा एडिटर
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-amber-400 font-mono font-bold border border-slate-700">
            {states.length} राज्य सक्रिय
          </span>
        </div>
        <button
          onClick={handleOpenWebsitePreview}
          className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition cursor-pointer"
        >
          <span>🌐 वेबसाइट होमपेज पर देखें कि यह कैसा दिखेगा</span>
          <span className="text-[10px]">↗</span>
        </button>
      </div>

      {/* Main Form Editor */}
      <div className="space-y-6">
          {/* Global Header Settings */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-black uppercase text-amber-400 tracking-wider">
              1. मुख्य हेडलाइन एवं बैनर टैग (Banner Settings)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  शीर्षक (Main Header Title)
                </label>
                <input
                  type="text"
                  value={headerTitle}
                  onChange={(e) => setHeaderTitle(e.target.value)}
                  placeholder="उदा. विधानसभा चुनाव 2026: ताज़ा रुझान व नतीजे"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  लाइव टैग बैज (Live Badge Text)
                </label>
                <input
                  type="text"
                  value={headerBadge}
                  onChange={(e) => setHeaderBadge(e.target.value)}
                  placeholder="उदा. 🔴 LIVE ELECTION DESK"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* States Selector & Add State Button */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-xs font-black uppercase text-amber-400 tracking-wider">
                  2. राज्य चयन व प्रबंधन (States: {states.length}/6)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  1 राज्य से लेकर 6 राज्यों तक जोड़ें (3 ऊपर, 3 नीचे ग्रिड में दिखेंगे)
                </p>
              </div>

              {states.length < 6 && (
                <button
                  onClick={handleAddState}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>+</span>
                  <span>नया राज्य जोड़ें (Add State)</span>
                </button>
              )}
            </div>

            {/* States Tab Switcher */}
            {states.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                कोई राज्य नहीं जुड़ा है। शुरू करने के लिए <strong>'+ नया राज्य जोड़ें'</strong> पर क्लिक करें।
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {states.map((st, idx) => (
                  <div
                    key={st.id}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition ${
                      activeStateIndex === idx
                        ? 'bg-amber-500 text-black border-amber-400 shadow-md font-black'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                    onClick={() => setActiveStateIndex(idx)}
                  >
                    <span>{idx + 1}. {st.stateName || 'अनाम राज्य'}</span>
                    {states.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveState(idx);
                        }}
                        className="hover:text-red-600 text-slate-400 text-xs font-black px-1"
                        title="राज्य हटाएं"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Current Selected State Form */}
          {currentState && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <span>📍</span>
                  <span>राज्य विवरण: {currentState.stateName}</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  बहुमत: {currentState.majority} सीटें (स्वतः गणना)
                </span>
              </div>

              {/* State Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* State Name */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    राज्य का नाम (State Name) *
                  </label>
                  <input
                    type="text"
                    value={currentState.stateName}
                    onChange={(e) => updateStateField('stateName', e.target.value)}
                    placeholder="उदा. उत्तर प्रदेश विधानसभा"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Total Seats */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    कुल सीटें (Total Seats) *
                  </label>
                  <input
                    type="number"
                    value={currentState.totalSeats || ''}
                    onChange={(e) => updateStateField('totalSeats', e.target.value)}
                    placeholder="उदा. 403 या 543"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-amber-400/80 block mt-0.5">
                    बहुमत स्वतः: {Math.floor((Number(currentState.totalSeats) || 0) / 2) + 1}
                  </span>
                </div>

                {/* Declared Seats (Auto-computed from parties) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-300">
                      रुझान/नतीजे सीटें (Declared/Trends)
                    </label>
                    <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      ⚡ स्वतः गणना
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      readOnly
                      value={currentState.parties.reduce((sum, p) => sum + (Number(p.won || 0) + Number(p.lead || 0)), 0)}
                      className="w-full bg-slate-800/80 border border-emerald-500/40 rounded-xl px-3 py-2 text-xs text-emerald-300 font-mono font-bold focus:outline-none cursor-default"
                    />
                    <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-mono">
                      / {currentState.totalSeats || 0}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    पार्टियों की जीती व आगे सीटों से स्वतः जुड़कर अपडेट होगी
                  </span>
                </div>

                {/* Status Text */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    स्थिति (Live Status)
                  </label>
                  <input
                    type="text"
                    value={currentState.statusText || ''}
                    onChange={(e) => updateStateField('statusText', e.target.value)}
                    placeholder="उदा. रुझान जारी या अंतिम नतीजे"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* PNG Map URL / Upload */}
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-3">
                <label className="text-xs font-bold text-slate-200 block">
                  🗺️ राज्य का PNG मैप (State Outline PNG Map)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={currentState.mapUrl || ''}
                    onChange={(e) => updateStateField('mapUrl', e.target.value)}
                    placeholder="PNG मैप इमेज का URL या दाईं ओर अपलोड करें (उदा. /uploads/bihar-map.png)"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <label className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-700 hover:bg-slate-600 text-white cursor-pointer transition shrink-0">
                    <span>📁 PNG अपलोड करें</span>
                    <input
                      type="file"
                      accept="image/png,image/webp,image/svg+xml"
                      className="hidden"
                      onChange={(e) => handleUploadImage(e, (url) => updateStateField('mapUrl', url))}
                    />
                  </label>
                  {currentState.mapUrl && (
                    <div className="w-10 h-10 border border-slate-700 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={currentState.mapUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-slate-400">
                  संसद के हाफ-सर्कल के बीच में यह मैप प्रदर्शित होगा। पारदर्शी बैकग्राउंड (Transparent PNG) सबसे बेहतर दिखेगा।
                </p>
              </div>

              {/* Parties Configuration Table */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-700/60">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">
                      पार्टियां व गठबंधन (Parties, Colors & Seats)
                    </h4>

                    {/* Alliance Toggle (User Rule: Full freedom to enable/disable alliance layer) */}
                    <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-700 shadow-xs">
                      <span className="text-xs font-bold text-white">
                        🔗 गठबंधन लेयर (Alliance Mode)
                      </span>
                      <button
                        type="button"
                        onClick={() => updateStateField('hasAlliance', !currentState.hasAlliance)}
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          currentState.hasAlliance ? 'bg-amber-500' : 'bg-slate-600'
                        }`}
                        title="गठबंधन मोड चालू या बंद करें"
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                            currentState.hasAlliance ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <span className={`text-[10px] font-bold ${currentState.hasAlliance ? 'text-amber-400' : 'text-slate-400'}`}>
                        {currentState.hasAlliance ? 'सक्रिय' : 'बंद'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSortPartiesBySeats}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title="सर्वाधिक सीटों के अनुसार ऊपर से नीचे क्रमबद्ध करें (Rank #1 top)"
                    >
                      <span>⚡</span>
                      <span>सीटों के अनुसार सॉर्ट करें</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAddParty}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>+</span>
                      <span>पार्टी जोड़ें</span>
                    </button>
                  </div>
                </div>

                {/* Alliance Live Summary Banner (Only if Alliance Mode is ON) */}
                {currentState.hasAlliance && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-black text-amber-300">
                        📊 गठबंधन सारांश (Live Alliance Grouping):
                      </span>
                      <span className="text-[10px] text-slate-400">
                        (प्रत्येक पार्टी के आगे गठबंधन चुनें या टाइप करें; जिनका खाली रहेगा वे स्वतंत्र/अन्य रहेंगी)
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {(() => {
                        const map = new Map<string, { total: number; count: number; color: string }>();
                        let noAllianceSeats = 0;
                        let noAllianceCount = 0;

                        currentState.parties.forEach(p => {
                          const allName = (p.alliance || '').trim();
                          if (allName) {
                            if (!map.has(allName)) map.set(allName, { total: 0, count: 0, color: p.color || '#F97316' });
                            const g = map.get(allName)!;
                            g.total += p.totalSeats || 0;
                            g.count += 1;
                          } else {
                            noAllianceSeats += p.totalSeats || 0;
                            noAllianceCount += 1;
                          }
                        });

                        const pills = Array.from(map.entries())
                          .sort((a, b) => b[1].total - a[1].total)
                          .map(([name, data]) => (
                          <div
                            key={name}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs shadow-xs"
                          >
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: data.color }} />
                            <span className="font-black text-white">{name}:</span>
                            <span className="font-mono font-black text-amber-400">{data.total} सीटें</span>
                            <span className="text-[10px] text-slate-400 font-normal">({data.count} दल)</span>
                          </div>
                        ));

                        if (noAllianceCount > 0) {
                          pills.push(
                            <div
                              key="none"
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs shadow-xs"
                            >
                              <span className="w-2.5 h-2.5 rounded-full bg-slate-500 shrink-0" />
                              <span className="font-bold text-slate-300">स्वतंत्र / अन्य:</span>
                              <span className="font-mono font-bold text-slate-200">{noAllianceSeats} सीटें</span>
                              <span className="text-[10px] text-slate-400 font-normal">({noAllianceCount} दल)</span>
                            </div>
                          );
                        }

                        return pills.length > 0 ? pills : (
                          <span className="text-xs text-slate-400 italic">
                            नीचे टेबल में पार्टियों के आगे गठबंधन दर्ज करें (उदा. NDA, INDIA)।
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Suggestions Datalist */}
                <datalist id="alliance-suggestions">
                  <option value="NDA" />
                  <option value="INDIA" />
                  <option value="NDA / भाजपा+" />
                  <option value="INDIA / कांग्रेस+" />
                  <option value="महायुति" />
                  <option value="महाविकास अघाड़ी (MVA)" />
                  <option value="महागठबंधन" />
                  <option value="UPA" />
                </datalist>

                <div className="overflow-x-auto rounded-xl border border-slate-700 shadow-md">
                  <table className="w-full text-left text-xs min-w-[950px]">
                    <thead className="bg-slate-800 text-slate-400 uppercase font-black text-[10px]">
                      <tr>
                        <th className="py-3 px-3 w-40">पार्टी नाम</th>
                        <th className="py-3 px-2 w-48 text-amber-400">गठबंधन (Alliance)</th>
                        <th className="py-3 px-3 text-center w-24">कलर</th>
                        <th className="py-3 px-3 min-w-[270px]">पार्टी लोगो (Logo / चुनाव चिह्न)</th>
                        <th className="py-3 px-2 text-center w-16">WIN</th>
                        <th className="py-3 px-2 text-center w-16">LEAD</th>
                        <th className="py-3 px-2 text-center w-20">TOTAL</th>
                        <th className="py-3 px-2 text-center w-20">वोट %</th>
                        <th className="py-3 px-2 text-center w-12">हटाएं</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                      {currentState.parties.map((party, pIdx) => (
                        <tr key={party.id} className="hover:bg-slate-800/40 transition-colors">
                          {/* Name */}
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              value={party.name}
                              onChange={(e) => updatePartyField(pIdx, 'name', e.target.value)}
                              placeholder="उदा. भाजपा या कांग्रेस"
                              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-medium focus:outline-none focus:border-amber-500"
                            />
                          </td>

                          {/* Alliance Selection (Always Visible with Quick 1-Click Buttons) */}
                          <td className="py-2.5 px-2">
                            <input
                              type="text"
                              list="alliance-suggestions"
                              value={party.alliance || ''}
                              onChange={(e) => {
                                updatePartyField(pIdx, 'alliance', e.target.value);
                                if (e.target.value.trim().length > 0) {
                                  updateStateField('hasAlliance', true);
                                }
                              }}
                              placeholder="उदा. NDA या INDIA"
                              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-amber-300 font-bold placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                            />
                            {/* Quick Select Buttons */}
                            <div className="flex flex-wrap gap-1 mt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  updatePartyField(pIdx, 'alliance', 'NDA');
                                  updateStateField('hasAlliance', true);
                                }}
                                className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/40 cursor-pointer"
                              >
                                + NDA
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  updatePartyField(pIdx, 'alliance', 'INDIA');
                                  updateStateField('hasAlliance', true);
                                }}
                                className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 border border-blue-500/40 cursor-pointer"
                              >
                                + INDIA
                              </button>
                              <button
                                type="button"
                                onClick={() => updatePartyField(pIdx, 'alliance', '')}
                                className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-700/50 hover:bg-slate-700 text-slate-300 cursor-pointer"
                              >
                                स्वतंत्र
                              </button>
                            </div>
                          </td>

                          {/* Color */}
                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <input
                                type="color"
                                value={party.color || '#F97316'}
                                onChange={(e) => updatePartyField(pIdx, 'color', e.target.value)}
                                className="w-7 h-7 rounded border border-slate-600 cursor-pointer bg-transparent"
                              />
                              <span className="text-[10px] font-mono text-slate-400">
                                {party.color}
                              </span>
                            </div>
                          </td>

                          {/* Logo (Spacious Section: Thumbnail + URL Input + Upload Button) */}
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              {/* 38x38 Visual Thumbnail Preview */}
                              <div className="w-9 h-9 rounded-lg border border-slate-700 bg-white p-0.5 flex items-center justify-center shrink-0 shadow-inner overflow-hidden relative group">
                                {party.logoUrl ? (
                                  <>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={party.logoUrl}
                                      alt={party.name}
                                      className="w-full h-full object-contain"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => updatePartyField(pIdx, 'logoUrl', '')}
                                      className="absolute inset-0 bg-red-600/90 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-black transition"
                                      title="लोगो हटाएं"
                                    >
                                      ✕
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-[9px] text-slate-400 font-bold">लोगो</span>
                                )}
                              </div>

                              {/* Logo URL input & Upload button */}
                              <div className="flex-1 flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={party.logoUrl || ''}
                                  onChange={(e) => updatePartyField(pIdx, 'logoUrl', e.target.value)}
                                  placeholder="लोगो URL या दाईं ओर अपलोड करें..."
                                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-amber-500"
                                />
                                <label className="px-2.5 py-1 text-xs font-bold bg-slate-700 hover:bg-slate-600 text-white rounded-lg cursor-pointer shrink-0 transition flex items-center gap-1 shadow-xs border border-slate-600" title="कंप्यूटर से इमेज चुनें">
                                  <span>📁</span>
                                  <span>अपलोड</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleUploadImage(e, (url) => updatePartyField(pIdx, 'logoUrl', url))}
                                  />
                                </label>
                              </div>
                            </div>
                          </td>

                          {/* WIN */}
                          <td className="py-2.5 px-2 text-center">
                            <input
                              type="number"
                              value={party.won}
                              onChange={(e) => updatePartyField(pIdx, 'won', e.target.value)}
                              className="w-14 bg-slate-800 border border-slate-700 rounded-lg px-1.5 py-1 text-xs text-center font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                            />
                          </td>

                          {/* LEAD */}
                          <td className="py-2.5 px-2 text-center">
                            <input
                              type="number"
                              value={party.lead}
                              onChange={(e) => updatePartyField(pIdx, 'lead', e.target.value)}
                              className="w-14 bg-slate-800 border border-slate-700 rounded-lg px-1.5 py-1 text-xs text-center font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                            />
                          </td>

                          {/* TOTAL (Auto-computed won+lead) */}
                          <td className="py-2.5 px-2 text-center">
                            <span
                              className="font-black font-mono text-sm block"
                              style={{ color: party.color }}
                            >
                              {party.totalSeats}
                            </span>
                          </td>

                          {/* Vote Share % (Optional - Blank if not entered) */}
                          <td className="py-2.5 px-2 text-center">
                            <input
                              type="number"
                              step="0.1"
                              value={party.voteShare !== undefined && party.voteShare !== null ? party.voteShare : ''}
                              onChange={(e) => updatePartyField(pIdx, 'voteShare', e.target.value)}
                              placeholder="-"
                              className="w-14 bg-slate-800 border border-slate-700 rounded-lg px-1 py-1 text-xs text-center font-mono text-slate-300 focus:outline-none focus:border-amber-500"
                            />
                          </td>

                          {/* Delete */}
                          <td className="py-2.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveParty(pIdx)}
                              className="text-red-400 hover:text-red-300 text-xs font-bold p-1 hover:bg-red-950/40 rounded transition"
                              title="पार्टी हटाएं"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

      {/* AI Auto-Fill Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span>🤖</span>
                <span>AI चुनाव डेटा फेच असिस्टेंट (ECI / Web Source)</span>
              </h3>
              <button
                onClick={() => setAiModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              चुनाव आयोग (ECI) रिजल्ट का URL या चुनाव का नाम दर्ज करें (उदा. <em>'Uttar Pradesh Assembly Election 2026'</em> या <em>'Bihar 2025'</em>)। एआई सीटें, पार्टियां और वोट शेयर स्वतः निकाल लेगा:
            </p>

            <div>
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="उदा. उत्तर प्रदेश विधानसभा चुनाव या ECI परिणाम वेब लिंक..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {aiError && (
              <p className="text-xs text-red-400 font-medium">❌ {aiError}</p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAiModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={handleAiFetch}
                disabled={isAiFetching || !aiQuery.trim()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 flex items-center gap-1.5 transition cursor-pointer"
              >
                {isAiFetching ? (
                  <>
                    <span className="inline-block animate-spin">⚡</span>
                    <span>डेटा फेच हो रहा है...</span>
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    <span>डेटा निकालें और भरें</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
