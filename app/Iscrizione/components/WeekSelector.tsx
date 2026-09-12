import React from 'react';
import { Clock, CheckCircle, X } from 'lucide-react';
import { CampWeek } from '../../types/iscrizione';

type WeekSelectorProps = {
  weeks: CampWeek[];
  weekSelections: Record<string, { selected: boolean, type: 'FULL' | 'HALF', prePost: 'NONE' | 'PRE' | 'POST' | 'BOTH' }>;
  isWeekBooked: (wid: string) => boolean;
  toggleWeek: (weekId: string) => void;
  updateWeekConfig: (weekId: string, field: 'type' | 'prePost', value: string) => void;
};

export const WeekSelector: React.FC<WeekSelectorProps> = ({
  weeks,
  weekSelections,
  isWeekBooked,
  toggleWeek,
  updateWeekConfig
}) => {
  const formatDateRange = (start: string, end: string) => {
    const s = new Date(start).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
    const e = new Date(end).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
    return `${s} - ${e}`;
  };

  return (
    <div className="space-y-4">
      {weeks.map(week => {
        const today = new Date(); 
        today.setHours(0,0,0,0);
        const weekStartDate = new Date(week.data_inizio);
        const isAlreadyBooked = isWeekBooked(week.id); 
        const isPast = weekStartDate < today;
        const isDisabled = isAlreadyBooked || isPast;
        const isSel = isDisabled ? false : !!weekSelections[week.id]?.selected;

        return (
          <div key={week.id} className={`p-5 rounded-2xl border-2 transition-all duration-300 ${isDisabled ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed' : isSel ? 'border-cyan-500 bg-cyan-50/30 shadow-md transform scale-[1.01]' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <label className={`flex items-center gap-4 flex-grow ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer select-none'}`}>
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${isAlreadyBooked ? 'bg-green-100 border-green-200' : isPast ? 'bg-gray-200 border-gray-300' : isSel ? 'bg-cyan-500 border-cyan-500' : 'border-gray-300 bg-white'}`}>
                  {isAlreadyBooked && <CheckCircle size={16} className="text-green-600"/>}
                  {isPast && <X size={16} className="text-gray-400"/>}
                  {isSel && !isDisabled && <CheckCircle size={16} className="text-white"/>}
                </div>
                <input type="checkbox" className="hidden" checked={isSel || isAlreadyBooked} disabled={isDisabled} onChange={() => !isDisabled && toggleWeek(week.id)} />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`font-bold text-lg ${isDisabled ? 'text-gray-500' : isSel ? 'text-cyan-900' : 'text-gray-700'}`}>{week.label}</p>
                    {isAlreadyBooked && <span className="text-[10px] uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Già Iscritto</span>}
                    {isPast && <span className="text-[10px] uppercase bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-bold">Conclusa</span>}
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-2"><Clock size={14}/>{formatDateRange(week.data_inizio, week.data_fine)}</p>
                </div>
              </label>
              
              {isSel && !isDisabled && (
                <div className="flex flex-col sm:flex-row gap-3 animate-in fade-in zoom-in-95 duration-300">
                  <select className="text-sm border border-cyan-200 rounded-lg p-2.5 bg-white text-gray-700 outline-none" value={weekSelections[week.id].type} onChange={(e:any) => updateWeekConfig(week.id, 'type', e.target.value)}>
                    <option value="FULL">Giornata Intera</option>
                    <option value="HALF">Mezza Giornata</option>
                  </select>
                  <select className="text-sm border border-cyan-200 rounded-lg p-2.5 bg-white text-gray-700 outline-none" value={weekSelections[week.id].prePost} onChange={(e:any) => updateWeekConfig(week.id, 'prePost', e.target.value)}>
                    <option value="NONE">No Extra</option>
                    <option value="PRE">Solo Pre</option>
                    <option value="POST">Solo Post</option>
                    <option value="BOTH">Pre + Post</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
