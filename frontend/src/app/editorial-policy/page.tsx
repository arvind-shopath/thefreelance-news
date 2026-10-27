"use client";

import React from "react";
import Header from "@/components/layout/Header";
import AdBlock from "@/components/home/AdBlock";
import Link from "next/link";

export default function EditorialPolicyPage() {
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
            <span className="text-red-500 font-semibold">संपादकीय नीति (Editorial Policy)</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5">
            Google News Publisher & PCI दिशानिर्देश अनुपालन
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
            The Freelance संपादकीय नीति एवं आचार संहिता
          </h1>

          <p className="text-xs sm:text-sm text-gray-400 font-normal">
            अंतिम अद्यतन (Last Updated): <span className="text-white font-semibold">{lastUpdated}</span>
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 text-sm sm:text-base text-gray-300 leading-relaxed">
        
        {/* Principles */}
        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-red-600 pl-3">
            1. सत्यता, सटीकता और तथ्य-जांच नीति (Fact-Checking Policy)
          </h2>
          <p>
            <strong className="text-white">The Freelance</strong> में प्रत्येक समाचार रिपोर्ट प्रकाशित होने से पहले एक सख्त संपादकीय और तथ्य-जांच प्रक्रिया से गुजरती है:
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-gray-300 pl-2">
            <li><strong>बहु-स्रोत सत्यापन (Multi-Source Verification):</strong> किसी भी महत्वपूर्ण दावे या ब्रेकिंग न्यूज़ की पुष्टि कम से कम दो स्वतंत्र और आधिकारिक स्रोतों (सरकारी प्रेस रिलीज, आधिकारिक प्रवक्ता, प्रत्यक्षदर्शी, पुलिस/न्यायालय रिकॉर्ड) से की जाती है।</li>
            <li><strong>सोशल मीडिया दावों की पड़ताल:</strong> सोशल मीडिया पर वायरल होने वाले वीडियो या तस्वीरों को मूल मेटाडेटा, रिवर्स इमेज सर्च और जियो-लोकेशन से परखा जाता है।</li>
            <li><strong>प्रामाणिक संदर्भ:</strong> आंकड़ों और शोध रिपोर्टों के संदर्भ में मूल सरकारी दस्तावेज़ों या प्राथमिक स्रोतों का हवाला दिया जाता है।</li>
          </ul>
        </section>

        {/* Corrections Policy */}
        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-blue-600 pl-3">
            2. पारदर्शी भूल-सुधार नीति (Corrections & Updates Policy)
          </h2>
          <p>
            सच्चाई और विश्वसनीयता हमारा मूल आधार है। यदि हमारी किसी रिपोर्ट में कोई तथ्यात्मक त्रुटि पाई जाती है, तो हम अपनी नीति के तहत निम्नलिखित कदम उठाते हैं:
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-gray-300 pl-2">
            <li>लेख के शीर्ष या अंत में स्पष्ट रूप से <strong>'सुधार (Correction)'</strong> या <strong>'अद्यतन (Update)'</strong> नोट जोड़ा जाता है।</li>
            <li>यह स्पष्ट लिखा जाता है कि मूल लेख में क्या त्रुटि थी और उसे किस तारीख व समय पर सही किया गया है।</li>
            <li>यदि कोई पाठक किसी त्रुटि को नोटिस करता है, तो वह सीधे <strong className="text-red-400">thefreelancetfl@gmail.com</strong> पर ईमेल करके संशोधन की मांग कर सकता है।</li>
          </ul>
        </section>

        {/* MID AD */}
        <div className="w-full flex justify-center">
          <AdBlock width="728px" height="90px" text="IN-ARTICLE ADVERTISEMENT (728x90)" />
        </div>

        {/* Non Partisanship */}
        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-amber-500 pl-3">
            3. निष्पक्षता एवं गैर-दलीय दृष्टिकोण (Non-Partisanship & Independence)
          </h2>
          <p>
            The Freelance किसी भी राजनीतिक दल, लॉबी या व्यापारिक समूह का मुखपत्र नहीं है।
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-gray-300 pl-2">
            <li>हमारे सभी पत्रकार और विश्लेषक व्यक्तिगत राजनीतिक पूर्वाग्रहों को रिपोर्टिंग से अलग रखने के लिए प्रतिबद्ध हैं।</li>
            <li>विवादित या राजनीतिक मामलों में सभी प्रमुख पक्षों (सत्ता पक्ष और विपक्ष) के वक्तव्यों और दृष्टिकोणों को संतुलित स्थान दिया जाता है।</li>
            <li>राय (Opinion) और समाचार (News) के बीच हमेशा स्पष्ट अंतर रखा जाता है।</li>
          </ul>
        </section>

        {/* Sourcing & Ethics */}
        <section className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-purple-500 pl-3">
            4. स्रोतों की सुरक्षा एवं आचार संहिता (Source Protection & Journalistic Integrity)
          </h2>
          <p>
            The Freelance व्हिसलब्लोअर्स और गोपनीय स्रोतों की पहचान की पूर्ण सुरक्षा करता है। हम किसी भी स्रोत से सूचना प्राप्त करने के लिए अवैध साधनों या रिश्वत का उपयोग नहीं करते हैं। हमारे पत्रकार प्रेस काउंसिल ऑफ इंडिया (PCI) और डिजिटल मीडिया आचार संहिता 2021 के सभी वैधानिक नियमों का पालन करते हैं।
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
