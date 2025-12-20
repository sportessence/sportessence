"use client";

import { useState, useEffect } from "react";
import { forgotPassword } from "@/app/actions/auth";
import { executeRecaptcha } from "@/app/utils/recaptcha";
import Link from "next/link";

export default function RecuperoPassword() {
  const [form, setForm] = useState({ email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"error" | "success">("error");
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  useEffect(() => {
    // Carica reCAPTCHA quando il componente monta
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (siteKey) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => setRecaptchaLoaded(true);
      document.head.appendChild(script);
    } else {
      setRecaptchaLoaded(true); // Continua senza reCAPTCHA se non configurato
    }
  }, []);

  const showAlert = (msg: string, type: "error" | "success" = "error") => {
    setAlertMsg(msg);
    setAlertType(type);
    setTimeout(() => setAlertMsg(null), 8000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!form.email) {
      showAlert("Inserisci la tua email");
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Esegui reCAPTCHA (se configurato)
      let recaptchaToken = null;
      if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        recaptchaToken = await executeRecaptcha('forgot_password');
        if (!recaptchaToken) {
          showAlert("Errore verifica di sicurezza. Riprova.");
          setIsSubmitting(false);
          return;
        }
      }

      // 2. Prepara FormData
      const formData = new FormData();
      formData.append("email", form.email);
      if (recaptchaToken) {
        formData.append("recaptchaToken", recaptchaToken);
      }

      const result = await forgotPassword(formData);

      if (result?.error) {
        showAlert(result.error);
      } else {
        showAlert(
          "Se hai un account registrato con questa email, riceverai un messaggio a breve con le istruzioni per il recupero password. Controlla anche la cartella spam.",
          "success"
        );
        setForm({ email: "" });
      }
    } catch (error) {
      showAlert("Errore di connessione");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream flex justify-center items-start pt-24 relative">
      <div className="absolute top-0 left-0 w-full h-full z-10">
        <img
          src="/imgs/sfondoLogin.jpg"
          alt="Sfondo decorativo"
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      {/* ALERT */}
      {alertMsg && (
        <div
          className={`fixed z-50 top-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded-lg font-semibold shadow-lg ${
            alertType === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {alertMsg}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 w-full max-w-md relative z-20">
        <h1 className="text-3xl font-bold text-blue-deep mb-2 text-center">
          Recupera Password
        </h1>
        <p className="text-gray-600 text-sm text-center mb-6">
          Inserisci la tua email e ti invieremo un link per reimpostare la password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-blue-deep font-semibold mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ email: e.target.value })}
              required
              placeholder="mario.rossi@email.it"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-black focus:ring-2 focus:ring-cyan-600"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !recaptchaLoaded}
            className={`w-full bg-cyan-600 text-white py-3 rounded-lg shadow-md 
              hover:-translate-y-1 hover:shadow-xl hover:bg-cyan-700 hover:cursor-pointer
              transition-all duration-300 ease-out font-semibold
              ${isSubmitting || !recaptchaLoaded ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {isSubmitting
              ? "Invio in corso..."
              : !recaptchaLoaded
              ? "Caricamento..."
              : "Invia Email di Recupero"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
          <p>
            Ricordi la password?{" "}
            <Link href="/Login" className="text-cyan-600 font-semibold hover:underline">
              Torna al Login
            </Link>
          </p>
          <p>
            Non hai un account?{" "}
            <Link href="/Registrazione" className="text-cyan-600 font-semibold hover:underline">
              Registrati
            </Link>
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
          <p className="font-semibold text-blue-900 mb-2">📧 Come funziona:</p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>Inserisci la tua email e clicca su "Invia"</li>
            <li>Riceverai un'email con un link</li>
            <li>Clicca sul link nell'email</li>
            <li>Imposta la tua nuova password</li>
          </ol>
          <p className="mt-2 text-xs text-gray-600">
            ⏱️ Il link è valido per 1 ora
          </p>
        </div>

        {/* reCAPTCHA Badge Info */}
        {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
          <p className="text-xs text-gray-500 text-center mt-6">
            Questo sito è protetto da reCAPTCHA e si applicano la{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Privacy Policy
            </a>{" "}
            e i{" "}
            <a
              href="https://policies.google.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Termini di Servizio
            </a>{" "}
            di Google.
          </p>
        )}
      </div>
    </main>
  );
}