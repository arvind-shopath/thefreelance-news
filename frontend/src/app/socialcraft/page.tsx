"use client";

import React, { useState, useEffect, useRef } from "react";

/* ─── TYPES ─────────────────────────────────────────── */
interface FormState {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

/* ─── OFFICIAL ICONS ─────────────────────────────────── */
const WA_ICON = (
  <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

const FB_ICON = (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
const IG_ICON = (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
);
const X_ICON = (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);
const YT_ICON = (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);

const Icon = ({ d, className = "w-6 h-6" }: { d: string; className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

/* ─── COUNTER HOOK ────────────────────────────────────── */
function useCounter(target: number, duration = 2000, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const startTime = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      setVal(Math.floor(p * p * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return val;
}

/* ─── SERVICES DATA ────────────────────────────────────── */
const SERVICES = [
  { icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", title: "Account Management", desc: "Full-time management of your Facebook, Instagram, X & YouTube accounts — posting, scheduling, and monitoring.", gradient: "from-violet-500/20 to-purple-500/10" },
  { icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z", title: "Content Creation", desc: "High-impact graphics, carousels, reels, and stories crafted by our creative designers aligned with your brand identity.", gradient: "from-pink-500/20 to-rose-500/10" },
  { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Paid Promotion & Boosting", desc: "Strategic Meta Ads & Google Ads campaigns targeting your ideal audience for maximum ROI and explosive reach.", gradient: "from-orange-500/20 to-amber-500/10" },
  { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", title: "Follower Growth Strategy", desc: "Organic & targeted paid follower growth plans that bring in real, genuine audiences — zero bots, guaranteed.", gradient: "from-cyan-500/20 to-blue-500/10" },
  { icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z", title: "Product Photo Shoot", desc: "Professional studio-grade product photography optimized for social commerce, e-catalogs, and conversion ads.", gradient: "from-emerald-500/20 to-teal-500/10" },
  { icon: "M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", title: "Product Video & Reels", desc: "Cinematic product video shoots and vertical short-form reels crafted for Instagram & Facebook to drive viral views.", gradient: "from-fuchsia-500/20 to-pink-500/10" },
  { icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z", title: "News Coverage & Interview", desc: "Feature your brand launch, leadership story, or milestones with editorial news coverage and an executive video interview.", gradient: "from-indigo-500/20 to-violet-500/10" },
  { icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z", title: "Creator Collaboration", desc: "Strategic influencer matchmaking — we identify, negotiate, and execute end-to-end creator sponsorships for your brand.", gradient: "from-amber-500/20 to-yellow-500/10" },
  { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: "Monthly Analytics Report", desc: "Detailed monthly analytics dashboard — reach, engagement rate, ads performance, and roadmap for future growth.", gradient: "from-teal-500/20 to-emerald-500/10" },
  { icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", title: "DM & Comment Monitoring", desc: "24/7 community management — quick customer replies, DM management, positive sentiment nurturing, and spam filtering.", gradient: "from-purple-500/20 to-pink-500/10" },
  { icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z", title: "Hashtag & Social SEO", desc: "Data-driven keyword mapping, bio optimization, and algorithm-friendly tags to scale organic discoverability.", gradient: "from-blue-500/20 to-indigo-500/10" },
  { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", title: "ORM & Brand Shield", desc: "Continuous sentiment monitoring and brand reputation safeguarding across all social media and review forums.", gradient: "from-rose-500/20 to-red-500/10" },
];

/* ─── PRICING DATA ─────────────────────────────────────── */
const PRICING = [
  {
    name: "Social Media Management",
    price: "₹30,000",
    period: "/month",
    highlight: true,
    badge: "Most Popular",
    gradient: "from-violet-600 via-purple-600 to-pink-600",
    features: [
      "FB, Instagram, X & YouTube Management",
      "30 High-Quality Custom Posts/Month",
      "Stories & Reels — 8 per Month",
      "Paid Ads Strategy & Optimization",
      "Dedicated Social Media Account Manager",
      "24/7 DM & Comment Moderation",
      "Social SEO & Keyword Optimization",
      "Monthly In-Depth Performance Analytics",
    ],
  },
  {
    name: "Personalized Web Development",
    price: "₹10,000",
    period: " + ₹2,000/mo",
    highlight: false,
    badge: "Web & Hosting",
    gradient: "from-cyan-500 via-blue-600 to-indigo-600",
    features: [
      "Custom Modern Website Development (₹10,000)",
      "Dedicated Cloud Hosting & Handling (₹2,000/mo)",
      "100% Mobile & Tablet Responsive Design",
      "Free SSL Certificate & Security Shield",
      "Monthly Maintenance, Backups & Content Updates",
      "SEO-Ready Setup & WhatsApp Lead Integration",
    ],
  },
  {
    name: "Product Photo Shoot",

    price: "₹5,000",
    period: "/product",
    highlight: false,
    badge: "E-Commerce Ready",
    gradient: "from-pink-500 to-rose-600",
    features: [
      "Professional Studio Setup & Lighting",
      "Multiple Angles & Creative Compositions",
      "Clean White Backdrop + Lifestyle Shots",
      "Commercial High-Res Edited Photos",
      "Commercial Usage & Marketing Rights",
      "Fast 48-Hour Turnaround Time",
    ],
  },
  {
    name: "Product Video & Reel",
    price: "₹8,000",
    period: "/product",
    highlight: false,
    badge: "Viral Short Form",
    gradient: "from-orange-500 to-amber-600",
    features: [
      "Complete 4K Product Showcase Video",
      "Vertical 9:16 Format for Reels & Shorts",
      "Dynamic Motion Graphics & Trendy Music",
      "Creative Scriptwriting & Hook Creation",
      "Color-Graded Master Deliverable",
      "Fast 72-Hour Turnaround Time",
    ],
  },
  {
    name: "News Coverage & Interview",
    price: "₹10,000",
    period: "/story",
    highlight: false,
    badge: "Authority Boost",
    gradient: "from-blue-500 to-cyan-600",
    features: [
      "Published on TheFreeLance News Portal",
      "Professional Executive Video Interview",
      "SEO-Optimized Permanent News Article",
      "Broadcast Across Verified Social Channels",
      "Permanent Do-Follow Web Archive Link",
      "Custom Thumbnail & Video Highlights",
    ],
  },
  {
    name: "Creator Collaboration",
    price: "₹12,000",
    period: "/video",
    highlight: false,
    badge: "Influencer Impact",
    gradient: "from-emerald-500 to-teal-600",
    features: [
      "Niche Creator Sourcing & Outreach",
      "Pricing Negotiation & Contract Drafting",
      "Campaign Brief & Script Assistance",
      "Quality Check & Pre-Publish Approval",
      "Cross-Platform Distribution Rights",
      "Post-Campaign Reach & ROI Reporting",
    ],
  },
];

/* ─── WHY CHOOSE US ────────────────────────────────────── */
const WHY = [
  { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Media-Grade Storytelling", desc: "We understand what makes audiences stop and listen — crafting genuine viral stories rather than bland commercial noise." },
  { icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", title: "Dedicated Manager", desc: "One dedicated social media manager assigned directly to your brand — always available on call and WhatsApp." },
  { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: "Data-Driven ROI", desc: "Every campaign is tracked with precision metrics: impressions, saves, CTR, and follower conversion." },
  { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", title: "100% Real Engagement", desc: "Zero bots, zero inflated metrics. We focus on real followers who engage, comment, and convert into loyal customers." },
  { icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "Bilingual Reach (Hindi & English)", desc: "Reach Tier-1 to Tier-3 markets across India with high-impact bilingual copy and region-specific messaging." },
  { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "Transparent Pricing & SLA", desc: "Clear deliverables, no hidden management markups, and guaranteed turnaround time on all scheduled creatives." },
];

/* ─── HOW IT WORKS ─────────────────────────────────────── */
const STEPS = [
  { num: "01", title: "Discovery Call", desc: "We evaluate your current presence, study your competitors, and define your core growth goals." },
  { num: "02", title: "Custom Roadmap", desc: "We design a 30-day content calendar, visual moodboard, and tailored hashtag & ad framework." },
  { num: "03", title: "Creative Execution", desc: "Our designers, copywriters, and video editors create top-tier assets and publish seamlessly." },
  { num: "04", title: "Scale & Optimize", desc: "Weekly review, monthly analytics breakdown, and relentless ad campaign optimization." },
];

/* ─── MAIN COMPONENT ───────────────────────────────────── */
export default function SocialCraftPage() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "", service: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  
  // Section visibility states for scroll animations
  const [statsVisible, setStatsVisible] = useState(false);
  const [servicesVisible, setServicesVisible] = useState(false);
  const [pricingVisible, setPricingVisible] = useState(false);
  const [whyVisible, setWhyVisible] = useState(false);

  const statsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleObserve = (ref: React.RefObject<HTMLDivElement | null>, setter: (v: boolean) => void) => {
      if (!ref.current) return;
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) setter(true);
      }, { threshold: 0.15 });
      obs.observe(ref.current);
      return () => obs.disconnect();
    };

    const cleanup1 = handleObserve(statsRef, setStatsVisible);
    const cleanup2 = handleObserve(servicesRef, setServicesVisible);
    const cleanup3 = handleObserve(pricingRef, setPricingVisible);
    const cleanup4 = handleObserve(whyRef, setWhyVisible);

    return () => {
      cleanup1?.();
      cleanup2?.();
      cleanup3?.();
      cleanup4?.();
    };
  }, []);

  const c1 = useCounter(250, 2000, statsVisible);
  const c2 = useCounter(5000, 2200, statsVisible);
  const c3 = useCounter(12, 1800, statsVisible);
  const c4 = useCounter(98, 1600, statsVisible);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectPlan = (planName: string) => {
    setForm(prev => ({ ...prev, service: planName }));
    const contactEl = document.getElementById("contact");
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          department: "advertising",
          subject: `[SocialCraft] ${form.service || "General Inquiry"}`,
          message: `📣 SOCIALCRAFT INQUIRY\n\nService Interest: ${form.service || "Not specified"}\n\nClient Phone: ${form.phone}\nClient Email: ${form.email}\n\nMessage:\n${form.message}`,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.message || "Submission failed");
      }
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", service: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-[#08071A] text-white font-sans min-h-screen overflow-x-hidden selection:bg-violet-600 selection:text-white">

      {/* ── CUSTOM INLINE STYLES FOR ANIMATIONS ── */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(1deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(12px) rotate(-1deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.08); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 7s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 5s ease-in-out infinite;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 8s ease infinite;
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#08071A]/85 backdrop-blur-2xl border-b border-white/[0.08] transition-all">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-18 py-3 flex items-center justify-between">
          
          {/* Typographic Logo */}
          <a href="#" className="flex items-center group">
            <span className="font-black text-2xl sm:text-3xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400 group-hover:scale-105 transition-transform select-none">
              SocialCraft
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#services" className="hover:text-violet-400 transition-colors">Services</a>
            <a href="#pricing" className="hover:text-pink-400 transition-colors">Pricing</a>
            <a href="#why-us" className="hover:text-orange-400 transition-colors">Why Us</a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">Process</a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a>
          </div>

          {/* Official WhatsApp Button */}
          <a
            href="https://wa.me/919723338321?text=Hi%2C%20I%27m%20interested%20in%20SocialCraft%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white text-xs font-bold transition-all shadow-lg shadow-green-500/25 hover:scale-105 active:scale-95"
          >
            {WA_ICON}
            <span>WhatsApp Us</span>
          </a>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Animated Background Atmosphere */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-10 left-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-pink-500/15 rounded-full blur-[130px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-purple-900/15 rounded-full blur-[150px]" />
          {/* Subtle Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(#a78bfa 1px, transparent 1px), linear-gradient(90deg, #a78bfa 1px, transparent 1px)",
              backgroundSize: "48px 48px"
            }}
          />
        </div>

        {/* Floating Badges */}
        <div className="hidden lg:block absolute top-36 left-12 animate-float-slow">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-2xl text-xs font-semibold text-violet-300">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
            🔥 30M+ Organic Video Impressions
          </div>
        </div>
        <div className="hidden lg:block absolute bottom-32 right-12 animate-float-reverse">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-2xl text-xs font-semibold text-pink-300">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
            ✨ 100% Real Audience & Zero Bots
          </div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 text-center">
          {/* Category Chip */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-bold tracking-widest uppercase mb-8 shadow-inner hover:scale-105 transition-transform cursor-default">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            Full-Suite Social Media & Growth Agency
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.08] tracking-tight mb-8">
            Grow Your Brand
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400 animate-gradient-x">
              With SocialCraft
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Elevate your digital presence with viral content creation, high-converting paid ads, and dedicated account management designed to scale your audience.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#contact"
              className="w-full sm:w-auto px-9 py-4 rounded-full bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500 hover:from-violet-500 hover:to-orange-400 text-white font-extrabold text-sm tracking-wide transition-all shadow-xl shadow-violet-600/30 hover:shadow-pink-500/40 hover:-translate-y-1 active:translate-y-0 text-center"
            >
              Get Free Consultation →
            </a>
            <a
              href="https://wa.me/919723338321?text=Hi%2C%20I%27m%20interested%20in%20SocialCraft%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full border border-emerald-500/40 bg-emerald-950/20 hover:bg-emerald-900/30 text-emerald-300 font-bold text-sm transition-all hover:-translate-y-1 shadow-lg shadow-emerald-900/20"
            >
              {WA_ICON}
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Social Platform Chips with Glow */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-14 flex-wrap">
            {[
              { icon: FB_ICON, label: "Facebook", color: "hover:border-blue-500/60 hover:text-blue-400" },
              { icon: IG_ICON, label: "Instagram", color: "hover:border-pink-500/60 hover:text-pink-400" },
              { icon: X_ICON, label: "X (Twitter)", color: "hover:border-gray-400 hover:text-white" },
              { icon: YT_ICON, label: "YouTube", color: "hover:border-red-500/60 hover:text-red-400" },
            ].map(p => (
              <div
                key={p.label}
                className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-xs font-semibold text-gray-300 transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg ${p.color} cursor-pointer`}
              >
                {p.icon}
                <span>{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section ref={statsRef} className="py-20 border-y border-white/[0.08] bg-[#060515]/60 relative">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: c1, suffix: "+", label: "Brands Scaled" },
            { value: c2, suffix: "+", label: "Creatives Produced" },
            { value: c3, suffix: "M+", label: "Reach Generated" },
            { value: c4, suffix: "%", label: "Client Retention Rate" },
          ].map((s, idx) => (
            <div
              key={s.label}
              className={`space-y-2 p-4 rounded-2xl transition-all duration-700 ${
                statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              <div className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400 tracking-tight">
                {s.value}{s.suffix}
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-semibold uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES SECTION ── */}
      <section id="services" ref={servicesRef} className="py-28 px-5 sm:px-8 relative">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-20">
            <span className="text-violet-400 text-xs font-extrabold tracking-widest uppercase mb-3 block">
              What We Do
            </span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              Comprehensive Growth Services
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-base">
              From creative storytelling and studio video shoots to precision paid advertising — everything your brand needs to dominate online.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {SERVICES.map((s, idx) => (
              <div
                key={s.title}
                className={`group relative p-7 rounded-3xl bg-white/[0.03] border border-white/[0.07] hover:border-violet-500/50 hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-2.5 hover:shadow-2xl hover:shadow-violet-600/15 flex flex-col ${
                  servicesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${(idx % 4) * 100}ms` }}
              >
                {/* Glowing top accent on hover */}
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-violet-500/0 to-transparent group-hover:via-violet-400 transition-all duration-500" />
                
                {/* Icon Container */}
                <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 border border-white/10`}>
                  <Icon d={s.icon} className="w-6 h-6 text-violet-300 group-hover:text-pink-300 transition-colors" />
                </div>

                <h3 className="font-extrabold text-base mb-3 text-white group-hover:text-violet-300 transition-colors tracking-tight">
                  {s.title}
                </h3>
                
                <p className="text-gray-400 text-xs leading-relaxed flex-1">
                  {s.desc}
                </p>

                <div className="pt-5 mt-4 border-t border-white/5 flex items-center text-xs font-bold text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Learn more</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── PRICING SECTION ── */}
      <section id="pricing" ref={pricingRef} className="py-28 px-5 sm:px-8 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent relative">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-20">
            <span className="text-pink-400 text-xs font-extrabold tracking-widest uppercase mb-3 block">
              Transparent Pricing
            </span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              Clear & Flexible Packages
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-base">
              No hidden agency fees or surprise invoices. Select the exact plan your business requires.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 max-w-6xl mx-auto">
            {PRICING.map((p, idx) => (
              <div
                key={p.name}
                className={`relative rounded-3xl p-7 flex flex-col transition-all duration-500 hover:-translate-y-3 ${
                  p.highlight
                    ? "border-2 border-violet-500/80 bg-gradient-to-b from-violet-950/50 via-[#100b29] to-[#0c0820] shadow-2xl shadow-violet-500/25 scale-[1.03] z-10"
                    : "border border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                } ${pricingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${idx * 120}ms` }}
              >
                {p.badge && (
                  <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-white text-[10px] font-black tracking-wider bg-gradient-to-r ${p.gradient} shadow-lg whitespace-nowrap uppercase`}>
                    {p.badge}
                  </div>
                )}

                <div className={`text-sm font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r ${p.gradient}`}>
                  {p.name}
                </div>

                <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-white/10">
                  <span className="text-3xl sm:text-4xl font-black text-white">{p.price}</span>
                  <span className="text-gray-400 text-xs font-medium">{p.period}</span>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-xs text-gray-300 leading-normal">
                      <svg className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleSelectPlan(p.name)}
                  className={`w-full py-3 rounded-2xl text-xs font-extrabold tracking-wide transition-all cursor-pointer ${
                    p.highlight
                      ? `bg-gradient-to-r ${p.gradient} text-white shadow-lg shadow-violet-600/30 hover:opacity-90 hover:scale-[1.02]`
                      : "border border-white/15 text-white hover:bg-white/10 hover:border-white/30"
                  }`}
                >
                  Choose Package →
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section id="why-us" ref={whyRef} className="py-28 px-5 sm:px-8 relative">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-20">
            <span className="text-orange-400 text-xs font-extrabold tracking-widest uppercase mb-3 block">
              Why SocialCraft
            </span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              Built for Real Business Impact
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-base">
              We merge journalistic credibility, viral social creative instincts, and ruthless analytics to grow real audiences.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY.map((w, idx) => (
              <div
                key={w.title}
                className={`group p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] hover:border-orange-500/40 hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-500/10 ${
                  whyVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all">
                  <Icon d={w.icon} className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="font-extrabold text-base text-white mb-2 tracking-tight group-hover:text-orange-300 transition-colors">
                  {w.title}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {w.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── PROCESS STEPS ── */}
      <section id="how-it-works" className="py-28 px-5 sm:px-8 bg-gradient-to-b from-transparent via-violet-950/15 to-transparent relative">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-20">
            <span className="text-violet-400 text-xs font-extrabold tracking-widest uppercase mb-3 block">
              Proven Workflow
            </span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              How We Work With You
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div
                key={s.num}
                className="group relative p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] hover:border-violet-500/50 hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-violet-500 to-transparent z-10" />
                )}
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-violet-400/60 to-transparent mb-4 group-hover:scale-110 transition-transform">
                  {s.num}
                </div>
                <h3 className="font-extrabold text-sm text-white mb-2 group-hover:text-violet-300 transition-colors">
                  {s.title}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-16 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto text-center rounded-3xl bg-gradient-to-r from-violet-900/60 via-purple-900/50 to-pink-900/60 border border-violet-500/30 p-12 sm:p-16 relative overflow-hidden shadow-2xl">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle at 30% 50%, #7c3aed88, transparent 60%), radial-gradient(circle at 70% 50%, #ec489988, transparent 60%)"
            }}
          />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black mb-5 tracking-tight">
              Ready to Accelerate Your Social Presence?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base mb-10 max-w-xl mx-auto leading-relaxed">
              Book a no-obligation consultation with our strategy director. We will audit your current channels and propose a customized growth plan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#contact"
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-white text-violet-950 font-black text-sm hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
              >
                Get Free Consultation →
              </a>
              <a
                href="https://wa.me/919723338321?text=Hi%2C%20I%27m%20interested%20in%20SocialCraft%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-emerald-400/50 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-sm transition-all hover:scale-105"
              >
                {WA_ICON}
                <span>+91 97233 38321</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ── */}
      <section id="contact" className="py-28 px-5 sm:px-8 relative">
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center mb-14">
            <span className="text-pink-400 text-xs font-extrabold tracking-widest uppercase mb-3 block">
              Direct Contact
            </span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              Let&apos;s Build Something Iconic
            </h2>
            <p className="text-gray-400 text-base">
              Submit your project details and our team will get back to you within 24 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/[0.09] rounded-3xl p-8 sm:p-12 space-y-6 shadow-2xl backdrop-blur-xl">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Your Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter full name"
                  className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 text-sm focus:border-violet-500 focus:bg-white/[0.07] focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="name@company.com"
                  className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 text-sm focus:border-violet-500 focus:bg-white/[0.07] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">WhatsApp Number *</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 9XXXXXXXXX"
                  className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 text-sm focus:border-violet-500 focus:bg-white/[0.07] focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Service Required *</label>
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#0c0922] border border-white/10 text-white text-sm focus:border-violet-500 focus:outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select service...</option>
                  <option value="Social Media Management">Social Media Management — ₹30,000/mo</option>
                  <option value="Personalized Web Development">Personalized Web Development — ₹10,000 (+ ₹2,000/mo)</option>
                  <option value="Product Photo Shoot">Product Photo Shoot — ₹5,000/product</option>
                  <option value="Product Video & Reel">Product Video & Reel — ₹8,000/product</option>
                  <option value="News Coverage & Interview">News Coverage & Interview — ₹10,000</option>
                  <option value="Creator Collaboration">Creator Collaboration — ₹12,000/video</option>
                  <option value="Custom / Multiple Services">Custom / Enterprise Package</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Tell Us About Your Brand *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Mention your industry, website/social handles, and key marketing objectives..."
                className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 text-sm focus:border-violet-500 focus:bg-white/[0.07] focus:outline-none transition-all resize-none"
              />
            </div>

            {status === "error" && (
              <div className="px-5 py-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
                {errorMsg}
              </div>
            )}
            
            {status === "sent" && (
              <div className="px-5 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-semibold">
                ✅ Your inquiry has been submitted! Our growth director will reach out within 24 hours.
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="submit"
                disabled={status === "sending"}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500 hover:from-violet-500 hover:to-orange-400 text-white font-extrabold text-sm tracking-wide hover:opacity-95 disabled:opacity-50 transition-all shadow-xl shadow-violet-600/25 cursor-pointer"
              >
                {status === "sending" ? "Submitting..." : "Submit Inquiry →"}
              </button>

              <a
                href="https://wa.me/919723338321?text=Hi%2C%20I%27m%20interested%20in%20SocialCraft%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 hover:bg-emerald-900/30 text-emerald-300 font-bold text-sm transition-all text-center"
              >
                {WA_ICON}
                <span>WhatsApp Instead</span>
              </a>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2 text-xs text-gray-400 font-medium">
              <svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Don&apos;t worry, we will not spam you.</span>
            </div>

          </form>

        </div>
      </section>

      {/* ── STANDALONE SOCIALCRAFT FOOTER ── */}
      <footer className="border-t border-white/[0.09] bg-[#050412] py-16 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Top Brand Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-white/[0.08]">
            <div className="flex items-center">
              <span className="font-black text-3xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400 select-none">
                SocialCraft
              </span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm text-center md:text-right max-w-md font-medium">
              Full-Suite Social Media Handling, Creative Storytelling & Growth Marketing
            </p>
          </div>

          {/* Network Platforms with Logos & Accurate Descriptions */}
          <div className="py-12 border-b border-white/[0.08]">
            <div className="text-center mb-8">
              <span className="text-xs font-extrabold text-violet-400 uppercase tracking-widest">
                Our Digital Network & Platforms
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {/* The Freelance Card */}
              <a
                href="https://news.thefreelance.in"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-red-500/50 hover:bg-white/[0.05] transition-all duration-300 shadow-xl hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center p-2 flex-shrink-0 group-hover:scale-105 transition-transform">
                  <img
                    src="/tfl-logo.png"
                    alt="The Freelance Logo"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-white group-hover:text-red-400 transition-colors truncate">
                      The Freelance
                    </h4>
                    <svg className="w-3 h-3 text-gray-500 group-hover:text-white transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </div>
                  <p className="text-[11px] text-gray-400 truncate">Independent Digital News Portal</p>
                  <span className="text-[10px] text-red-400/80 font-semibold">news.thefreelance.in ↗</span>
                </div>
              </a>

              {/* VoterAction Card — Accurate Election Management App description */}
              <a
                href="https://voteraction.thefreelance.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-blue-500/50 hover:bg-white/[0.05] transition-all duration-300 shadow-xl hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center p-1.5 flex-shrink-0 group-hover:scale-105 transition-transform">
                  <img
                    src="/voteraction-logo.png"
                    alt="VoterAction Logo"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-white group-hover:text-blue-400 transition-colors truncate">
                      VoterAction
                    </h4>
                    <svg className="w-3 h-3 text-gray-500 group-hover:text-white transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </div>
                  <p className="text-[11px] text-gray-400 truncate">Election & Campaign Platform</p>
                  <span className="text-[10px] text-blue-400/80 font-semibold">voteraction...in ↗</span>
                </div>
              </a>

              {/* Shopath.in Card */}
              <a
                href="https://shopath.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-emerald-500/50 hover:bg-white/[0.05] transition-all duration-300 shadow-xl hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center p-2 flex-shrink-0 group-hover:scale-105 transition-transform">
                  <img
                    src="/shopath-logo.png"
                    alt="Shopath Logo"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-white group-hover:text-emerald-400 transition-colors truncate">
                      Shopath.in
                    </h4>
                    <svg className="w-3 h-3 text-gray-500 group-hover:text-white transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </div>
                  <p className="text-[11px] text-gray-400 truncate">Quick Commerce & Local Shopping</p>
                  <span className="text-[10px] text-emerald-400/80 font-semibold">shopath.in ↗</span>
                </div>
              </a>
            </div>
          </div>

          {/* Bottom Copyright Strip */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
            <p>© {new Date().getFullYear()} SocialCraft. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>📍 India</span>
              <span>•</span>
              <a href="mailto:thefreelancetfl@gmail.com" className="hover:text-gray-300 transition-colors">
                thefreelancetfl@gmail.com
              </a>

            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
