"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Controlla se l'utente ha già accettato i cookie
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    setShowBanner(false);
  };

  const rejectCookies = () => {
    localStorage.setItem("cookie-consent", "rejected");
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-cyan-600 shadow-2xl">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-sm text-gray-700">
            <p className="font-semibold text-blue-deep mb-2">
              🍪 Informativa Cookie
            </p>
            <p>
              Questo sito utilizza cookie tecnici necessari per il funzionamento
              (autenticazione e preferenze). Non utilizziamo cookie di profilazione
              o tracking. Per potersi registrare bisogna accettarli{" "}
              <Link
                href="/privacy"
                className="text-cyan-600 underline hover:text-cyan-700 font-semibold"
              >
                Leggi l'informativa completa
              </Link>
            </p>
          </div>

          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={rejectCookies}
              className="px-6 py-2 border-2 border-gray-300 rounded-lg text-gray-700 
                hover:bg-gray-50 transition-colors font-semibold"
            >
              Rifiuta
            </button>
            <button
              onClick={acceptCookies}
              className="px-6 py-2 bg-cyan-600 text-white rounded-lg 
                hover:bg-cyan-700 transition-colors font-semibold shadow-md"
            >
              Accetta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}