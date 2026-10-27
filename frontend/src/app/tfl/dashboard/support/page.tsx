"use client";

import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

interface SupportConfig {
  upiId: string;
  payeeName: string;
  customQrUrl?: string;
  bankAccount?: string;
  ifscCode?: string;
  bankName?: string;
  accountHolder?: string;
  tagline?: string;
  description?: string;
}

const DEFAULT_CONFIG: SupportConfig = {
  upiId: "thefreelance@upi",
  payeeName: "The Freelance",
  customQrUrl: "",
  bankAccount: "919876543210",
  ifscCode: "PYTM0123456",
  bankName: "Paytm Payments Bank",
  accountHolder: "The Freelance Media",
  tagline: "स्वतंत्र, निष्पक्ष और जनसरोकारी पत्रकारिता को आपका साथ चाहिए",
  description:
    "The Freelance किसी भी राजनीतिक दल या बड़े कॉर्पोरेट घराने के दबाव से मुक्त होकर केवल आम जनता के मुद्दों को प्राथमिकता देता है। हमारा मानना है कि पत्रकारिता का असल मालिक पाठक होता है।"
};

export default function DashboardSupportSettings() {
  const [config, setConfig] = useState<SupportConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/v1/ads/support_payment_config")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.adHtml) {
          try {
            const parsed = JSON.parse(data.adHtml);
            setConfig((prev) => ({ ...prev, ...parsed }));
          } catch {}
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('tfl_admin_token') || 'arvind_auth_token_9723338321' : 'arvind_auth_token_9723338321';

      const res = await fetch("/api/v1/ads/support_payment_config", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-token": token
        },
        body: JSON.stringify({
          adHtml: JSON.stringify(config),
          isActive: true
        })
      });


      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        alert("सेटिंग्स सेव करने में समस्या आई।");
      }
    } catch {
      alert("सर्वर से कनेक्ट नहीं हो सका।");
    } finally {
      setSaving(false);
    }
  };

  const previewUpiUri = `upi://pay?pa=${encodeURIComponent(config.upiId)}&pn=${encodeURIComponent(
    config.payeeName
  )}&cu=INR&tn=${encodeURIComponent("Support TheFreelance")}`;

  if (loading) {
    return <div className="text-gray-400 p-8">सपोर्ट सेटिंग्स लोड हो रही हैं...</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 pb-16">
      
      {/* Header */}
      <div className="bg-[#12141c] border border-gray-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-500/30 text-red-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            Payment & Donation Gateway
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            सपोर्ट व यूपीआई सेटिंग्स (Support Page Management)
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            यहाँ से आप अपनी UPI ID, QR कोड, बैंक डिटेल्स और सपोर्ट पेज का संदेश तुरंत बदल सकते हैं।
          </p>
        </div>

        <a
          href="/support"
          target="_blank"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-red-600/30 transition-all active:scale-95"
        >
          <span>👁️</span> लाइव सपोर्ट पेज देखें
        </a>
      </div>

      {/* Success Banner */}
      {savedSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-6 py-4 rounded-2xl flex items-center gap-3 animate-fade-in shadow-xl">
          <span className="text-xl">✅</span>
          <span className="text-sm font-bold">
            आपकी UPI और सपोर्ट सेटिंग्स सफलतापूर्वक अपडेट हो गई हैं! लाइव पेज पर बदलाव दिखने लगे हैं।
          </span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Inputs */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* UPI Settings Card */}
          <div className="bg-[#12141c] border border-gray-800 p-6 sm:p-7 rounded-3xl shadow-xl flex flex-col gap-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-xl">📱</span> UPI और QR कोड कॉन्फ़िगरेशन
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                आपकी UPI आईडी (VPA ID) *
              </label>
              <input
                type="text"
                required
                value={config.upiId}
                onChange={(e) => setConfig({ ...config, upiId: e.target.value })}
                placeholder="उदा. yourname@okaxis या 9876543210@paytm"
                className="w-full bg-[#0b0c10] border border-gray-700 focus:border-red-500 rounded-2xl py-3.5 px-4 text-white font-mono text-base outline-none transition-colors"
              />
              <p className="text-[11px] text-gray-400 mt-1.5">
                इसी UPI आईडी के लिए QR कोड अपने आप जेनरेट होगा और सीधे पेमेंट इसी पर आएगा।
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                पेयी / मर्चेंट का नाम (Payee Name) *
              </label>
              <input
                type="text"
                required
                value={config.payeeName}
                onChange={(e) => setConfig({ ...config, payeeName: e.target.value })}
                placeholder="उदा. The Freelance या आपका नाम"
                className="w-full bg-[#0b0c10] border border-gray-700 focus:border-red-500 rounded-2xl py-3.5 px-4 text-white text-sm outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                कस्टम QR कोड इमेज URL (वैकल्पिक / Optional)
              </label>
              <input
                type="text"
                value={config.customQrUrl || ""}
                onChange={(e) => setConfig({ ...config, customQrUrl: e.target.value })}
                placeholder="उदा. /support-qr.png या https://yourdomain.com/qr.png"
                className="w-full bg-[#0b0c10] border border-gray-700 focus:border-red-500 rounded-2xl py-3.5 px-4 text-white text-sm outline-none transition-colors"
              />
              <p className="text-[11px] text-gray-400 mt-1.5">
                खाली छोड़ने पर सिस्टम आपकी UPI आईडी से आधुनिक डायनामिक QR कोड खुद बना देगा।
              </p>
            </div>
          </div>

          {/* Text Content */}
          <div className="bg-[#12141c] border border-gray-800 p-6 sm:p-7 rounded-3xl shadow-xl flex flex-col gap-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-xl">✍️</span> सपोर्ट पेज संदेश व टैगलाइन
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                मुख्य हेडिंग / अपील टैगलाइन
              </label>
              <input
                type="text"
                value={config.tagline || ""}
                onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                placeholder="उदा. स्वतंत्र, निष्पक्ष और जनसरोकारी पत्रकारिता को आपका साथ चाहिए"
                className="w-full bg-[#0b0c10] border border-gray-700 focus:border-red-500 rounded-2xl py-3.5 px-4 text-white text-sm outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                विस्तृत विवरण (Appeal Message)
              </label>
              <textarea
                rows={4}
                value={config.description || ""}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                placeholder="पाठकों के लिए आपकी अपील..."
                className="w-full bg-[#0b0c10] border border-gray-700 focus:border-red-500 rounded-2xl p-4 text-white text-sm outline-none transition-colors"
              ></textarea>
            </div>
          </div>

          {/* Bank Transfer Details */}
          <div className="bg-[#12141c] border border-gray-800 p-6 sm:p-7 rounded-3xl shadow-xl flex flex-col gap-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-xl">🏦</span> बैंक खाता विवरण (NEFT / IMPS)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  खाता धारक (Account Name)
                </label>
                <input
                  type="text"
                  value={config.accountHolder || ""}
                  onChange={(e) => setConfig({ ...config, accountHolder: e.target.value })}
                  className="w-full bg-[#0b0c10] border border-gray-700 focus:border-red-500 rounded-2xl py-3 px-4 text-white text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  बैंक का नाम (Bank Name)
                </label>
                <input
                  type="text"
                  value={config.bankName || ""}
                  onChange={(e) => setConfig({ ...config, bankName: e.target.value })}
                  className="w-full bg-[#0b0c10] border border-gray-700 focus:border-red-500 rounded-2xl py-3 px-4 text-white text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  खाता संख्या (Account Number)
                </label>
                <input
                  type="text"
                  value={config.bankAccount || ""}
                  onChange={(e) => setConfig({ ...config, bankAccount: e.target.value })}
                  className="w-full bg-[#0b0c10] border border-gray-700 focus:border-red-500 rounded-2xl py-3 px-4 text-white text-sm outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  IFSC कोड
                </label>
                <input
                  type="text"
                  value={config.ifscCode || ""}
                  onChange={(e) => setConfig({ ...config, ifscCode: e.target.value })}
                  className="w-full bg-[#0b0c10] border border-gray-700 focus:border-red-500 rounded-2xl py-3 px-4 text-white text-sm outline-none font-mono uppercase"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-2xl font-black text-base shadow-xl shadow-red-600/30 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {saving ? "सेव किया जा रहा है..." : "💾 सेटिंग्स सुरक्षित करें (Save Support Settings)"}
          </button>
        </div>

        {/* Right: Live Preview Card */}
        <div className="lg:col-span-5 sticky top-6">
          <div className="bg-[#12141c] border border-gray-800 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col items-center text-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              लाइव क्यूआर कोड प्रीव्यू (Live QR Preview)
            </span>

            <div className="p-4 bg-white rounded-2xl shadow-inner relative flex items-center justify-center border-4 border-gray-700/60 mb-5">
              <QRCodeSVG
                value={previewUpiUri}
                size={220}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: "/logo-circle.png",
                  height: 44,
                  width: 44,
                  excavate: true,
                }}
              />
            </div>

            <div className="w-full bg-[#0b0c10] border border-gray-800 rounded-2xl p-4 text-left mb-4">
              <div className="text-[11px] text-gray-400 uppercase tracking-wider font-bold">UPI ID:</div>
              <div className="text-base font-mono font-bold text-white mt-0.5 break-all">
                {config.upiId}
              </div>
              <div className="text-[11px] text-gray-400 uppercase tracking-wider font-bold mt-2">पेयी का नाम:</div>
              <div className="text-sm font-semibold text-gray-200 mt-0.5">
                {config.payeeName}
              </div>
            </div>

            <div className="text-xs text-gray-400 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl w-full text-left">
              ℹ️ जब भी कोई पाठक इस QR को अपने फोन से स्कैन करेगा, तो आपका नाम <strong>{config.payeeName}</strong> और UPI ID <strong>{config.upiId}</strong> सीधे उनके UPI ऐप में आ जाएगी।
            </div>
          </div>
        </div>

      </form>

    </div>
  );
}
