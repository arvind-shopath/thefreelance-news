"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import AdBlock from "@/components/home/AdBlock";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "editorial",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.message || "संदेश भेजने में समस्या आई। कृपया पुनः प्रयास करें।");
      }
    } catch {
      setErrorMsg("सर्वर से संपर्क नहीं हो सका। कृपया बाद में प्रयास करें।");
    } finally {
      setSubmitting(false);
    }
  };

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
            <span className="text-red-500 font-semibold">संपर्क करें (Contact Us)</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-500/30 text-red-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            न्यूज़रूम से सीधा संवाद
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
            The Freelance टीम से संपर्क करें
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-normal">
            समाचार सुझाव, प्रेस रिलीज, शिकायत निवारण या विज्ञापन साझेदारी के लिए हमारी संपादकीय टीम सदैव उपलब्ध है।
          </p>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Direct Contact Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Editorial Desk */}
            <div className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 shadow-lg">
              <span className="text-xs font-bold text-red-500 uppercase tracking-wider block mb-2">
                📰 संपादकीय डेस्क (Newsroom)
              </span>
              <h3 className="text-lg font-bold text-white mb-2">समाचार सुझाव एवं प्रेस विज्ञप्ति</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">
                यदि आपके पास कोई ब्रेकिंग न्यूज़, खोजी रिपोर्ट या घटना की जानकारी है, तो सीधे ईमेल करें:
              </p>
              <div className="bg-[#181b26] p-3 rounded-lg border border-gray-800 text-xs font-mono text-red-400 select-all">
                thefreelancetfl@gmail.com
              </div>
            </div>

            {/* Advertising & Business */}
            <div className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 shadow-lg">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-2">
                💼 विज्ञापन एवं साझेदारी (Advertising)
              </span>
              <h3 className="text-lg font-bold text-white mb-2">ब्रांड प्रमोशन व विज्ञापन पूछताछ</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">
                वेबसाइट बैनर, प्रायोजित लेख, वेब स्टोरी और वीडियो प्रचार के लिए संपर्क करें:
              </p>
              <div className="bg-[#181b26] p-3 rounded-lg border border-gray-800 text-xs font-mono text-blue-400 select-all">
                thefreelancetfl@gmail.com
              </div>
            </div>

            {/* Registered Office & Grievance */}
            <div className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 shadow-lg">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                📍 पंजीकृत कार्यालय (Office)
              </span>
              <h3 className="text-lg font-bold text-white mb-2">The Freelance Media Network</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                आलमबाग, लखनऊ, उत्तर प्रदेश - 226005<br />
                ईमेल: thefreelancetfl@gmail.com<br />
                वेबसाइट: https://news.thefreelance.in
              </p>
            </div>

          </div>

          {/* Right Column: Interactive Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-2">
                संदेश भेजें (Send a Message)
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mb-6">
                कृपया नीचे दिया गया फॉर्म भरें। हमारी टीम 24 कार्य-घंटों के भीतर आपसे संपर्क करेगी।
              </p>

              {submitted ? (
                <div className="p-6 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-bold">
                    ✓
                  </div>
                  <h3 className="text-lg font-bold text-emerald-300">आपका संदेश प्राप्त हो गया है!</h3>
                  <p className="text-xs text-gray-300">
                    The Freelance से संपर्क करने के लिए धन्यवाद। हमारी संपादकीय टीम जल्द ही आपकी दी गई ईमेल आईडी पर जवाब देगी।
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", phone: "", department: "editorial", subject: "", message: "" });
                    }}
                    className="mt-3 text-xs text-emerald-400 hover:underline font-bold"
                  >
                    नया संदेश भेजें
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-300 font-medium">
                      ⚠️ {errorMsg}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">
                        आपका नाम (Full Name) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="उदा. राहुल शर्मा"
                        className="w-full bg-[#181b26] border border-gray-700 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">
                        ईमेल पता (Email Address) *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full bg-[#181b26] border border-gray-700 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">
                        मोबाइल नंबर (Mobile No.)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#181b26] border border-gray-700 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">
                        विभाग चुनें (Department) *
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full bg-[#181b26] border border-gray-700 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="editorial">संपादकीय / न्यूज़ टिप (Editorial)</option>
                        <option value="advertising">विज्ञापन एवं स्पॉन्सरशिप (Ads)</option>
                        <option value="grievance">शिकायत निवारण (Grievance)</option>
                        <option value="technical">तकनीकी समस्या (Technical Support)</option>
                        <option value="other">अन्य (General Inquiry)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      विषय (Subject) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="संदेश का संक्षिप्त विषय"
                      className="w-full bg-[#181b26] border border-gray-700 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      विस्तृत संदेश (Message) *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="अपना संदेश यहाँ विस्तार से लिखें..."
                      className="w-full bg-[#181b26] border border-gray-700 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg text-sm transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        संदेश भेजा जा रहा है...
                      </>
                    ) : (
                      "संदेश भेजें (Submit Message)"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* BOTTOM AD */}
        <div className="w-full flex justify-center mt-12">
          <AdBlock width="728px" height="90px" text="FOOTER CONTENT ADVERTISEMENT (728x90)" />
        </div>
      </div>
    </main>
  );
}
