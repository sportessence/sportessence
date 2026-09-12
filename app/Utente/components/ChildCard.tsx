import React, { useState } from 'react';
import { Calendar, AlertTriangle, Edit2, Trash2, ChevronDown, ChevronUp, TrendingUp, Plus } from 'lucide-react';
import { EnrollmentItem } from './EnrollmentItem';
import { Child, Enrollment } from '../../types/iscrizione';

type ChildCardProps = {
  child: Child;
  enrollments: Enrollment[];
  onEdit: (child: Child) => void;
  onDelete: (child: Child) => void;
  onRegister: (childId: string) => void;
};

export const ChildCard: React.FC<ChildCardProps> = ({ child, enrollments, onEdit, onDelete, onRegister }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const activeEnrollments = enrollments || [];
  
  const calculateAge = (birthDate: string) => {
    const diff = Date.now() - new Date(birthDate).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  return (
    <div className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-cyan-200 transition-all shadow-sm bg-white">
      
      {/* Header Bambino */}
      <div className="bg-gradient-to-r from-cyan-50 to-white p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          <div className="flex-1 cursor-pointer group" onClick={() => setIsExpanded(!isExpanded)}>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-bold text-blue-deep group-hover:text-cyan-700 transition-colors">
                  {child.nome} {child.cognome}
              </h3>
              <span className="bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                {calculateAge(child.data_nascita)} anni
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
               <span className="font-mono bg-gray-50 px-1 rounded text-xs">{child.cf}</span>
               {activeEnrollments.length > 0 && (
                  <span className="flex items-center gap-1 text-cyan-700 font-bold bg-cyan-100/50 px-2 py-0.5 rounded-md text-xs">
                     <Calendar size={12}/> {activeEnrollments.length} Iscrizioni
                  </span>
               )}
            </div>
            {child.intolleranze && child.intolleranze.length > 0 && (
                <p className="text-xs text-orange-600 font-bold mt-2 flex items-center gap-1">
                    <AlertTriangle size={12}/> {child.intolleranze.join(", ")}
                </p>
            )}
          </div>

          <div className="flex gap-2 items-center self-end md:self-center">
            <button onClick={() => onRegister(child.id)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all flex items-center gap-2 font-bold text-sm shadow-sm whitespace-nowrap">
               <TrendingUp size={16}/> Nuova iscrizione
            </button>
            <button onClick={() => onEdit(child)} className="p-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors" title="Modifica Dati">
               <Edit2 size={18}/>
            </button>
            <button onClick={() => onDelete(child)} className="p-2 bg-white border border-red-100 text-red-500 rounded-lg hover:bg-red-50 transition-colors" title="Elimina Bambino">
               <Trash2 size={18}/>
            </button>
            <button 
               onClick={() => setIsExpanded(!isExpanded)} 
               className={`p-2 ml-2 transition-colors rounded-full ${isExpanded ? 'bg-cyan-50 text-cyan-600' : 'text-gray-400 hover:bg-gray-50'}`}
            >
               {isExpanded ? <ChevronUp size={24}/> : <ChevronDown size={24}/>}
            </button>
          </div>
        </div>
      </div>

      {/* Body Espandibile */}
      {isExpanded && (
        <div className="p-6 bg-white space-y-4 animate-in slide-in-from-top-4 border-t border-gray-100">
           <h4 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-3 ml-1">Storico Iscrizioni</h4>
           
           {activeEnrollments.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                 <p className="text-sm text-gray-400 italic mb-3">Nessuna iscrizione presente per {child.nome}.</p>
                 <button onClick={() => onRegister(child.id)} className="text-cyan-600 font-bold text-sm hover:underline flex items-center justify-center gap-1 mx-auto">
                    <Plus size={14}/> Iscrivi ora
                 </button>
              </div>
           ) : (
              activeEnrollments.map((enr: any) => (
                 <EnrollmentItem key={enr.id} enrollment={enr} child={child} />
              ))
           )}
        </div>
      )}
    </div>
  );
};
