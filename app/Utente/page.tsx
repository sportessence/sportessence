"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit2, 
  Save, 
  X, 
  Trash2,
  Users,
  Calendar,
  AlertTriangle,
  Eye,
  EyeOff,
  Plus,
  FileText
} from "lucide-react";

type Profile = {
  id: string;
  email: string;
  nome: string;
  cognome: string;
  cf: string;
  telefono: string;
  email_contatti: string;
  indirizzo_via: string;
  indirizzo_civico: string;
  indirizzo_cap: string;
  indirizzo_paese: string;
  indirizzo_provincia: string;
};

type Child = {
  id: string;
  nome: string;
  cognome: string;
  data_nascita: string;
  cf: string;
  sesso: string;
  allergie?: string;
  note_mediche?: string;
  parent_id: string;
};

type Enrollment = {
  id: string;
  child_id: string;
  camp_id: string;
  created_at: string;
  prezzo_totale: number;
  importo_pagato: number;
  saldata: boolean;
  camps: {
    nome: string;
    data_inizio: string;
    data_fine: string;
    indirizzo_via: string;
    indirizzo_paese: string;
  };
};

export default function PaginaUtente() {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [enrollments, setEnrollments] = useState<{ [childId: string]: Enrollment[] }>({});
  
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingChild, setEditingChild] = useState<string | null>(null);
  const [expandedChild, setExpandedChild] = useState<string | null>(null);
  
  const [alert, setAlert] = useState<{ msg: string; type: "error" | "success" } | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const showAlert = (msg: string, type: "error" | "success" = "error") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 5000);
  };

  // 🔒 Verifica autenticazione
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/Login?redirect=/Utente");
        return;
      }

      await loadUserData(user.id);
    };

    checkAuth();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      // Carica profilo
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Carica figli
      const { data: childrenData, error: childrenError } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', userId)
        .order('data_nascita', { ascending: false });

      if (childrenError) throw childrenError;
      setChildren(childrenData || []);

      // Carica iscrizioni per ogni figlio
      if (childrenData && childrenData.length > 0) {
        const enrollmentsMap: { [key: string]: Enrollment[] } = {};
        
        for (const child of childrenData) {
          const { data: enrollData } = await supabase
            .from('enrollments')
            .select(`
              *,
              camps (
                nome,
                data_inizio,
                data_fine,
                indirizzo_via,
                indirizzo_paese
              )
            `)
            .eq('child_id', child.id)
            .order('created_at', { ascending: false });

          enrollmentsMap[child.id] = enrollData || [];
        }
        
        setEnrollments(enrollmentsMap);
      }

      setLoading(false);
    } catch (error: any) {
      console.error("Errore caricamento dati:", error);
      showAlert("Errore durante il caricamento dei dati");
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nome: profile.nome,
          cognome: profile.cognome,
          telefono: profile.telefono,
          email_contatti: profile.email_contatti,
          indirizzo_via: profile.indirizzo_via,
          indirizzo_civico: profile.indirizzo_civico,
          indirizzo_cap: profile.indirizzo_cap,
          indirizzo_paese: profile.indirizzo_paese,
          indirizzo_provincia: profile.indirizzo_provincia,
        })
        .eq('id', profile.id);

      if (error) throw error;

      showAlert("Dati aggiornati con successo", "success");
      setEditingProfile(false);
    } catch (error: any) {
      console.error("Errore aggiornamento profilo:", error);
      showAlert("Errore durante l'aggiornamento");
    }
  };

  const handleDeleteAccount = async () => {
    if (!profile) return;

    // Verifica se ci sono iscrizioni attive non saldate
    const activeEnrollments = Object.values(enrollments)
      .flat()
      .filter(e => !e.saldata || e.importo_pagato < e.prezzo_totale);

    if (activeEnrollments.length > 0) {
      showAlert("Impossibile eliminare: ci sono iscrizioni attive o pagamenti non saldati");
      return;
    }

    if (children.length > 0) {
      showAlert("Impossibile eliminare: elimina prima tutti i figli registrati");
      return;
    }

    const confirmed = window.confirm(
      "⚠️ ATTENZIONE: Questa azione è IRREVERSIBILE!\n\n" +
      "Eliminando l'account perderai:\n" +
      "- Tutti i dati personali\n" +
      "- Lo storico delle iscrizioni\n\n" +
      "Sei ASSOLUTAMENTE sicuro?"
    );

    if (!confirmed) return;

    try {
      // Elimina il profilo (il trigger eliminerà anche l'auth user)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profile.id);

      if (error) throw error;

      // Logout
      await supabase.auth.signOut();
      router.push("/");
    } catch (error: any) {
      console.error("Errore eliminazione account:", error);
      showAlert("Errore durante l'eliminazione");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Errore nel caricamento del profilo</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream py-12 px-4">
      {/* Alert */}
      {alert && (
        <div
          className={`fixed z-50 top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg font-semibold shadow-xl ${
            alert.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {alert.msg}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-cyan-100 p-4 rounded-full">
                <User className="text-cyan-600" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-blue-deep">
                  Ciao, {profile.nome}! 👋
                </h1>
                <p className="text-gray-600">Benvenuto nella tua area personale</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dati Personali */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-deep flex items-center gap-2">
              <User size={24} />
              Dati Personali
            </h2>
            {!editingProfile ? (
              <button
                onClick={() => setEditingProfile(true)}
                className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 
                  transition-all flex items-center gap-2 font-semibold"
              >
                <Edit2 size={18} />
                Modifica
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateProfile}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 
                    transition-all flex items-center gap-2 font-semibold"
                >
                  <Save size={18} />
                  Salva
                </button>
                <button
                  onClick={() => {
                    setEditingProfile(false);
                    loadUserData(profile.id);
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 
                    transition-all flex items-center gap-2 font-semibold"
                >
                  <X size={18} />
                  Annulla
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div>
              <label className="block text-gray-600 text-sm font-semibold mb-2">Nome</label>
              {editingProfile ? (
                <input
                  type="text"
                  value={profile.nome}
                  onChange={(e) => setProfile({ ...profile, nome: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                />
              ) : (
                <p className="text-gray-800 font-medium">{profile.nome}</p>
              )}
            </div>

            {/* Cognome */}
            <div>
              <label className="block text-gray-600 text-sm font-semibold mb-2">Cognome</label>
              {editingProfile ? (
                <input
                  type="text"
                  value={profile.cognome}
                  onChange={(e) => setProfile({ ...profile, cognome: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                />
              ) : (
                <p className="text-gray-800 font-medium">{profile.cognome}</p>
              )}
            </div>

            {/* Email (non modificabile direttamente) */}
            <div>
              <label className="block text-gray-600 text-sm font-semibold mb-2 flex items-center gap-2">
                <Mail size={16} />
                Email Account
              </label>
              <div className="flex items-center gap-2">
                <p className="text-gray-800 font-medium">{profile.email}</p>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="text-cyan-600 text-sm hover:underline"
                >
                  Modifica
                </button>
              </div>
            </div>

            {/* Codice Fiscale (non modificabile) */}
            <div>
              <label className="block text-gray-600 text-sm font-semibold mb-2">Codice Fiscale</label>
              <p className="text-gray-800 font-medium uppercase">{profile.cf}</p>
            </div>

            {/* Telefono */}
            <div>
              <label className="block text-gray-600 text-sm font-semibold mb-2 flex items-center gap-2">
                <Phone size={16} />
                Telefono
              </label>
              {editingProfile ? (
                <input
                  type="tel"
                  value={profile.telefono}
                  onChange={(e) => setProfile({ ...profile, telefono: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                />
              ) : (
                <p className="text-gray-800 font-medium">{profile.telefono}</p>
              )}
            </div>

            {/* Email Contatti */}
            <div>
              <label className="block text-gray-600 text-sm font-semibold mb-2 flex items-center gap-2">
                <Mail size={16} />
                Email Contatti
              </label>
              {editingProfile ? (
                <input
                  type="email"
                  value={profile.email_contatti}
                  onChange={(e) => setProfile({ ...profile, email_contatti: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                />
              ) : (
                <p className="text-gray-800 font-medium">{profile.email_contatti}</p>
              )}
            </div>

            {/* Indirizzo */}
            <div className="md:col-span-2">
              <label className="block text-gray-600 text-sm font-semibold mb-2 flex items-center gap-2">
                <MapPin size={16} />
                Indirizzo
              </label>
              {editingProfile ? (
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 mb-4">
                  <input
                    type="text"
                    value={profile.indirizzo_via}
                    onChange={(e) => setProfile({ ...profile, indirizzo_via: e.target.value })}
                    placeholder="Via/Piazza"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                  />
                  <input
                    type="text"
                    value={profile.indirizzo_civico}
                    onChange={(e) => setProfile({ ...profile, indirizzo_civico: e.target.value })}
                    placeholder="Civico"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                  />
                </div>
              ) : (
                <p className="text-gray-800 font-medium mb-2">
                  {profile.indirizzo_via} {profile.indirizzo_civico}
                </p>
              )}
              
              {editingProfile ? (
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={profile.indirizzo_cap}
                    onChange={(e) => setProfile({ ...profile, indirizzo_cap: e.target.value })}
                    placeholder="CAP"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                  />
                  <input
                    type="text"
                    value={profile.indirizzo_paese}
                    onChange={(e) => setProfile({ ...profile, indirizzo_paese: e.target.value })}
                    placeholder="Comune"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                  />
                  <input
                    type="text"
                    value={profile.indirizzo_provincia}
                    onChange={(e) => setProfile({ ...profile, indirizzo_provincia: e.target.value.toUpperCase() })}
                    placeholder="Prov."
                    maxLength={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black uppercase"
                  />
                </div>
              ) : (
                <p className="text-gray-800 font-medium">
                  {profile.indirizzo_cap} {profile.indirizzo_paese} ({profile.indirizzo_provincia})
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sezione Figli */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-deep flex items-center gap-2">
              <Users size={24} />
              I Miei Figli ({children.length})
            </h2>
            <button
              onClick={() => router.push("/Iscrizione")}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 
                transition-all flex items-center gap-2 font-semibold"
            >
              <Plus size={18} />
              Nuova Iscrizione
            </button>
          </div>

          {children.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Users className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 mb-4">Non hai ancora registrato nessun bambino</p>
              <button
                onClick={() => router.push("/Iscrizione")}
                className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-all"
              >
                Registra il primo bambino
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {children.map((child) => {
                const childEnrollments = enrollments[child.id] || [];
                const activeEnrollments = childEnrollments.filter(e => 
                  new Date(e.camps.data_fine) >= new Date()
                );
                const pastEnrollments = childEnrollments.filter(e => 
                  new Date(e.camps.data_fine) < new Date()
                );

                return (
                  <div key={child.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Header Bambino */}
                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-blue-deep mb-1">
                            {child.nome} {child.cognome}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {calculateAge(child.data_nascita)} anni • Nato il {formatDate(child.data_nascita)}
                          </p>
                        </div>
                        <button
                          onClick={() => setExpandedChild(expandedChild === child.id ? null : child.id)}
                          className="bg-white text-blue-deep px-4 py-2 rounded-lg hover:bg-gray-50 
                            transition-all flex items-center gap-2 font-semibold"
                        >
                          {expandedChild === child.id ? <Eye size={18} /> : <FileText size={18} />}
                          {expandedChild === child.id ? "Nascondi" : "Dettagli"}
                        </button>
                      </div>

                      {/* Iscrizioni Attive (sempre visibili) */}
                      {activeEnrollments.length > 0 && (
                        <div className="mt-4 bg-white rounded-lg p-4">
                          <p className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                            <Calendar size={16} />
                            Iscrizioni Attive: {activeEnrollments.length}
                          </p>
                          {activeEnrollments.map((enrollment) => (
                            <div key={enrollment.id} className="text-sm text-gray-700 mb-2 last:mb-0">
                              • {enrollment.camps.nome} ({formatDate(enrollment.camps.data_inizio)} - {formatDate(enrollment.camps.data_fine)})
                              <span className={`ml-2 font-semibold ${enrollment.saldata ? 'text-green-600' : 'text-orange-600'}`}>
                                {enrollment.saldata ? '✓ Saldata' : `€${enrollment.importo_pagato}/${enrollment.prezzo_totale}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Dettagli Espansi */}
                    {expandedChild === child.id && (
                      <div className="p-6 bg-white">
                        {/* Dati Bambino */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-blue-deep mb-3">Informazioni Personali</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Codice Fiscale:</span>
                              <p className="font-semibold uppercase">{child.cf}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Sesso:</span>
                              <p className="font-semibold">{child.sesso === 'M' ? 'Maschio' : 'Femmina'}</p>
                            </div>
                            {child.allergie && (
                              <div className="col-span-2">
                                <span className="text-gray-600">Allergie/Intolleranze:</span>
                                <p className="font-semibold text-orange-600">{child.allergie}</p>
                              </div>
                            )}
                            {child.note_mediche && (
                              <div className="col-span-2">
                                <span className="text-gray-600">Note Mediche:</span>
                                <p className="font-semibold">{child.note_mediche}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Storico Iscrizioni */}
                        {pastEnrollments.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-blue-deep mb-3">Storico Iscrizioni</h4>
                            <div className="space-y-2">
                              {pastEnrollments.map((enrollment) => (
                                <div key={enrollment.id} className="bg-gray-50 rounded-lg p-4 text-sm">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <p className="font-semibold text-gray-800">{enrollment.camps.nome}</p>
                                      <p className="text-gray-600 text-xs">
                                        {formatDate(enrollment.camps.data_inizio)} - {formatDate(enrollment.camps.data_fine)}
                                      </p>
                                      <p className="text-gray-600 text-xs">
                                        {enrollment.camps.indirizzo_via}, {enrollment.camps.indirizzo_paese}
                                      </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                      enrollment.saldata 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-orange-100 text-orange-700'
                                    }`}>
                                      {enrollment.saldata ? 'Saldata' : 'Parziale'}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    Pagato: €{enrollment.importo_pagato.toFixed(2)} / €{enrollment.prezzo_totale.toFixed(2)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Zona Pericolosa */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-red-200">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-red-600" size={24} />
            <h2 className="text-2xl font-bold text-red-600">Zona Pericolosa</h2>
          </div>
          
          <p className="text-gray-700 mb-4">
            Eliminando il tuo account perderai permanentemente tutti i dati, compreso lo storico delle iscrizioni.
            Questa azione è irreversibile.
          </p>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 
              transition-all flex items-center gap-2 font-semibold"
          >
            <Trash2 size={18} />
            Elimina Account
          </button>
        </div>
      </div>

      {/* Modal Modifica Password/Email */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-blue-deep">Modifica Credenziali</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                Per modificare email o password, riceverai un link di verifica via email.
                Clicca sul link per confermare le modifiche.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={async () => {
                  try {
                    // Implementa la logica di reset password
                    showAlert("Link inviato alla tua email", "success");
                    setShowPasswordModal(false);
                  } catch (error) {
                    showAlert("Errore durante l'invio");
                  }
                }}
                className="w-full bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700 
                  transition-all font-semibold"
              >
                Modifica Email/Password
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 
                  transition-all font-semibold"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Conferma Eliminazione */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-red-600 flex items-center gap-2">
                <AlertTriangle size={24} />
                Conferma Eliminazione
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700 mb-2 font-semibold">
                ⚠️ Questa azione è IRREVERSIBILE
              </p>
              <p className="text-sm text-gray-700">
                Perderai permanentemente:
              </p>
              <ul className="text-sm text-gray-700 list-disc list-inside mt-2">
                <li>Tutti i dati personali</li>
                <li>I dati dei figli</li>
                <li>Lo storico delle iscrizioni</li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleDeleteAccount}
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 
                  transition-all font-semibold"
              >
                Sì, Elimina il Mio Account
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 
                  transition-all font-semibold"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}