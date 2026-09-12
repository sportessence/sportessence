import React from 'react';
import { Edit2, Trash2, MapPin, CheckCircle, XCircle, FileText, Euro, Clock } from 'lucide-react';

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
};

export const CampCard = ({ camp, onEdit, onDelete }: { camp: any, onEdit: (camp: any) => void, onDelete: (id: string) => void }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      
      {/* HEADER CARD */}
      <div className="bg-blue-50/50 p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-blue-deep">{camp.nome}</h2>
            {camp.attivo ? (
              <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold flex items-center gap-1 border border-green-200">
                <CheckCircle size={12}/> Attivo
              </span>
            ) : (
              <span className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full font-bold flex items-center gap-1 border border-red-200">
                <XCircle size={12}/> Disattivo
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span className="flex items-center gap-1"><MapPin size={16} className="text-cyan-600"/> {camp.indirizzo_paese} ({camp.indirizzo_provincia})</span>
            <span className="flex items-center gap-1"><Clock size={16} className="text-cyan-600"/> {camp.camp_weeks?.length || 0} Settimane</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => onEdit(camp)} className="px-4 py-2 bg-white border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold flex items-center gap-2 transition-colors">
            <Edit2 size={16}/> Modifica
          </button>
          <button onClick={() => onDelete(camp.id)} className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-semibold flex items-center gap-2 transition-colors">
            <Trash2 size={16}/> Elimina
          </button>
        </div>
      </div>

      {/* BODY CARD */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* COLONNA SX */}
        <div className="space-y-6">
          {/* Info Generali */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2"><FileText size={14}/> Dettagli</h3>
            <p className="text-sm text-gray-800 mb-1">
              <strong>Indirizzo:</strong> {camp.indirizzo_via} {camp.indirizzo_civico}, {camp.indirizzo_cap} {camp.indirizzo_paese}
            </p>
            <p className="text-sm text-gray-600 italic line-clamp-2">
              {camp.descrizione || "Nessuna descrizione."}
            </p>
          </div>

          {/* Prezzi Extra e Sconto Fratelli Aggiornato */}
          <div className="bg-cyan-50/30 rounded-xl text-gray-600 p-4 border border-cyan-100">
            <h3 className="text-xs font-bold text-cyan-700 uppercase mb-3 flex items-center gap-2"><Euro size={14}/> Extra & Promo</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
              <div className="flex justify-between border-b border-cyan-100 pb-1 mr-2"><span>Mezza Giornata:</span> <strong>€{camp.price_half_day}</strong></div>
              <div className="flex justify-between border-b border-cyan-100 pb-1"><span>Pre:</span> <strong>€{camp.price_pre}</strong></div>
              <div className="flex justify-between border-b border-cyan-100 pb-1 mr-2"><span>Post:</span> <strong>€{camp.price_post}</strong></div>
              <div className="flex justify-between border-b border-cyan-100 pb-1"><span>Bundle:</span> <strong>€{camp.price_pre_post_bundle}</strong></div>
            </div>
            
            <div className="mt-4 pt-2 border-t border-cyan-200 space-y-1">
                <div className="flex justify-between text-sm text-purple-700">
                   <span>Sconto Fratelli:</span>
                   <span className="font-bold">
                     {camp.sibling_discount_week_price > 0 ? (
                        `Prezzo fisso: €${camp.sibling_discount_week_price}/sett`
                     ) : (
                        camp.sibling_discount_value <= 1 && camp.sibling_discount_value > 0
                          ? `-${(camp.sibling_discount_value * 100).toFixed(0)}%` 
                          : camp.sibling_discount_value > 1 
                            ? `-€${camp.sibling_discount_value}`
                            : 'Nessuno'
                     )}
                   </span>
                </div>
             </div>
          </div>
        </div>

        {/* COLONNA DX: Tabelle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Tabella Scaglioni */}
          <div className="border border-gray-200 rounded-xl overflow-hidden flex flex-col h-fit">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
              <h3 className="text-xs font-bold text-gray-700 uppercase">Listino Full</h3>
            </div>
            <div className="overflow-y-auto max-h-48">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs">
                  <tr>
                    <th className="px-3 py-2">Settimane</th>
                    <th className="px-3 py-2 text-right">Prezzo</th>
                    <th className="px-3 py-2 text-right">Sconto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {camp.camp_pricing_tiers?.sort((a:any,b:any) => a.min_weeks - b.min_weeks).map((tier: any) => (
                    <tr key={tier.id}>
                      <td className="px-3 py-2 text-gray-700">Min. {tier.min_weeks}</td>
                      <td className="px-3 py-2 text-right font-bold text-blue-600">€{tier.price_per_week}</td>
                      <td className="px-3 py-2 text-right text-green-600 font-bold">{tier.discount_percent > 0 ? `-${tier.discount_percent}%` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabella Settimane */}
          <div className="border border-gray-200 text-gray-700 rounded-xl overflow-hidden flex flex-col h-64">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xs font-bold text-gray-700 uppercase">Calendario</h3>
              <span className="text-[10px] bg-white px-2 rounded border border-gray-300">{camp.camp_weeks?.length || 0} sett.</span>
            </div>
            <div className="overflow-y-auto flex-1 bg-white">
              <ul className="divide-y divide-gray-50">
                {camp.camp_weeks?.sort((a:any,b:any) => a.data_inizio.localeCompare(b.data_inizio)).map((week:any) => (
                  <li key={week.id} className="px-4 py-2.5 hover:bg-gray-50">
                     <p className="text-xs font-bold text-blue-deep mb-0.5">{week.label}</p>
                     <p className="text-[11px] text-gray-500">
                       {formatDate(week.data_inizio)} - {formatDate(week.data_fine)}
                     </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
