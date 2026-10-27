"use client";

import React from "react";
import Header from "@/components/layout/Header";
import AdBlock from "@/components/home/AdBlock";
import Link from "next/link";

export default function TermsPage() {
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
            <span className="text-red-500 font-semibold">नियम और शर्तें (Terms of Service)</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-purple-600/10 border border-purple-500/30 text-purple-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5">
            वेबसाइट उपयोग की कानूनी शर्तें
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
            The Freelance नियम और शर्तें
          </h1>

          <p className="text-xs sm:text-sm text-gray-400 font-normal">
            अंतिम अद्यतन (Last Updated): <span className="text-white font-semibold">{lastUpdated}</span>
          </p>
        </div>
      </div>

      {/* TERMS CONTENT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 text-sm sm:text-base text-gray-300 leading-relaxed">
        
        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-red-600 pl-3">
            1. शर्तों की स्वीकृति (Acceptance of Terms)
          </h2>
          <p>
            <strong className="text-white">news.thefreelance.in</strong> में आपका स्वागत है। इस वेबसाइट का उपयोग करके या इस पर दी गई किसी भी सामग्री, समाचार, वीडियो, या सेवा को एक्सेस करके, आप इन नियमों और शर्तों से पूर्णतः बंधे होने की सहमति देते हैं। यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया हमारी वेबसाइट का उपयोग न करें।
          </p>
        </section>

        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-blue-600 pl-3">
            2. बौद्धिक संपदा अधिकार और कॉपीराइट (Intellectual Property Rights)
          </h2>
          <p>
            The Freelance पर प्रकाशित सभी मूल सामग्री—जिसमें पाठ, ग्राफिक्स, लोगो, चित्र, ऑडियो क्लिप्स, डिजिटल डाउनलोड और डेटा संकलन शामिल हैं—The Freelance या उसके सामग्री आपूर्तिकर्ताओं की बौद्धिक संपदा हैं और कॉपीराइट कानूनों द्वारा संरक्षित हैं।
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-gray-300 pl-2">
            <li>आप व्यक्तिगत, गैर-व्यावसायिक उपयोग के लिए वेबसाइट से सामग्री पढ़ और साझा कर सकते हैं।</li>
            <li>The Freelance की पूर्व लिखित अनुमति के बिना हमारी सामग्री का पुनर्प्रकाशन, व्यावसायिक उपयोग, या संशोधन सख्त वर्जित है।</li>
            <li>सोशल मीडिया पर खबर साझा करते समय मूल क्रेडिट और लिंकबैक देना अनिवार्य है।</li>
          </ul>
        </section>

        {/* MID AD */}
        <div className="w-full flex justify-center">
          <AdBlock width="728px" height="90px" text="IN-ARTICLE ADVERTISEMENT (728x90)" />
        </div>

        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-amber-500 pl-3">
            3. उपयोगकर्ता आचरण एवं टिप्पणी नीति (User Conduct & Comments)
          </h2>
          <p>
            वेबसाइट पर टिप्पणी करते समय या सामग्री साझा करते समय उपयोगकर्ता निम्नलिखित नियमों का पालन करने के लिए बाध्य हैं:
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-gray-300 pl-2">
            <li>किसी भी प्रकार की घृणास्पद भाषा (Hate Speech), सांप्रदायिक विद्वेष या हिंसा को बढ़ावा देने वाली टिप्पणी वर्जित है।</li>
            <li>अश्लील, मानहानिकारक, या किसी व्यक्ति की निजता का उल्लंघन करने वाली सामग्री पोस्ट करना गैर-कानूनी है।</li>
            <li>The Freelance बिना किसी पूर्व सूचना के किसी भी आपत्तिजनक टिप्पणी को हटाने या उपयोगकर्ता को ब्लॉक करने का पूर्ण अधिकार रखता है।</li>
          </ul>
        </section>

        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-emerald-500 pl-3">
            4. देयता की सीमा (Limitation of Liability)
          </h2>
          <p>
            The Freelance यह सुनिश्चित करने के लिए हर संभव प्रयास करता है कि सभी रिपोर्टें सटीक और अद्यतित हों। हालांकि, हम किसी भी जानकारी की पूर्णता, सटीकता, या किसी विशिष्ट उद्देश्य के लिए उसकी उपयुक्तता की कोई वारंटी नहीं देते हैं। हमारी साइट पर प्रकाशित किसी भी जानकारी पर भरोसा करने से होने वाले किसी भी प्रत्यक्ष या अप्रत्यक्ष नुकसान के लिए The Freelance उत्तरदायी नहीं होगा।
          </p>
        </section>

        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-indigo-500 pl-3">
            5. लागू कानून एवं क्षेत्राधिकार (Governing Law & Jurisdiction)
          </h2>
          <p>
            ये नियम और शर्तें भारत गणराज्य के कानूनों के अनुसार शासित और व्याख्यायित की जाएंगी। The Freelance के संबंध में उत्पन्न होने वाले किसी भी विवाद के निपटारे का अनन्य क्षेत्राधिकार केवल <strong className="text-white">लखनऊ (उत्तर प्रदेश, भारत) स्थित सक्षम न्यायालयों</strong> के पास होगा।
          </p>
        </section>

        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-rose-500 pl-3">
            6. संपर्क एवं विधिक नोटिस (Contact & Legal Notices)
          </h2>
          <p>
            इन नियमों और शर्तों के संबंध में किसी भी प्रश्न या विधिक सूचना के लिए कृपया हमें ईमेल करें: <strong className="text-white select-all">thefreelancetfl@gmail.com</strong>
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
