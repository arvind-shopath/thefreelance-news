'use client';

import React, { useMemo, useState } from 'react';

export interface ParliamentPartySeat {
  id: string;
  name: string;
  shortName?: string;
  color: string;
  logoUrl?: string;
  alliance?: string;
  won: number;
  lead: number;
  totalSeats: number;
  voteShare?: number;
}

interface ParliamentHemicycleProps {
  totalSeats: number;
  declaredSeats: number;
  majority: number;
  parties: ParliamentPartySeat[];
  mapUrl?: string;
  stateName?: string;
  statusText?: string;
  interactive?: boolean;
  partyCount?: number;
  isSingleState?: boolean;
}

interface SeatDot {
  x: number;
  y: number;
  angle: number; // in degrees: 180 (left) to 0 (right)
  row: number;
  color: string;
  partyName: string;
  isFilled: boolean;
  order: number;
}

export default function ParliamentHemicycle({
  totalSeats = 403,
  declaredSeats = 0,
  majority = 202,
  parties = [],
  mapUrl,
  stateName = 'विधानसभा',
  statusText = 'रुझान जारी',
  interactive = true,
  partyCount,
  isSingleState = false,
}: ParliamentHemicycleProps) {
  const [fillProgress, setFillProgress] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const animRef = React.useRef<number | null>(null);

  // 0-to-Target Progressive Fill Animation (Smoother and slower: 2200ms duration)
  const startFillAnimation = React.useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const duration = 2200; // Slower, silky-smooth 2.2s animation
    const start = performance.now();

    const animate = (time: number) => {
      const elapsed = time - start;
      const t = Math.min(1, elapsed / duration);
      // Smooth sinusoidal ease-in-out
      const ease = 0.5 - 0.5 * Math.cos(Math.PI * t);
      setFillProgress(ease);
      setDisplayCount(Math.round(ease * declaredSeats));

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  }, [declaredSeats]);

  React.useEffect(() => {
    startFillAnimation();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [startFillAnimation]);

  // Trigger animation on hover, click or touch
  const handleInteraction = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    startFillAnimation();
  };

  // Generate Hemicycle seat dots
  const { dots } = useMemo(() => {
    const seatsToRender = Math.max(20, Math.min(totalSeats, 360));
    const scaleFactor = totalSeats > 0 ? seatsToRender / totalSeats : 1;

    // User Rule: Parties with higher numbers are rendered first (highest seats first, then won, lead, voteShare)
    const sortedParties = [...parties].sort((a, b) => {
      const bTotal = Number(b.totalSeats !== undefined ? b.totalSeats : (b.won || 0) + (b.lead || 0));
      const aTotal = Number(a.totalSeats !== undefined ? a.totalSeats : (a.won || 0) + (a.lead || 0));
      if (bTotal !== aTotal) return bTotal - aTotal;
      if ((b.won || 0) !== (a.won || 0)) return (b.won || 0) - (a.won || 0);
      if ((b.lead || 0) !== (a.lead || 0)) return (b.lead || 0) - (a.lead || 0);
      return (Number(b.voteShare) || 0) - (Number(a.voteShare) || 0);
    });

    let allocatedSeats = 0;
    const partySeatAllocations = sortedParties.map(p => {
      const scaled = Math.round(Number(p.totalSeats || 0) * scaleFactor);
      allocatedSeats += scaled;
      return {
        ...p,
        renderSeats: scaled,
      };
    });

    const numRows = totalSeats > 250 ? 5 : (totalSeats > 100 ? 5 : 4);
    const innerRadius = 45;
    const outerRadius = 98;
    const rowRadii: number[] = [];
    let sumRadii = 0;

    for (let i = 0; i < numRows; i++) {
      const r = innerRadius + (i * (outerRadius - innerRadius)) / (numRows - 1);
      rowRadii.push(r);
      sumRadii += r;
    }

    const rowCounts: number[] = [];
    let remainingDots = seatsToRender;
    for (let i = 0; i < numRows; i++) {
      if (i === numRows - 1) {
        rowCounts.push(remainingDots);
      } else {
        const count = Math.round((rowRadii[i] / sumRadii) * seatsToRender);
        rowCounts.push(count);
        remainingDots -= count;
      }
    }

    const rawDots: Array<{ x: number; y: number; angle: number; row: number }> = [];
    const centerX = 135;
    const centerY = 118;

    rowCounts.forEach((count, rowIdx) => {
      const r = rowRadii[rowIdx];
      for (let j = 0; j < count; j++) {
        const angleDeg = count > 1 ? 180 - (j * 180) / (count - 1) : 90;
        const angleRad = (angleDeg * Math.PI) / 180;
        const x = centerX + r * Math.cos(angleRad);
        const y = centerY - r * Math.sin(angleRad);
        rawDots.push({ x, y, angle: angleDeg, row: rowIdx });
      }
    });

    rawDots.sort((a, b) => b.angle - a.angle || a.row - b.row);

    let currentDotIdx = 0;
    const coloredDots: SeatDot[] = [];

    partySeatAllocations.forEach(party => {
      for (let s = 0; s < party.renderSeats && currentDotIdx < rawDots.length; s++) {
        coloredDots.push({
          ...rawDots[currentDotIdx],
          color: party.color || '#F97316',
          partyName: party.name,
          isFilled: true,
          order: currentDotIdx,
        });
        currentDotIdx++;
      }
    });

    while (currentDotIdx < rawDots.length) {
      coloredDots.push({
        ...rawDots[currentDotIdx],
        color: '#1e293b',
        partyName: 'अघोषित / अनिर्णीत',
        isFilled: false,
        order: currentDotIdx,
      });
      currentDotIdx++;
    }

    return { dots: coloredDots };
  }, [totalSeats, parties]);

  const centerX = 135;
  const centerY = 118;
  const majorityYTop = 8;
  const filledDotsCount = dots.filter(d => d.isFilled).length;

  // User Rule: Dynamic graphic scaling to fit inside screen without scrolling
  // "पट्टियां छोटी हो जाएंगी.. ग्राफिक्स छोटा हो जाएगा.. लेकिन आएगा स्क्रीन के अंदर ही.."
  const effectiveCount = partyCount !== undefined ? partyCount : parties.length;
  const sizeClass = isSingleState
    ? 'max-w-[260px] sm:max-w-[320px]'
    : effectiveCount <= 3
      ? 'max-w-[200px] sm:max-w-[220px]'
      : effectiveCount <= 5
        ? 'max-w-[165px] sm:max-w-[180px]'
        : 'max-w-[135px] sm:max-w-[150px]';

  return (
    <div
      className="relative select-none flex flex-col items-center justify-center cursor-pointer group w-full"
      onMouseEnter={handleInteraction}
      onTouchStart={handleInteraction}
      onClick={handleInteraction}
    >
      {/* Dynamic/Adaptive Hemicycle Parliament SVG Chart */}
      <div className={`relative w-full ${sizeClass} aspect-[270/125] transition-all duration-300`}>
        <svg
          viewBox="0 0 270 125"
          className="w-full h-full overflow-visible"
        >
          {/* Semicircle Guide Tracks */}
          <path
            d="M 37 118 A 98 98 0 0 1 233 118"
            fill="none"
            stroke="currentColor"
            className="text-slate-800/40"
            strokeWidth="0.8"
            strokeDasharray="2 3"
          />
          <path
            d="M 90 118 A 45 45 0 0 1 180 118"
            fill="none"
            stroke="currentColor"
            className="text-slate-800/30"
            strokeWidth="0.8"
          />

          {/* Seat Dots (Animate 0 to target progress) */}
          <g>
            {dots.map((dot, idx) => {
              const isLit =
                dot.isFilled &&
                (filledDotsCount > 0
                  ? (dot.order + 1) / filledDotsCount <= fillProgress
                  : false);
              const dotColor = isLit ? dot.color : '#1e293b';
              const dotOpacity = isLit ? 1 : 0.35;

              return (
                <circle
                  key={idx}
                  cx={dot.x}
                  cy={dot.y}
                  r={isLit ? 2.3 : 1.7}
                  fill={dotColor}
                  style={{
                    opacity: dotOpacity,
                    transition: 'fill 0.12s ease-out, opacity 0.12s ease-out',
                    filter: isLit ? 'drop-shadow(0 0 1px rgba(0,0,0,0.6))' : 'none',
                  }}
                >
                  <title>{`${dot.partyName}`}</title>
                </circle>
              );
            })}
          </g>

          {/* Vertical Center Majority Line (बहुमत रेखा) */}
          <line
            x1={centerX}
            y1={majorityYTop + 14}
            x2={centerX}
            y2={centerY - 10}
            stroke="#EF4444"
            strokeWidth="1.2"
            strokeDasharray="2.5 2.5"
            className="opacity-80"
          />

          {/* Majority Threshold Badge on top of Majority Line */}
          <g transform={`translate(${centerX}, ${majorityYTop})`}>
            <rect
              x="-30"
              y="-8"
              width="60"
              height="16"
              rx="8"
              fill="#1e1b4b"
              stroke="#EF4444"
              strokeWidth="1"
              className="drop-shadow-sm"
            />
            <text
              x="0"
              y="3.5"
              textAnchor="middle"
              className="fill-red-400 font-black tracking-wider"
              style={{ fontSize: '8px', fontWeight: 900 }}
            >
              बहुमत: {majority}
            </text>
          </g>

          {/* Horizontal Base Line */}
          <line
            x1="30"
            y1={centerY}
            x2="240"
            y2={centerY}
            stroke="currentColor"
            className="text-slate-700/60"
            strokeWidth="1"
          />
        </svg>

        {/* Center Hollow Content: State PNG Map or Parliament graphic + Live Seat Counter */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center text-center pointer-events-none">
          {mapUrl ? (
            <div className="relative w-8 sm:w-10 h-6 sm:h-7 mb-0.2 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mapUrl}
                alt={stateName}
                className="max-h-6 sm:max-h-7 max-w-8 sm:max-w-10 object-contain drop-shadow-sm filter brightness-110"
              />
            </div>
          ) : (
            <div className="text-xs sm:text-sm mb-0.2 filter drop-shadow opacity-90">
              🏛️
            </div>
          )}

          {/* Declared / Total Seats Counter — Animates 0 to Target */}
          <div className="flex items-baseline gap-0.5 font-mono">
            <span className="text-xs sm:text-sm font-black text-amber-400 tracking-tight">
              {displayCount}
            </span>
            <span className="text-slate-400 text-[9px] font-bold">
              /{totalSeats}
            </span>
            <span className="text-[7px] uppercase font-bold text-slate-400 ml-0.2">
              सीटें
            </span>
          </div>

          {/* Live Status Indicator */}
          <div className="flex items-center gap-1 mt-0">
            <span className="w-1 h-1 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-[8px] font-bold text-red-400 leading-none">
              {statusText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
