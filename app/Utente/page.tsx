"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  User, Users, AlertTriangle, 
  Plus, CheckCircle, Trash2
} from "lucide-react";
import AddChildModal from "../components/addChildModal";
import EditChildModal from "../components/editChildModal";
import ProfileSection from "../components/profileSection";
import { deleteChild, deleteAccount } from "../actions/childrens";
import DeleteConfirmModal from "../components/deleteConfirmModal"; 
import { ChildCard } from "./components/ChildCard";
import { Profile, Child, Enrollment } from "../types/iscrizione";

function UtenteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [enrollments, setEnrollments] = useState<{ [childId: string]: Enrollment[] }>({});
  
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [alert, setAlert] = useState<{ msg: string; type: "error" | "success" } | null>(null);
  
  // Modali
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteModalConfig, setDeleteModalConfig] = useState<{ isOpen: boolean; type: "ACCOUNT" | "CHILD" | null; data: any; }>({ isOpen: false, type: null, data: null });

  const showAlert = (msg: string, type: "error" | "success" = "error") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 5000);
  };

  useEffect(() => {
    if (searchParams.get('success') === 'true' || searchParams.get('success') === 'enrollment_created') {
      showAlert("✅ Prenotazione confermata! Apri la scheda del bambino per i dettagli di pagamento.", "success");
      router.replace('/Utente');
    }
  }, [searchParams, router]);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/Login"); return; }

      try {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(profile as Profile);

        const { data: kids } = await supabase.from('children').select('*').eq('parent_id', user.id).order('data_nascita');
        setChildren(kids as Child[] || []);

        if (kids && kids.length > 0) {
          const enrollMap: any = {};
          for (const k of kids) {
            const { data } = await supabase.from('enrollments')
              .select(`*, camps(nome, indirizzo_via, indirizzo_paese), enrollment_weeks(camp_weeks(data_inizio, data_fine))`)
              .eq('child_id', k.id).order('created_at', { ascending: false });
            enrollMap[k.id] = data || [];
          }
          setEnrollments(enrollMap);
        }
        setLoading(false);
      } catch (e) { console.error(e); setLoading(false); }
    };
    loadData();
  }, [router, supabase]);

  const handleRegister = (childId: string) => router.push(`/Iscrizione?child=${childId}`);
  
  const handleDeleteChild = (child: Child) => {
     setDeleteModalConfig({ isOpen: true, type: "CHILD", data: child });
  };

  const handleDeleteAccount = () => {
     setDeleteModalConfig({ isOpen: true, type: "ACCOUNT", data: null });
  };

  const performDeletion = async () => {
     try {
       if(deleteModalConfig.type === "CHILD") {
          const result = await deleteChild(deleteModalConfig.data.id);
          if (result.error) {
            showAlert(result.error, "error");
            setDeleteModalConfig({ isOpen: false, type: null, data: null });
            return;
          }
          showAlert(`${deleteModalConfig.data.nome} ${deleteModalConfig.data.cognome} è stato eliminato correttamente`, "success");
          setDeleteModalConfig({ isOpen: false, type: null, data: null });
          setTimeout(() => { window.location.reload(); }, 1000);
          
       } else if (deleteModalConfig.type === "ACCOUNT") {
          const result = await deleteAccount();
          if (result.error) {
            showAlert(result.error, "error");
            setDeleteModalConfig({ isOpen: false, type: null, data: null });
            return;
          }
          await supabase.auth.signOut();
          router.push("/");
       }
     } catch(e: any) {
        console.error("Errore eliminazione:", e);
        showAlert("Errore durante l'eliminazione: " + e.message, "error");
        setDeleteModalConfig({ isOpen: false, type: null, data: null });
     }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-cream"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div></div>;
  if (!profile) return null;

  return (
    <>
      {alert && (
        <div className={`fixed z-[200] top-6 left-1/2 -translate-x-1/2 px-6 py-4 rounded-xl font-bold shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${alert.type === "error" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"}`}>
          {alert.type === "error" ? <AlertTriangle size={20}/> : <CheckCircle size={20}/>}
          {alert.msg}
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Profilo */}
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-6 border border-gray-100">
           <div className="bg-cyan-100 p-4 rounded-full"><User className="text-cyan-600" size={40} /></div>
           <div>
             <h1 className="text-3xl font-bold text-blue-deep">Ciao, {profile.nome}! 👋</h1>
             <p className="text-gray-500">Gestisci qui le tue iscrizioni e i dati della famiglia.</p>
           </div>
        </div>

        {/* Sezione Profilo Editabile */}
        <ProfileSection profile={profile} onProfileUpdate={() => window.location.reload()} showAlert={showAlert} />

        {/* Lista Figli */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-deep flex items-center gap-2">
              <Users size={24} /> I Miei Figli ({children.length})
            </h2>
            <button onClick={() => setShowAddChildModal(true)} className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 flex items-center gap-2 font-bold text-sm shadow-md transition-all hover:-translate-y-0.5">
               <Plus size={18}/> Aggiungi
            </button>
          </div>

          <div className="space-y-6">
             {children.length === 0 && (
                <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                   <Users className="mx-auto mb-3 opacity-20" size={48}/>
                   <p>Non hai ancora registrato nessun bambino.</p>
                </div>
             )}
             {children.map(child => (
                <ChildCard 
                   key={child.id} 
                   child={child} 
                   enrollments={enrollments[child.id]} 
                   onEdit={(c: Child) => { setEditingChild(c); setShowEditModal(true); }}
                   onDelete={handleDeleteChild}
                   onRegister={handleRegister}
                />
             ))}
          </div>
        </div>

        {/* Zona Pericolosa */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-red-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 p-2 rounded-lg"><AlertTriangle className="text-red-600" size={24} /></div>
            <h2 className="text-xl font-bold text-red-700">Zona Pericolosa</h2>
          </div>
          <p className="text-gray-600 mb-6 text-sm">
             Eliminando l'account perderai l'accesso a tutti i dati e allo storico delle iscrizioni.
             {children.length > 0 && (
                <span className="block mt-2 font-bold text-red-600">
                   ⚠️ Prima di eliminare l'account, devi eliminare tutti i bambini registrati.
                </span>
             )}
          </p>
          <button onClick={handleDeleteAccount} className="bg-white border-2 border-red-200 text-red-600 px-6 py-3 rounded-xl hover:bg-red-50 transition-all flex items-center gap-2 font-bold text-sm">
            <Trash2 size={18} /> Elimina Account
          </button>
        </div>
      </div>

      {/* Modali */}
      <AddChildModal isOpen={showAddChildModal} onClose={() => setShowAddChildModal(false)} onSuccess={() => window.location.reload()} showAlert={showAlert} />
      <EditChildModal isOpen={showEditModal} child={editingChild} onClose={() => { setShowEditModal(false); setEditingChild(null); }} onSuccess={() => window.location.reload()} showAlert={showAlert} />
      <DeleteConfirmModal 
          isOpen={deleteModalConfig.isOpen} 
          onClose={() => setDeleteModalConfig({ isOpen: false, type: null, data: null })} 
          onConfirm={performDeletion} 
          title={deleteModalConfig.type === "ACCOUNT" ? "Elimina Account" : `Elimina ${deleteModalConfig.data?.nome || 'Bambino'}`}
          description={
            deleteModalConfig.type === "ACCOUNT" 
              ? "Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile e comporterà la perdita di tutti i tuoi dati." 
              : `Sei sicuro di voler eliminare ${deleteModalConfig.data?.nome} ${deleteModalConfig.data?.cognome}? Questa azione è irreversibile.`
          }
          confirmText="Elimina definitivamente" 
      />
    </>
  );
}

export default function PaginaUtente() {
  return (
    <main className="min-h-screen bg-cream py-12 px-4">
      <Suspense fallback={
         <div className="flex h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
         </div>
      }>
        <UtenteContent />
      </Suspense>
    </main>
  );
}