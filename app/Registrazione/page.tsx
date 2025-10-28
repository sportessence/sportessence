"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Registrazione() {
  const router = useRouter();
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
  });

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [pwdFlags, setPwdFlags] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ'’\s-]+$/;
const codiceFiscaleRegex = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i;
  const phoneRegex = /^(\+39)?\s?\d{3}\s?\d{6,7}$/;


 const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"error" | "success">("error");

  const handleChange = (e: { target: { name: any; value: any; type: any; checked: any } }) => {
    const { name, value, type, checked } = e.target;

    if (name === "email") setIsEmailValid(emailRegex.test(value));

    if (name === "password") {
      const pwd = value;
      setPwdFlags({
        length: pwd.length >= 8,
        uppercase: /[A-Z]/.test(pwd),
        lowercase: /[a-z]/.test(pwd),
        number: /\d/.test(pwd),
        special: /[^A-Za-z0-9]/.test(pwd),
      });
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "usaStessaEmail" && checked ? { emailContatto: prev.email } : {}),
    }));
  };

    const showAlert = (msg: string, type: "error" | "success" = "error") => {
    setAlertMsg(msg);
    setAlertType(type);
    setTimeout(() => setAlertMsg(""), 5000);
    console.log(msg)
  };

  const handleSubmit = async(e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!emailRegex.test(form.email)) return showAlert("Email non valida");
    if (Object.values(pwdFlags).some((f) => !f)) return showAlert("Password non valida");
    if (form.password !== form.confermaPassword) return showAlert("Le password non coincidono");
    if (!nomeRegex.test(form.nome) || !nomeRegex.test(form.cognome)) return showAlert("Nome o cognome non valido");
    if (!codiceFiscaleRegex.test(form.codiceFiscale)) return showAlert("Codice fiscale non valido");
    if (!phoneRegex.test(form.telefono)) return showAlert("Numero di telefono non valido");

    const indirizzoValido = await verificaIndirizzo();
    if (!indirizzoValido) return showAlert("Indirizzo non trovato");

  try {
      // Chiamata all'API per registrazione + invio email
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        nome: form.nome,
        cognome: form.cognome,
        email: form.email,
        codiceFiscale: form.codiceFiscale,
        telefono: form.telefono,
        emailContatto: form.emailContatto,
        residenza: {
          via: form.via,
          civico: form.civico,
          cap: form.cap,
          paese: form.paese,
          provincia: form.provincia,
        },
        password: form.password,
      }),
    });
      const data = await res.json();
      if (data.success) {
        showAlert("Registrazione completata! Controlla la tua email.", "success");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        showAlert(data.message || "Errore durante la registrazione");
      }
    } catch (err) {
      showAlert("Errore di connessione");
    }
  };


  const verificaIndirizzo = async () => {
  const { via, civico, cap, paese, provincia } = form;
  const query = `${via} ${civico}, ${cap} ${paese}, ${provincia}, Italia`;

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.length > 0;
  } catch {
    return false;
  }
};


  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
        
         {/* ALERT */}
        {alertMsg && (
            <div
            className={`fixed top-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded-lg font-semibold shadow-lg ${
                alertType === "error"
                ? "bg-red-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {alertMsg}
          </div>
        )}
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 w-full max-w-2xl">
        
        <h1 className="text-3xl font-bold text-blue-deep mb-6 text-center">
          Crea il tuo account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email principale */}
          <div>
            <label className="block text-blue-deep font-semibold mb-1">
              Email principale
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="mario.rossi@email.it"
              className={`w-full px-4 py-2 rounded-lg border text-black focus:ring-2 focus:ring-cyan-600 ${
                !isEmailValid && form.email.length > 0
                  ? "border-red-400"
                  : "border-gray-300"
              }`}
            />
          </div>

          {/* Nome e cognome */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-deep font-semibold mb-1">
                Nome
              </label>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                required
                placeholder="Mario"
                className="w-full px-4 py-2 rounded-lg text-black border border-gray-300 focus:ring-2 focus:ring-cyan-600"
              />
            </div>
            <div>
              <label className="block text-blue-deep font-semibold mb-1">
                Cognome
              </label>
              <input
                type="text"
                name="cognome"
                value={form.cognome}
                onChange={handleChange}
                required
                placeholder="Rossi"
                className="w-full px-4 py-2 rounded-lg text-black border border-gray-300 focus:ring-2 focus:ring-cyan-600"
              />
            </div>
          </div>

          {/* Codice fiscale e telefono */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-deep font-semibold mb-1">
                Codice Fiscale
              </label>
              <input
                type="text"
                name="codiceFiscale"
                value={form.codiceFiscale}
                onChange={handleChange}
                required
                placeholder="RSSMRA90A01F205X"
                className="w-full uppercase px-4 py-2 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-600"
              />
            </div>
            <div>
              <label className="block text-blue-deep font-semibold mb-1">
                Telefono
              </label>
              <input
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                required
                placeholder="342 0394661"
                className="w-full px-4 py-2 rounded-lg text-black border border-gray-300 focus:ring-2 focus:ring-cyan-600"
              />
            </div>
          </div>

          {/* Email contatto opzionale */}
          <div>
            <label className="block text-blue-deep font-semibold mb-1">
              Email per contatti
            </label>
            <div className="flex items-center gap-3 mb-2">
              <input
                type="checkbox"
                name="usaStessaEmail"
                checked={form.usaStessaEmail}
                onChange={handleChange}
                className="w-4 h-4 accent-cyan-600"
              />
              <span className="text-sm text-blue-deep">
                Usa la stessa email dell’account
              </span>
            </div>
            <input
              type="email"
              name="emailContatto"
              value={form.emailContatto}
              onChange={handleChange}
              placeholder="genitore2.rossi@email.it"
              disabled={form.usaStessaEmail}
              className={`w-full px-4 py-2 rounded-lg text-black border border-gray-300 focus:ring-2 focus:ring-cyan-600 ${
                form.usaStessaEmail ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          {/* Indirizzo */}
          <div>
            <h3 className="text-blue-deep font-semibold mb-2">Residenza</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["via", "civico", "cap", "paese", "provincia"].map((field, idx) => (
                <input
                  key={idx}
                  type="text"
                  name={field}
                 value={String(form[field as keyof typeof form] || "")} 
                  onChange={handleChange}
                  placeholder={
                    field === "via"
                      ? "Via o piazza"
                      : field === "civico"
                      ? "Civico (es. 12B)"
                      : field === "cap"
                      ? "CAP (es. 24121)"
                      : field === "paese"
                      ? "Comune"
                      : "Provincia (es. CO)"
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg text-black border border-gray-300 focus:ring-2 focus:ring-cyan-600"
                />
              ))}
            </div>
          </div>

          {/* Password e conferma */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-deep font-semibold mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="Minimo 8 caratteri"
                className="w-full px-4 py-2 rounded-lg text-black border border-gray-300 focus:ring-2 focus:ring-cyan-600"
              />

              {/* Flags visivi password */}
              <ul className="text-sm space-y-1 mt-2">
                <li className={pwdFlags.length ? "text-green-600" : "text-gray-500"}>
                  ✅ Almeno 8 caratteri
                </li>
                <li className={pwdFlags.uppercase ? "text-green-600" : "text-gray-500"}>
                  ✅ Una lettera maiuscola
                </li>
                <li className={pwdFlags.lowercase ? "text-green-600" : "text-gray-500"}>
                  ✅ Una lettera minuscola
                </li>
                <li className={pwdFlags.number ? "text-green-600" : "text-gray-500"}>
                  ✅ Almeno un numero
                </li>
                <li className={pwdFlags.special ? "text-green-600" : "text-gray-500"}>
                  ✅ Un carattere speciale (!@#$%)
                </li>
              </ul>
            </div>

            <div>
              <label className="block text-blue-deep font-semibold mb-1">
                Conferma Password
              </label>
              <input
                type="password"
                name="confermaPassword"
                value={form.confermaPassword}
                onChange={handleChange}
                required
                placeholder="Ripeti la password"
                className={`w-full px-4 py-2 text-black rounded-lg border ${
                  form.confermaPassword && form.confermaPassword !== form.password
                    ? "border-red-400"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-cyan-600`}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-cyan-600 text-white py-3 rounded-lg shadow-md 
              hover:-translate-y-1 hover:shadow-xl hover:bg-cyan-700 hover:cursor-pointer
              active:translate-y-0 active:shadow-md transition-all duration-300 ease-out font-semibold"
          >
            Registrati
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Hai già un account?{" "}
          <a href="/login" className="text-cyan-600 font-semibold hover:underline">
            Accedi qui
          </a>
        </p>
      </div>
    </main>
  );
}
