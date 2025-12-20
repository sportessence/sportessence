"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions/auth";
import { executeRecaptcha } from "@/app/utils/recaptcha";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
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

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const showAlert = (msg: string, type: "error" | "success" = "error") => {
    setAlertMsg(msg);
    setAlertType(type);
    setTimeout(() => setAlertMsg(null), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!form.email || !form.password) {
      showAlert("Compila tutti i campi");
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Esegui reCAPTCHA (se configurato)
      let recaptchaToken = null;
      if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        recaptchaToken = await executeRecaptcha('login');
        if (!recaptchaToken) {
          showAlert("Errore verifica di sicurezza. Riprova.");
          setIsSubmitting(false);
          return;
        }
      }

      // 2. Prepara FormData
      const formData = new FormData();
      formData.append("email", form.email);
      formData.append("password", form.password);
      if (recaptchaToken) {
        formData.append("recaptchaToken", recaptchaToken);
      }

      // 3. Chiama la Server Action
      const result = await login(formData);

      if (result?.error) {
        showAlert(result.error);
        setIsSubmitting(false);
        return;
      }

      // 4. Login riuscito! Redirect in base al ruolo
      if (result?.success && result?.role) {
        const targetUrl = result.role === 'admin' ? '/admin/Dashboard' : '/';
        window.location.href = targetUrl;
      }
      
    } catch (error: any) {
      console.error("Login error:", error);
      showAlert("Errore di connessione");
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
        <h1 className="text-3xl font-bold text-blue-deep mb-6 text-center">
          Accedi al tuo account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-blue-deep font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="mario.rossi@email.it"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-black focus:ring-2 focus:ring-cyan-600"
            />
          </div>

          <div>
            <label className="block text-blue-deep font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Inserisci la password"
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
            {isSubmitting ? "Accesso in corso..." : !recaptchaLoaded ? "Caricamento..." : "Accedi"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600 space-y-2">
          <p>
            Non hai un account?{" "}
            <a href="/Registrazione" className="text-cyan-600 font-semibold hover:underline">
              Crea account
            </a>
          </p>
          <p>
            Hai dimenticato la password?{" "}
            <a href="/RecuperoPassword" className="text-cyan-600 font-semibold hover:underline">
              Recupera password
            </a>
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