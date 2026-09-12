"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { Plus } from "lucide-react";
import { upsertCampFull, deleteCamp, type CampData } from "@/app/actions/camps";
import { CampCard } from "./components/CampCard";
import { CampFormModal } from "./components/CampFormModal";

export default function AdminCampiPage() {
  const [camps, setCamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  
  const [siblingDiscountMode, setSiblingDiscountMode] = useState<'DISCOUNT' | 'WEEK_PRICE'>('DISCOUNT');

  const [formData, setFormData] = useState<CampData>({
    nome: "", indirizzo_via: "", indirizzo_civico: "", indirizzo_cap: "", indirizzo_paese: "", indirizzo_provincia: "", descrizione: "", 
    data_inizio: "", data_fine: "", attivo: true,
    price_half_day: 70, price_pre: 10, price_post: 10, price_pre_post_bundle: 15, 
    sibling_discount_value: 0,
    sibling_discount_week_price: 0,
    weeks: [], tiers: [{ min_weeks: 1, price_per_week: 100, discount_percent: 0 }]
  });

  const supabase = createClient();

  const loadCamps = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("camps")
      .select("*, camp_weeks(*), camp_pricing_tiers(*)")
      .order("created_at", { ascending: false });

    if (!error) setCamps(data || []);
    setLoading(false);
  };

  useEffect(() => { loadCamps(); }, []);

  const handleOpenModal = (camp?: any) => {
    if (camp) {
      setEditingId(camp.id);
      const mode = (camp.sibling_discount_week_price && camp.sibling_discount_week_price > 0) ? 'WEEK_PRICE' : 'DISCOUNT';
      setSiblingDiscountMode(mode);

      setFormData({
        nome: camp.nome, indirizzo_via: camp.indirizzo_via, indirizzo_civico: camp.indirizzo_civico, indirizzo_cap: camp.indirizzo_cap, indirizzo_paese: camp.indirizzo_paese, indirizzo_provincia: camp.indirizzo_provincia,
        descrizione: camp.descrizione || "", data_inizio: camp.data_inizio || "", data_fine: camp.data_fine || "", attivo: camp.attivo,
        price_half_day: camp.price_half_day ?? 70, price_pre: camp.price_pre ?? 10, price_post: camp.price_post ?? 10, price_pre_post_bundle: camp.price_pre_post_bundle ?? 15,
        sibling_discount_value: camp.sibling_discount_value ?? 0, sibling_discount_week_price: camp.sibling_discount_week_price ?? 0,
        weeks: camp.camp_weeks || [],
        tiers: camp.camp_pricing_tiers?.sort((a: any,b: any) => a.min_weeks - b.min_weeks) || []
      });
    } else {
      setEditingId(undefined);
      setSiblingDiscountMode('DISCOUNT');
      setFormData({
        nome: "", indirizzo_via: "", indirizzo_civico: "", indirizzo_cap: "", indirizzo_paese: "", indirizzo_provincia: "", descrizione: "", 
        data_inizio: "", data_fine: "", attivo: true,
        price_half_day: 70, price_pre: 10, price_post: 10, price_pre_post_bundle: 15, 
        sibling_discount_value: 0, sibling_discount_week_price: 0,
        weeks: [], tiers: [{ min_weeks: 1, price_per_week: 100, discount_percent: 0 }]
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const finalData = {
        ...formData,
        price_half_day: formData.price_half_day ?? 0,
        price_pre: formData.price_pre ?? 0,
        price_post: formData.price_post ?? 0,
        price_pre_post_bundle: formData.price_pre_post_bundle ?? 0,
        
        sibling_discount_value: siblingDiscountMode === 'DISCOUNT' ? (formData.sibling_discount_value ?? 0) : 0,
        sibling_discount_week_price: siblingDiscountMode === 'WEEK_PRICE' ? (formData.sibling_discount_week_price ?? 0) : 0,

        tiers: formData.tiers.map(t => ({
            ...t, min_weeks: t.min_weeks ?? 0, price_per_week: t.price_per_week ?? 0, discount_percent: t.discount_percent ?? 0
        }))
    };

    const res = await upsertCampFull(finalData, editingId);
    setIsSubmitting(false);
    
    if (res.error) {
      alert("Errore: " + res.error);
    } else {
      setShowModal(false);
      loadCamps();
    }
  };

  const handleDeleteCamp = async (id: string) => {
    if(!confirm("Sicuro di voler eliminare questo campo e tutte le settimane associate?")) return;
    await deleteCamp(id);
    loadCamps();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Gestione Campi</h1>
          <button onClick={() => handleOpenModal()} className="bg-cyan-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-bold hover:bg-cyan-700 transition-colors shadow-sm">
            <Plus size={20} /> Nuovo Campo
          </button>
        </div>

        <div className="space-y-8">
          {camps.map(camp => (
            <CampCard 
              key={camp.id} 
              camp={camp} 
              onEdit={handleOpenModal} 
              onDelete={handleDeleteCamp} 
            />
          ))}

          {!loading && camps.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <div className="text-4xl mb-4">🏕️</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Nessun campo presente</h3>
                <button onClick={() => handleOpenModal()} className="bg-cyan-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-cyan-700 transition-colors">
                  Crea Campo
                </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <CampFormModal 
          editingId={editingId}
          formData={formData}
          setFormData={setFormData}
          siblingDiscountMode={siblingDiscountMode}
          setSiblingDiscountMode={setSiblingDiscountMode}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
}