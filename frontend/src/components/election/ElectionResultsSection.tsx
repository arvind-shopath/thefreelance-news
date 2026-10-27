'use client';

import React, { useEffect, useState } from 'react';
import StateElectionCard, { StateElectionCardData } from './StateElectionCard';

export interface ElectionResultsSectionProps {
  initialConfig?: {
    isActive: boolean;
    headerTitle: string;
    headerBadge?: string;
    states: StateElectionCardData[];
  } | null;
  isPreview?: boolean;
}

export default function ElectionResultsSection({
  initialConfig,
  isPreview = false,
}: ElectionResultsSectionProps) {
  const [config, setConfig] = useState(initialConfig);
  const [activeStateTab, setActiveStateTab] = useState<string>('all');
  const [isUrlPreview, setIsUrlPreview] = useState<boolean>(false);

  useEffect(() => {
    // Check if URL has preview query parameter
    let hasPreviewQuery = false;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (
        params.get('preview') === 'election' ||
        params.get('election_preview') === '1' ||
        params.get('election_preview') === 'true'
      ) {
        hasPreviewQuery = true;
        setIsUrlPreview(true);
      }
    }

    if (initialConfig !== undefined && !hasPreviewQuery) {
      setConfig(initialConfig);
      return;
    }

    // Client-side fetch
    const fetchConfig = async () => {
      try {
        const fetchUrl = hasPreviewQuery ? `/api/v1/election?t=${Date.now()}` : '/api/v1/election';
        const res = await fetch(fetchUrl, { cache: hasPreviewQuery ? 'no-store' : 'default' });
        if (res.ok) {
          const data = await res.json();
          setConfig(data);
        }
      } catch (err) {
        console.error('Error fetching election config:', err);
      }
    };

    fetchConfig();
  }, [initialConfig]);

  const effectivePreview = isPreview || isUrlPreview;

  // If inactive and not in preview mode, don't render anything
  if (!effectivePreview && (!config || !config.isActive || !config.states || config.states.length === 0)) {
    return null;
  }

  const states = config?.states || [];
  if (states.length === 0) return null;

  // Filter states if single tab is selected (optional filter on mobile/desktop)
  const displayedStates = activeStateTab === 'all'
    ? states
    : states.filter(s => s.id === activeStateTab);

  // Determine grid column layout based on number of states
  // Requirement: "एक साथ 6 राज्य दिखाए जा सकेंगे.. तीन ऊपर तीन नीचे.."
  // If 1 state: centered max-w-xl
  // If 2 states: 2 cols
  const isSingleState = displayedStates.length === 1;

  // Determine grid column layout based on number of states
  const getGridClass = () => {
    if (isSingleState) {
      return 'max-w-4xl lg:max-w-5xl mx-auto';
    }
    if (displayedStates.length === 2) {
      return 'grid grid-cols-1 md:grid-cols-2 gap-2.5 max-w-6xl mx-auto';
    }
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2';
  };

  return (
    <section className="w-full bg-[#08090e] border-b border-red-950/40 relative overflow-hidden py-1.5 sm:py-2">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-2.5 sm:px-6 lg:px-8 relative z-10 space-y-1.5">
        {/* Admin Preview Mode Indicator */}
        {isUrlPreview && (
          <div className="bg-amber-500/15 border border-amber-500/40 rounded-lg px-2.5 py-0.5 flex flex-wrap items-center justify-between gap-1.5 shadow-xs text-[11px]">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <span>👁️</span>
              <span>
                <strong>एडमिन लाइव प्रीव्यू:</strong>{' '}
                {config?.isActive
                  ? '🟢 विजेट पाठकों के लिए भी लाइव है।'
                  : '⚪ विजेट केवल आपको दिख रहा है (आम पाठकों के लिए ऑफ है)।'}
              </span>
            </div>
            <a
              href="/tfl/dashboard/election"
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-black transition"
            >
              ← डैशबोर्ड में वापस जाएं
            </a>
          </div>
        )}

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800/80 pb-1">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-red-600 text-white shadow-xs flex items-center gap-1 shrink-0 animate-pulse">
              <span className="w-1 h-1 rounded-full bg-white" />
              {config?.headerBadge || '🔴 LIVE ELECTION DESK'}
            </span>
            <h2 className="text-xs sm:text-sm font-black text-white tracking-wide truncate">
              {config?.headerTitle || 'विधानसभा चुनाव 2026: ताज़ा रुझान व नतीजे'}
            </h2>
          </div>

          {/* Multi-State Tab Filter (If more than 1 state) */}
          {states.length > 1 && (
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveStateTab('all')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                  activeStateTab === 'all'
                    ? 'bg-amber-500 text-black font-black shadow-xs'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                सभी {states.length} राज्य
              </button>
              {states.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setActiveStateTab(st.id)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                    activeStateTab === st.id
                      ? 'bg-amber-500 text-black font-black shadow-xs'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {st.stateName}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* States Results Grid (1 state = side-by-side, 2+ states = multi-column) */}
        <div className={getGridClass()}>
          {displayedStates.map((st) => (
            <StateElectionCard key={st.id} state={st} isSingleState={isSingleState} />
          ))}
        </div>
      </div>
    </section>
  );
}
