"use client";

import { useState } from "react";
import { AlertTriangle, Lock, X, Trash2 } from "lucide-react";
import { createClient } from "@/app/utils/supabase/client";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Elimina definitivamente"
}: DeleteConfirmModalProps) {
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsVerifying(true);

    try {
      // 1. Verifica che la password sia corretta
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error("Utente non trovato");

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password,
      });

      if (signInError) {
        setError("Password non corretta");
        setIsVerifying(false);
        return;
      }

      // 2. Se password ok, procedi con l'azione passata come prop
      await onConfirm();
      onClose(); // Chiudi solo se successo
    } catch (err: any) {
      console.error(err);
      setError("Si è verificato un errore. Riprova.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3 text-red-600">
            <div className="bg-red-100 p-2 rounded-full">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold">{title}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
          {description}
        </p>

        <form onSubmit={handleConfirm} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Lock size={16} /> Conferma con la tua password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Inserisci la tua password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              autoFocus
            />
            {error && <p className="text-red-600 text-sm mt-2 font-medium">❌ {error}</p>}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isVerifying}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={!password || isVerifying}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-200"
            >
              {isVerifying ? (
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              ) : (
                <>
                  <Trash2 size={18} />
                  {confirmText}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}