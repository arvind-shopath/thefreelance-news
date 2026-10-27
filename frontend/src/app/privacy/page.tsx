"use client";

import React from "react";
import Header from "@/components/layout/Header";
import AdBlock from "@/components/home/AdBlock";
import Link from "next/link";

export default function PrivacyPage() {
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
            <span className="text-red-500 font-semibold">गोपनीयता नीति (Privacy Policy)</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/30 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5">
            Google AdSense & DPDP Act 2023 अनुपालन
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
            The Freelance गोपनीयता नीति
          </h1>

          <p className="text-xs sm:text-sm text-gray-400 font-normal">
            अंतिम अद्यतन (Last Updated): <span className="text-white font-semibold">{lastUpdated}</span>
          </p>
        </div>
      </div>

      {/* PRIVACY POLICY CONTENT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 text-sm sm:text-base text-gray-300 leading-relaxed">
        
        {/* Intro */}
        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl">
          <p>
            <strong className="text-white">The Freelance (news.thefreelance.in)</strong> पर आने वाले पाठकों की गोपनीयता (Privacy) हमारे लिए सर्वोच्च प्राथमिकता है। यह गोपनीयता नीति दस्तावेज़ यह स्पष्ट करता है कि जब आप हमारी वेबसाइट और सेवाओं का उपयोग करते हैं, तो किस प्रकार की जानकारी एकत्रित और दर्ज की जाती है तथा हम उसका उपयोग कैसे करते हैं।
          </p>
          <p className="mt-3">
            यदि आपके पास हमारी गोपनीयता नीति के संबंध में कोई अतिरिक्त प्रश्न हैं या अधिक जानकारी की आवश्यकता है, तो कृपया <Link href="/contact" className="text-red-400 hover:underline">हमसे संपर्क करें</Link> या <strong className="text-white">thefreelancetfl@gmail.com</strong> पर ईमेल करें।
          </p>
        </section>

        {/* Log Files */}
        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-red-600 pl-3">
            1. लॉग फाइल्स (Log Files)
          </h2>
          <p>
            The Freelance लॉग फाइलों का उपयोग करने की एक मानक प्रक्रिया का पालन करता है। जब आगंतुक वेबसाइटों पर आते हैं तो ये फाइलें विजिटर्स को लॉग करती हैं। सभी होस्टिंग कंपनियाँ ऐसा करती हैं और होस्टिंग सेवाओं के एनालिटिक्स का यह एक सामान्य हिस्सा है।
          </p>
          <p>
            लॉग फाइलों द्वारा एकत्र की जाने वाली जानकारी में इंटरनेट प्रोटोकॉल (IP) पते, ब्राउज़र का प्रकार, इंटरनेट सेवा प्रदाता (ISP), दिनांक और समय टिकट, रेफरिंग/एग्जिट पेज और संभवतः क्लिकों की संख्या शामिल होती है। ये किसी भी ऐसी जानकारी से जुड़े नहीं हैं जो व्यक्तिगत रूप से पहचान योग्य हो। इस जानकारी का उद्देश्य केवल प्रवृत्तियों का विश्लेषण करना, साइट का प्रबंधन करना, वेबसाइट पर उपयोगकर्ताओं की गतिविधियों को ट्रैक करना और जनसांख्यिकीय जानकारी इकट्ठा करना है।
          </p>
        </section>

        {/* Cookies & Google AdSense DART Cookie */}
        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-blue-600 pl-3">
            2. कुकीज़ एवं गूगल एडसेंस डार्ट कुकी (Cookies & Google DART Cookie)
          </h2>
          <p>
            अन्य सभी पेशेवर वेबसाइटों की तरह, The Freelance 'कुकीज़' का उपयोग करता है। इन कुकीज़ का उपयोग आगंतुकों की प्राथमिकताओं, और वेबसाइट पर उन पृष्ठों को संग्रहीत करने के लिए किया जाता है जिन पर आगंतुक ने एक्सेस किया या विज़िट किया। जानकारी का उपयोग आगंतुकों के ब्राउज़र प्रकार या अन्य जानकारी के आधार पर हमारे वेब पेज सामग्री को अनुकूलित करके उपयोगकर्ताओं के अनुभव को अनुकूलित करने के लिए किया जाता है।
          </p>

          <div className="bg-[#181b26] p-5 rounded-xl border border-gray-800 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-amber-400">★</span> Google DoubleClick DART Cookie
            </h3>
            <p className="text-xs sm:text-sm text-gray-300">
              गूगल हमारी साइट पर एक तृतीय-पक्ष (Third-Party) विक्रेता है। यह हमारी साइट के आगंतुकों को news.thefreelance.in और इंटरनेट पर अन्य साइटों पर उनकी यात्रा के आधार पर विज्ञापन देने के लिए कुकीज़ (जिन्हें DART कुकीज़ के रूप में जाना जाता है) का उपयोग करता है।
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              हालाँकि, आगंतुक Google विज्ञापन और सामग्री नेटवर्क गोपनीयता नीति पर जाकर DART कुकीज़ के उपयोग को अस्वीकार करने का विकल्प चुन सकते हैं:{" "}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 underline font-semibold"
              >
                https://policies.google.com/technologies/ads
              </a>
            </p>
          </div>
        </section>

        {/* MID PAGE AD */}
        <div className="w-full flex justify-center">
          <AdBlock width="728px" height="90px" text="IN-ARTICLE ADVERTISEMENT (728x90)" />
        </div>

        {/* Advertising Partners & Third Party Policies */}
        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-amber-500 pl-3">
            3. विज्ञापन भागीदारों की नीतियां (Advertising Partners Privacy Policies)
          </h2>
          <p>
            The Freelance पर दिखाए जाने वाले विज्ञापनों और लिंकों में तृतीय-पक्ष विज्ञापन सर्वर या विज्ञापन नेटवर्क तकनीक जैसे कुकीज़, जावास्क्रिप्ट या वेब बीकन का उपयोग किया जा सकता है जो सीधे उपयोगकर्ताओं के ब्राउज़र पर भेजे जाते हैं। जब ऐसा होता है तो वे स्वचालित रूप से आपका आईपी पता प्राप्त करते हैं।
          </p>
          <p>
            ध्यान दें कि The Freelance के पास इन कुकीज़ पर कोई नियंत्रण या पहुँच नहीं है जो तृतीय-पक्ष विज्ञापनदाताओं द्वारा उपयोग की जाती हैं।
          </p>
        </section>

        {/* User Rights (DPDP Act & GDPR) */}
        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-emerald-500 pl-3">
            4. आपके डेटा अधिकार (Your Data Protection Rights)
          </h2>
          <p>
            भारतीय डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम (DPDP Act 2023) और अंतरराष्ट्रीय गोपनीयता मानकों के अनुसार, प्रत्येक उपयोगकर्ता निम्नलिखित अधिकारों का हकदार है:
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-gray-300 pl-2">
            <li><strong>पहुंच का अधिकार:</strong> आपको अपने व्यक्तिगत डेटा की प्रतियों का अनुरोध करने का अधिकार है।</li>
            <li><strong>सुधार का अधिकार:</strong> आपको यह अनुरोध करने का अधिकार है कि हम उस जानकारी को ठीक करें जिसे आप गलत मानते हैं।</li>
            <li><strong>मिटाने का अधिकार:</strong> कुछ शर्तों के तहत, आपको यह अनुरोध करने का अधिकार है कि हम आपका व्यक्तिगत डेटा हटा दें।</li>
            <li><strong>सहमति वापस लेने का अधिकार:</strong> आप किसी भी समय न्यूज़लेटर या व्यक्तिगत ट्रैकिंग की अपनी सहमति वापस ले सकते हैं।</li>
          </ul>
        </section>

        {/* Children's Privacy */}
        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-purple-500 pl-3">
            5. बच्चों की गोपनीयता की सुरक्षा (Children's Information)
          </h2>
          <p>
            The Freelance जानबूझकर 13 वर्ष से कम आयु के बच्चों से कोई व्यक्तिगत पहचान योग्य जानकारी एकत्र नहीं करता है। यदि आपको लगता है कि आपके बच्चे ने हमारी वेबसाइट पर इस प्रकार की जानकारी प्रदान की है, तो हम आपको तुरंत हमसे संपर्क करने के लिए दृढ़ता से प्रोत्साहित करते हैं और हम अपने रिकॉर्ड से ऐसी जानकारी को तुरंत हटाने के लिए अपना सर्वश्रेष्ठ प्रयास करेंगे।
          </p>
        </section>

        {/* Consent */}
        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl text-center space-y-3">
          <h2 className="text-xl font-bold text-white">आपकी सहमति (Consent)</h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto">
            हमारी वेबसाइट का उपयोग करके, आप हमारी गोपनीयता नीति के लिए अपनी सहमति देते हैं और इसके नियमों व शर्तों से सहमत होते हैं।
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
