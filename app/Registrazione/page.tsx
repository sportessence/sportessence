"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/app/actions/auth";
import { verifyCaptcha } from "@/app/actions/captcha";
import TurnstileCaptcha, { useCaptcha } from "@/app/components/TurnstileCaptcha";
import { ValidationUtils } from "@/app/utils/validation";

export default function Registrazione() {
  const router = useRouter();
  
  // State per il form
  const [form, setForm] = useState({
    email: "",
    nome: "",
    cognome: "",
    codiceFiscale: "",
    telefono: "",
    emailContatto: "",
    usaStessaEmail: false,
    via: "",
    civico: "",
    cap: "",
    paese: "",
    provincia: "",
    password: "",
    confermaPassword: "",
    accettoPrivacy: false, // ✨ NUOVO: consenso privacy
  });

  // State per validazione
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [pwdStrength, setPwdStrength] = useState(ValidationUtils.validatePassword(""));

  // State per CAPTCHA
  const { captchaToken, setCaptchaToken, resetCaptcha, isCaptchaVerified } = useCaptcha();

  // State per UI
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"error" | "success">("error");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showAlert = (msg: string, type: "error" | "success" = "error") => {
    setAlertMsg(msg);
    setAlertType(type);
    setTimeout(() => setAlertMsg(null), 5000);
  };

  const handleChange = (e: { target: { name: any; value: any; type: any; checked: any } }) => {
    const { name, value, type, checked } = e.target;

    // Validazione email in tempo reale
    if (name === "email") {
      setIsEmailValid(ValidationUtils.validateEmail(value));
    }

    // Validazione password in tempo reale
    if (name === "password") {
      setPwdStrength(ValidationUtils.validatePassword(value));
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "usaStessaEmail" && checked ? { emailContatto: prev.email } : {}),
    }));
  };

  const verificaIndirizzo = async () => {
    const { via, civico, paese, provincia } = form;
    const query = `${via} ${civico}, ${paese}, ${provincia}, Italia`;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      if (data.length > 0) {
        const address = data[0].address;
        if (address.postcode) {
          setForm((prev) => ({ ...prev, cap: address.postcode }));
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Errore verifica indirizzo:", err);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // ✅ 1. VERIFICA CAPTCHA (PRIORITÀ MASSIMA)
      if (!isCaptchaVerified || !captchaToken) {
        showAlert("Completa la verifica di sicurezza");
        setIsSubmitting(false);
        return;
      }

      // ✅ 1.5 VERIFICA CONSENSO PRIVACY (OBBLIGATORIO)
      if (!form.accettoPrivacy) {
        showAlert("Devi accettare la Privacy Policy per registrarti");
        setIsSubmitting(false);
        return;
      }

      // Verifica CAPTCHA lato server
      const captchaVerification = await verifyCaptcha(captchaToken);
      if (!captchaVerification.success) {
        showAlert(captchaVerification.error || "Verifica di sicurezza fallita");
        resetCaptcha();
        setIsSubmitting(false);
        return;
      }

      // ✅ 2. VALIDAZIONE EMAIL
      if (!ValidationUtils.validateEmail(form.email)) {
        showAlert("Email non valida");
        setIsSubmitting(false);
        return;
      }

      // ✅ 3. VALIDAZIONE CODICE FISCALE
      if (!ValidationUtils.validateCodiceFiscale(form.codiceFiscale)) {
        showAlert("Codice Fiscale non valido o formato errato");
        setIsSubmitting(false);
        return;
      }

      // ✅ 4. VALIDAZIONE PASSWORD
      if (!pwdStrength.isValid) {
        showAlert("Password non rispetta i criteri di sicurezza");
        setIsSubmitting(false);
        return;
      }

      if (form.password !== form.confermaPassword) {
        showAlert("Le password non coincidono");
        setIsSubmitting(false);
        return;
      }

      // ✅ 5. VALIDAZIONE NOME E COGNOME
      if (!ValidationUtils.validateName(form.nome) || !ValidationUtils.validateName(form.cognome)) {
        showAlert("Nome o cognome contengono caratteri non validi");
        setIsSubmitting(false);
        return;
      }

      // ✅ 6. VALIDAZIONE TELEFONO
      if (!ValidationUtils.validatePhoneNumber(form.telefono)) {
        showAlert("Numero di telefono non valido (deve iniziare con 3 ed essere di 10 cifre)");
        setIsSubmitting(false);
        return;
      }

      // ✅ 7. VALIDAZIONE CAP E PROVINCIA
      if (!ValidationUtils.validateCAP(form.cap)) {
        showAlert("CAP non valido (deve essere di 5 cifre)");
        setIsSubmitting(false);
        return;
      }

      if (!ValidationUtils.validateProvincia(form.provincia)) {
        showAlert("Provincia non valida (deve essere di 2 lettere)");
        setIsSubmitting(false);
        return;
      }

      // ✅ 8. VERIFICA INDIRIZZO
      const indirizzoValido = await verificaIndirizzo();
      if (!indirizzoValido) {
        showAlert("Indirizzo non trovato. Controlla i dati inseriti.");
        setIsSubmitting(false);
        return;
      }

      // ✅ 9. NORMALIZZAZIONE E SANITIZZAZIONE DATI
      const signupData = {
        email: ValidationUtils.normalizeEmail(form.email),
        password: form.password, // Non sanitizzare la password!
        nome: ValidationUtils.sanitizeHtml(ValidationUtils.normalizeName(form.nome)),
        cognome: ValidationUtils.sanitizeHtml(ValidationUtils.normalizeName(form.cognome)),
        codiceFiscale: ValidationUtils.normalizeCodiceFiscale(form.codiceFiscale),
        telefono: ValidationUtils.normalizePhoneNumber(form.telefono),
        emailContatto: ValidationUtils.normalizeEmail(form.emailContatto),
        via: ValidationUtils.sanitizeHtml(form.via.trim()),
        civico: ValidationUtils.sanitizeHtml(form.civico.trim()),
        cap: form.cap.trim(),
        paese: ValidationUtils.sanitizeHtml(form.paese.trim()),
        provincia: ValidationUtils.normalizeProvincia(form.provincia),
      };

      // ✅ 10. CHIAMATA SERVER ACTION
      const res = await signup(signupData);

      if (res?.error) {
        showAlert(res.error);
        resetCaptcha();
      } else {
        showAlert(
          "Registrazione completata! Controlla la tua email per confermare l'account.",
          "success"
        );
        // Redirect dopo 3 secondi
        setTimeout(() => router.push("/Login"), 3000);
      }
    } catch (err) {
      console.error(err);
      showAlert("Errore imprevisto durante la registrazione");
      resetCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream flex items-center relative justify-center px-4 py-12">
      <div className="absolute top-0 left-0 w-full h-full z-10">
        <img
          src="/imgs/sfondoRegistrazione.jpg"
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

      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 w-full max-w-2xl relative z-20">
        <h1 className="text-3xl font-bold text-blue-deep mb-6 text-center">
          Crea il tuo account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* EMAIL PRINCIPALE */}
          <div>
            <label className="block text-blue-deep font-semibold mb-1">Email principale *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="mario.rossi@email.it"
              className={`w-full px-4 py-2 rounded-lg border text-black focus:ring-2 focus:ring-cyan-600 ${
                !isEmailValid && form.email.length > 0 ? "border-red-400" : "border-gray-300"
              }`}
            />
            {!isEmailValid && form.email.length > 0 && (
              <p className="text-red-500 text-xs mt-1">Formato email non valido</p>
            )}
          </div>

          {/* NOME E COGNOME */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-deep font-semibold mb-1">Nome *</label>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Mario"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                required
              />
            </div>
            <div>
              <label className="block text-blue-deep font-semibold mb-1">Cognome *</label>
              <input
                type="text"
                name="cognome"
                value={form.cognome}
                onChange={handleChange}
                placeholder="Rossi"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                required
              />
            </div>
          </div>

          {/* CF E TELEFONO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-deep font-semibold mb-1">Codice Fiscale *</label>
              <input
                type="text"
                name="codiceFiscale"
                value={form.codiceFiscale}
                onChange={handleChange}
                placeholder="RSSMRA90A01F205X"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg uppercase focus:ring-2 focus:ring-cyan-600 text-black"
                maxLength={16}
                required
              />
            </div>
            <div>
              <label className="block text-blue-deep font-semibold mb-1">Cellulare *</label>
              <input
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="342 0000000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                required
              />
            </div>
          </div>

          {/* INDIRIZZO (Via, Civico) */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
            <div>
              <label className="block text-blue-deep font-semibold mb-1">Via / Piazza *</label>
              <input
                type="text"
                name="via"
                value={form.via}
                onChange={handleChange}
                placeholder="Via Roma"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                required
              />
            </div>
            <div>
              <label className="block text-blue-deep font-semibold mb-1">Civico *</label>
              <input
                type="text"
                name="civico"
                value={form.civico}
                onChange={handleChange}
                placeholder="12/B"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                required
              />
            </div>
          </div>

          {/* INDIRIZZO (CAP, Paese, Provincia) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-blue-deep font-semibold mb-1">CAP *</label>
              <input
                type="text"
                name="cap"
                value={form.cap}
                onChange={handleChange}
                placeholder="20100"
                maxLength={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                required
              />
            </div>
            <div>
              <label className="block text-blue-deep font-semibold mb-1">Comune *</label>
              <input
                type="text"
                name="paese"
                value={form.paese}
                onChange={handleChange}
                placeholder="Milano"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                required
              />
            </div>
            <div>
              <label className="block text-blue-deep font-semibold mb-1">Prov. *</label>
              <input
                type="text"
                name="provincia"
                value={form.provincia}
                onChange={handleChange}
                placeholder="MI"
                maxLength={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg uppercase focus:ring-2 focus:ring-cyan-600 text-black"
                required
              />
            </div>
          </div>

          {/* EMAIL CONTATTO */}
          <div>
            <label className="block text-blue-deep font-semibold mb-1">Email per contatti *</label>
            <input
              type="email"
              name="emailContatto"
              value={form.emailContatto}
              onChange={handleChange}
              placeholder="genitore2@email.it"
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black ${
                form.usaStessaEmail ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
              }`}
              disabled={form.usaStessaEmail}
              required
            />
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input
                type="checkbox"
                name="usaStessaEmail"
                checked={form.usaStessaEmail}
                onChange={handleChange}
                className="w-4 h-4 accent-cyan-600"
              />
              <span className="text-sm text-gray-600">Usa la stessa email dell'account</span>
            </label>
          </div>

          {/* PASSWORD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-deep font-semibold mb-1">Password *</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="Min. 8 caratteri"
                className="w-full px-4 py-2 rounded-lg text-black border border-gray-300 focus:ring-2 focus:ring-cyan-600"
              />
              <ul className="text-xs space-y-1 mt-2 text-gray-500">
                <li className={pwdStrength.hasMinLength ? "text-green-600 line-through" : ""}>
                  - Almeno 8 caratteri
                </li>
                <li className={pwdStrength.hasUppercase ? "text-green-600 line-through" : ""}>
                  - Una maiuscola
                </li>
                <li className={pwdStrength.hasLowercase ? "text-green-600 line-through" : ""}>
                  - Una minuscola
                </li>
                <li className={pwdStrength.hasNumber ? "text-green-600 line-through" : ""}>
                  - Un numero
                </li>
                <li className={pwdStrength.hasSpecial ? "text-green-600 line-through" : ""}>
                  - Un carattere speciale
                </li>
              </ul>
            </div>
            <div>
              <label className="block text-blue-deep font-semibold mb-1">Conferma Password *</label>
              <input
                type="password"
                name="confermaPassword"
                value={form.confermaPassword}
                onChange={handleChange}
                required
                placeholder="Ripeti password"
                className={`w-full px-4 py-2 text-black rounded-lg border ${
                  form.confermaPassword && form.confermaPassword !== form.password
                    ? "border-red-400"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-cyan-600`}
              />
              {form.confermaPassword && form.confermaPassword !== form.password && (
                <p className="text-red-500 text-xs mt-1">Le password non coincidono</p>
              )}
            </div>
          </div>

          {/* PRIVACY POLICY - CONSENSO OBBLIGATORIO */}
          <div className="border-t pt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-deep mb-4">
                📋 Consenso al Trattamento dei Dati
              </h3>
              
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="accettoPrivacy"
                  checked={form.accettoPrivacy}
                  onChange={handleChange}
                  required
                  className="mt-1 w-5 h-5 accent-cyan-600 cursor-pointer"
                />
                <span className="text-gray-700 text-sm leading-relaxed">
                  <span className="text-red-600 font-bold">*</span> Ho letto e accetto la{" "}
                  <a 
                    href="/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cyan-600 font-semibold hover:underline"
                  >
                    Privacy Policy
                  </a>
                  {" "}e acconsento al trattamento dei miei dati personali e di quelli del minore 
                  per le finalità indicate (gestione iscrizioni, sicurezza, comunicazioni relative ai campi estivi).
                </span>
              </label>

              {!form.accettoPrivacy && (
                <p className="text-xs text-gray-600 mt-3 ml-8">
                  ⓘ Il consenso è obbligatorio per procedere con la registrazione
                </p>
              )}
            </div>
          </div>

          {/* CAPTCHA */}
          <div className="border-t pt-4">
            <label className="block text-blue-deep font-semibold mb-3 text-center">
              Verifica di sicurezza *
            </label>
            <TurnstileCaptcha
              onVerify={setCaptchaToken}
              onExpire={resetCaptcha}
              onError={resetCaptcha}
              theme="light"
              size="normal"
            />
          </div>

          {/* BOTTONE SUBMIT */}
          <button
            type="submit"
            disabled={isSubmitting || !isCaptchaVerified || !form.accettoPrivacy}
            className={`w-full bg-cyan-600 text-white py-3 rounded-lg shadow-md hover:bg-cyan-700 transition-all font-semibold ${
              isSubmitting || !isCaptchaVerified || !form.accettoPrivacy ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Registrazione in corso..." : "Registrati"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Hai già un account?{" "}
          <a href="/Login" className="text-cyan-600 font-semibold hover:underline">
            Accedi qui
          </a>
        </p>

        {/* Note Privacy */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-xs text-gray-600">
          <p className="font-semibold text-blue-900 mb-2">🔒 Privacy e Sicurezza</p>
          <ul className="space-y-1">
            <li>• I tuoi dati sono protetti e crittografati</li>
            <li>• Non condivideremo le tue informazioni con terze parti</li>
            <li>• Rispettiamo il GDPR e i tuoi diritti sulla privacy</li>
            <li>• Puoi richiedere la cancellazione dei tuoi dati in qualsiasi momento</li>
          </ul>
        </div>
      </div>
    </main>
  );
}