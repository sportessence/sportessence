"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"error" | "success">("error");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const showAlert = (msg: string, type: "error" | "success" = "error") => {
    setAlertMsg(msg);
    setAlertType(type);
    setTimeout(() => setAlertMsg(null), 5000);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!emailRegex.test(form.email)) {
      showAlert("Email non valida");
      setIsSubmitting(false);
      return;
    }
    if (!form.password) {
      showAlert("Inserisci la password");
      setIsSubmitting(false);
      return;
    }

    try {
const res = await fetch("/api/user/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include", // <--- aggiungi questa riga
  body: JSON.stringify(form),
});


      const data = await res.json();
      if (data.success) {
        showAlert("Login effettuato!", "success");
        setTimeout(() =>  window.location.href = "/Utente", 1500);
      } else {
        showAlert(data.message || "Email o password errati");
      }
    } catch {
      showAlert("Errore di connessione");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream flex justify-center items-start pt-24 relative">

      {/* Immagine di sfondo trasparente */}
  <div className="absolute top-0 left-0 w-full h-full z-10">
    <img
      src="/imgs/sfondoLogin.jpg"
      alt="Sfondo decorativo"
      className="w-full h-full object-cover opacity-40" // opacity ridotta
    />
  </div>


       {/* ALERT */}
        {alertMsg && (
            <div
            className={`fixed z-11 top-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded-lg font-semibold shadow-lg ${
                alertType === "error"
                ? "bg-red-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {alertMsg}
          </div>
        )}

      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 w-full max-w-md relative z-10">
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
            disabled={isSubmitting}
            className={`w-full bg-cyan-600 text-white py-3 rounded-lg shadow-md 
              hover:-translate-y-1 hover:shadow-xl hover:bg-cyan-700 hover:cursor-pointer
              active:translate-y-0 active:shadow-md transition-all duration-300 ease-out font-semibold
              ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? "Invio dati in corso…" : "Accedi"}
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
    <a href="/recupero-password" className="text-cyan-600 font-semibold hover:underline">
      Recupera password
    </a>
  </p>
</div>
      </div>
    </main>
  );
}
