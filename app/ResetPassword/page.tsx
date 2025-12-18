"use client";

import { useState, useEffect } from "react";
import { updatePassword } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";

export default function ResetPassword() {
  const router = useRouter();
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"error" | "success">("error");
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  const supabase = createClient();

  useEffect(() => {
    // Verifica che l'utente abbia un token valido (arriva da email)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Se c'è una sessione recovery, l'utente ha cliccato il link nell'email
      if (session) {
        setIsValidToken(true);
      } else {
        setIsValidToken(false);
      }
    };

    checkSession();
  }, [supabase]);

  const showAlert = (msg: string, type: "error" | "success" = "error") => {
    setAlertMsg(msg);
    setAlertType(type);
    setTimeout(() => setAlertMsg(null), 5000);
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "La password deve essere di almeno 8 caratteri";
    }
    if (!/[A-Z]/.test(password)) {
      return "La password deve contenere almeno una lettera maiuscola";
    }
    if (!/[a-z]/.test(password)) {
      return "La password deve contenere almeno una lettera minuscola";
    }
    if (!/[0-9]/.test(password)) {
      return "La password deve contenere almeno un numero";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validazione
    if (form.password !== form.confirmPassword) {
      showAlert("Le password non corrispondono");
      setIsSubmitting(false);
      return;
    }

    const passwordError = validatePassword(form.password);
    if (passwordError) {
      showAlert(passwordError);
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("password", form.password);

      const result = await updatePassword(formData);

      if (result?.error) {
        showAlert(result.error);
        setIsSubmitting(false);
      } else {
        showAlert("Password aggiornata con successo!", "success");
        
        // Redirect al login dopo 2 secondi
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (error) {
      showAlert("Errore di connessione");
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isValidToken === null) {
    return (
      <main className="min-h-screen bg-cream flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <p className="text-gray-600">Verifica in corso...</p>
        </div>
      </main>
    );
  }

  // Token non valido
  if (isValidToken === false) {
    return (
      <main className="min-h-screen bg-cream flex justify-center items-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
          <div className="mb-4 text-red-500 text-5xl">❌</div>
          <h1 className="text-2xl font-bold text-blue-deep mb-4">Link Non Valido</h1>
          <p className="text-gray-600 mb-6">
            Il link per il recupero password non è valido o è scaduto.
          </p>
          <button
            onClick={() => router.push("/RecuperoPassword")}
            className="w-full bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700 font-semibold"
          >
            Richiedi Nuovo Link
          </button>
        </div>
      </main>
    );
  }

  // Form reset password
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
          Imposta Nuova Password
        </h1>
        <p className="text-gray-600 text-sm text-center mb-6">
          Scegli una password sicura per il tuo account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-blue-deep font-semibold mb-1">
              Nuova Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={8}
              placeholder="Almeno 8 caratteri"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-black focus:ring-2 focus:ring-cyan-600"
            />
          </div>

          <div>
            <label className="block text-blue-deep font-semibold mb-1">
              Conferma Password
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
              minLength={8}
              placeholder="Ripeti la password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-black focus:ring-2 focus:ring-cyan-600"
            />
          </div>

          {/* Requisiti password */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs">
            <p className="font-semibold text-gray-700 mb-2">La password deve contenere:</p>
            <ul className="space-y-1 text-gray-600">
              <li className={form.password.length >= 8 ? "text-green-600" : ""}>
                ✓ Almeno 8 caratteri
              </li>
              <li className={/[A-Z]/.test(form.password) ? "text-green-600" : ""}>
                ✓ Una lettera maiuscola
              </li>
              <li className={/[a-z]/.test(form.password) ? "text-green-600" : ""}>
                ✓ Una lettera minuscola
              </li>
              <li className={/[0-9]/.test(form.password) ? "text-green-600" : ""}>
                ✓ Un numero
              </li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-cyan-600 text-white py-3 rounded-lg shadow-md 
              hover:-translate-y-1 hover:shadow-xl hover:bg-cyan-700 hover:cursor-pointer
              transition-all duration-300 ease-out font-semibold
              ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? "Salvataggio..." : "Salva Nuova Password"}
          </button>
        </form>
      </div>
    </main>
  );
}