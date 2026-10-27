"use client";

import React from "react";
import Header from "@/components/layout/Header";
import AdBlock from "@/components/home/AdBlock";
import Link from "next/link";

export default function GrievancePage() {
  const lastUpdated = "18 सितंबर 2026";

  return (
    <main className="min-h-screen bg-[#0b0c10] text-gray-200">
      <Header />

      {/* TOP BANNER AD */}
      <div className="max-w-[1280px] mx-auto px-4 pt-6">
        <AdBlock width="970px" height="90px" text="TOP BANNER ADVERTISEMENT (970x90)" />
      </div>

      {/* HERO SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#141622] via-[#0b0c10] to-[#0b0c10] border-b border-gray-800/80 pt-10 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-6 font-medium">
            <Link href="/" className="hover:text-white transition-colors">होम</Link>
            <span>›</span>
            <span className="text-red-500 font-semibold">शिकायत निवारण (Grievance Redressal)</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-500/30 text-red-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5">
            सूचना प्रौद्योगिकी (मध्यवर्ती दिशानिर्देश और डिजिटल मीडिया आचार संहिता) नियम, 2021
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
            शिकायत निवारण तंत्र (Grievance Redressal)
          </h1>

          <p className="text-xs sm:text-sm text-gray-400 font-normal">
            अंतिम अद्यतन (Last Updated): <span className="text-white font-semibold">{lastUpdated}</span>
          </p>
        </div>
      </div>

      {/* CONTENT BODY */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 text-sm sm:text-base text-gray-300 leading-relaxed">
        
        {/* Statutary Compliance */}
        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-red-600 pl-3">
            वैधानिक अनुपालन (Statutory Notice)
          </h2>
          <p>
            भारत सरकार के इलेक्ट्रॉनिक्स और सूचना प्रौद्योगिकी मंत्रालय द्वारा अधिसूचित <strong className="text-white">सूचना प्रौद्योगिकी (मध्यवर्ती दिशानिर्देश और डिजिटल मीडिया आचार संहिता) नियम, 2021 के नियम 11</strong> के अनुपालन में, <strong className="text-white">The Freelance (news.thefreelance.in)</strong> ने अपने डिजिटल समाचार और समसामयिक सामग्री से संबंधित शिकायतों के त्वरित समाधान के लिए एक शिकायत निवारण तंत्र स्थापित किया है।
          </p>
        </section>

        {/* Grievance Officer Details */}
        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-blue-600 pl-3">
            शिकायत निवारण अधिकारी (Resident Grievance Officer)
          </h2>
          <div className="bg-[#181b26] p-6 rounded-xl border border-gray-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-400 block font-bold uppercase tracking-wider">पदनाम (Designation):</span>
                <span className="text-white font-semibold text-base">मुख्य शिकायत निवारण अधिकारी (Chief Grievance Officer)</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-bold uppercase tracking-wider">ईमेल (Email):</span>
                <a href="mailto:thefreelancetfl@gmail.com" className="text-red-400 font-semibold text-base hover:underline select-all">
                  thefreelancetfl@gmail.com
                </a>
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-bold uppercase tracking-wider">संस्थान (Organisation):</span>
                <span className="text-white text-sm">The Freelance Media Network</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-bold uppercase tracking-wider">पता (Address):</span>
                <span className="text-white text-sm">आलमबाग, लखनऊ, उत्तर प्रदेश - 226005</span>
              </div>
            </div>
          </div>
        </section>

        {/* MID AD */}
        <div className="w-full flex justify-center">
          <AdBlock width="728px" height="90px" text="IN-ARTICLE ADVERTISEMENT (728x90)" />
        </div>

        {/* Procedure & Timeline */}
        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-emerald-500 pl-3">
            शिकायत दर्ज करने की प्रक्रिया एवं समय-सीमा (Procedure & Timeline)
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-gray-300">
            <div className="flex gap-4 items-start">
              <span className="w-7 h-7 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
              <div>
                <h3 className="font-bold text-white text-sm">शिकायत का प्रारूप</h3>
                <p className="text-gray-400 mt-1">ईमेल में संबंधित समाचार का URL (वेब लिंक), प्रकाशन की तारीख, और आपत्तिजनक अंश का स्पष्ट विवरण लिखें। साथ ही यह स्पष्ट करें कि सामग्री किस नियम या कानून का उल्लंघन करती है।</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
              <div>
                <h3 className="font-bold text-white text-sm">24 घंटे के भीतर पावती (Acknowledgment within 24 Hours)</h3>
                <p className="text-gray-400 mt-1">शिकायत ईमेल प्राप्त होने के 24 घंटों के भीतर शिकायतकर्ता को संदर्भ संख्या (Complaint Ticket ID) के साथ ईमेल पावती भेजी जाएगी।</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="w-7 h-7 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
              <div>
                <h3 className="font-bold text-white text-sm">15 दिनों के भीतर निस्तारण (Disposal within 15 Days)</h3>
                <p className="text-gray-400 mt-1">संपादकीय एवं कानूनी समीक्षा के उपरांत, नियमों के अनुसार अधिकतम 15 दिनों के भीतर शिकायत का पूर्ण निवारण कर शिकायतकर्ता को निर्णय से अवगत कराया जाएगा।</p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM AD */}
        <div className="w-full flex justify-center pt-4">
          <AdBlock width="728px" height="90px" text="FOOTER ADVERTISEMENT (728x90)" />
        </div>

      </div>
    </main>
  );
}
