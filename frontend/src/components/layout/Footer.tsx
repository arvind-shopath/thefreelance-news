"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import GoogleAdUnit from "@/components/ads/GoogleAdUnit";

export default function Footer() {
  const pathname = usePathname();
  const isEn = pathname === '/en' || (pathname ? pathname.startsWith('/en/') : false);
  const currentYear = new Date().getFullYear();

  const categories = isEn ? [
    { label: "World", href: "/en/world" },
    { label: "India", href: "/en/national" },
    { label: "Crime", href: "/en/crime" },
    { label: "Entertainment", href: "/en/entertainment" },
    { label: "Sports", href: "/en/sports" },
    { label: "Lifestyle", href: "/en/lifestyle" },
    { label: "Business & Economy", href: "/en/business" },
    { label: "Tech & Auto", href: "/en/tech-auto" },
    { label: "Religion", href: "/en/religion" },
  ] : [
    { label: "दुनिया (World)", href: "/international" },
    { label: "इंडिया (India)", href: "/national" },
    { label: "क्राइम (Crime)", href: "/crime" },
    { label: "मनोरंजन (Entertainment)", href: "/entertainment" },
    { label: "खेल (Sports)", href: "/sports" },
    { label: "लाइफस्टाइल (Lifestyle)", href: "/lifestyle" },
    { label: "व्यापार और बाजार (Business)", href: "/business" },
    { label: "टेक और ऑटो (Tech & Auto)", href: "/tech-auto" },
    { label: "धर्म (Religion)", href: "/religion" },
  ];

  const quickLinks = isEn ? [
    { label: "Visual Stories", href: "/web-stories" },
    { label: "Photo Gallery", href: "/photos" },
    { label: "Daily Horoscope", href: "/horoscope" },
    { label: "Trending News", href: "/trending" },
    { label: "Support Us", href: "/en/support" },
  ] : [
    { label: "विजुअल स्टोरीज़ (Visual Stories)", href: "/web-stories" },
    { label: "फोटो गैलरी (Photo Gallery)", href: "/photos" },
    { label: "दैनिक राशिफल (Horoscope)", href: "/horoscope" },
    { label: "ट्रेंडिंग न्यूज़ (Trending)", href: "/trending" },
    { label: "सहयोग करें (Support Us)", href: "/support" },
  ];

  const subMenuLinks = isEn ? [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Disclaimer", href: "/disclaimer" },
    { label: "Editorial Policy", href: "/editorial-policy" },
    { label: "Grievance Redressal", href: "/grievance" },
  ] : [
    { label: "हमारे बारे में (About Us)", href: "/about" },
    { label: "संपर्क करें (Contact Us)", href: "/contact" },
    { label: "गोपनीयता नीति (Privacy Policy)", href: "/privacy" },
    { label: "नियम एवं शर्तें (Terms)", href: "/terms" },
    { label: "अस्वीकरण (Disclaimer)", href: "/disclaimer" },
    { label: "संपादकीय नीति (Editorial Policy)", href: "/editorial-policy" },
    { label: "शिकायत निवारण (Grievance)", href: "/grievance" },
  ];

  return (
    <footer className="footer-preserve w-full bg-[#0b0c10] text-gray-300 border-t border-gray-800/80 pt-10 pb-24 md:pb-10 select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        


        {/* TOP SECTION: BRAND & 3 BALANCED COLUMNS (5 items each) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-gray-800/60">
          
          {/* Col 1: Brand Info (Spans 2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href={isEn ? "/en" : "/"} className="inline-block">
              <Image
                src="/tfl-logo.png"
                alt="The Freelance"
                width={140}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>
            {isEn ? (
              <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                <strong className="text-white">The Freelance</strong> is India's most unbiased and modern digital news portal, delivering verified, independent journalism across national affairs, politics, business, technology, sports, and culture.
              </p>
            ) : (
              <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                <strong className="text-white">The Freelance</strong> भारत का सबसे निष्पक्ष और आधुनिक डिजिटल हिंदी न्यूज़ पोर्टल है। देश, दुनिया, राजनीति, तकनीक, सिनेमा, खेल और स्थानीय सरोकारों से जुड़ी हर खबर निष्पक्षता के साथ।
              </p>
            )}
            <div className="flex items-center gap-2.5 pt-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {isEn ? "Follow Us:" : "सोशल मीडिया:"}
              </span>
              <a href="https://facebook.com/thefreelancein" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-btn keep-white w-8 h-8 rounded-full bg-[#1877f2] hover:scale-110 text-white flex items-center justify-center transition-all shadow">
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://x.com/thefreelancein" target="_blank" rel="noopener noreferrer" aria-label="Twitter X" className="social-btn keep-white w-8 h-8 rounded-full bg-black border border-gray-700 hover:scale-110 text-white flex items-center justify-center transition-all shadow">
                <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://instagram.com/thefreelancein" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-btn keep-white w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:scale-110 text-white flex items-center justify-center transition-all shadow">
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://youtube.com/@thefreelancein" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="social-btn keep-white w-8 h-8 rounded-full bg-[#ff0000] hover:scale-110 text-white flex items-center justify-center transition-all shadow">
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://whatsapp.com/channel/0029Vb4qJ4V0VycM6KqKqB2m" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="social-btn keep-white w-8 h-8 rounded-full bg-[#25d366] hover:scale-110 text-white flex items-center justify-center transition-all shadow">
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              </a>
            </div>
          </div>

          {/* Col 2: Categories (5 items) */}
          <div>
            <h4 className="text-white text-sm font-black uppercase tracking-wider mb-4 border-l-2 border-red-600 pl-2">
              {isEn ? "Main Categories" : "मुख्य श्रेणियां"}
            </h4>
            <ul className="space-y-2.5 text-xs">
              {categories.slice(0, 5).map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="hover:text-red-400 transition-colors">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: More Categories (5 items) */}
          <div>
            <h4 className="text-white text-sm font-black uppercase tracking-wider mb-4 border-l-2 border-blue-600 pl-2">
              {isEn ? "Special Segments" : "विशेष सेगमेंट"}
            </h4>
            <ul className="space-y-2.5 text-xs">
              {categories.slice(5).map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="hover:text-blue-400 transition-colors">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Quick Links (5 items balanced) */}
          <div>
            <h4 className="text-white text-sm font-black uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              {isEn ? "Quick Links" : "क्विक लिंक्स"}
            </h4>
            <ul className="space-y-2.5 text-xs">
              {quickLinks.map((q) => (
                <li key={q.href}>
                  <Link href={q.href} className="hover:text-amber-400 transition-colors">
                    {q.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* SUB-MENU STRIP: Corporate, Editorial & Policy Links (Directly Above Copyright) */}
        <div className="py-4 border-b border-gray-800/60 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-400 font-medium">
          {subMenuLinks.map((item, index) => (
            <React.Fragment key={item.href}>
              <Link href={item.href} className="hover:text-white transition-colors">
                {item.label}
              </Link>
              {index < subMenuLinks.length - 1 && (
                <span className="text-gray-700 hidden sm:inline select-none">•</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* OUR NETWORK & INITIATIVES (With Logos) */}
        <div className="py-4 border-b border-gray-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            {isEn ? "Our Network & Initiatives:" : "हमारे नेटवर्क एवं पहल:"}
          </span>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {/* SocialCraft Logo Link */}
            <a
              href="https://socialcraft.thefreelance.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-violet-500/50 hover:bg-violet-950/20 transition-all shadow-sm"
              title="SocialCraft - Social Media Management & Digital Growth Agency"
            >
              <span className="font-black text-base tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400 group-hover:scale-105 transition-transform select-none">
                SocialCraft
              </span>
            </a>


            {/* VoterAction Logo Link */}
            <a
              href="https://voteraction.thefreelance.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-blue-500/50 hover:bg-blue-950/20 transition-all shadow-sm"
              title="VoterAction - Empowering Citizens & Democracy"
            >
              <img
                src="/voteraction-logo.png"
                alt="VoterAction"
                className="h-7 w-auto object-contain group-hover:scale-105 transition-transform"
              />
              <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                VoterAction
              </span>
            </a>

            {/* Shopath.in Logo Link */}
            <a
              href="https://shopath.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-950/20 transition-all shadow-sm"
              title="Shopath.in - Smart Quick Commerce & Local Shopping Platform"
            >
              <img
                src="/shopath-logo.png"
                alt="Shopath"
                className="h-7 w-7 object-contain rounded-md group-hover:scale-105 transition-transform"
              />
              <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                Shopath.in
              </span>
            </a>
          </div>
        </div>

        {/* BOTTOM SECTION: COPYRIGHT */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <p>© {currentYear} The Freelance (TFL). {isEn ? "All rights reserved." : "सर्वाधिकार सुरक्षित।"}</p>
          <p className="text-[11px] text-gray-600">
            Powered by Next.js & Google Cloud • Real-Time News Intelligence
          </p>
        </div>



      </div>
    </footer>
  );
}