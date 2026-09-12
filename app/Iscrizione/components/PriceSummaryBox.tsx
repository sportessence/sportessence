import React from 'react';
import { Euro, Users, Loader2, AlertTriangle, ArrowRight, Tag, Info } from 'lucide-react';
import { LocalQuote, CampWeek } from '../../types/iscrizione';

type PriceSummaryBoxProps = {
  selectedChild: string;
  selectedCamp: string;
  calculating: boolean;
  priceQuote: LocalQuote | null;
  weeks: CampWeek[];
  isCastelloCamp: boolean;
  isMuliniCamp: boolean;
  promoCode: string;
  setPromoCode: (code: string) => void;
  isPromoApplied: boolean;
  setIsPromoApplied: (val: boolean) => void;
  applyPromoCode: () => void;
  promoError: string;
  alreadyBilledAmount: number;
  errorMsg: string | null;
  submitting: boolean;
  acceptTerms: boolean;
  setAcceptTerms: (val: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
};

export const PriceSummaryBox: React.FC<PriceSummaryBoxProps> = ({
  selectedChild,
  selectedCamp,
  calculating,
  priceQuote,
  weeks,
  isCastelloCamp,
  isMuliniCamp,
  promoCode,
  setPromoCode,
  isPromoApplied,
  setIsPromoApplied,
  applyPromoCode,
  promoError,
  alreadyBilledAmount,
  errorMsg,
  submitting,
  acceptTerms,
  setAcceptTerms,
  handleSubmit
}) => {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 sticky top-8 flex flex-col h-fit">
      <h3 className="font-bold text-xl text-blue-deep mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
        <Euro size={22} className="text-cyan-600"/> Riepilogo
      </h3>
      
      {!selectedChild || !selectedCamp ? (
        <div className="text-center py-10 text-gray-400">
          <Users size={48} className="mx-auto mb-3 opacity-20"/>
          <p className="text-sm">Seleziona bambino e campo.</p>
        </div>
      ) : calculating ? (
        <div className="flex flex-col items-center justify-center py-12 text-cyan-600">
          <Loader2 className="animate-spin mb-2" size={32}/> 
          <span className="text-sm font-medium">Calcolo...</span>
        </div>
      ) : priceQuote ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
            {priceQuote.details.map((d:any) => {
              const weekObj = weeks.find(w => w.id === d.week_id);
              const showDiscount = d.is_full && d.price < d.originalPrice;
              
              return (
                <div key={d.week_id} className="flex justify-between items-start text-sm p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-full">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-700 block mb-1">{weekObj?.label}</span>
                      {showDiscount && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold h-fit">
                          {d.discountReason || "Sconto serie settimane"}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-0.5 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        {showDiscount && (
                          <span className="line-through text-gray-400">€{d.originalPrice}</span>
                        )}
                        <span className="font-bold text-gray-800">
                          €{d.price} {d.is_full ? "" : "(Mezza)"}
                        </span>
                      </div>
                      {d.extraPrice > 0 && <div className="text-cyan-700 font-medium">+ €{d.extraPrice} ({d.prePost === 'BOTH' ? 'Pre+Post' : d.prePost})</div>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-dashed border-gray-200"></div>

          {(isCastelloCamp || isMuliniCamp) && (
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
              <label className="text-xs font-bold text-purple-900 mb-1 flex items-center gap-1"><Tag size={12}/> Codice Sconto Fedeltà</label>
              <div className="flex gap-2">
                <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Inserisci codice" className="text-black w-full text-sm p-2 rounded border border-purple-200 outline-none uppercase" disabled={isPromoApplied} />
                {isPromoApplied ? <button onClick={() => { setIsPromoApplied(false); setPromoCode(""); }} className="bg-red-100 text-red-600 px-3 rounded font-bold text-xs hover:bg-red-200">X</button> : <button onClick={applyPromoCode} className="bg-purple-600 text-white px-3 rounded font-bold text-xs hover:bg-purple-700">Applica</button>}
              </div>
              {promoError && <p className="text-xs text-red-500 mt-1 font-bold">{promoError}</p>}
              {isPromoApplied && <p className="text-xs text-green-600 mt-1 font-bold">Sconto applicato!</p>}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between items-center text-gray-600 text-sm font-medium"><span>Totale Settimane (Cumulativo)</span><span>€{priceQuote.tuition.toFixed(2)}</span></div>
            <div className="flex justify-between items-center text-gray-600 text-sm font-medium"><span>Extra (Pre/Post)</span><span>€{priceQuote.extras.toFixed(2)}</span></div>
            <div className="flex justify-between items-center text-gray-800 text-sm font-bold">
              <span>Quota Iscrizione</span>
              <span>+ €{priceQuote.registrationFee.toFixed(2)}</span>
            </div>
            {priceQuote.discountSibling > 0 && <div className="flex justify-between items-center text-green-600 text-sm font-bold"><span>Sconto Fratelli</span><span>- €{priceQuote.discountSibling.toFixed(2)}</span></div>}
            {priceQuote.discountPromo > 0 && <div className="flex justify-between items-center text-purple-600 text-sm font-bold"><span>Sconto Codice</span><span>- €{priceQuote.discountPromo.toFixed(2)}</span></div>}
            {alreadyBilledAmount > 0 && <div className="flex justify-between items-center text-cyan-700 text-sm font-medium"><span>Già Fatturato</span><span>- €{alreadyBilledAmount.toFixed(2)}</span></div>}
            
            <div className="border-b border-gray-100 my-1"></div>
            <div className="bg-blue-600 p-5 rounded-2xl flex justify-between items-center shadow-lg shadow-blue-200 mt-2">
              <div className="text-white"><p className="text-xs uppercase tracking-wider opacity-80 mb-0.5">Da Saldare Ora</p><p className="text-xs opacity-70">(Bonifico)</p></div>
              <span className="text-3xl font-extrabold text-white">€{priceQuote.total.toFixed(2)}</span>
            </div>

            {errorMsg && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs flex gap-2 border border-red-100"><AlertTriangle size={14}/> {errorMsg}</div>}

            <button 
              onClick={handleSubmit} 
              disabled={submitting || priceQuote.total < 0 || !acceptTerms} 
              className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg flex justify-center items-center gap-2 group ${
                (submitting || priceQuote.total < 0 || !acceptTerms) 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none" 
                : "bg-cyan-600 text-white hover:bg-cyan-700 hover:shadow-cyan-200/50"
              }`}
            >
              {submitting ? <><Loader2 className="animate-spin" size={20}/> Elaborazione...</> : <>Conferma Iscrizione <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/></>}
            </button>

            <div className="mt-4 flex justify-center">
              <label className="flex items-start gap-2 cursor-pointer opacity-90 hover:opacity-100 transition-opacity select-none">
                 <input 
                   type="checkbox" 
                   checked={acceptTerms}
                   onChange={(e) => setAcceptTerms(e.target.checked)}
                   className="mt-0.5 accent-cyan-600 w-4 h-4 cursor-pointer"
                 />
                 <span className="text-xs text-gray-600 leading-tight">
                   Dichiaro di aver letto e di accettare il <a href="/regolamentoSportEssence.pdf" target="_blank" rel="noopener noreferrer" className="text-cyan-700 font-bold hover:underline" onClick={(e) => e.stopPropagation()}>Regolamento del camp</a>.
                 </span>
              </label>
            </div>

          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400 flex flex-col items-center"><Info size={32} className="mb-2 opacity-30"/><p className="text-sm">Seleziona settimane.</p></div>
      )}
    </div>
  );
};
