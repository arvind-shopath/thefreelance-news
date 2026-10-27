'use client';

import React from 'react';
import { ParliamentPartySeat } from './ParliamentHemicycle';

interface ElectionPartyCardsProps {
  parties: ParliamentPartySeat[];
  totalSeats: number;
  lastUpdated?: string;
  sourceText?: string;
  hasAlliance?: boolean;
}

export default function ElectionPartyCards({
  parties = [],
  totalSeats = 403,
  lastUpdated,
  sourceText = 'स्रोत: भारत निर्वाचन आयोग (ECI)',
  hasAlliance = false,
}: ElectionPartyCardsProps) {
  // User Rule: जिसके नंबर ज्यादा होंगे वो सबसे ऊपर दिखेगा (Rank #1 first, #2 next, #3 next)
  const sortedParties = React.useMemo(() => {
    return [...parties].sort((a, b) => {
      const bTotal = Number(b.totalSeats !== undefined ? b.totalSeats : (b.won || 0) + (b.lead || 0));
      const aTotal = Number(a.totalSeats !== undefined ? a.totalSeats : (a.won || 0) + (a.lead || 0));
      if (bTotal !== aTotal) return bTotal - aTotal;
      if ((b.won || 0) !== (a.won || 0)) return (b.won || 0) - (a.won || 0);
      if ((b.lead || 0) !== (a.lead || 0)) return (b.lead || 0) - (a.lead || 0);
      return (Number(b.voteShare) || 0) - (Number(a.voteShare) || 0);
    });
  }, [parties]);

  // User Rule: Only display vote share if explicitly filled and greater than 0
  const hasVoteShare = sortedParties.some(
    (p) => p.voteShare !== undefined && p.voteShare !== null && Number(p.voteShare) > 0
  );

  // Group parties by Alliance to build the Top Alliance Cards
  const allianceData = React.useMemo(() => {
    const allianceMap = new Map<string, {
      name: string;
      color: string;
      won: number;
      lead: number;
      totalSeats: number;
      voteShare?: number;
      partyCount: number;
    }>();

    let standaloneSeats = 0;
    let standaloneCount = 0;

    parties.forEach(p => {
      let allName = (p.alliance || '').trim();
      if (!allName && (p.shortName === 'NDA' || p.shortName === 'INDIA' || p.shortName === 'UPA' || p.shortName === 'MVA')) {
        allName = p.shortName;
      }

      if (allName) {
        if (!allianceMap.has(allName)) {
          // Identify theme color for alliance
          let themeColor = p.color || '#F97316';
          if (allName.toUpperCase().includes('NDA')) themeColor = '#F97316';
          else if (allName.toUpperCase().includes('INDIA')) themeColor = '#DC2626';

          allianceMap.set(allName, {
            name: allName,
            color: themeColor,
            won: 0,
            lead: 0,
            totalSeats: 0,
            voteShare: undefined,
            partyCount: 0,
          });
        }
        const g = allianceMap.get(allName)!;
        g.won += p.won || 0;
        g.lead += p.lead || 0;
        g.totalSeats += p.totalSeats || 0;
        if (p.voteShare !== undefined && p.voteShare !== null && Number(p.voteShare) > 0) {
          g.voteShare = Number(((g.voteShare || 0) + Number(p.voteShare)).toFixed(1));
        }
        g.partyCount += 1;
      } else {
        standaloneSeats += p.totalSeats || 0;
        standaloneCount += 1;
      }
    });

    // User Rule: जिसके नंबर ज्यादा होंगे वो ऊपर हो जाएगा (NDA, INDIA या कोई अन्य गठबंधन)
    const alliancesList = Array.from(allianceMap.values()).sort((a, b) => {
      const bTotal = Number(b.totalSeats !== undefined ? b.totalSeats : (b.won || 0) + (b.lead || 0));
      const aTotal = Number(a.totalSeats !== undefined ? a.totalSeats : (a.won || 0) + (a.lead || 0));
      if (bTotal !== aTotal) return bTotal - aTotal;
      if ((b.won || 0) !== (a.won || 0)) return (b.won || 0) - (a.won || 0);
      if ((b.lead || 0) !== (a.lead || 0)) return (b.lead || 0) - (a.lead || 0);
      return (Number(b.voteShare) || 0) - (Number(a.voteShare) || 0);
    });

    return {
      alliances: alliancesList,
      standaloneSeats,
      standaloneCount,
      hasAnyAlliance: alliancesList.length > 0,
    };
  }, [parties]);

  // User Rule: Dynamic sizing based on number of parties so everything fits strictly within viewport height
  // "पट्टियां छोटी हो जाएंगी.. ग्राफिक्स छोटा हो जाएगा.. लेकिन आएगा स्क्रीन के अंदर ही.."
  const partyCount = sortedParties.length;
  const isUltraCompact = partyCount >= 5;
  const isCompact = partyCount === 4;

  return (
    <div className="w-full space-y-1">
      {/* 1. Alliance Cards: Sleek, compact & ranked #1 top */}
      {allianceData.hasAnyAlliance && (
        <div className="flex flex-wrap items-center gap-1 pb-0.5">
          {allianceData.alliances.map((alliance) => (
            <div
              key={alliance.name}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md border shadow-xs transition-transform hover:scale-[1.02]"
              style={{
                backgroundColor: `${alliance.color}20`,
                borderColor: `${alliance.color}70`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0 shadow-xs"
                style={{ backgroundColor: alliance.color }}
              />
              <span className="font-black text-white text-[10px] sm:text-xs tracking-tight">
                {alliance.name}
              </span>
              <span
                className="font-mono font-black text-[10px] sm:text-xs px-1 py-0.2 rounded shadow-xs"
                style={{
                  backgroundColor: alliance.color,
                  color: '#ffffff',
                }}
              >
                {alliance.totalSeats} सीटें
              </span>
              <span className="text-[8px] text-slate-300 font-medium">
                ({alliance.partyCount} दल)
              </span>
            </div>
          ))}

          {/* Standalone / Others Pill */}
          {allianceData.standaloneCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/80 text-[10px] sm:text-xs shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
              <span className="font-bold text-slate-300">अन्य/स्वतंत्र:</span>
              <span className="font-mono font-black text-white bg-slate-700 px-1 py-0.2 rounded">
                {allianceData.standaloneSeats} सीटें
              </span>
            </div>
          )}
        </div>
      )}

      {/* 2. Vote Share Segmented Bar — Only visible if vote share data is actually entered */}
      {hasVoteShare && (
        <div className="space-y-0.5">
          <div className="flex justify-between items-center text-[8px] font-bold text-slate-400">
            <span>📊 वोट शेयर वितरण (Vote Share)</span>
            <span className="text-[8px] text-slate-500 font-mono">% शेयर</span>
          </div>
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden flex border border-slate-700/60 shadow-inner">
            {sortedParties.map((p) => {
              const widthPct = Math.max(0, Math.min(100, Number(p.voteShare) || 0));
              if (widthPct <= 0) return null;
              return (
                <div
                  key={p.id}
                  className="h-full transition-all duration-700 relative group/bar"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: p.color || '#F97316',
                  }}
                  title={`${p.name}: ${p.voteShare}%`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Party Breakdown Table with Dynamic Strip Height */}
      <div className="overflow-hidden rounded-lg border border-slate-700/70 bg-slate-900/60 backdrop-blur-md shadow-xs">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-1 py-1 px-2 bg-slate-950 text-[9px] font-black text-slate-300 uppercase tracking-wider border-b border-slate-800">
          <div className="col-span-5 text-left">पार्टी (PARTY)</div>
          <div className="col-span-2 text-center">WIN (जीते)</div>
          <div className="col-span-2 text-center">LEAD (आगे)</div>
          <div className="col-span-3 text-right">
            {hasVoteShare ? 'TOTAL (वोट %)' : 'TOTAL (कुल)'}
          </div>
        </div>

        {/* Table Body: Party-by-Party with Dynamic Strip Heights & Max-Height Safety */}
        <div className="divide-y divide-black/25 max-h-[260px] overflow-y-auto scrollbar-none">
          {sortedParties.map((party) => {
            const hasPartyVoteShare =
              party.voteShare !== undefined &&
              party.voteShare !== null &&
              Number(party.voteShare) > 0;

            const partyAlliance = (party.alliance || '').trim() ||
              ((party.shortName === 'NDA' || party.shortName === 'INDIA' || party.shortName === 'UPA' || party.shortName === 'MVA') ? party.shortName : '');

            return (
              <div
                key={party.id}
                className={`grid grid-cols-12 gap-1 items-center transition-all border-b border-black/25 text-white hover:brightness-110 shadow-xs ${
                  isUltraCompact
                    ? 'py-0.5 px-2 text-[11px]'
                    : isCompact
                      ? 'py-1 px-2 text-xs'
                      : 'py-1 px-2.5 text-xs'
                }`}
                style={{
                  backgroundColor: party.color || '#F97316',
                }}
              >
                {/* Party Name, Logo & Alliance Badge */}
                <div className="col-span-5 flex items-center gap-1.5 min-w-0 pr-1">
                  {/* Logo Container: Stretches top-to-bottom of the strip with 1px margin */}
                  {party.logoUrl ? (
                    <div
                      className={`rounded bg-white p-0.5 shadow-xs border border-white/80 shrink-0 flex items-center justify-center overflow-hidden my-0.2 ${
                        isUltraCompact
                          ? 'h-[20px] sm:h-[22px] w-7 sm:w-8'
                          : isCompact
                            ? 'h-[24px] sm:h-[26px] w-8 sm:w-9'
                            : 'h-[28px] sm:h-[30px] w-9 sm:w-11'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={party.logoUrl}
                        alt={party.name}
                        className="max-w-full max-h-full w-auto h-auto object-contain"
                      />
                    </div>
                  ) : (
                    <div
                      className={`rounded bg-white/20 border border-white/50 backdrop-blur-xs flex items-center justify-center text-white font-black shrink-0 my-0.2 shadow-xs ${
                        isUltraCompact
                          ? 'h-[20px] sm:h-[22px] w-6 sm:w-7 text-[9px]'
                          : isCompact
                            ? 'h-[24px] sm:h-[26px] w-7 sm:w-8 text-[10px]'
                            : 'h-[28px] sm:h-[30px] w-8 sm:w-9 text-xs'
                      }`}
                    >
                      {party.name.slice(0, 3)}
                    </div>
                  )}

                  <div className="flex items-center gap-1 min-w-0 flex-wrap">
                    <span
                      className={`font-black text-white truncate leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] ${
                        isUltraCompact ? 'text-[11px] sm:text-xs' : 'text-xs sm:text-sm'
                      }`}
                      title={party.name}
                    >
                      {party.name}
                    </span>

                    {/* Alliance badge */}
                    {partyAlliance ? (
                      <span className="text-[8px] font-black px-1 py-0.2 rounded bg-black/40 text-white border border-white/40 shadow-xs shrink-0 backdrop-blur-xs">
                        {partyAlliance}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* WIN Count */}
                <div
                  className={`col-span-2 text-center font-mono font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] ${
                    isUltraCompact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
                  }`}
                >
                  {party.won}
                </div>

                {/* LEAD Count */}
                <div
                  className={`col-span-2 text-center font-mono font-black text-yellow-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] ${
                    isUltraCompact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
                  }`}
                >
                  {party.lead}
                </div>

                {/* TOTAL + Optional Vote Share % */}
                <div className="col-span-3 text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span
                      className={`font-black font-mono text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] ${
                        isUltraCompact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
                      }`}
                    >
                      {party.totalSeats}
                    </span>
                    {hasPartyVoteShare && (
                      <span className="text-[9px] sm:text-[10px] font-mono font-bold text-white/90 drop-shadow-xs">
                        ({party.voteShare}%)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex flex-wrap items-center justify-between text-[8px] text-slate-500 px-0.5 pt-0.2">
        {lastUpdated && <span>🕒 {lastUpdated}</span>}
        <span>{sourceText}</span>
      </div>
    </div>
  );
}
