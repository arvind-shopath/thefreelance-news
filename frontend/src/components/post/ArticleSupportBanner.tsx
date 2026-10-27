import React from "react";
import Link from "next/link";

interface ArticleSupportBannerProps {
  isEn?: boolean;
}

export default function ArticleSupportBanner({ isEn = false }: ArticleSupportBannerProps) {
  if (isEn) {
    return (
      <div className="my-8 bg-gradient-to-br from-[#141724] via-[#0f111a] to-[#0b0c10] border border-red-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden article-support-banner">
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 rounded-full blur-[60px] pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-xl shrink-0">
              ❤️
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-600/10 px-2 py-0.5 rounded-full border border-red-500/20">
                  Reader-Supported Journalism
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-white leading-snug article-support-title">
                Support Independent Global Journalism
              </h4>
              <p className="text-xs text-gray-300 mt-1 max-w-xl leading-relaxed article-support-desc">
                The FreeLance is an independent media outlet without corporate or political backing. Your support helps us deliver fearless, unbiased ground reporting.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <a
              href="https://www.paypal.com/paypalme/iarvindshukla"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#0070ba] hover:bg-[#003087] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all active:scale-95"
            >
              <span>💳</span>
              <span>Donate via PayPal</span>
            </a>
            <Link
              href="/support"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all active:scale-95"
            >
              <span>UPI / More</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 bg-gradient-to-br from-[#141724] via-[#0f111a] to-[#0b0c10] border border-red-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden article-support-banner">
      <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 rounded-full blur-[60px] pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-xl shrink-0">
            ❤️
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-600/10 px-2 py-0.5 rounded-full border border-red-500/20">
                100% पाठक समर्थित मीडिया
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-black text-white leading-snug article-support-title">
              निष्पक्ष व निडर पत्रकारिता को आपका साथ चाहिए
            </h4>
            <p className="text-xs text-gray-300 mt-1 max-w-xl leading-relaxed article-support-desc">
              द फ्रीलांस बिना किसी कॉर्पोरेट या राजनीतिक दबाव के जनसरोकार की खबरें आप तक पहुँचाता है। आपका छोटा सा योगदान भी हमारी स्वतंत्रता की ताकत है।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
          <Link
            href="/support"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-95"
          >
            <span>📱</span>
            <span>सहयोग करें (UPI / QR)</span>
          </Link>
          <a
            href="https://www.paypal.com/paypalme/iarvindshukla"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-[#0070ba] hover:bg-[#003087] text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-lg transition-all active:scale-95"
          >
            <span>PayPal</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
