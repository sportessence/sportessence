"use client";

import { useState } from "react";
import { X, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { 
  requestEmailChangeOTP, 
  verifyEmailChangeOTP, 
  changePassword 
} from "../actions/updateCredentials";

interface ChangeCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
  showAlert: (msg: string, type: "error" | "success") => void;
}

export default function ChangeCredentialsModal({
  isOpen,
  onClose,
  currentEmail,
  showAlert
}: ChangeCredentialsModalProps) {
  const [activeTab, setActiveTab] = useState<"email" | "password">("email");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // ===== TAB EMAIL (2 STEP) =====
  const [emailStep, setEmailStep] = useState<"input" | "otp">("input");
  const [newEmail, setNewEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  
  // ===== TAB PASSWORD (1 STEP) =====
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // Validazioni password in tempo reale
  const [pwdFlags, setPwdFlags] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  // Reset form quando si chiude
  const handleClose = () => {
    setActiveTab("email");
    setEmailStep("input");
    setNewEmail("");
    setEmailOtp("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPwdFlags({
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    });
    onClose();
  };

  // ===== CAMBIO EMAIL STEP 1: Richiedi OTP =====
  const handleRequestEmailOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validazioni
    if (!emailRegex.test(newEmail)) {
      showAlert("❌ Email non valida", "error");
      setEmailValid(false);
      setIsSubmitting(false);
      return;
    }

    if (newEmail.toLowerCase() === currentEmail.toLowerCase()) {
      showAlert("❌ La nuova email è uguale a quella attuale", "error");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await requestEmailChangeOTP(newEmail);

      if (result?.error) {
        showAlert("❌ " + result.error, "error");
        setIsSubmitting(false);
        return;
      }

      showAlert("✅ Codice inviato! Controlla la nuova email.", "success");
      setEmailStep("otp");
    } catch (error: any) {
      showAlert("❌ Errore: " + error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===== CAMBIO EMAIL STEP 2: Verifica OTP =====
  const handleVerifyEmailOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (emailOtp.length !== 8) {
      showAlert("❌ Il codice deve essere di 8 cifre", "error");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await verifyEmailChangeOTP(newEmail, emailOtp);

      if (result?.error) {
        showAlert("❌ " + result.error, "error");
        setIsSubmitting(false);
        return;
      }

      showAlert("✅ Email cambiata con successo!", "success");
      
      // Ricarica la pagina dopo 1 secondo per aggiornare l'email visualizzata
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      showAlert("❌ Errore: " + error.message, "error");
      setIsSubmitting(false);
    }
  };

  // ===== CAMBIO PASSWORD =====
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validazioni
    if (!currentPassword || !newPassword || !confirmPassword) {
      showAlert("❌ Compila tutti i campi", "error");
      setIsSubmitting(false);
      return;
    }

    if (Object.values(pwdFlags).some((f) => !f)) {
      showAlert("❌ La password non rispetta i criteri di sicurezza", "error");
      setIsSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert("❌ Le password non coincidono", "error");
      setIsSubmitting(false);
      return;
    }

    if (currentPassword === newPassword) {
      showAlert("❌ La nuova password deve essere diversa da quella attuale", "error");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await changePassword(currentPassword, newPassword);

      if (result?.error) {
        showAlert("❌ " + result.error, "error");
        setIsSubmitting(false);
        return;
      }

      showAlert("✅ Password cambiata con successo!", "success");
      handleClose();
    } catch (error: any) {
      showAlert("❌ Errore: " + error.message, "error");
      setIsSubmitting(false);
    }
  };

  // Validazione password in tempo reale
  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    setPwdFlags({
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /\d/.test(value),
      special: /[^A-Za-z0-9]/.test(value),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-blue-light text-white p-6 flex justify-between items-center rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold">Modifica Credenziali</h2>
          <button
            onClick={handleClose}
            className="hover:bg-blue-800 p-2 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab("email");
              setEmailStep("input");
              setEmailOtp("");
            }}
            className={`flex-1 py-3 px-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === "email"
                ? "bg-cyan-50 text-cyan-600 border-b-2 border-cyan-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            disabled={isSubmitting}
          >
            <Mail size={18} />
            Cambia Email
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`flex-1 py-3 px-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === "password"
                ? "bg-cyan-50 text-cyan-600 border-b-2 border-cyan-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            disabled={isSubmitting}
          >
            <Lock size={18} />
            Cambia Password
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* ===== TAB EMAIL ===== */}
          {activeTab === "email" && (
            <>
              {emailStep === "input" ? (
                // STEP 1: Inserisci nuova email
                <form onSubmit={handleRequestEmailOTP} className="space-y-5">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-blue-light flex-shrink-0 mt-0.5" size={20} />
                      <div className="text-sm text-gray-700">
                        <p className="font-semibold mb-1">📧 Come funziona:</p>
                        <ol className="text-xs space-y-1 list-decimal list-inside">
                          <li>Inserisci la nuova email</li>
                          <li>Riceverai un codice di 8 cifre</li>
                          <li>Inserisci il codice per confermare</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-blue-deep font-semibold mb-2">
                      Email Attuale
                    </label>
                    <input
                      type="email"
                      value={currentEmail}
                      disabled
                      className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-blue-deep font-semibold mb-2">
                      Nuova Email *
                    </label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => {
                        setNewEmail(e.target.value);
                        setEmailValid(emailRegex.test(e.target.value));
                      }}
                      required
                      placeholder="nuova@email.it"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-600 text-black
                        ${!emailValid && newEmail ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                    />
                    {!emailValid && newEmail && (
                      <p className="text-red-500 text-xs mt-1">Email non valida</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !newEmail}
                    className={`w-full bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700 
                      transition-all font-semibold
                      ${(isSubmitting || !newEmail) ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Invio...' : 'Invia Codice di Verifica'}
                  </button>
                </form>
              ) : (
                // STEP 2: Inserisci OTP
                <form onSubmit={handleVerifyEmailOTP} className="space-y-5">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      ✅ Codice inviato a: <strong>{newEmail}</strong>
                    </p>
                  </div>

                  <div>
                    <label className="block text-blue-deep font-semibold mb-2 text-center">
                      Codice di Verifica (8 cifre)
                    </label>
                    <input
                      type="text"
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                      required
                      maxLength={8}
                      placeholder="12345678"
                      autoFocus
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-black 
                        text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-cyan-600"
                    />
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Controlla anche la cartella spam
                    </p>
                  </div>

                  <div className="space-y-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || emailOtp.length !== 8}
                      className={`w-full bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700 
                        transition-all font-semibold
                        ${(isSubmitting || emailOtp.length !== 8) ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? 'Verifica...' : 'Conferma Cambio Email'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEmailStep("input");
                        setEmailOtp("");
                      }}
                      disabled={isSubmitting}
                      className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 
                        transition-all text-sm"
                    >
                      ← Cambia Email
                    </button>

                    <button
                      type="button"
                      onClick={handleRequestEmailOTP}
                      disabled={isSubmitting}
                      className="w-full text-cyan-600 text-sm hover:underline disabled:opacity-50"
                    >
                      Non hai ricevuto il codice? Invia di nuovo
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* ===== TAB PASSWORD ===== */}
          {activeTab === "password" && (
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-blue-light flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-1">🔐 Sicurezza:</p>
                    <p className="text-xs">
                      Inserisci la password corrente per confermare la tua identità.
                      <strong> Nessuna email richiesta.</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Password Corrente */}
              <div>
                <label className="block text-blue-deep font-semibold mb-2">
                  Password Corrente *
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPwd ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Nuova Password */}
              <div>
                <label className="block text-blue-deep font-semibold mb-2">
                  Nuova Password *
                </label>
                <div className="relative">
                  <input
                    type={showNewPwd ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    required
                    minLength={8}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPwd(!showNewPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {/* Requisiti Password */}
                <ul className="text-xs space-y-1 mt-2 text-gray-500">
                  <li className={pwdFlags.length ? "text-green-600 line-through" : ""}>
                    ✓ Almeno 8 caratteri
                  </li>
                  <li className={pwdFlags.uppercase ? "text-green-600 line-through" : ""}>
                    ✓ Una maiuscola
                  </li>
                  <li className={pwdFlags.lowercase ? "text-green-600 line-through" : ""}>
                    ✓ Una minuscola
                  </li>
                  <li className={pwdFlags.number ? "text-green-600 line-through" : ""}>
                    ✓ Un numero
                  </li>
                  <li className={pwdFlags.special ? "text-green-600 line-through" : ""}>
                    ✓ Un carattere speciale
                  </li>
                </ul>
              </div>

              {/* Conferma Password */}
              <div>
                <label className="block text-blue-deep font-semibold mb-2">
                  Conferma Nuova Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPwd ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-600 text-black pr-10
                      ${confirmPassword && confirmPassword !== newPassword ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-red-500 text-xs mt-1">Le password non coincidono</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700 
                  transition-all font-semibold
                  ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Cambio...' : 'Cambia Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}