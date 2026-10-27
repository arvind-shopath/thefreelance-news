"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

export default function EnglishSupportPage() {
  const [copied, setCopied] = useState<boolean>(false);

  const payeeName = "Arvind Shukla";
  const upiId = "iarvind@ptaxis";
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&cu=INR&tn=${encodeURIComponent("Support TheFreelance")}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main className="min-h-screen bg-[#0b0c10] text-gray-200">
      <Header />

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#14161f] via-[#0b0c10] to-[#0b0c10] border-b border-gray-800/80 pt-8 pb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-5 font-medium">
            <Link href="/en" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span className="text-red-500 font-semibold">Support Us</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-500/30 text-red-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            100% Reader-Supported Independent Journalism
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight mb-3">
            Stand With Fearless, Independent News
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            The FreeLance operates with complete editorial independence, free from government propaganda and corporate capture. Your voluntary contribution powers our reporters, fact-checkers, and investigations.
          </p>
        </div>
      </div>

      {/* Support Methods Grid: Global PayPal (Primary for International Readers) + UPI */}
      <div className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Method 1: Global PayPal / International Card */}
        <div className="bg-[#12141c] border border-blue-900/40 rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center shadow-2xl relative justify-between">
          <div className="w-full">
            {/* Header Brand */}
            <div className="w-full flex items-center justify-between border-b border-gray-800/80 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌍</span>
                <span className="font-bold text-white text-sm">International / Worldwide</span>
              </div>
              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                PayPal Verified
              </span>
            </div>

            {/* PayPal Icon / Visual */}
            <div className="my-4 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#003087] to-[#0070ba] flex items-center justify-center shadow-xl shadow-blue-600/20 mb-3 border border-blue-400/30">
                <span className="text-3xl font-black text-white italic tracking-tighter">P</span>
              </div>
              <h3 className="text-lg font-black text-white">PayPal.Me Contribution</h3>
              <p className="text-xs text-gray-300 mt-1 max-w-xs leading-relaxed">
                Contribute in USD ($), CAD (C$), GBP (£), EUR (€), SGD (S$) or any currency via Credit Card, Debit Card or PayPal account.
              </p>
            </div>

            {/* PayPal Handle & Email Box */}
            <div className="w-full bg-[#0b0c10] border border-blue-900/40 rounded-2xl p-3.5 mb-4 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">PayPal ID / Email</span>
                <span className="text-[10px] text-emerald-400 font-bold">Direct Transfer</span>
              </div>
              <div className="text-sm font-mono font-black text-white truncate">
                arvind.shukla64@gmail.com
              </div>
              <div className="text-[11px] text-blue-400 font-mono mt-1">
                PayPal.Me: @iarvindshukla
              </div>
            </div>
          </div>

          <div className="w-full">
            {/* PayPal Direct Button */}
            <a
              href="https://www.paypal.com/paypalme/iarvindshukla"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#0070ba] hover:bg-[#003087] text-white py-3 px-5 rounded-xl font-black text-sm shadow-xl shadow-blue-600/30 transition-all active:scale-[0.98] mb-3"
            >
              <span>💳</span> Donate via PayPal.Me ↗
            </a>

            {/* Supported Cards */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] text-gray-300 font-semibold">
              <span className="bg-[#1a1d28] px-2 py-0.5 rounded border border-gray-800">Visa</span>
              <span className="bg-[#1a1d28] px-2 py-0.5 rounded border border-gray-800">Mastercard</span>
              <span className="bg-[#1a1d28] px-2 py-0.5 rounded border border-gray-800">American Express</span>
              <span className="bg-[#1a1d28] px-2 py-0.5 rounded border border-gray-800">PayPal Balance</span>
            </div>
          </div>
        </div>

        {/* Method 2: UPI / QR Code Card */}
        <div className="bg-[#12141c] border border-gray-800 rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center shadow-2xl relative justify-between">
          <div className="w-full">
            {/* Header Brand */}
            <div className="w-full flex items-center justify-between border-b border-gray-800/80 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <span className="text-xl">🇮🇳</span>
                <span className="font-bold text-white text-sm">UPI / QR Code</span>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                Verified Merchant
              </span>
            </div>

            {/* QR CODE */}
            <div className="p-3.5 bg-white rounded-3xl shadow-inner relative flex items-center justify-center border-4 border-gray-700/60 mb-5 max-w-[230px] mx-auto">
              <QRCodeSVG
                value={upiUri}
                size={190}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: "/logo-circle.png",
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </div>

            {/* Direct UPI ID Box */}
            <div className="w-full bg-[#0b0c10] border border-gray-700/80 rounded-2xl p-3.5 mb-4 text-left">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                Direct UPI ID
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm sm:text-base font-mono font-black text-white truncate">
                  {upiId}
                </div>
                <button
                  onClick={handleCopyUpi}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold text-xs transition-all flex-shrink-0 ${
                    copied
                      ? "bg-emerald-600 text-white shadow"
                      : "bg-red-600 hover:bg-red-700 text-white shadow"
                  }`}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          <div className="w-full">
            {/* Mobile Direct Pay Button */}
            <a
              href={upiUri}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white py-2.5 px-4 rounded-xl font-bold text-xs shadow-lg shadow-red-600/30 transition-all active:scale-[0.98] mb-3"
            >
              <span>📱</span> Open in UPI App
            </a>

            {/* Supported Apps Badges */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] text-gray-300 font-semibold">
              <span className="bg-[#1a1d28] px-2 py-0.5 rounded border border-gray-800">Google Pay</span>
              <span className="bg-[#1a1d28] px-2 py-0.5 rounded border border-gray-800">PhonePe</span>
              <span className="bg-[#1a1d28] px-2 py-0.5 rounded border border-gray-800">Paytm</span>
              <span className="bg-[#1a1d28] px-2 py-0.5 rounded border border-gray-800">BHIM</span>
            </div>
          </div>
        </div>

      </div>

      {/* Global Contact note */}
      <div className="max-w-4xl mx-auto px-4 pb-12 text-center text-xs text-gray-400">
        For receipts, queries, or partnership inquiries, contact us at: <span className="text-gray-200 font-medium">thefreelancetfl@gmail.com</span>
      </div>
    </main>
  );
}
