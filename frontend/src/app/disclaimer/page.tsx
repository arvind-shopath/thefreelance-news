"use client";

import React from "react";
import Header from "@/components/layout/Header";
import AdBlock from "@/components/home/AdBlock";
import Link from "next/link";

export default function DisclaimerPage() {
  const lastUpdated = "18 सितंबर 2026";

  return (
    <main className="min-h-screen bg-[#0b0c10] text-gray-200">
      <Header />

      {/* TOP BANNER AD */}
      <div className="max-w-[1280px] mx-auto px-4 pt-6">
        <AdBlock width="970px" height="90px" text="TOP BANNER ADVERTISEMENT (970x90)" />
      </div>

      {/* HERO BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#141622] via-[#0b0c10] to-[#0b0c10] border-b border-gray-800/80 pt-10 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-6 font-medium">
            <Link href="/" className="hover:text-white transition-colors">होम</Link>
            <span>›</span>
            <span className="text-red-500 font-semibold">अस्वीकरण (Disclaimer)</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-amber-600/10 border border-amber-500/30 text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5">
            सामग्री उपयोग एवं विधिक अस्वीकरण
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
            The Freelance अस्वीकरण
          </h1>

          <p className="text-xs sm:text-sm text-gray-400 font-normal">
            अंतिम अद्यतन (Last Updated): <span className="text-white font-semibold">{lastUpdated}</span>
          </p>
        </div>
      </div>

      {/* DISCLAIMER CONTENT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 text-sm sm:text-base text-gray-300 leading-relaxed">
        
        {/* General */}
        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-red-600 pl-3">
            1. सामान्य सूचना अस्वीकरण (General Informational Disclaimer)
          </h2>
          <p>
            The Freelance (news.thefreelance.in) पर प्रकाशित सभी सामग्री, समाचार लेख, फीचर स्टोरीज़ और विश्लेषण केवल सामान्य सूचनात्मक और शैक्षणिक उद्देश्यों के लिए हैं। यद्यपि हम केवल विश्वसनीय और सत्यापित स्रोतों से ही जानकारी प्रकाशित करते हैं, फिर भी हम सामग्री की पूर्ण सटीकता, पर्याप्तता या उपलब्धता के संबंध में किसी भी प्रकार का कोई स्पष्ट या निहित आश्वासन नहीं देते हैं।
          </p>
        </section>

        {/* Financial & Stock Market */}
        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-emerald-500 pl-3">
            2. वित्तीय एवं निवेश सलाह अस्वीकरण (Financial & Investment Disclaimer)
          </h2>
          <p>
            The Freelance पर प्रकाशित व्यापार (Business), शेयर बाजार (Stock Market), म्यूचुअल फंड, सोना-चांदी के भाव, क्रिप्टोकरेंसी या किसी भी कंपनी के शेयरों से संबंधित लेख <strong className="text-white">किसी भी प्रकार की वित्तीय या निवेश सलाह नहीं हैं</strong>। 
          </p>
          <div className="bg-[#181b26] p-4 rounded-xl border border-gray-800 text-xs sm:text-sm text-gray-400">
            The Freelance या उसके लेखक भारतीय प्रतिभूति और विनिमय बोर्ड (SEBI) द्वारा पंजीकृत वित्तीय सलाहकार (Financial Advisor) नहीं हैं। शेयर बाजार में निवेश बाजार जोखिमों के अधीन है। किसी भी वित्तीय निर्णय या निवेश से पहले कृपया किसी प्रमाणित वित्तीय सलाहकार (SEBI Registered Advisor) से परामर्श अवश्य लें।
          </div>
        </section>

        {/* MID AD */}
        <div className="w-full flex justify-center">
          <AdBlock width="728px" height="90px" text="IN-ARTICLE ADVERTISEMENT (728x90)" />
        </div>

        {/* Medical & Health */}
        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-blue-600 pl-3">
            3. स्वास्थ्य एवं चिकित्सा अस्वीकरण (Medical & Health Advice Disclaimer)
          </h2>
          <p>
            हमारी वेबसाइट के लाइफस्टाइल, स्वास्थ्य और वेलनेस सेक्शन में दी गई जानकारी केवल सामान्य ज्ञान और जागरूकता के उद्देश्य से है। यह किसी पेशेवर चिकित्सा सलाह, निदान (Diagnosis) या उपचार का विकल्प नहीं है। किसी भी स्वास्थ्य संबंधी समस्या, आहार परिवर्तन या दवा शुरू करने से पहले हमेशा योग्य चिकित्सक या डॉक्टर की सलाह लें।
          </p>
        </section>

        {/* Astrology / Horoscope */}
        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-amber-500 pl-3">
            4. धर्म एवं ज्योतिषीय राशिफल अस्वीकरण (Astrology & Horoscope Disclaimer)
          </h2>
          <p>
            धर्म और दैनिक राशिफल में प्रकाशित भविष्यफल पारंपरिक वैदिक ज्योतिषीय मान्यताओं, ग्रह गणनाओं और पंचांग पर आधारित होते हैं। इसे केवल सांस्कृतिक रुचि और मनोरंजन के दृष्टिकोण से पढ़ा जाना चाहिए। The Freelance इन भविष्यवाणियों की सत्यता या किसी निश्चित परिणाम का दावा नहीं करता है।
          </p>
        </section>

        {/* Third Party Ads */}
        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-purple-500 pl-3">
            5. विज्ञापनों एवं बाहरी लिंक्स का अस्वीकरण (Advertisements & External Links)
          </h2>
          <p>
            The Freelance पर प्रदर्शित विज्ञापन Google AdSense या अन्य विज्ञापन नेटवर्कों द्वारा प्रदान किए जाते हैं। इन विज्ञापनों में उल्लिखित किसी उत्पाद, सेवा या दावे का The Freelance प्रत्यक्ष रूप से समर्थन या गारंटी नहीं देता है। किसी भी बाहरी लिंक पर क्लिक करने से पहले उपयोगकर्ता अपने विवेक का उपयोग करें।
          </p>
        </section>

        {/* BOTTOM AD */}
        <div className="w-full flex justify-center pt-4">
          <AdBlock width="728px" height="90px" text="FOOTER ADVERTISEMENT (728x90)" />
        </div>

      </div>
    </main>
  );
}
