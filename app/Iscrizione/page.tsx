"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, MapPin, Users } from "lucide-react";
import { createEnrollment } from "@/app/actions/enrollments";

import { Child, Camp, CampWeek, LocalQuote, ExistingBooking } from "../types/iscrizione";
import { calculateQuote } from "../utils/pricing";
import { WeekSelector } from "./components/WeekSelector";
import { PriceSummaryBox } from "./components/PriceSummaryBox";

function IscrizioneContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  const [children, setChildren] = useState<Child[]>([]);
  const [camps, setCamps] = useState<Camp[]>([]);
  const [weeks, setWeeks] = useState<CampWeek[]>([]); 
  const [loadingData, setLoadingData] = useState(true);

  const [selectedChild, setSelectedChild] = useState<string>("");
  const [selectedCamp, setSelectedCamp] = useState<string>("");
  
  const [bookedWeeks, setBookedWeeks] = useState<ExistingBooking[]>([]);
  const [bookedWeekIds, setBookedWeekIds] = useState<string[]>([]);
  const [alreadyBilledAmount, setAlreadyBilledAmount] = useState(0);
  
  const [siblingWeekIds, setSiblingWeekIds] = useState<Set<string>>(new Set());
  const [siblingWeekDates, setSiblingWeekDates] = useState<Record<string, string>>({}); 

  const [weekSelections, setWeekSelections] = useState<Record<string, {
    selected: boolean,
    type: 'FULL' | 'HALF',
    prePost: 'NONE' | 'PRE' | 'POST' | 'BOTH'
  }>>({});

  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const [acceptTerms, setAcceptTerms] = useState(false);

  const [priceQuote, setPriceQuote] = useState<LocalQuote | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const availableCamps = useMemo(() => {
    if (!selectedChild) return camps; 

    const childObj = children.find(c => c.id === selectedChild);
    if (!childObj || !childObj.data_nascita) return camps;

    const birthYear = new Date(childObj.data_nascita).getFullYear();
    const currentYear = new Date().getFullYear();

    const minAge = 3;
    const maxAge = 6;
    
    const maxBirthYear = currentYear - minAge;
    const minBirthYear = currentYear - maxAge; 

    return camps.filter(camp => {
      if (camp.nome.toLowerCase().includes("capiago intimiano baby camp")) {
        return birthYear >= minBirthYear && birthYear <= maxBirthYear;
      }
      return true;
    });
  }, [camps, selectedChild, children]);

  const currentCampObj = camps.find(c => c.id === selectedCamp);
  const isCastelloCamp = currentCampObj?.nome.toLowerCase().includes("castello") || false;
  const isMuliniCamp = currentCampObj?.nome.toLowerCase().includes("uggiate") || false;

  const currentPromoCode = isCastelloCamp ? process.env.NEXT_PUBLIC_SCONTO_FEDELI_CODICE_CANTU : isMuliniCamp ? process.env.NEXT_PUBLIC_SCONTO_FEDELI_CODICE_MULINI : "";
  const currentPromoValue = isCastelloCamp ? Number(process.env.NEXT_PUBLIC_SCONTO_FEDELI_CANTU) : isMuliniCamp ? Number(process.env.NEXT_PUBLIC_SCONTO_FEDELI_MULINI) : 0;

  useEffect(() => {
    const initData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/Login?redirect=/Iscrizione"); return; }

      const { data: childrenData } = await supabase.from('children').select('id, nome, cognome, data_nascita').eq('parent_id', user.id);
      setChildren(childrenData as Child[] || []);

      const { data: campsData } = await supabase
        .from('camps')
        .select(`
            id, nome, indirizzo_paese, 
            sibling_discount_value, sibling_discount_week_price,
            price_half_day, price_pre, price_post, price_pre_post_bundle,
            camp_weeks (id, label, data_inizio, data_fine),
            camp_pricing_tiers (price_per_week, min_weeks, discount_percent)
        `)
        .eq('attivo', true);

      const formattedCamps = (campsData || []).map((c: any) => ({
        ...c,
        prezzo_base_indicativo: c.camp_pricing_tiers?.sort((a:any,b:any) => a.min_weeks - b.min_weeks)[0]?.price_per_week || 0
      }));
      setCamps(formattedCamps);
      
      const urlChild = searchParams.get('child');
      const urlCamp = searchParams.get('campo');
      if (urlChild && childrenData?.some(c => c.id === urlChild)) setSelectedChild(urlChild);
      if (urlCamp && formattedCamps?.some(c => c.id === urlCamp)) handleCampChange(urlCamp, formattedCamps);

      setLoadingData(false);
    };
    initData();
  }, [searchParams, router, supabase]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!selectedChild || !selectedCamp) { 
          setBookedWeeks([]); 
          setBookedWeekIds([]);
          setSiblingWeekIds(new Set());
          setSiblingWeekDates({});
          setAlreadyBilledAmount(0);
          return; 
      }

      const currentYear = new Date().getFullYear();
      const startOfYear = `${currentYear}-01-01T00:00:00.000Z`;

      // A. MIEI DATI
      const { data: myEnrollments } = await supabase.from('enrollments')
        .select(`
            id, prezzo_totale, stato, created_at,
            enrollment_weeks (camp_week_id, type, pre_post)
        `)
        .eq('child_id', selectedChild)
        .eq('camp_id', selectedCamp)
        .in('stato', ['CONFIRMED', 'COMPLETED', 'PENDING', 'saldato', 'acconto'])
        .gte('created_at', startOfYear);
      
      let pastWeeks: ExistingBooking[] = [];
      let pastTotal = 0;
      let pastIds: string[] = [];

      if (myEnrollments) {
          myEnrollments.forEach((e: any) => {
              pastTotal += e.prezzo_totale || 0;
              if (e.enrollment_weeks) {
                  e.enrollment_weeks.forEach((ew: any) => {
                      pastWeeks.push({
                          camp_week_id: ew.camp_week_id,
                          type: ew.type,
                          prePost: ew.pre_post,
                          created_at: e.created_at
                      });
                      pastIds.push(ew.camp_week_id);
                  });
              }
          });
      }
      
      setBookedWeeks(pastWeeks);
      setBookedWeekIds(pastIds);
      setAlreadyBilledAmount(pastTotal);

      // B. FRATELLI
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: siblingsData } = await supabase.from('enrollment_weeks')
        .select('camp_week_id, child_id, enrollments!inner(camp_id, stato, created_at)')
        .neq('child_id', selectedChild)
        .eq('enrollments.camp_id', selectedCamp)
        .in('enrollments.stato', ['CONFIRMED', 'COMPLETED', 'PENDING', 'saldato', 'acconto'])
        .gte('enrollments.created_at', startOfYear);

      const siblingSet = new Set<string>();
      const siblingDates: Record<string, string> = {};

      siblingsData?.forEach((row: any) => {
          siblingSet.add(row.camp_week_id);
          const cDate = row.enrollments.created_at;
          if (!siblingDates[row.camp_week_id] || new Date(cDate) < new Date(siblingDates[row.camp_week_id])) {
              siblingDates[row.camp_week_id] = cDate;
          }
      });
      setSiblingWeekIds(siblingSet);
      setSiblingWeekDates(siblingDates);
    };

    fetchHistory();
  }, [selectedChild, selectedCamp, supabase]);

  useEffect(() => {
    if (selectedCamp && selectedChild) {
      const isValid = availableCamps.some(c => c.id === selectedCamp);
      if (!isValid) {
        handleCampChange(""); 
      }
    }
  }, [selectedChild, availableCamps, selectedCamp]);

  const handleCampChange = (campId: string, campsList: Camp[] = camps) => {
    setSelectedCamp(campId);
    const camp = campsList.find(c => c.id === campId);
    setWeeks(camp?.camp_weeks?.sort((a, b) => a.data_inizio.localeCompare(b.data_inizio)) || []);
    setWeekSelections({});
    setPriceQuote(null);
    setErrorMsg(null);
    setPromoCode("");
    setIsPromoApplied(false);
    setAcceptTerms(false); 
  };

  const toggleWeek = (weekId: string) => {
    setWeekSelections(prev => {
      if (prev[weekId]?.selected) {
        const next = { ...prev }; delete next[weekId]; return next;
      }
      return { ...prev, [weekId]: { selected: true, type: 'FULL', prePost: 'NONE' } };
    });
  };

  const updateWeekConfig = (weekId: string, field: 'type' | 'prePost', value: string) => {
    setWeekSelections(prev => ({ ...prev, [weekId]: { ...prev[weekId], [field]: value } }));
  };

  const applyPromoCode = () => {
    if (!currentPromoCode) return;
    if (promoCode.trim().toUpperCase() === currentPromoCode.toUpperCase()) {
      setIsPromoApplied(true);
      setPromoError("");
    } else {
      setIsPromoApplied(false);
      setPromoError("Codice non valido");
    }
  };

  const isWeekBooked = (wid: string) => bookedWeekIds.includes(wid);

  // --- CALCOLO LOCALE ---
  useEffect(() => {
    if (!selectedCamp || !selectedChild) return;
    
    setCalculating(true);
    const timer = setTimeout(() => {
      const campObj = camps.find(c => c.id === selectedCamp);
      if (!campObj) return;

      const quote = calculateQuote({
        campObj,
        weekSelections,
        bookedWeeks,
        bookedWeekIds,
        alreadyBilledAmount,
        isPromoApplied,
        siblingWeekIds,
        siblingWeekDates,
        currentPromoValue: currentPromoValue || 0
      });

      setPriceQuote(quote);
      setCalculating(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [selectedCamp, selectedChild, weekSelections, bookedWeeks, alreadyBilledAmount, isPromoApplied, camps, siblingWeekIds, siblingWeekDates, currentPromoValue]);

  // Invio Dati
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!priceQuote) return;
    
    if (!acceptTerms) {
        setErrorMsg("Devi accettare il regolamento per procedere.");
        return;
    }

    setSubmitting(true); setErrorMsg(null);

    const weeksPayload = priceQuote.details.map((d: any) => ({
        camp_week_id: d.week_id, type: d.type, pre_post: d.prePost || 'NONE', price: d.price
    }));

    if (weeksPayload.length === 0) { setErrorMsg("Nessuna settimana selezionata."); setSubmitting(false); return; }

    const result = await createEnrollment({
      campId: selectedCamp, childId: selectedChild, weeks: weeksPayload, 
      totalPrice: priceQuote.total, priceSnapshot: priceQuote, appliedPromo: isPromoApplied
    });

    if (result.error) { setErrorMsg(result.error); setSubmitting(false); } 
    else { router.push('/Utente?success=enrollment_created'); }
  };

  if (loadingData) return <div className="flex h-screen items-center justify-center bg-cream"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div></div>;

  if (children.length === 0) {
    return (
       <div className="max-w-4xl mx-auto py-10 px-4">
         <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Aggiungi il tuo primo bambino</h2>
            <button onClick={() => router.push('/Utente')} className="bg-cyan-600 text-white px-8 py-4 rounded-xl font-bold">Vai alla Dashboard</button>
         </div>
       </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
        <div className="bg-blue-light p-8 text-white relative">
          <div className="absolute inset-0 bg-[url('/imgs/pattern.png')] opacity-10"></div>
          <h1 className="text-3xl font-extrabold mb-2 relative z-10">Nuova Iscrizione</h1>
          <p className="text-blue-100 relative z-10">Configura le settimane e personalizza l'esperienza.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h2 className="font-bold text-xl mb-6 flex items-center gap-3 text-blue-deep"><span className="bg-blue-100 p-2 rounded-lg text-blue-600"><Users size={20}/></span>Dati Principali</h2>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Bambino</label>
                  <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 appearance-none bg-white text-gray-900" value={selectedChild} onChange={e => setSelectedChild(e.target.value)}>
                    <option value="">-- Seleziona --</option>
                    {children.map(c => <option key={c.id} value={c.id}>{c.nome} {c.cognome}</option>)}
                  </select>
                  <Users className="absolute left-3 top-[2.6rem] text-gray-400" size={18} />
                </div>
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Campo Estivo</label>
                  <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 appearance-none bg-white text-gray-900" value={selectedCamp} onChange={e => handleCampChange(e.target.value)}>
                    <option value="">-- Seleziona --</option>
                    {availableCamps.map(c => <option key={c.id} value={c.id}>{c.nome} ({c.indirizzo_paese})</option>)}
                  </select>
                  <MapPin className="absolute left-3 top-[2.6rem] text-gray-400" size={18} />
                </div>
            </div>
          </div>

          {selectedCamp && (
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h2 className="font-bold text-xl mb-6 flex items-center gap-3 text-blue-deep"><span className="bg-cyan-100 p-2 rounded-lg text-cyan-600"><Calendar size={20}/></span>Scegli le settimane</h2>
               <WeekSelector 
                  weeks={weeks}
                  weekSelections={weekSelections}
                  isWeekBooked={isWeekBooked}
                  toggleWeek={toggleWeek}
                  updateWeekConfig={updateWeekConfig}
               />
            </div>
          )}
        </div>

        <div className="lg:col-span-4">
          <PriceSummaryBox 
            selectedChild={selectedChild}
            selectedCamp={selectedCamp}
            calculating={calculating}
            priceQuote={priceQuote}
            weeks={weeks}
            isCastelloCamp={isCastelloCamp}
            isMuliniCamp={isMuliniCamp}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            isPromoApplied={isPromoApplied}
            setIsPromoApplied={setIsPromoApplied}
            applyPromoCode={applyPromoCode}
            promoError={promoError}
            alreadyBilledAmount={alreadyBilledAmount}
            errorMsg={errorMsg}
            submitting={submitting}
            acceptTerms={acceptTerms}
            setAcceptTerms={setAcceptTerms}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}

export default function IscrizionePage() {
  return (
    <main className="min-h-screen bg-cream py-12 px-4 font-sans">
      <Suspense fallback={<div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div></div>}>
        <IscrizioneContent />
      </Suspense>
    </main>
  );
}
