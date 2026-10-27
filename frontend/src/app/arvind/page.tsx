"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SecretAdminLogin() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("tfl_admin_token") : null;
    const hasCookie = typeof document !== "undefined" && document.cookie.includes("tfl_admin_session");
    if (token || hasCookie) {
      router.replace("/tfl/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("tfl_admin_token", data.token || "arvind_auth_token_9723338321");
        localStorage.setItem("tfl_admin_user", data.user || "Admin");
        localStorage.setItem("tfl_admin_login_time", Date.now().toString());

        router.replace("/tfl/dashboard");
      } else {
        setError(data.error || "अमान्य क्रेडेंशियल्स! केवल अधिकृत व्यवस्थापक ही प्रवेश कर सकते हैं।");
        setIsLoading(false);
      }
    } catch (err) {
      setError("सर्वर से जुड़ने में त्रुटि आई। कृपया पुनः प्रयास करें।");
      setIsLoading(false);
    }
  };


  return (
    <>
      <head>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
        <title>Access Verification | The Freelance</title>
      </head>

      <div className="min-h-screen bg-[#050608] flex items-center justify-center p-4 relative overflow-hidden select-none">
        
        {/* Background Subtle Ambience */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-900/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="w-full max-w-[400px] z-10">
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-48 h-14 mb-3">
              <Image src="/tfl-logo.png" alt="The Freelance" fill className="object-contain" priority />
            </div>
            <div className="flex items-center gap-1.5 bg-red-600/10 border border-red-500/20 px-3 py-1 rounded-full text-[10px] font-bold text-red-400 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              व्यवस्थापक प्रमाणीकरण (Owner Access Only)
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-[#0e1017]/90 backdrop-blur-xl border border-gray-800/80 p-7 rounded-2xl shadow-2xl">
            
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs text-center font-medium leading-relaxed">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} autoComplete="off" className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs font-bold mb-1.5 uppercase tracking-wider">
                  व्यवस्थापक नंबर (Registered Mobile)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                  </span>
                  <input
                    type="tel"
                    required
                    autoComplete="off"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="1234567890"
                    className="w-full bg-[#07090e] text-white border border-gray-800 rounded-xl py-3 pl-9 pr-3 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold mb-1.5 uppercase tracking-wider">
                  सुरक्षित पासवर्ड (Master Password)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </span>
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="पासवर्ड दर्ज करें"
                    className="w-full bg-[#07090e] text-white border border-gray-800 rounded-xl py-3 pl-9 pr-3 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>सत्यापित किया जा रहा है...</span>
                  </>
                ) : (
                  <>
                    <span>डैशबोर्ड में प्रवेश करें</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-gray-800/60 text-center">
              <span className="text-[11px] text-gray-500">
                🔒 एंड-टू-एंड एन्क्रिप्टेड एडमिन सत्र
              </span>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
