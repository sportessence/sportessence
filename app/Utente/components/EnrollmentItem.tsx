import React, { useState } from 'react';
import { Calendar, CheckCircle, ChevronDown, FileText } from 'lucide-react';
import BankTransferBox from '../../components/BankTransferBox';
import { Enrollment, Child } from '../../types/iscrizione';

export const EnrollmentItem = ({ enrollment, child }: { enrollment: Enrollment; child: Child }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Calcoli
  const daSaldare = enrollment.prezzo_totale - (enrollment.pagato || 0);
  const isSaldato = daSaldare <= 0;
  
  // Date
  const bookedWeeks = enrollment.enrollment_weeks
     .map(ew => ew.camp_weeks)
     .sort((a, b) => a.data_inizio.localeCompare(b.data_inizio));
  
  const realStart = bookedWeeks[0]?.data_inizio;
  const realEnd = bookedWeeks[bookedWeeks.length - 1]?.data_fine;
  const weeksCount = bookedWeeks.length;

  const formatDate = (d: string) => new Date(d).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });

  return (
    <div className={`border border-gray-200 rounded-xl bg-gray-50/30 overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-md bg-white border-cyan-100' : ''}`}>
      {/* Header Riga */}
      <div 
        className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer hover:bg-gray-50 transition-colors gap-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1">
           <div className="flex items-center gap-3">
              <p className="font-bold text-blue-deep text-lg">{enrollment.camps.nome}</p>
              <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-500 font-medium whitespace-nowrap">
                 {weeksCount} sett.
              </span>
           </div>
           <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
              <Calendar size={14} className="text-cyan-600"/>
              {realStart && realEnd ? `${formatDate(realStart)} - ${formatDate(realEnd)}` : "Date da definire"}
           </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
           {isSaldato ? (
              <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                 <CheckCircle size={12}/> Saldato
              </span>
           ) : (
              <div className="text-right">
                 <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-100 px-3 py-1 rounded-full text-xs font-bold border border-blue-200 mb-1">
                    Confermata
                 </span>
                 <p className="text-xs text-red-600 font-bold">Da saldare: €{daSaldare.toFixed(2)}</p>
              </div>
           )}
           <div className={`transition-transform duration-300 text-gray-400 ${isOpen ? 'rotate-180 text-cyan-600' : ''}`}>
              <ChevronDown size={20}/>
           </div>
        </div>
      </div>

      {/* Body Espandibile */}
      {isOpen && (
        <div className="p-4 pt-0 border-t border-gray-100 bg-white animate-in slide-in-from-top-2">
           <div className="mt-4 flex flex-col md:flex-row gap-4 md:gap-8 text-xs text-gray-400 mb-4 pb-4 border-b border-dashed border-gray-100">
              <span className="flex items-center gap-2">
                  <FileText size={14}/> Ordine <strong>#{enrollment.id.slice(0,8).toUpperCase()}</strong>
              </span>
              <span>Data: {new Date(enrollment.created_at).toLocaleDateString()}</span>
              <span>Totale: €{enrollment.prezzo_totale.toFixed(2)} (Pagato: €{enrollment.pagato.toFixed(2)})</span>
           </div>

           {!isSaldato && (
              <BankTransferBox 
                amount={daSaldare}
                childName={child.nome}
                childSurname={child.cognome}
                childCF={child.cf}
                campName={enrollment.camps.nome}
                reservationId={enrollment.id}
              />
           )}
        </div>
      )}
    </div>
  );
};
