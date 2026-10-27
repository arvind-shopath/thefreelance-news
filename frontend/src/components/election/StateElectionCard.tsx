'use client';

import React from 'react';
import ParliamentHemicycle, { ParliamentPartySeat } from './ParliamentHemicycle';
import ElectionPartyCards from './ElectionPartyCards';

export interface StateElectionCardData {
  id: string;
  stateName: string;
  stateNameEn?: string;
  mapUrl?: string;
  totalSeats: number;
  declaredSeats: number;
  majority: number;
  statusText?: string;
  lastUpdated?: string;
  sourceText?: string;
  hasAlliance?: boolean;
  parties: ParliamentPartySeat[];
}

interface StateElectionCardProps {
  state: StateElectionCardData;
  isSingleState?: boolean;
}

export default function StateElectionCard({ state, isSingleState = false }: StateElectionCardProps) {
  // Ensure majority is calculated if not provided
  const majority = state.majority || Math.floor((state.totalSeats || 100) / 2) + 1;
  // User Rule: declaredSeats is ALWAYS automatically computed from all parties' seats
  const declaredSeats = state.parties.reduce((sum, p) => sum + (p.totalSeats || 0), 0);

  return (
    <div
      className={`relative rounded-xl border border-slate-800 bg-gradient-to-b from-[#111420] to-[#0c0d14] ${
        isSingleState ? 'p-3 sm:p-4' : 'p-2 sm:p-2.5'
      } shadow-xl flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-slate-700/80 h-full`}
    >
      {/* Top Accent Gradient Border Glow */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-amber-500 via-red-500 to-indigo-500 opacity-80" />

      {/* State Header Card: Single-line sleek layout */}
      <div className="flex items-center justify-between gap-1.5 border-b border-slate-800/80 pb-1 mb-1">
        <div className="min-w-0 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shrink-0" />
          <h3 className="font-black text-xs sm:text-sm text-white truncate leading-tight tracking-wide">
            {state.stateName}
          </h3>
          {state.stateNameEn && (
            <span className="text-[10px] text-slate-400 truncate hidden sm:inline">
              ({state.stateNameEn})
            </span>
          )}
        </div>

        {/* Majority Pill Badge */}
        <div className="shrink-0 flex items-center gap-1 text-[9px]">
          <span className="font-black px-1.5 py-0.2 rounded-full bg-red-950/80 text-red-300 border border-red-800/60 shadow-xs">
            बहुमत: {majority}
          </span>
          <span className="font-mono text-slate-400">
            ({state.totalSeats} सीटें)
          </span>
        </div>
      </div>

      {isSingleState ? (
        /* Side-by-Side (दाएं-बाएं) Layout for Single State View */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6 items-center py-1">
          {/* Left (बाएं): Parliament Hemicycle (Expands adaptively to fill space generously) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <ParliamentHemicycle
              totalSeats={state.totalSeats}
              declaredSeats={declaredSeats}
              majority={majority}
              parties={state.parties}
              mapUrl={state.mapUrl}
              stateName={state.stateName}
              statusText={state.statusText || 'रुझान जारी'}
              partyCount={state.parties.length}
              isSingleState={true}
            />
          </div>

          {/* Right (दाएं): Party Breakdown Table & Vote Share */}
          <div className="md:col-span-7 flex flex-col justify-center">
            <ElectionPartyCards
              parties={state.parties}
              totalSeats={state.totalSeats}
              lastUpdated={state.lastUpdated}
              sourceText={state.sourceText}
              hasAlliance={state.hasAlliance}
            />
          </div>
        </div>
      ) : (
        /* Stacked (ऊपर-नीचे) Layout for Multi-State Grid */
        /* User Rule: Card height matches siblings, top graphic flexes to fill available vertical space evenly */
        <div className="flex-1 flex flex-col justify-between space-y-1">
          {/* Top Graphic: Flexes to fill remaining vertical space without forcing min-height */}
          <div className="flex-1 flex flex-col items-center justify-center py-0.5 min-h-0">
            <ParliamentHemicycle
              totalSeats={state.totalSeats}
              declaredSeats={declaredSeats}
              majority={majority}
              parties={state.parties}
              mapUrl={state.mapUrl}
              stateName={state.stateName}
              statusText={state.statusText || 'रुझान जारी'}
              partyCount={state.parties.length}
              isSingleState={false}
            />
          </div>

          {/* Bottom Table: Aligned cleanly at the bottom */}
          <div className="shrink-0 w-full">
            <ElectionPartyCards
              parties={state.parties}
              totalSeats={state.totalSeats}
              lastUpdated={state.lastUpdated}
              sourceText={state.sourceText}
              hasAlliance={state.hasAlliance}
            />
          </div>
        </div>
      )}
    </div>
  );
}
