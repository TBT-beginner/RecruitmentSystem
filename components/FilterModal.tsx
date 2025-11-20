import React, { useState, useMemo, useEffect } from 'react';
import { SchoolData } from '../types';
import { X, Check, Filter, RotateCcw } from 'lucide-react';

export interface FilterState {
  municipalities: string[];
  schoolNames: string[];
  clubNames: string[];
  recruiterTypes: string[];
  actions: string[];
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  currentFilters: FilterState;
  schools: SchoolData[];
  clubs: string[];
  recruiters: string[];
  actions?: string[]; // Optional for StudentList
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  currentFilters,
  schools,
  clubs,
  recruiters,
  actions
}) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters);

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(currentFilters);
    }
  }, [isOpen, currentFilters]);

  // --- Sorting Logic ---
  
  // 1. Sort Schools by Code
  const sortedSchools = useMemo(() => {
    return [...schools].sort((a, b) => {
      const codeA = parseInt(a.code, 10) || 99999;
      const codeB = parseInt(b.code, 10) || 99999;
      return codeA - codeB;
    });
  }, [schools]);

  // 2. Sort Municipalities by min School Code in that municipality
  const sortedMunicipalities = useMemo(() => {
    const muniMap = new Map<string, number>();
    schools.forEach(s => {
      const code = parseInt(s.code, 10) || 99999;
      const currentMin = muniMap.get(s.municipality) || 99999;
      if (code < currentMin) {
        muniMap.set(s.municipality, code);
      }
    });

    return Array.from(muniMap.keys()).sort((a, b) => {
      return (muniMap.get(a) || 99999) - (muniMap.get(b) || 99999);
    });
  }, [schools]);

  // --- Handlers ---

  const toggleFilter = (category: keyof FilterState, value: string) => {
    setLocalFilters(prev => {
      const list = prev[category];
      if (list.includes(value)) {
        return { ...prev, [category]: list.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...list, value] };
      }
    });
  };

  const toggleAll = (category: keyof FilterState, allValues: string[]) => {
    setLocalFilters(prev => {
      const currentList = prev[category];
      // If all currently selected, deselect all. Otherwise select all.
      const isAllSelected = allValues.every(v => currentList.includes(v));
      
      if (isAllSelected) {
        return { ...prev, [category]: [] };
      } else {
        // Select all provided values (merge with existing just in case, though usually we replace)
        return { ...prev, [category]: allValues };
      }
    });
  };

  const clearAll = () => {
    setLocalFilters({
      municipalities: [],
      schoolNames: [],
      clubNames: [],
      recruiterTypes: [],
      actions: []
    });
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl shrink-0">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Filter size={24} className="text-blue-600" />
            絞り込み条件設定
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2">
            <X size={28} />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8">
          
          {/* Actions (Optional) */}
          {actions && actions.length > 0 && (
            <FilterSection 
              title="次対応・アクション" 
              items={actions} 
              selected={localFilters.actions} 
              onToggle={(val) => toggleFilter('actions', val)}
              onToggleAll={() => toggleAll('actions', actions)}
            />
          )}

          {/* Municipalities */}
          <FilterSection 
            title="自治体 (学校コード順)" 
            items={sortedMunicipalities} 
            selected={localFilters.municipalities} 
            onToggle={(val) => toggleFilter('municipalities', val)}
            onToggleAll={() => toggleAll('municipalities', sortedMunicipalities)}
          />

          {/* Schools */}
          <FilterSection 
            title="中学校 (コード順)" 
            items={sortedSchools.map(s => s.name)} 
            selected={localFilters.schoolNames} 
            onToggle={(val) => toggleFilter('schoolNames', val)}
            onToggleAll={() => toggleAll('schoolNames', sortedSchools.map(s => s.name))}
            cols={3}
          />

          {/* Clubs */}
          <FilterSection 
            title="部活動" 
            items={clubs} 
            selected={localFilters.clubNames} 
            onToggle={(val) => toggleFilter('clubNames', val)}
            onToggleAll={() => toggleAll('clubNames', clubs)}
          />

          {/* Recruiters */}
          <FilterSection 
            title="担当者" 
            items={recruiters} 
            selected={localFilters.recruiterTypes} 
            onToggle={(val) => toggleFilter('recruiterTypes', val)}
            onToggleAll={() => toggleAll('recruiterTypes', recruiters)}
          />

        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-between items-center shrink-0">
          <button 
            onClick={clearAll}
            className="text-slate-500 hover:text-red-600 flex items-center gap-2 px-4 py-2 rounded hover:bg-red-50 transition-colors font-medium"
          >
            <RotateCcw size={18} />
            条件をクリア
          </button>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 font-medium"
            >
              キャンセル
            </button>
            <button 
              onClick={handleApply}
              className="px-8 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-md flex items-center gap-2"
            >
              <Check size={20} />
              この条件で絞り込む
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for each section
const FilterSection: React.FC<{
  title: string;
  items: string[];
  selected: string[];
  onToggle: (value: string) => void;
  onToggleAll: () => void;
  cols?: number;
}> = ({ title, items, selected, onToggle, onToggleAll, cols = 4 }) => {
  const isAllSelected = items.length > 0 && items.every(i => selected.includes(i));
  const isPartialSelected = items.some(i => selected.includes(i)) && !isAllSelected;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end border-b border-slate-100 pb-2">
        <h4 className="font-bold text-slate-700 text-lg">{title}</h4>
        <button 
          onClick={onToggleAll}
          className="text-sm text-blue-600 hover:bg-blue-50 px-2 py-1 rounded font-medium"
        >
          {isAllSelected ? '全解除' : '全選択'}
        </button>
      </div>
      <div className={`grid grid-cols-2 md:grid-cols-${cols} gap-2`}>
        {items.map(item => {
           const isSelected = selected.includes(item);
           return (
            <label 
              key={item} 
              className={`
                flex items-center gap-2 p-2 rounded cursor-pointer border transition-all select-none
                ${isSelected ? 'bg-blue-50 border-blue-300 text-blue-800' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}
              `}
            >
              <div className={`
                w-5 h-5 rounded border flex items-center justify-center flex-shrink-0
                ${isSelected ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-300'}
              `}>
                {isSelected && <Check size={14} className="text-white" />}
              </div>
              <span className="text-sm truncate" title={item}>{item}</span>
            </label>
           );
        })}
        {items.length === 0 && <div className="text-slate-400 text-sm col-span-full">項目がありません</div>}
      </div>
    </div>
  );
};

export default FilterModal;