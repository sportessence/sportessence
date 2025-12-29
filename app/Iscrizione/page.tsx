"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/app/utils/supabase/client";

export default function Iscrizione() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");

  // 🔒 PROTEZIONE: Solo utenti loggati
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Non loggato → redirect al login
        router.push("/Login?redirect=/Iscrizione");
      } else {
        setUserEmail(user.email || "");
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // ⬆️ Scroll to top al caricamento
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mostra loading mentre verifica auth
  if (isLoading) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifica accesso...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-blue-deep mb-2">
            Iscrizione Campo Estivo
          </h1>
          <p className="text-gray-600">
            Completa il form per iscrivere tuo figlio al nostro campo estivo
          </p>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-6">
            {[
              { num: 1, label: "Dati Bambino" },
              { num: 2, label: "Scelta Campo" },
              { num: 3, label: "Riepilogo" }
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step >= s.num
                        ? "bg-cyan-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {s.num}
                  </div>
                  <span className="text-xs mt-2 text-center font-semibold">
                    {s.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div
                    className={`h-1 flex-1 -mt-6 ${
                      step > s.num ? "bg-cyan-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* STEP 1: Dati Bambino */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-blue-deep mb-6">
                Dati del Bambino/Ragazzo
              </h2>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-blue-deep font-semibold mb-1">
                      Nome *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Mario"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                        focus:ring-2 focus:ring-cyan-600 text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-blue-deep font-semibold mb-1">
                      Cognome *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Rossi"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                        focus:ring-2 focus:ring-cyan-600 text-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-blue-deep font-semibold mb-1">
                      Data di Nascita *
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                        focus:ring-2 focus:ring-cyan-600 text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-blue-deep font-semibold mb-1">
                      Codice Fiscale *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="RSSMRA15A01F205X"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                        uppercase focus:ring-2 focus:ring-cyan-600 text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-blue-deep font-semibold mb-1">
                    Sesso *
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sesso"
                        value="M"
                        className="w-4 h-4 accent-cyan-600"
                      />
                      <span className="text-gray-700">Maschio</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sesso"
                        value="F"
                        className="w-4 h-4 accent-cyan-600"
                      />
                      <span className="text-gray-700">Femmina</span>
                    </label>
                  </div>
                </div>

                {/* Informazioni Sanitarie */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-xl font-semibold text-blue-deep mb-4">
                    Informazioni Sanitarie
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-cyan-600"
                        />
                        <span className="text-gray-700">
                          Il bambino ha allergie o intolleranze alimentari
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-blue-deep font-semibold mb-1">
                        Se sì, specificare:
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Descrivi eventuali allergie, intolleranze o necessità particolari..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                          focus:ring-2 focus:ring-cyan-600 text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-blue-deep font-semibold mb-1">
                        Note mediche aggiuntive (opzionale)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Eventuali patologie, farmaci assunti regolarmente, altre informazioni rilevanti..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                          focus:ring-2 focus:ring-cyan-600 text-black"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold 
                    hover:bg-cyan-700 transition-colors"
                >
                  Continua →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Scelta Campo */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-blue-deep mb-6">
                Scegli il Campo
              </h2>

              <div className="space-y-6">
                {/* Placeholder - qui verranno caricati i campi dal DB */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-600 text-center py-8">
                    🏗️ <strong>Sezione in sviluppo</strong>
                    <br />
                    Qui vedrai la lista dei campi disponibili con date, prezzi e posti rimasti.
                    <br />
                    Potrai selezionare le settimane che preferisci.
                  </p>
                </div>

                {/* Esempio Card Campo (placeholder) */}
                <div className="border-2 border-cyan-600 rounded-lg p-6 bg-cyan-50/30">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-blue-deep">
                        Campo Sportivo - Giugno
                      </h3>
                      <p className="text-gray-600 text-sm">
                        10 - 14 Giugno 2025 • Età 6-12 anni
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-cyan-600">€180</p>
                      <p className="text-xs text-gray-500">a settimana</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">
                    Una settimana dedicata allo sport: calcio, basket, pallavolo e giochi di squadra!
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      ✅ <strong>12 posti disponibili</strong>
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-cyan-600"
                      />
                      <span className="font-semibold text-blue-deep">Seleziona</span>
                    </label>
                  </div>
                </div>

                {/* Riepilogo Selezione */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-bold text-blue-deep mb-3">
                    📋 Riepilogo Selezione
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Campi selezionati: <strong className="text-blue-deep">1</strong>
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    Totale da pagare: <strong className="text-blue-deep text-xl">€180,00</strong>
                  </p>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>• Acconto 30% richiesto: €54,00</p>
                    <p>• Saldo entro 15 giorni prima dell'inizio</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold 
                    hover:bg-gray-400 transition-colors"
                >
                  ← Indietro
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold 
                    hover:bg-cyan-700 transition-colors"
                >
                  Continua →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Riepilogo */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-blue-deep mb-6">
                Riepilogo e Conferma
              </h2>

              <div className="space-y-6">
                {/* Dati Bambino */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-bold text-blue-deep mb-3">
                    👤 Dati Bambino/Ragazzo
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Nome:</span>
                      <p className="font-semibold">Mario Rossi</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Data di nascita:</span>
                      <p className="font-semibold">15/01/2015</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">Codice Fiscale:</span>
                      <p className="font-semibold">RSSMRA15A01F205X</p>
                    </div>
                  </div>
                </div>

                {/* Campi Selezionati */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-bold text-blue-deep mb-3">
                    🏕️ Campi Selezionati
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Campo Sportivo - Giugno (10-14 Giu)</span>
                      <span className="font-semibold">€180,00</span>
                    </div>
                  </div>
                  <div className="border-t mt-4 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>TOTALE:</span>
                      <span className="text-cyan-600">€180,00</span>
                    </div>
                  </div>
                </div>

                {/* Documenti */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="font-bold text-yellow-900 mb-3">
                    📄 Documenti Necessari
                  </h3>
                  <ul className="text-sm text-yellow-900 space-y-2">
                    <li>✓ Certificato medico per attività sportiva (da consegnare il primo giorno)</li>
                    <li>✓ Fotocopia tessera sanitaria</li>
                    <li>✓ Modulo autorizzazioni compilato (riceverai via email)</li>
                  </ul>
                </div>

                {/* Privacy e Termini */}
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      className="w-5 h-5 mt-1 accent-cyan-600 flex-shrink-0"
                    />
                    <span className="text-sm text-gray-700">
                      Ho letto e accetto i{" "}
                      <Link href="/privacy" className="text-cyan-600 underline font-semibold">
                        termini e condizioni
                      </Link>{" "}
                      e l'{" "}
                      <Link href="/privacy" className="text-cyan-600 underline font-semibold">
                        informativa sulla privacy
                      </Link>
                      *
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      className="w-5 h-5 mt-1 accent-cyan-600 flex-shrink-0"
                    />
                    <span className="text-sm text-gray-700">
                      Autorizzo il trattamento dei dati personali ai sensi del GDPR 
                      per le finalità connesse all'iscrizione e partecipazione al campo estivo *
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-5 h-5 mt-1 accent-cyan-600 flex-shrink-0"
                    />
                    <span className="text-sm text-gray-700">
                      Autorizzo la pubblicazione di foto/video del minore sui canali social 
                      dell'associazione (opzionale)
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold 
                    hover:bg-gray-400 transition-colors"
                >
                  ← Indietro
                </button>
                <button
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold 
                    hover:bg-green-700 transition-colors"
                  onClick={() => alert("🏗️ Funzionalità in sviluppo - Collegamento con database in arrivo!")}
                >
                  Conferma Iscrizione ✓
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-deep mb-2">
            💡 Hai bisogno di aiuto?
          </h3>
          <p className="text-gray-700 text-sm mb-4">
            Se hai domande sull'iscrizione, consulta la nostra{" "}
            <Link href="/info" className="text-cyan-600 underline font-semibold">
              pagina FAQ
            </Link>{" "}
            o contattaci direttamente.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:sportessence.asd.aps@gmail.com"
              className="text-sm bg-white border border-blue-300 text-blue-deep px-4 py-2 
                rounded-lg hover:bg-blue-100 transition-colors"
            >
              📧 Email
            </a>
            <a
              href="tel:3420394661"
              className="text-sm bg-white border border-blue-300 text-blue-deep px-4 py-2 
                rounded-lg hover:bg-blue-100 transition-colors"
            >
              📞 Telefono
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}