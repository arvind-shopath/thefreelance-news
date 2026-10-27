import React from 'react';
import Link from 'next/link';
import { EditorialDesk } from '@/lib/editorialDesks';

export default function EditorialDeskCard({
  desk,
  isEn = false
}: {
  desk: EditorialDesk;
  isEn?: boolean;
}) {
  const deskName = isEn ? desk.nameEn : desk.nameHi;
  const deskRole = isEn ? desk.roleEn : desk.roleHi;
  const deskDesc = isEn ? desk.descEn : desk.descHi;

  return (
    <div className="my-10 p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#12141c] to-[#181b28] border border-gray-800 shadow-xl editorial-desk-card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-5 border-b border-gray-800/80">
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-red-900/30 shrink-0">
          <span>✍️</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight editorial-desk-title">
              {deskName}
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <svg className="w-3 h-3 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
              {isEn ? "Verified Editorial Desk" : "सत्यापित संपादकीय डेस्क"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1 editorial-desk-role">
            {deskRole}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mt-4 editorial-desk-desc">
        {deskDesc} {isEn 
          ? "We are committed to unbiased, factual journalism based on verified agencies, official statements, and on-the-ground correspondents." 
          : "हम निष्पक्ष, सटीक और तथ्यात्मक पत्रकारिता के लिए प्रतिबद्ध हैं। यह समाचार रिपोर्ट विभिन्न प्रमाणित समाचार एजेंसियों, आधिकारिक बयानों और स्थानीय संवाददाताओं से प्राप्त इनपुट के आधार पर तैयार की जाती है।"}
      </p>

      {/* Standards & Transparency Footer */}
      <div className="mt-5 pt-4 border-t border-gray-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-gray-400 editorial-desk-footer">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span>✓</span> {isEn ? "Strict Double Fact-Checking" : "दोहरा तथ्य-सत्यापन प्रमाणित"}
          </span>
          <span className="text-gray-700 hidden sm:inline">•</span>
          <Link href="/editorial-policy" className="hover:text-white transition-colors underline decoration-dotted">
            {isEn ? "Editorial Code of Ethics" : "संपादकीय आचार संहिता"}
          </Link>
          <span className="text-gray-700 hidden sm:inline">•</span>
          <Link href="/grievance" className="hover:text-white transition-colors underline decoration-dotted">
            {isEn ? "Grievance Redressal" : "शिकायत निवारण"}
          </Link>
        </div>

        <a
          href={`mailto:${desk.email}?subject=${encodeURIComponent(`News Tip / Feedback for ${deskName}`)}`}
          className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 font-bold transition-colors"
        >
          <span>✉</span> {isEn ? "Send News Tip" : "समाचार सुझाव भेजें"} →
        </a>
      </div>
    </div>
  );
}
