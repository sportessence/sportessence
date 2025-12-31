"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  MapPin, 
  Euro, 
  Filter,
  Users,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";

type Child = {
  id: string;
  nome: string;
  cognome: string;
};

type Enrollment = {
  id: string;
  child_id: string;
  camp_id: string;
  created_at: string;
  prezzo_totale: number;
  importo_pagato: number;
  saldata: boolean;
  children: {
    nome: string;
    cognome: string;
  };
  camps: {
    nome: string;
    data_inizio: string;
    data_fine: string;
    indirizzo_via: string;
    indirizzo_civico: string;
    indirizzo_paese: string;
    indirizzo_provincia: string;
  };
};

export default function IscrizioniPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<Child[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>([]);
  
  // Filtri
  const [selectedChild, setSelectedChild] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all"); // all, active, past
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [enrollments, selectedChild, selectedYear, selectedStatus]);

  const checkAuthAndLoadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/Login?redirect=/Iscrizioni");
      return;
    }

    await loadData(user.id);
  };

  const loadData = async (userId: string) => {
    try {
      // Carica figli
      const { data: childrenData } = await supabase
        .from('children')
        .select('id, nome, cognome')
        .eq('parent_id', userId);

      setChildren(childrenData || []);

      // Carica tutte le iscrizioni
      const { data: enrollmentsData } = await supabase
        .from('enrollments')
        .select(`
          *,
          children (nome, cognome),
          camps (
            nome,
            data_inizio,
            data_fine,
            indirizzo_via,
            indirizzo_civico,
            indirizzo_paese,
            indirizzo_provincia
          )
        `)
        .in('child_id', (childrenData || []).map(c => c.id))
        .order('created_at', { ascending: false });

      setEnrollments(enrollmentsData || []);
      setLoading(false);
    } catch (error) {
      console.error("Errore caricamento dati:", error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...enrollments];

    // Filtro per bambino
    if (selectedChild !== "all") {
      filtered = filtered.filter(e => e.child_id === selectedChild);
    }

    // Filtro per anno
    if (selectedYear !== "all") {
      filtered = filtered.filter(e => {
        const year = new Date(e.camps.data_inizio).getFullYear();
        return year.toString() === selectedYear;
      });
    }

    // Filtro per stato (attive/passate)
    const today = new Date();
    if (selectedStatus === "active") {
      filtered = filtered.filter(e => new Date(e.camps.data_fine) >= today);
    } else if (selectedStatus === "past") {
      filtered = filtered.filter(e => new Date(e.camps.data_fine) < today);
    }

    setFilteredEnrollments(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getAvailableYears = () => {
    const years = new Set<number>();
    enrollments.forEach(e => {
      years.add(new Date(e.camps.data_inizio).getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  const isActive = (enrollment: Enrollment) => {
    return new Date(enrollment.camps.data_fine) >= new Date();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento iscrizioni...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-deep mb-2">
                Le Tue Iscrizioni
              </h1>
              <p className="text-gray-600">
                Visualizza e gestisci tutte le iscrizioni dei tuoi figli
              </p>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 
                transition-all flex items-center justify-center gap-2 font-semibold"
            >
              <Filter size={20} />
              Filtri
              {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {/* Pannello Filtri */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Filtro Bambino */}
                <div>
                  <label className="block text-sm font-semibold text-blue-deep mb-2">
                    Bambino
                  </label>
                  <select
                    value={selectedChild}
                    onChange={(e) => setSelectedChild(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                  >
                    <option value="all">Tutti i bambini</option>
                    {children.map(child => (
                      <option key={child.id} value={child.id}>
                        {child.nome} {child.cognome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtro Anno */}
                <div>
                  <label className="block text-sm font-semibold text-blue-deep mb-2">
                    Anno
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                  >
                    <option value="all">Tutti gli anni</option>
                    {getAvailableYears().map(year => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtro Stato */}
                <div>
                  <label className="block text-sm font-semibold text-blue-deep mb-2">
                    Stato
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-black"
                  >
                    <option value="all">Tutte</option>
                    <option value="active">Attive</option>
                    <option value="past">Passate</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Statistiche Rapide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Iscrizioni Totali</p>
                <p className="text-3xl font-bold text-blue-deep">{enrollments.length}</p>
              </div>
              <Users className="text-cyan-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Iscrizioni Attive</p>
                <p className="text-3xl font-bold text-green-600">
                  {enrollments.filter(e => isActive(e)).length}
                </p>
              </div>
              <CheckCircle className="text-green-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Pagamenti Saldati</p>
                <p className="text-3xl font-bold text-blue-deep">
                  {enrollments.filter(e => e.saldata).length}
                </p>
              </div>
              <Euro className="text-cyan-600" size={40} />
            </div>
          </div>
        </div>

        {/* Lista Iscrizioni */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-blue-deep mb-6">
            Elenco Iscrizioni ({filteredEnrollments.length})
          </h2>

          {filteredEnrollments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 mb-4">
                {enrollments.length === 0 
                  ? "Non hai ancora nessuna iscrizione"
                  : "Nessuna iscrizione trovata con questi filtri"}
              </p>
              {enrollments.length === 0 && (
                <button
                  onClick={() => router.push("/Campi")}
                  className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-all"
                >
                  Scopri i Campi Disponibili
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEnrollments.map((enrollment) => {
                const active = isActive(enrollment);
                
                return (
                  <div 
                    key={enrollment.id} 
                    className={`border-2 rounded-xl overflow-hidden transition-all hover:shadow-lg ${
                      active ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-blue-deep">
                              {enrollment.camps.nome}
                            </h3>
                            {active ? (
                              <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                                Attiva
                              </span>
                            ) : (
                              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                                Passata
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 font-medium">
                            {enrollment.children.nome} {enrollment.children.cognome}
                          </p>
                        </div>

                        <div className={`px-6 py-3 rounded-xl text-center ${
                          enrollment.saldata 
                            ? 'bg-green-100 border-2 border-green-300' 
                            : 'bg-orange-100 border-2 border-orange-300'
                        }`}>
                          <p className="text-xs text-gray-600 font-semibold mb-1">Pagamento</p>
                          <p className={`text-xl font-bold ${
                            enrollment.saldata ? 'text-green-700' : 'text-orange-700'
                          }`}>
                            {enrollment.saldata ? '✓ Saldata' : `€${enrollment.importo_pagato}/${enrollment.prezzo_totale}`}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-start gap-3">
                          <Calendar className="text-cyan-600 flex-shrink-0 mt-1" size={18} />
                          <div>
                            <p className="font-semibold text-gray-800">Periodo</p>
                            <p className="text-gray-600">
                              {formatDate(enrollment.camps.data_inizio)} - {formatDate(enrollment.camps.data_fine)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="text-cyan-600 flex-shrink-0 mt-1" size={18} />
                          <div>
                            <p className="font-semibold text-gray-800">Sede</p>
                            <p className="text-gray-600">
                              {enrollment.camps.indirizzo_via} {enrollment.camps.indirizzo_civico}, {enrollment.camps.indirizzo_paese}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Euro className="text-cyan-600 flex-shrink-0 mt-1" size={18} />
                          <div>
                            <p className="font-semibold text-gray-800">Prezzo Totale</p>
                            <p className="text-gray-600">€{enrollment.prezzo_totale.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Calendar className="text-cyan-600 flex-shrink-0 mt-1" size={18} />
                          <div>
                            <p className="font-semibold text-gray-800">Data Iscrizione</p>
                            <p className="text-gray-600">{formatDate(enrollment.created_at)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Link rapidi */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-bold text-blue-deep mb-4">Link Utili</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push("/Utente")}
              className="bg-cyan-600 text-white py-3 px-6 rounded-lg hover:bg-cyan-700 
                transition-all font-semibold text-center"
            >
              👤 Il Mio Profilo
            </button>
            <button
              onClick={() => router.push("/Campi")}
              className="bg-blue-light text-white py-3 px-6 rounded-lg hover:bg-blue-deep 
                transition-all font-semibold text-center"
            >
              🏕️ Scopri i Campi
            </button>
            <button
              onClick={() => router.push("/Info")}
              className="bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 
                transition-all font-semibold text-center"
            >
              ℹ️ Informazioni
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}