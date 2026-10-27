"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { getPostImage } from "@/lib/constants";
import PostViews, { getPostViews } from "@/components/common/PostViews";

const zodiacData = [
  { id: 'aries', icon: "mdi:zodiac-aries", nameHi: "मेष", nameEn: "Aries" },
  { id: 'taurus', icon: "mdi:zodiac-taurus", nameHi: "वृषभ", nameEn: "Taurus" },
  { id: 'gemini', icon: "mdi:zodiac-gemini", nameHi: "मिथुन", nameEn: "Gemini" },
  { id: 'cancer', icon: "mdi:zodiac-cancer", nameHi: "कर्क", nameEn: "Cancer" },
  { id: 'leo', icon: "mdi:zodiac-leo", nameHi: "सिंह", nameEn: "Leo" },
  { id: 'virgo', icon: "mdi:zodiac-virgo", nameHi: "कन्या", nameEn: "Virgo" },
  { id: 'libra', icon: "mdi:zodiac-libra", nameHi: "तुला", nameEn: "Libra" },
  { id: 'scorpio', icon: "mdi:zodiac-scorpio", nameHi: "वृश्चिक", nameEn: "Scorpio" },
  { id: 'sagittarius', icon: "mdi:zodiac-sagittarius", nameHi: "धनु", nameEn: "Sagittarius" },
  { id: 'capricorn', icon: "mdi:zodiac-capricorn", nameHi: "मकर", nameEn: "Capricorn" },
  { id: 'aquarius', icon: "mdi:zodiac-aquarius", nameHi: "कुंभ", nameEn: "Aquarius" },
  { id: 'pisces', icon: "mdi:zodiac-pisces", nameHi: "मीन", nameEn: "Pisces" }
];

const DEFAULT_PREDICTIONS: Record<string, { hi: string; en: string }> = {
  aries: {
    hi: "कार्यक्षेत्र में आपकी मेहनत की सराहना होगी और नए अवसर मिलेंगे। स्वास्थ्य उत्तम रहेगा तथा सकारात्मक ऊर्जा बनी रहेगी। आर्थिक स्थिति सुदृढ़ होगी।",
    en: "Hard work in your career will be recognized with promising new opportunities. Health remains positive with vibrant energy. Financial growth is assured."
  },
  taurus: {
    hi: "आज आपके धैर्य और लगन का फल मिलेगा। व्यापार में धन लाभ के योग बन रहे हैं। पारिवारिक जीवन में सुख-शांति रहेगी और मित्रों का सहयोग प्राप्त होगा।",
    en: "Patience and persistence will yield rewarding outcomes today. Business ventures show signs of monetary gains. Harmonious moments with family."
  },
  gemini: {
    hi: "नई योजनाओं पर काम शुरू करने के लिए दिन अनुकूल है। संचार कौशल से लाभ होगा। विद्यार्थियों और युवाओं के लिए सफलता के नए द्वार खुलेंगे।",
    en: "An ideal day to initiate creative plans. Your communication skills bring substantial gains. Encouraging prospects for education and competitive pursuits."
  },
  cancer: {
    hi: "मानसिक शांति का अनुभव होगा। कार्यस्थल पर सहकर्मियों का पूरा सहयोग मिलेगा। स्वास्थ्य अच्छा रहेगा, खान-पान में संतुलन बनाए रखें।",
    en: "Peace of mind and clarity prevail today. Colleagues will provide full support at work. Maintain balanced nutrition for vibrant health."
  },
  leo: {
    hi: "आत्मविश्वास में वृद्धि होगी। नेतृत्व क्षमता के बल पर कठिन कार्यों को भी सुगमता से पूरा कर लेंगे। समाज और कार्यक्षेत्र में मान-सम्मान बढ़ेगा।",
    en: "Confidence surges with strong leadership attributes. You will navigate challenging tasks effortlessly. Respect and recognition grow in your sphere."
  },
  virgo: {
    hi: "योजनाबद्ध तरीके से किए गए कार्यों में अप्रत्याशित सफलता मिलेगी। खर्चों पर नियंत्रण रखें। परिवार के साथ किसी शुभ या धार्मिक यात्रा का योग है।",
    en: "Meticulously planned endeavors achieve remarkable results. Exercise mindful financial discipline. Favorable prospects for meaningful family travels."
  },
  libra: {
    hi: "व्यापार और नौकरी दोनों में उन्नति के अवसर प्राप्त होंगे। रिश्तों में मधुरता बनी रहेगी। कला, साहित्य और रचनात्मक कार्यों में आपकी रुचि बढ़ेगी।",
    en: "Advancement opportunities emerge in both business and professional endeavors. Warmth in personal bonds. Creative inspiration flourishes."
  },
  scorpio: {
    hi: "अटके हुए सरकारी या कानूनी कार्य पूरे होने की प्रबल संभावना है। आर्थिक मामलों में समझदारी से निर्णय लें। स्वास्थ्य के प्रति सचेत रहें।",
    en: "Long-pending official affairs head towards smooth resolution. Prudent financial choices ensure security. Keep a proactive routine for wellness."
  },
  sagittarius: {
    hi: "भाग्य का पूरा साथ मिलेगा। उच्च अधिकारियों से प्रशंसा प्राप्त होगी। नई जिम्मेदारियां मिल सकती हैं जो भविष्य में करियर को नई दिशा देंगी।",
    en: "Fortune shines favorably on your endeavors. Mentors and seniors acknowledge your dedication. New responsibilities pave the way for career growth."
  },
  capricorn: {
    hi: "कार्यक्षेत्र में नई उपलब्धियां हासिल होंगी। भूमि या वाहन संबंधी विचार बन सकता है। बड़े-बुजुर्गों का आशीर्वाद और मार्गदर्शन लाभदायी सिद्ध होगा।",
    en: "Significant milestones achieved in professional commitments. Wisdom and encouragement from elders provide valuable guidance."
  },
  aquarius: {
    hi: "नवाचार और नए विचारों से कार्यक्षेत्र में अलग पहचान बनेगी। आर्थिक स्थिति मजबूत रहेगी। दोस्तों के साथ समय बिताना ताजगी और उत्साह देगा।",
    en: "Innovative thinking distinguishes you at work. Financial fundamentals remain resilient. Uplifting interactions with trusted friends."
  },
  pisces: {
    hi: "आध्यात्मिक और धार्मिक कार्यों में मन लगेगा। रुका हुआ धन वापस मिलने के योग हैं। परिवार में किसी मांगलिक या शुभ कार्य की योजना बनेगी।",
    en: "Spiritual inclinations bring inner peace. Favorable signs for recovery of pending dues. Auspicious and joyful gatherings with loved ones."
  }
};

