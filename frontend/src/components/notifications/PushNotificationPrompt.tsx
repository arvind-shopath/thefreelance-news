"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

function urlB64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushNotificationPrompt() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Strictly identify audience language
  const isEnglish = pathname?.startsWith('/en');
  const targetLanguage = isEnglish ? 'en' : 'hi';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check browser support
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
      return;
    }

    // If permission already granted or explicitly denied, don't nag
    if (Notification.permission === 'granted' || Notification.permission === 'denied') {
      return;
    }

    // Check dismissal cookie/storage (remind only after 3 days)
    const dismissedTime = localStorage.getItem('tfl_push_dismissed');
    if (dismissedTime && Date.now() - parseInt(dismissedTime, 10) < 3 * 24 * 3600 * 1000) {
      return;
    }

    // Show smooth banner after 4 seconds of reading
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    try {
      // 1. Request Browser Permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        handleDismiss();
        return;
      }

      // 2. Register Service Worker
      const reg = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      // 3. Fetch Server Public VAPID Key
      const keyRes = await fetch('/api/v1/push/public-key');
      const { publicKey } = await keyRes.json();

      if (!publicKey) throw new Error('VAPID key unavailable');

      // 4. Create Push Subscription
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(publicKey),
      });

      const subJson = subscription.toJSON();

      // 5. Save with Language to Backend
      await fetch('/api/v1/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: subJson.endpoint,
          keys: subJson.keys,
          language: targetLanguage, // Strictly segregated!
          userAgent: navigator.userAgent,
        }),
      });

      setIsSubscribed(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 2500);
    } catch (err) {
      console.error('[WebPush] Subscription error:', err);
      handleDismiss();
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('tfl_push_dismissed', Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#12141c]/95 backdrop-blur-md border border-red-600/30 rounded-2xl p-4 shadow-2xl text-white">
        {isSubscribed ? (
          <div className="flex items-center gap-3 text-emerald-400 font-bold text-sm">
            <span className="text-xl">✅</span>
            <span>
              {isEnglish 
                ? 'Alerts Enabled! You will receive timely breaking news.' 
                : 'नोटिफिकेशन चालू हो गए हैं! आपको ताज़ा ब्रेकिंग खबरें मिलती रहेंगी।'}
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-red-600/20 text-red-500 rounded-xl text-lg flex-shrink-0">
                🔔
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-snug">
                  {isEnglish ? 'Breaking News Alerts' : 'ताज़ा ब्रेकिंग न्यूज़ अलर्ट'}
                </h4>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                  {isEnglish
                    ? 'Get instant updates on major global events directly on your screen.'
                    : 'देश और दुनिया की बड़ी खबरों की सूचना सीधे अपनी स्क्रीन पर पाएं। कोई स्पैम नहीं।'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-800">
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 text-xs text-gray-400 hover:text-white font-medium transition-colors"
              >
                {isEnglish ? 'Maybe Later' : 'बाद में'}
              </button>
              <button
                onClick={handleSubscribe}
                disabled={isSubscribing}
                className="px-4 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg shadow-lg shadow-red-600/20 transition-all flex items-center gap-1.5"
              >
                {isSubscribing ? (
                  <span>⏳...</span>
                ) : (
                  <span>{isEnglish ? 'Allow Alerts' : 'हाँ, चालू करें'}</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
