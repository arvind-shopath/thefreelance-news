"use client";

import React from "react";
import Header from "@/components/layout/Header";
import AdBlock from "@/components/home/AdBlock";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
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
          
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-6 font-medium">
            <Link href="/" className="hover:text-white transition-colors">होम</Link>
            <span>›</span>
            <span className="text-red-500 font-semibold">हमारे बारे में (About Us)</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-500/30 text-red-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            सच्ची, स्वतंत्र और निष्पक्ष डिजिटल पत्रकारिता
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
            The Freelance (TFL) के बारे में
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-normal">
            देश और दुनिया की हर खबर को बिना किसी राजनीतिक या कॉर्पोरेट दबाव के, पूरी निष्पक्षता और सटीकता के साथ आप तक पहुँचाने का एक ईमानदार डिजिटल मंच।
          </p>
        </div>
      </div>

      {/* CONTENT BODY */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        
        {/* Mission & Vision */}
        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-red-600 pl-3">
            हमारा ध्येय और मिशन (Our Mission & Vision)
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-gray-300 leading-relaxed">
            <p>
              <strong className="text-white">The Freelance (news.thefreelance.in)</strong> भारत का एक तेजी से उभरता हुआ स्वतंत्र डिजिटल हिंदी न्यूज़ पोर्टल है। हमारा संकल्प है कि आम जनता के मुद्दों, लोकतंत्र के मूल्यों और देश के हर कोने की सच्चाई को बेबाकी और निष्पक्षता से सामने लाया जाए।
            </p>
            <p>
              आज के सूचना क्रांति के दौर में जहाँ फेक न्यूज़ और सनसनीखेज हेडलाइंस का बोलबाला है, वहाँ <strong className="text-white">The Freelance</strong> तथ्यों की प्रामाणिकता, गहन शोध और तथ्य-जांच (Fact-Checking) के कठोर सिद्धांतों पर काम करता है। हम किसी भी राजनीतिक दल, धार्मिक संगठन या कॉर्पोरेट घराने से अप्रभावित रहकर केवल जनसरोकार की पत्रकारिता करते हैं।
            </p>
          </div>
        </section>

        {/* Editorial Standards & Integrity */}
        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-blue-600 pl-3">
            पत्रकारिता के नैतिक मानदंड (Editorial Ethics & Principles)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-[#181b26] p-5 rounded-xl border border-gray-800">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-red-500">✓</span> 100% सत्यता और तथ्य-जांच
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                हम किसी भी खबर को प्रकाशित करने से पहले कम से कम दो स्वतंत्र और आधिकारिक स्रोतों से सत्यापित करते हैं। अफवाहों और अनसुलझी खबरों को सीधे खारिज किया जाता है।
              </p>
            </div>

            <div className="bg-[#181b26] p-5 rounded-xl border border-gray-800">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-blue-500">✓</span> निष्पक्ष दृष्टिकोण (Non-Partisanship)
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                हम किसी विचारधारा विशेष का समर्थन नहीं करते। खबर में पक्ष और विपक्ष दोनों के दृष्टिकोण को समान महत्व दिया जाता है ताकि पाठक स्वयं निर्णय ले सकें।
              </p>
            </div>

            <div className="bg-[#181b26] p-5 rounded-xl border border-gray-800">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-amber-500">✓</span> तुरंत भूल-सुधार की पारदर्शिता
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                यदि किसी रिपोर्ट में कोई अनजानी त्रुटि पाई जाती है, तो हम उसे छिपाते नहीं बल्कि समय व तारीख के साथ खुले तौर पर अपडेट और सुधार करते हैं।
              </p>
            </div>

            <div className="bg-[#181b26] p-5 rounded-xl border border-gray-800">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-emerald-500">✓</span> जनहित एवं कानून का सम्मान
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                हम भारत के संविधान, प्रेस काउंसिल ऑफ इंडिया (PCI) के दिशानिर्देशों और डिजिटल मीडिया आचार संहिता 2021 का पूर्णतः पालन करते हैं।
              </p>
            </div>
          </div>
        </section>

        {/* MID CONTENT AD */}
        <div className="w-full flex justify-center">
          <AdBlock width="728px" height="90px" text="IN-PAGE ADVERTISEMENT (728x90)" />
        </div>

        {/* Leadership & Editorial Desk */}
        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-amber-500 pl-3">
            स्वामित्व, प्रबंधन एवं टीम (Ownership & Leadership)
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-gray-300 leading-relaxed">
            <p>
              <strong className="text-white">The Freelance Media Network</strong> एक स्वतंत्र डिजिटल प्रकाशन समूह है। हमारे न्यूज़रूम का संचालन अनुभवी पत्रकारों, रिसर्चर्स, डेटा एनालिस्ट्स और युवा लेखकों की एक समर्पित टीम द्वारा किया जाता है।
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <div className="border border-gray-800 bg-[#161822] p-4 rounded-xl">
                <span className="text-xs text-red-400 font-bold uppercase tracking-wider block mb-1">संपादकीय प्रमुख (Editor-in-Chief)</span>
                <h4 className="text-white font-bold text-base">सम्पादकीय डेस्क (The Freelance Editorial Board)</h4>
                <p className="text-xs text-gray-400 mt-1">ईमेल: thefreelancetfl@gmail.com</p>
                <p className="text-xs text-gray-400 mt-1">स्थान: आलमबाग, लखनऊ, उत्तर प्रदेश - 226005</p>
              </div>
              <div className="border border-gray-800 bg-[#161822] p-4 rounded-xl">
                <span className="text-xs text-blue-400 font-bold uppercase tracking-wider block mb-1">कानूनी एवं अनुपालन (Legal & Compliance)</span>
                <h4 className="text-white font-bold text-base">शिकायत निवारण अधिकारी (Grievance Officer)</h4>
                <p className="text-xs text-gray-400 mt-1">ईमेल: thefreelancetfl@gmail.com</p>
                <p className="text-xs text-gray-400 mt-1">स्थान: आलमबाग, लखनऊ, उत्तर प्रदेश - 226005</p>
              </div>
            </div>
          </div>
        </section>

        {/* Coverage Categories */}
        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-emerald-500 pl-3">
            हम क्या कवर करते हैं (Our News Coverage)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-gray-300">
            <div className="p-3 bg-[#171924] rounded-lg border border-gray-800">• राष्ट्रीय राजनीति एवं संसद</div>
            <div className="p-3 bg-[#171924] rounded-lg border border-gray-800">• राज्यों के स्थानीय व जमीनी सरोकार</div>
            <div className="p-3 bg-[#171924] rounded-lg border border-gray-800">• व्यापार, शेयर बाजार एवं अर्थव्यवस्था</div>
            <div className="p-3 bg-[#171924] rounded-lg border border-gray-800">• तकनीक, गैजेट्स एवं ऑटोमोबाइल</div>
            <div className="p-3 bg-[#171924] rounded-lg border border-gray-800">• खेल, क्रिकेट एवं वैश्विक टूर्नामेंट</div>
            <div className="p-3 bg-[#171924] rounded-lg border border-gray-800">• सिनेमा, मनोरंजन एवं संस्कृति</div>
            <div className="p-3 bg-[#171924] rounded-lg border border-gray-800">• स्वास्थ्य, योग एवं लाइफस्टाइल</div>
            <div className="p-3 bg-[#171924] rounded-lg border border-gray-800">• धर्म, ज्योतिष एवं आध्यात्मिक दर्शन</div>
            <div className="p-3 bg-[#171924] rounded-lg border border-gray-800">• शिक्षा, रोजगार व प्रतियोगी परीक्षाएं</div>
          </div>
        </section>

        {/* Contact Links */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-400 mb-4">
            क्या आपके पास कोई समाचार सुझाव, प्रेस विज्ञप्ति या प्रतिक्रिया है?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-full text-sm transition-colors shadow-lg"
          >
            हमसे संपर्क करें (Contact Us) →
          </Link>
        </div>

      </div>
    </main>
  );
}
