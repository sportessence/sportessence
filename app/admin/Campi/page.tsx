"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { Plus, Edit2, Trash2, X, Calendar, MapPin, Users, Euro } from "lucide-react";
import { createCamp, updateCamp, deleteCamp, type CampData } from "@/app/actions/camps";

type Camp = {
  id: string;
  nome: string;
  indirizzo_via: string;
  indirizzo_civico: string;
  indirizzo_cap: string;
  indirizzo_paese: string;
  indirizzo_provincia: string;
  data_inizio: string;
  data_fine: string;
  descrizione?: string;
  posti_disponibili?: number;
  prezzo?: number;
  created_at: string;
};

export default function AdminCampiPage() {
  const [camps, setCamps] = useState<Camp[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCamp, setEditingCamp] = useState<Camp | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ msg: string; type: "error" | "success" } | null>(null);
  
  const [formData, setFormData] = useState<CampData>({
    nome: "",
    indirizzo_via: "",
    indirizzo_civico: "",
    indirizzo_cap: "",
    indirizzo_paese: "",
    indirizzo_provincia: "",
    data_inizio: "",
    data_fine: "",
    descrizione: "",
    posti_disponibili: undefined,
    prezzo: undefined,
  });

  const supabase = createClient();

  const showAlert = (msg: string, type: "error" | "success") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const loadCamps = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("camps")
      .select("*")
      .order("data_inizio", { ascending: true });

    if (error) {
      console.error("Errore caricamento campi:", error);
      showAlert("Errore caricamento campi", "error");
    } else {
      setCamps(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCamps();
  }, []);

  const handleOpenModal = (camp?: Camp) => {
    if (camp) {
      setEditingCamp(camp);
      setFormData({
        nome: camp.nome,
        indirizzo_via: camp.indirizzo_via,
        indirizzo_civico: camp.indirizzo_civico,
        indirizzo_cap: camp.indirizzo_cap,
        indirizzo_paese: camp.indirizzo_paese,
        indirizzo_provincia: camp.indirizzo_provincia,
        data_inizio: camp.data_inizio,
        data_fine: camp.data_fine,
        descrizione: camp.descrizione || "",
        posti_disponibili: camp.posti_disponibili,
        prezzo: camp.prezzo,
      });
    } else {
      setEditingCamp(null);
      setFormData({
        nome: "",
        indirizzo_via: "",
        indirizzo_civico: "",
        indirizzo_cap: "",
        indirizzo_paese: "",
        indirizzo_provincia: "",
        data_inizio: "",
        data_fine: "",
        descrizione: "",
        posti_disponibili: undefined,
        prezzo: undefined,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCamp(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validazione date
      if (new Date(formData.data_inizio) >= new Date(formData.data_fine)) {
        showAlert("La data di fine deve essere successiva alla data di inizio", "error");
        setIsSubmitting(false);
        return;
      }

      let result;
      if (editingCamp) {
        // Modifica
        result = await updateCamp(editingCamp.id, formData);
      } else {
        // Creazione
        result = await createCamp(formData);
      }

      if (result.error) {
        showAlert(result.error, "error");
      } else {
        showAlert(
          editingCamp ? "Campo aggiornato con successo" : "Campo creato con successo",
          "success"
        );
        handleCloseModal();
        loadCamps();
      }
    } catch (error) {
      console.error("Errore:", error);
      showAlert("Errore durante l'operazione", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (camp: Camp) => {
    const confirmed = window.confirm(
      `Sei sicuro di voler eliminare il campo "${camp.nome}"?\n\nQuesta azione è irreversibile.`
    );

    if (!confirmed) return;

    try {
      const result = await deleteCamp(camp.id);

      if (result.error) {
        showAlert(result.error, "error");
      } else {
        showAlert("Campo eliminato con successo", "success");
        loadCamps();
      }
    } catch (error) {
      console.error("Errore eliminazione:", error);
      showAlert("Errore durante l'eliminazione", "error");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Alert */}
      {alert && (
        <div
          className={`fixed z-50 top-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded-lg font-semibold shadow-lg ${
            alert.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {alert.msg}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Gestione Campi Estivi</h1>
          <button
            onClick={() => handleOpenModal()}
            className="bg-cyan-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-cyan-700 
              transition-all flex items-center gap-2 font-semibold"
          >
            <Plus size={20} />
            Nuovo Campo
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Caricamento campi...</p>
          </div>
        )}

        {/* Lista Campi */}
        {!loading && camps.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">Non ci sono campi disponibili</p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-all"
            >
              Crea il primo campo
            </button>
          </div>
        )}

        {!loading && camps.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {camps.map((camp) => (
              <div key={camp.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-cyan-600 to-blue-500 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{camp.nome}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} />
                    <span>
                      {camp.indirizzo_via} {camp.indirizzo_civico}, {camp.indirizzo_paese}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  {/* Date */}
                  <div className="flex items-start gap-3 mb-3">
                    <Calendar className="text-cyan-600 flex-shrink-0 mt-1" size={18} />
                    <div className="text-sm">
                      <p className="text-gray-600">
                        {formatDate(camp.data_inizio)} - {formatDate(camp.data_fine)}
                      </p>
                    </div>
                  </div>

                  {/* Posti */}
                  {camp.posti_disponibili !== null && camp.posti_disponibili !== undefined && (
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="text-cyan-600 flex-shrink-0" size={18} />
                      <div className="text-sm">
                        <span className="text-gray-600">Posti: </span>
                        <span className="font-semibold">{camp.posti_disponibili}</span>
                      </div>
                    </div>
                  )}

                  {/* Prezzo */}
                  {camp.prezzo && (
                    <div className="flex items-center gap-3 mb-4">
                      <Euro className="text-cyan-600 flex-shrink-0" size={18} />
                      <div className="text-sm">
                        <span className="text-gray-600">Prezzo: </span>
                        <span className="font-bold">€{camp.prezzo.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  {/* Descrizione */}
                  {camp.descrizione && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{camp.descrizione}</p>
                  )}

                  {/* Azioni */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(camp)}
                      className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 
                        transition-all flex items-center justify-center gap-2 font-semibold"
                    >
                      <Edit2 size={16} />
                      Modifica
                    </button>ò hover:
                    <button
                      onClick={() => handleDelete(camp)}
                      className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 
                        transition-all flex items-center justify-center gap-2 font-semibold"
                    >
                      <Trash2 size={16} />
                      Elimina
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Crea/Modifica */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="sticky top-0 bg-blue-900 text-white p-6 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-2xl font-bold">
                {editingCamp ? "Modifica Campo" : "Nuovo Campo"}
              </h2>
              <button onClick={handleCloseModal} className="hover:bg-blue-800 p-2 rounded-lg">
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-blue-deep font-semibold mb-1">
                  Nome del Campo *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                  placeholder="Es: Campo Estivo Avventura"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                />
              </div>

              {/* Indirizzo */}
              <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
                <div>
                  <label className="block text-blue-deep font-semibold mb-1">Via *</label>
                  <input
                    type="text"
                    value={formData.indirizzo_via}
                    onChange={(e) => setFormData({ ...formData, indirizzo_via: e.target.value })}
                    required
                    placeholder="Via Roma"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                  />
                </div>
                <div>
                  <label className="block text-blue-deep font-semibold mb-1">Civico *</label>
                  <input
                    type="text"
                    value={formData.indirizzo_civico}
                    onChange={(e) =>
                      setFormData({ ...formData, indirizzo_civico: e.target.value })
                    }
                    required
                    placeholder="12"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-blue-deep font-semibold mb-1">CAP *</label>
                  <input
                    type="text"
                    value={formData.indirizzo_cap}
                    onChange={(e) => setFormData({ ...formData, indirizzo_cap: e.target.value })}
                    required
                    placeholder="20100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                  />
                </div>
                <div>
                  <label className="block text-blue-deep font-semibold mb-1">Comune *</label>
                  <input
                    type="text"
                    value={formData.indirizzo_paese}
                    onChange={(e) =>
                      setFormData({ ...formData, indirizzo_paese: e.target.value })
                    }
                    required
                    placeholder="Milano"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                  />
                </div>
                <div>
                  <label className="block text-blue-deep font-semibold mb-1">Provincia *</label>
                  <input
                    type="text"
                    value={formData.indirizzo_provincia}
                    onChange={(e) =>
                      setFormData({ ...formData, indirizzo_provincia: e.target.value })
                    }
                    required
                    placeholder="MI"
                    maxLength={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black uppercase"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-deep font-semibold mb-1">
                    Data Inizio *
                  </label>
                  <input
                    type="date"
                    value={formData.data_inizio}
                    onChange={(e) => setFormData({ ...formData, data_inizio: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                  />
                </div>
                <div>
                  <label className="block text-blue-deep font-semibold mb-1">Data Fine *</label>
                  <input
                    type="date"
                    value={formData.data_fine}
                    onChange={(e) => setFormData({ ...formData, data_fine: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                  />
                </div>
              </div>

              {/* Posti e Prezzo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-deep font-semibold mb-1">
                    Posti Disponibili
                  </label>
                  <input
                    type="number"
                    value={formData.posti_disponibili || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        posti_disponibili: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    min="0"
                    placeholder="50"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                  />
                </div>
                <div>
                  <label className="block text-blue-deep font-semibold mb-1">Prezzo (€)</label>
                  <input
                    type="number"
                    value={formData.prezzo || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prezzo: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    min="0"
                    step="0.01"
                    placeholder="200.00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                  />
                </div>
              </div>

              {/* Descrizione */}
              <div>
                <label className="block text-blue-deep font-semibold mb-1">Descrizione</label>
                <textarea
                  value={formData.descrizione}
                  onChange={(e) => setFormData({ ...formData, descrizione: e.target.value })}
                  rows={4}
                  placeholder="Descrivi il campo estivo, le attività previste, ecc..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black resize-none"
                />
              </div>

              {/* Pulsanti */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-all font-semibold"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700 transition-all font-semibold
                    ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {isSubmitting
                    ? "Salvataggio..."
                    : editingCamp
                    ? "Salva Modifiche"
                    : "Crea Campo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}