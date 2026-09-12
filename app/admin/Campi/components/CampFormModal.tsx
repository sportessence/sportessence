import React from 'react';
import { Plus, Trash2, X, CheckCircle, Wand2 } from 'lucide-react';
import { CampData, CampWeekData, PricingTierData } from '@/app/actions/camps';

const SectionTitle = ({ title }: { title: string }) => (
  <h3 className="text-lg font-bold text-blue-900 border-b border-blue-100 pb-2 mb-4 mt-6">{title}</h3>
);

type CampFormModalProps = {
  editingId: string | undefined;
  formData: CampData;
  setFormData: React.Dispatch<React.SetStateAction<CampData>>;
  siblingDiscountMode: 'DISCOUNT' | 'WEEK_PRICE';
  setSiblingDiscountMode: (mode: 'DISCOUNT' | 'WEEK_PRICE') => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  setShowModal: (show: boolean) => void;
};

export const CampFormModal: React.FC<CampFormModalProps> = ({
  editingId,
  formData,
  setFormData,
  siblingDiscountMode,
  setSiblingDiscountMode,
  handleSubmit,
  isSubmitting,
  setShowModal
}) => {

  const handlePriceChange = (field: keyof CampData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === "" ? undefined : parseFloat(value)
    }));
  };

  const addWeek = () => {
    setFormData(prev => ({
      ...prev,
      weeks: [...prev.weeks, { label: `Settimana ${prev.weeks.length + 1}`, data_inizio: '', data_fine: '' }]
    }));
  };

  const removeWeek = (index: number) => {
    setFormData(prev => ({ ...prev, weeks: prev.weeks.filter((_, i) => i !== index) }));
  };

  const updateWeek = (index: number, field: keyof CampWeekData, value: string) => {
    const newWeeks = [...formData.weeks];
    // @ts-ignore
    newWeeks[index][field] = value;
    setFormData({ ...formData, weeks: newWeeks });
  };

  const generateAutoWeeks = () => {
    if (!formData.data_inizio || !formData.data_fine) {
      alert("Per favore inserisci le date 'Da Data' e 'A Data' nel box viola prima di generare.");
      return;
    }

    if (formData.weeks.length > 0) {
      if (!confirm("Attenzione: sovrascriverai le settimane esistenti. Continuare?")) return;
    }

    const startDate = new Date(formData.data_inizio);
    const endDate = new Date(formData.data_fine);
    const newWeeks: CampWeekData[] = [];
    let counter = 1;
    let currentIter = new Date(startDate);
    let safety = 0;

    while (currentIter < endDate && safety < 52) {
      const weekStart = new Date(currentIter);
      const weekEnd = new Date(currentIter);
      weekEnd.setDate(weekEnd.getDate() + 4); 

      const startStr = weekStart.toLocaleDateString('en-CA'); 
      const endStr = weekEnd.toLocaleDateString('en-CA');

      newWeeks.push({
        label: `Settimana ${counter}`,
        data_inizio: startStr,
        data_fine: endStr
      });

      currentIter.setDate(currentIter.getDate() + 7);
      counter++;
      safety++;
    }

    setFormData(prev => ({ ...prev, weeks: newWeeks }));
  };

  const addTier = () => {
    setFormData(prev => ({
      ...prev,
      tiers: [...prev.tiers, { min_weeks: prev.tiers.length + 1, price_per_week: 0, discount_percent: 0 }]
    }));
  };

  const removeTier = (index: number) => {
    setFormData(prev => ({ ...prev, tiers: prev.tiers.filter((_, i) => i !== index) }));
  };

  const updateTier = (index: number, field: keyof PricingTierData, value: string) => {
    const newTiers = [...formData.tiers];
    // @ts-ignore
    newTiers[index][field] = value === "" ? undefined : parseFloat(value);
    setFormData({ ...formData, tiers: newTiers });
  };

  const inputClass = "w-full border border-gray-300 p-2 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-cyan-600 focus:border-transparent placeholder-gray-400";
  const labelClass = "block font-bold text-sm text-gray-700 mb-1";

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-20">
          <h2 className="text-2xl font-bold text-blue-deep">{editingId ? 'Modifica Campo' : 'Nuovo Campo'}</h2>
          <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100"><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* --- DATI ANAGRAFICI --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
                <label className={labelClass}>Nome Campo</label>
                <input required placeholder="Es. Summer Camp 2025" className={inputClass} value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
            </div>
            <div><label className={labelClass}>Via</label><input required className={inputClass} value={formData.indirizzo_via} onChange={e => setFormData({...formData, indirizzo_via: e.target.value})} /></div>
            <div><label className={labelClass}>Civico</label><input required className={inputClass} value={formData.indirizzo_civico} onChange={e => setFormData({...formData, indirizzo_civico: e.target.value})} /></div>
            <div><label className={labelClass}>Comune</label><input required className={inputClass} value={formData.indirizzo_paese} onChange={e => setFormData({...formData, indirizzo_paese: e.target.value})} /></div>
            <div><label className={labelClass}>Provincia</label><input required className={inputClass} value={formData.indirizzo_provincia} onChange={e => setFormData({...formData, indirizzo_provincia: e.target.value})} /></div>
            <div><label className={labelClass}>CAP</label><input required className={inputClass} value={formData.indirizzo_cap} onChange={e => setFormData({...formData, indirizzo_cap: e.target.value})} /></div>
          </div>

          <div>
            <label className={labelClass}>Descrizione</label>
            <textarea className={inputClass} rows={3} value={formData.descrizione || ''} onChange={e => setFormData({...formData, descrizione: e.target.value})} />
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer" onClick={() => setFormData({...formData, attivo: !formData.attivo})}>
            <div className={`w-5 h-5 rounded flex items-center justify-center border ${formData.attivo ? 'bg-cyan-600 border-cyan-600' : 'bg-white border-gray-400'}`}>
                {formData.attivo && <CheckCircle size={14} className="text-white"/>}
            </div>
            <label className="font-bold text-gray-800 cursor-pointer select-none">Campo Attivo</label>
          </div>

          {/* --- CONFIGURAZIONE PREZZI --- */}
          <SectionTitle title="1. Configurazione Prezzi" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
            <div><label className={labelClass}>Mezza Giornata (€)</label><input type="number" className={inputClass} value={formData.price_half_day ?? ""} onChange={e => handlePriceChange('price_half_day', e.target.value)} /></div>
            <div><label className={labelClass}>Pre-Scuola (€)</label><input type="number" className={inputClass} value={formData.price_pre ?? ""} onChange={e => handlePriceChange('price_pre', e.target.value)} /></div>
            <div><label className={labelClass}>Post-Scuola (€)</label><input type="number" className={inputClass} value={formData.price_post ?? ""} onChange={e => handlePriceChange('price_post', e.target.value)} /></div>
            <div><label className={labelClass}>Bundle Pre+Post (€)</label><input type="number" className={inputClass} value={formData.price_pre_post_bundle ?? ""} onChange={e => handlePriceChange('price_pre_post_bundle', e.target.value)} /></div>
          </div>

          {/* NUOVA SEZIONE SCONTI FRATELLI */}
          <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 mt-4">
              <label className="text-xs font-bold text-cyan-800 mb-3 block uppercase tracking-wider">Gestione Sconto Fratelli</label>
              <div className="space-y-4">
                
                {/* Selettore Modalità */}
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="radio" 
                            name="sibling_mode" 
                            value="DISCOUNT" 
                            checked={siblingDiscountMode === 'DISCOUNT'} 
                            onChange={() => setSiblingDiscountMode('DISCOUNT')}
                            className="text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Applica Sconto (Percentuale o Fisso)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="radio" 
                            name="sibling_mode" 
                            value="WEEK_PRICE" 
                            checked={siblingDiscountMode === 'WEEK_PRICE'} 
                            onChange={() => setSiblingDiscountMode('WEEK_PRICE')}
                            className="text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Imposta Prezzo Settimanale Fisso</span>
                    </label>
                </div>

                {/* Input Dinamico in base alla selezione */}
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    {siblingDiscountMode === 'DISCOUNT' ? (
                        <div>
                            <label className={labelClass}>Valore Sconto</label>
                            <div className="flex items-center gap-2">
                                <input type="number" step="0.01" className={inputClass} value={formData.sibling_discount_value ?? ""} onChange={e => handlePriceChange('sibling_discount_value', e.target.value)} />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1">
                                <strong>Logica:</strong> Se ≤ 1 è percentuale (es. 0.20 = 20%). Se {'>'} 1 è assoluto (es. 30 = €30 di sconto).
                            </p>
                        </div>
                    ) : (
                        <div>
                            <label className={labelClass}>Prezzo Settimanale Fratello (€)</label>
                            <input type="number" className={inputClass} value={formData.sibling_discount_week_price ?? ""} onChange={e => handlePriceChange('sibling_discount_week_price', e.target.value)} />
                            <p className="text-[10px] text-gray-500 mt-1">
                                Il fratello pagherà esattamente questa cifra per ogni settimana iscritta, ignorando gli scaglioni standard.
                            </p>
                        </div>
                    )}
                </div>

              </div>
          </div>

          {/* --- SCAGLIONI PREZZO --- */}
          <SectionTitle title="2. Scaglioni Prezzo (Full)" />
          <div className="space-y-3 bg-gray-50 p-5 rounded-xl border border-gray-200">
            {formData.tiers.map((tier, idx) => (
              <div key={idx} className="flex flex-wrap md:flex-nowrap gap-4 items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <span className="text-sm font-bold w-6 text-center text-gray-500">{idx + 1}.</span>
                
                <div className="flex items-center gap-2">
                    <input type="number" className={`${inputClass} w-20`} value={tier.min_weeks ?? ""} onChange={e => updateTier(idx, 'min_weeks', e.target.value)} />
                    <span className="text-sm text-gray-700 font-medium">sett. minime</span>
                </div>
                
                <div className="flex items-center gap-2">
                    <input type="number" className={`${inputClass} w-24`} value={tier.price_per_week ?? ""} onChange={e => updateTier(idx, 'price_per_week', e.target.value)} />
                    <span className="text-sm text-gray-700 font-medium">€/sett</span>
                </div>

                <div className="flex items-center gap-2">
                    <input type="number" className={`${inputClass} w-20 border-green-200 bg-green-50`} value={tier.discount_percent ?? ""} onChange={e => updateTier(idx, 'discount_percent', e.target.value)} />
                    <span className="text-sm text-green-700 font-medium">% sconto</span>
                </div>

                <button type="button" onClick={() => removeTier(idx)} className="text-gray-400 hover:text-red-600 p-2 ml-auto transition-colors"><Trash2 size={18}/></button>
              </div>
            ))}
            <button type="button" onClick={addTier} className="text-sm text-cyan-700 font-bold flex items-center gap-2 mt-2 hover:bg-cyan-50 p-2 rounded transition-colors w-fit"><Plus size={16}/> Aggiungi Scaglione</button>
          </div>

          {/* --- CALENDARIO SETTIMANE --- */}
          <h3 className="text-lg font-bold text-blue-900 border-b border-blue-100 pb-2 mb-4 mt-8">3. Calendario Settimane</h3>
          
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 mb-6 flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="text-xs font-bold text-purple-800 mb-1 block uppercase">Da Data</label>
                <input type="date" className={`${inputClass} border-purple-200 focus:ring-purple-500`} value={formData.data_inizio} onChange={e => setFormData({...formData, data_inizio: e.target.value})} />
              </div>
              <div className="flex-1 w-full">
                <label className="text-xs font-bold text-purple-800 mb-1 block uppercase">A Data</label>
                <input type="date" className={`${inputClass} border-purple-200 focus:ring-purple-500`} value={formData.data_fine} onChange={e => setFormData({...formData, data_fine: e.target.value})} />
              </div>
              <button type="button" onClick={generateAutoWeeks} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm">
                <Wand2 size={18} /> Genera
              </button>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {formData.weeks.map((week, idx) => (
                <div key={idx} className="flex flex-wrap md:flex-nowrap gap-3 items-end bg-white p-4 rounded-xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex-grow min-w-[200px]">
                     <label className="text-xs font-bold text-gray-500 mb-1 block uppercase">Etichetta</label>
                     <input type="text" placeholder="Es. Settimana 1" className={inputClass} value={week.label} onChange={e => updateWeek(idx, 'label', e.target.value)} />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-gray-500 mb-1 block uppercase">Inizio</label>
                     <input type="date" className={inputClass} value={week.data_inizio} onChange={e => updateWeek(idx, 'data_inizio', e.target.value)} />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-gray-500 mb-1 block uppercase">Fine</label>
                     <input type="date" className={inputClass} value={week.data_fine} onChange={e => updateWeek(idx, 'data_fine', e.target.value)} />
                  </div>
                  <button type="button" onClick={() => removeWeek(idx)} className="text-gray-400 hover:text-red-600 p-2.5 mb-0.5 rounded-lg hover:bg-red-50 transition-colors"><Trash2 size={18}/></button>
                </div>
            ))}
            <button type="button" onClick={addWeek} className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:border-cyan-500 hover:text-cyan-600 hover:bg-cyan-50/30 flex justify-center gap-2 items-center transition-all mt-4">
              <Plus size={20}/> Aggiungi Settimana Manualmente
            </button>
          </div>

          <div className="pt-6 border-t border-gray-100 mt-8 flex gap-4 sticky bottom-0 bg-white pb-2 z-10">
            <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">Annulla</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-3.5 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed">
              {isSubmitting ? 'Salvataggio...' : 'Salva Campo'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