interface HoroscopeItem {
  sign: string;
  prediction: string;
}

export default function ReligionSection({ 
  initialHoroscopes = [], 
  posts = [],
  isEn = false
}: { 
  initialHoroscopes?: HoroscopeItem[]; 
  posts?: any[];
  isEn?: boolean;
}) {
  const [activeZodiac, setActiveZodiac] = useState(0);
  const [currentDate, setCurrentDate] = useState("");
  const [horoscopes, setHoroscopes] = useState<HoroscopeItem[]>(initialHoroscopes);

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString(isEn ? 'en-US' : 'hi-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    );
    
    if (initialHoroscopes.length === 0) {
      const horoscopeUrl = typeof window !== 'undefined' ? '/api/v1/feeds/horoscope' : 'http://localhost:4000/api/v1/feeds/horoscope';
      fetch(horoscopeUrl)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setHoroscopes(data);
          }
        })
        .catch(err => console.error("Horoscope fetch failed", err));
    }
  }, [initialHoroscopes, isEn]);

  const prevZodiac = () => setActiveZodiac((prev) => (prev > 0 ? prev - 1 : zodiacData.length - 1));
  const nextZodiac = () => setActiveZodiac((prev) => (prev < zodiacData.length - 1 ? prev + 1 : 0));

  const signId = zodiacData[activeZodiac].id;
  const currentPrediction = horoscopes.find(h => h.sign === signId)?.prediction 
    || (isEn ? DEFAULT_PREDICTIONS[signId]?.en : DEFAULT_PREDICTIONS[signId]?.hi);

  const newsItems = posts.slice(0, 3);
  const currentZodiac = zodiacData[activeZodiac];

  return (
    <section className="mb-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 bg-orange-600 rounded-full"></div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
            {isEn ? "Religion & Horoscope" : "धर्म & राशिफल"}
          </h2>
        </div>
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{currentDate}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* News Column - Always 3 stories evenly distributed to match Rashifal card */}
        <div className="lg:col-span-2 flex flex-col justify-between gap-3.5 h-full">
           {newsItems.length > 0 ? newsItems.map((post) => {
             const headline = (isEn && post.headlineEn) ? post.headlineEn : post.headline;
             const summary = (isEn && post.summaryEn) ? post.summaryEn : (post.summary || post.content?.slice(0, 150));
             const slugVal = (isEn && post.slugEn) ? post.slugEn : post.slug;
             const hrefVal = isEn ? `/en/${post.categoryStr}/${slugVal}` : `/${post.categoryStr}/${slugVal}`;

             return (
               <Link 
                 key={post.id}
                 href={hrefVal}
                 className="bg-[#12141c] p-3 sm:p-3.5 rounded-2xl border border-gray-800 hover:border-orange-500/40 transition-all group cursor-pointer flex flex-col sm:flex-row gap-4 items-center flex-1 shadow-md religion-news-card"
               >
                  <div className="relative w-full sm:w-52 h-32 sm:h-auto sm:self-stretch rounded-xl overflow-hidden flex-shrink-0 bg-gray-900 shadow-md">
                     <Image src={getPostImage(post)} alt={headline} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                     <div className="absolute top-2.5 left-2.5 bg-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded italic shadow-lg uppercase">
                       {isEn ? "LATEST" : "ताज़ा"}
                     </div>
                  </div>
                  <div className="flex flex-col justify-center flex-1 py-1">
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                      {headline}
                    </h3>
                    <p className="text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed mb-2">
                      {summary}...
                    </p>
                    <PostViews views={getPostViews(post, isEn)} size="xs" />
                  </div>
               </Link>
             );
           }) : (
             <div className="bg-[#12141c] p-10 rounded-xl border border-gray-800 text-center text-gray-500 font-bold">
               {isEn ? "No stories currently available in this section." : "इस कैटेगरी में फिलहाल कोई खबर उपलब्ध नहीं है।"}
             </div>
           )}
        </div>

        {/* Rashifal Card */}
        <div className="relative group religion-rashifal-container">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="religion-rashifal-card relative h-full w-full rounded-2xl bg-[#12141c] border border-gray-800 overflow-hidden flex flex-col p-5 sm:p-6 shadow-xl">
            
            <div className="flex items-center justify-between mb-5">
               <h3 className="text-white font-black text-lg flex items-center gap-2 rashifal-card-title">
                 <span className="text-orange-500 italic">DAILY</span> {isEn ? "HOROSCOPE" : "राशिफल"}
               </h3>
               <div className="flex gap-2">
                 <button onClick={prevZodiac} aria-label="Previous Zodiac" className="rashifal-nav-btn w-8 h-8 rounded-full bg-[#0b0c10] flex items-center justify-center text-orange-500 hover:bg-orange-600 hover:text-white transition-all shadow-inner border border-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 18l-6-6 6-6"/></svg>
                 </button>
                 <button onClick={nextZodiac} aria-label="Next Zodiac" className="rashifal-nav-btn w-8 h-8 rounded-full bg-[#0b0c10] flex items-center justify-center text-orange-500 hover:bg-orange-600 hover:text-white transition-all shadow-inner border border-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 18l6-6-6-6"/></svg>
                 </button>
               </div>
            </div>

            {/* Zodiac Icons Grid */}
            <div className="rashifal-grid-box grid grid-cols-6 gap-2 mb-6 bg-[#0b0c10]/60 p-2.5 rounded-xl border border-gray-800/60">
               {zodiacData.map((z, idx) => {
                 const isActive = idx === activeZodiac;
                 // Use dark icon for inactive items so they are clearly visible in light mode, and crisp white when active
                 const iconColor = isActive ? "white" : "%23475569";
                 return (
                   <button 
                    key={z.id}
                    onClick={() => setActiveZodiac(idx)}
                    title={isEn ? z.nameEn : z.nameHi}
                    className={`rashifal-sign-btn flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-lg transition-all ${
                      isActive 
                        ? "rashifal-sign-active bg-orange-600 text-white scale-105 shadow-md font-bold" 
                        : "rashifal-sign-inactive bg-gray-900/40 hover:bg-gray-800/60 text-gray-400 hover:text-white border border-transparent"
                    }`}
                   >
                     <img 
                       src={`https://api.iconify.design/${z.icon}.svg?color=${isActive ? "white" : "%23ea580c"}`} 
                       alt={isEn ? z.nameEn : z.nameHi} 
                       className="w-5 h-5 sm:w-6 sm:h-6 rashifal-sign-icon transition-transform" 
                     />
                     <span className={`text-[10px] leading-none mt-1 font-semibold ${isActive ? "text-white" : "text-gray-400"}`}>
                       {isEn ? z.nameEn.slice(0, 3) : z.nameHi}
                     </span>
                   </button>
                 );
               })}
            </div>

            {/* Content Area */}
            <div className="rashifal-content-box flex flex-col items-center text-center flex-1 justify-center animate-in fade-in zoom-in duration-500 py-2" key={activeZodiac}>
               <div className="w-16 h-16 rounded-full bg-orange-600/10 flex items-center justify-center mb-3 border-2 border-orange-600/20 shadow-inner">
                  <img src={`https://api.iconify.design/${currentZodiac.icon}.svg?color=%23ea580c`} alt="Icon" className="w-9 h-9" />
               </div>
               <h2 className="rashifal-sign-heading text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">
                 {isEn ? currentZodiac.nameEn : `${currentZodiac.nameHi} राशि`}
               </h2>
               <div className="w-12 h-1 bg-orange-600 rounded-full mb-4"></div>
               <p className="rashifal-prediction-text text-gray-300 text-sm sm:text-base leading-relaxed font-medium px-2 italic">
                 "{currentPrediction}"
               </p>
            </div>

            <div className="rashifal-footer mt-5 pt-3.5 border-t border-gray-800 text-center">
               <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                 {isEn ? "Verified by Astrological Insights" : "ज्योतिष विशेषज्ञों द्वारा सत्यापित दैनिक भविष्यवाणी"}
               </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
