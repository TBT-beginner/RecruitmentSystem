
import React, { useState, useMemo } from 'react';
import { SchoolData, ConfigData } from '../types';
import { Save, Trash2, Plus, MapPin, Search, ArrowUpDown, ArrowUp, ArrowDown, Dumbbell, Users, Sliders, X } from 'lucide-react';

interface MasterDataProps {
  schools: SchoolData[];
  clubs: string[];
  recruiters: string[];
  config: ConfigData;
  onUpdateAll: (schools: SchoolData[], clubs: string[], recruiters: string[], config: ConfigData) => void;
}

type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: string;
  direction: SortDirection;
}

type MasterTab = 'school' | 'club' | 'recruiter' | 'config';

const getNextSchoolCode = (currentSchools: SchoolData[]): string => {
  const codes = currentSchools
    .map(s => parseInt(s.code, 10))
    .filter(n => !isNaN(n));
  const maxId = codes.length > 0 ? Math.max(...codes) : 0;
  return (maxId + 1).toString();
};

const MasterData: React.FC<MasterDataProps> = ({ schools, clubs, recruiters, config, onUpdateAll }) => {
  const [activeTab, setActiveTab] = useState<MasterTab>('school');
  const [searchQuery, setSearchQuery] = useState('');
  const [municipalityFilter, setMunicipalityFilter] = useState('');
  
  // School Entry State
  const [newSchool, setNewSchool] = useState<Partial<SchoolData>>({ municipality: '', name: '' });
  
  // Club Entry State
  const [newClub, setNewClub] = useState('');

  // Recruiter Entry State
  const [newRecruiter, setNewRecruiter] = useState('');
  
  // Config Entry States
  const [newRank, setNewRank] = useState('');
  const [newResult, setNewResult] = useState('');
  const [newProspect, setNewProspect] = useState('');

  // Modal States
  const [isAddingSchool, setIsAddingSchool] = useState(false);
  const [isAddingClub, setIsAddingClub] = useState(false);
  const [isAddingRecruiter, setIsAddingRecruiter] = useState(false);
  
  // Config Modal States
  const [isAddingRank, setIsAddingRank] = useState(false);
  const [isAddingResult, setIsAddingResult] = useState(false);
  const [isAddingProspect, setIsAddingProspect] = useState(false);

  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  
  // Edit state (School)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<keyof SchoolData | null>(null);
  const [editValue, setEditValue] = useState('');

  // Edit state (Club)
  const [editingClubIndex, setEditingClubIndex] = useState<number | null>(null);
  const [editClubValue, setEditClubValue] = useState('');

  // Edit state (Recruiter)
  const [editingRecruiterIndex, setEditingRecruiterIndex] = useState<number | null>(null);
  const [editRecruiterValue, setEditRecruiterValue] = useState('');

  const municipalities = useMemo(() => 
    Array.from(new Set(schools.map(s => s.municipality))).sort(), 
  [schools]);

  const nextSchoolCode = useMemo(() => getNextSchoolCode(schools), [schools]);

  // Handle Tab Change with Sort Reset
  const handleTabChange = (tab: MasterTab) => {
      setActiveTab(tab);
      setSortConfig(null);
      setSearchQuery('');
      setMunicipalityFilter('');
  };

  // --- Handlers ---
  const handleAddSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchool.name || !newSchool.municipality) return;
    const schoolToAdd: SchoolData = {
      code: nextSchoolCode,
      name: newSchool.name,
      municipality: newSchool.municipality,
      principal: '',
      phone: '',
      headTeacher: ''
    };
    onUpdateAll([...schools, schoolToAdd], clubs, recruiters, config);
    setNewSchool({ municipality: newSchool.municipality, name: '' });
    setIsAddingSchool(false);
  };

  const handleDeleteSchool = (code: string) => {
    if (window.confirm('この学校情報を削除してもよろしいですか？')) {
      onUpdateAll(schools.filter(s => s.code !== code), clubs, recruiters, config);
    }
  };

  const handleSort = (key: string) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const startEditingSchool = (school: SchoolData, field: keyof SchoolData) => {
    if (field === 'code') return;
    setEditingId(school.code);
    setEditingField(field);
    setEditValue(school[field] || '');
  };

  const saveEditSchool = () => {
    if (editingId && editingField) {
      const updatedSchools = schools.map(s => 
        s.code === editingId ? { ...s, [editingField]: editValue } : s
      );
      onUpdateAll(updatedSchools, clubs, recruiters, config);
      setEditingId(null);
      setEditingField(null);
    }
  };

  const cancelEditSchool = () => setEditingId(null);

  const handleAddClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClub.trim()) return;
    if (clubs.includes(newClub.trim())) { alert('登録済みです'); return; }
    onUpdateAll(schools, [...clubs, newClub.trim()], recruiters, config);
    setNewClub('');
    setIsAddingClub(false);
  };

  const handleDeleteClub = (clubName: string) => {
    if (window.confirm(`「${clubName}」を削除しますか？`)) {
      onUpdateAll(schools, clubs.filter(c => c !== clubName), recruiters, config);
    }
  };

  const startEditingClub = (index: number, name: string) => {
    setEditingClubIndex(index);
    setEditClubValue(name);
  };

  const saveEditClub = () => {
    if (editingClubIndex !== null) {
        const updated = [...clubs];
        updated[editingClubIndex] = editClubValue;
        onUpdateAll(schools, updated, recruiters, config);
        setEditingClubIndex(null);
    }
  };

  const cancelEditClub = () => setEditingClubIndex(null);

  const handleAddRecruiter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecruiter.trim()) return;
    if (recruiters.includes(newRecruiter.trim())) { alert('登録済みです'); return; }
    onUpdateAll(schools, clubs, [...recruiters, newRecruiter.trim()], config);
    setNewRecruiter('');
    setIsAddingRecruiter(false);
  };

  const handleDeleteRecruiter = (recruiterName: string) => {
    if (window.confirm(`「${recruiterName}」を削除しますか？`)) {
        onUpdateAll(schools, clubs, recruiters.filter(r => r !== recruiterName), config);
    }
  };

  const startEditingRecruiter = (index: number, name: string) => {
    setEditingRecruiterIndex(index);
    setEditRecruiterValue(name);
  };

  const saveEditRecruiter = () => {
    if (editingRecruiterIndex !== null) {
        const updated = [...recruiters];
        updated[editingRecruiterIndex] = editRecruiterValue;
        onUpdateAll(schools, clubs, updated, config);
        setEditingRecruiterIndex(null);
    }
  };

  const cancelEditRecruiter = () => setEditingRecruiterIndex(null);

  const handleConfigUpdate = (type: Exclude<keyof ConfigData, 'recruitmentTarget'>, action: 'add' | 'delete', value: string) => {
      const currentList = config[type];
      let newList = [...currentList];
      if (action === 'add') {
          if (!value.trim() || currentList.includes(value.trim())) return;
          newList.push(value.trim());
      } else {
          if (window.confirm(`「${value}」を削除しますか？`)) {
            newList = newList.filter(v => v !== value);
          } else {
              return;
          }
      }
      onUpdateAll(schools, clubs, recruiters, { ...config, [type]: newList });
  };

  const handleAddConfigItem = (type: 'ranks' | 'results' | 'prospects', e: React.FormEvent) => {
      e.preventDefault();
      let val = '';
      if (type === 'ranks') { val = newRank; setNewRank(''); setIsAddingRank(false); }
      if (type === 'results') { val = newResult; setNewResult(''); setIsAddingResult(false); }
      if (type === 'prospects') { val = newProspect; setNewProspect(''); setIsAddingProspect(false); }
      
      handleConfigUpdate(type, 'add', val);
  };

  const processedSchools = useMemo(() => {
    let result = [...schools];
    if (municipalityFilter) result = result.filter(s => s.municipality === municipalityFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(q) || s.municipality.toLowerCase().includes(q) || (s.principal && s.principal.toLowerCase().includes(q)));
    }
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = (a as any)[sortConfig.key] || '';
        const bValue = (b as any)[sortConfig.key] || '';
        
        // Specific numeric sort for 'code'
        if (sortConfig.key === 'code') {
            const aNum = parseInt(aValue, 10);
            const bNum = parseInt(bValue, 10);
            if (!isNaN(aNum) && !isNaN(bNum)) {
                if (aNum < bNum) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aNum > bNum) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            }
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [schools, municipalityFilter, searchQuery, sortConfig]);

  const processedClubs = useMemo(() => {
    // Map to objects to preserve original index
    const items = clubs.map((name, originalIndex) => ({ name, originalIndex }));
    
    if (sortConfig && sortConfig.key === 'name') {
        items.sort((a, b) => {
            const res = a.name.localeCompare(b.name, 'ja');
            return sortConfig.direction === 'asc' ? res : -res;
        });
    }
    return items;
  }, [clubs, sortConfig]);

  const processedRecruiters = useMemo(() => {
    const items = recruiters.map((name, originalIndex) => ({ name, originalIndex }));
    
    if (sortConfig && sortConfig.key === 'name') {
        items.sort((a, b) => {
            const res = a.name.localeCompare(b.name, 'ja');
            return sortConfig.direction === 'asc' ? res : -res;
        });
    }
    return items;
  }, [recruiters, sortConfig]);

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key) return <ArrowUpDown size={16} className="text-slate-300" />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={16} className="text-blue-600" /> : <ArrowDown size={16} className="text-blue-600" />;
  };

  return (
    <div className="h-full flex flex-col">
        {/* Tabs - Sticky Top */}
        <div className="flex border-b border-slate-200 bg-white px-4 md:px-8 pt-6 gap-4 md:gap-6 overflow-x-auto shrink-0 z-10 sticky top-0">
            {[
                { id: 'school', label: '学校マスタ', icon: MapPin },
                { id: 'club', label: '部活動マスタ', icon: Dumbbell },
                { id: 'recruiter', label: '担当者マスタ', icon: Users },
                { id: 'config', label: '設定マスタ', icon: Sliders }
            ].map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id as MasterTab)}
                    className={`pb-4 px-4 text-lg font-medium transition-colors relative whitespace-nowrap ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <div className="flex items-center gap-2">
                        <tab.icon size={24} />
                        {tab.label}
                    </div>
                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>}
                </button>
            ))}
        </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto bg-slate-50 flex flex-col">
        {activeTab === 'school' && (
            <div className="flex flex-col">
                {/* Header Actions */}
                <div className="flex justify-between items-center p-4 md:p-8 pb-0 md:pb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800">学校情報管理</h2>
                    <button 
                        onClick={() => setIsAddingSchool(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm font-bold"
                    >
                        <Plus size={20} /> 新規学校追加
                    </button>
                </div>

                {/* List */}
                <div className="bg-white border-y border-slate-200 flex-col overflow-visible mt-4">
                    <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-slate-50 sticky top-0 z-20">
                        <h3 className="font-bold text-slate-700 text-lg">登録済み学校一覧 ({processedSchools.length}校)</h3>
                        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center w-full md:w-auto">
                            <select value={municipalityFilter} onChange={e => setMunicipalityFilter(e.target.value)} className="px-3 py-3 border border-slate-300 rounded-lg bg-white w-full md:w-auto"><option value="">すべての地域</option>{municipalities.map(m => <option key={m} value={m}>{m}</option>)}</select>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input type="text" placeholder="検索..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-10 py-3 border border-slate-300 rounded-lg w-full md:w-72" />
                                {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-1"><X size={16} /></button>}
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                    <table className="min-w-full text-base text-left text-slate-600 whitespace-nowrap">
                        <thead className="text-sm text-slate-700 uppercase bg-slate-100">
                        <tr>
                            {[
                            { key: 'code', label: 'コード', width: 'w-24' },
                            { key: 'municipality', label: '市町村', width: 'w-36' },
                            { key: 'name', label: '中学校名', width: 'w-48' },
                            { key: 'principal', label: '学校長名', width: 'w-48' },
                            { key: 'headTeacher', label: '主任・進路', width: 'w-48' },
                            { key: 'phone', label: '電話番号', width: 'w-36' },
                            ].map(({ key, label, width }) => (
                            <th key={key} className={`px-6 py-4 cursor-pointer hover:bg-slate-200 ${width}`} onClick={() => handleSort(key)}>
                                <div className="flex items-center gap-1">{label} {getSortIcon(key)}</div>
                            </th>
                            ))}
                            <th className="px-6 py-4 text-right w-24">操作</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                        {processedSchools.map(school => (
                            <tr key={school.code} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-5 font-mono text-sm text-slate-500 bg-slate-50/50">{school.code}</td>
                            {['municipality', 'name', 'principal', 'headTeacher', 'phone'].map((field) => (
                                <td key={field} className="px-6 py-5 cursor-text relative" onDoubleClick={() => startEditingSchool(school, field as keyof SchoolData)} title="ダブルクリックで編集">
                                {editingId === school.code && editingField === field ? (
                                    <input autoFocus type="text" value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={saveEditSchool} onKeyDown={(e) => { if (e.key === 'Enter') saveEditSchool(); if (e.key === 'Escape') cancelEditSchool(); }} className="absolute inset-0 w-full h-full px-5 py-4 border-2 border-blue-400 focus:outline-none bg-white shadow-lg z-20 rounded-none text-lg" />
                                ) : (
                                    <div className="truncate min-h-[1.5rem]">{school[field as keyof SchoolData] || <span className="text-slate-300 text-sm opacity-0 group-hover:opacity-100">---</span>}</div>
                                )}
                                </td>
                            ))}
                            <td className="px-6 py-5 text-right">
                                <button onClick={() => handleDeleteSchool(school.code)} className="text-slate-300 hover:text-red-600 hover:bg-red-50 p-2 rounded-full"><Trash2 size={20} /></button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'club' && (
            <div className="flex flex-col">
                 <div className="flex justify-between items-center p-4 md:p-8 pb-0 md:pb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800">部活動情報管理</h2>
                    <button 
                        onClick={() => setIsAddingClub(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm font-bold"
                    >
                        <Plus size={20} /> 新規部活動追加
                    </button>
                </div>

                <div className="bg-white border-y border-slate-200 flex-col overflow-visible mt-4">
                    <div className="p-6 border-b border-slate-200 bg-slate-50 sticky top-0 z-20">
                        <h3 className="font-bold text-slate-700 text-lg">登録済み部活動一覧 ({clubs.length}部)</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-base text-left text-slate-600">
                            <thead className="text-sm text-slate-700 uppercase bg-slate-100">
                                <tr>
                                    <th className="px-8 py-4 w-24">No.</th>
                                    <th className="px-8 py-4 cursor-pointer hover:bg-slate-200" onClick={() => handleSort('name')}>
                                        <div className="flex items-center gap-1">部活動名 {getSortIcon('name')}</div>
                                    </th>
                                    <th className="px-8 py-4 text-right w-36">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {processedClubs.map(({name, originalIndex}, index) => (
                                    <tr key={index} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-8 py-5 text-slate-400 font-mono text-sm">{index + 1}</td>
                                        <td className="px-8 py-5 font-medium text-slate-800 cursor-text relative" onDoubleClick={() => startEditingClub(originalIndex, name)}>
                                            {editingClubIndex === originalIndex ? (
                                                <input autoFocus type="text" value={editClubValue} onChange={e => setEditClubValue(e.target.value)} onBlur={saveEditClub} onKeyDown={(e) => { if (e.key === 'Enter') saveEditClub(); if (e.key === 'Escape') cancelEditClub(); }} className="absolute inset-0 w-full h-full px-7 py-4 border-2 border-blue-400 focus:outline-none bg-white shadow-lg z-20 rounded-none text-lg" />
                                            ) : name}
                                        </td>
                                        <td className="px-8 py-5 text-right"><button onClick={() => handleDeleteClub(name)} className="text-slate-300 hover:text-red-600 hover:bg-red-50 p-2 rounded-full"><Trash2 size={20} /></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'recruiter' && (
             <div className="flex flex-col">
                <div className="flex justify-between items-center p-4 md:p-8 pb-0 md:pb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800">担当者情報管理</h2>
                    <button 
                        onClick={() => setIsAddingRecruiter(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm font-bold"
                    >
                        <Plus size={20} /> 新規担当者追加
                    </button>
                </div>

                <div className="bg-white border-y border-slate-200 flex-col overflow-visible mt-4">
                    <div className="p-6 border-b border-slate-200 bg-slate-50 sticky top-0 z-20">
                        <h3 className="font-bold text-slate-700 text-lg">登録済み担当者一覧 ({recruiters.length}名)</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-base text-left text-slate-600">
                            <thead className="text-sm text-slate-700 uppercase bg-slate-100">
                                <tr>
                                    <th className="px-8 py-4 w-24">No.</th>
                                    <th className="px-8 py-4 cursor-pointer hover:bg-slate-200" onClick={() => handleSort('name')}>
                                        <div className="flex items-center gap-1">担当者名 {getSortIcon('name')}</div>
                                    </th>
                                    <th className="px-8 py-4 text-right w-36">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {processedRecruiters.map(({name, originalIndex}, index) => (
                                    <tr key={index} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-8 py-5 text-slate-400 font-mono text-sm">{index + 1}</td>
                                        <td className="px-8 py-5 font-medium text-slate-800 cursor-text relative" onDoubleClick={() => startEditingRecruiter(originalIndex, name)}>
                                            {editingRecruiterIndex === originalIndex ? (
                                                <input autoFocus type="text" value={editRecruiterValue} onChange={e => setEditRecruiterValue(e.target.value)} onBlur={saveEditRecruiter} onKeyDown={(e) => { if (e.key === 'Enter') saveEditRecruiter(); if (e.key === 'Escape') cancelEditRecruiter(); }} className="absolute inset-0 w-full h-full px-7 py-4 border-2 border-blue-400 focus:outline-none bg-white shadow-lg z-20 rounded-none text-lg" />
                                            ) : name}
                                        </td>
                                        <td className="px-8 py-5 text-right"><button onClick={() => handleDeleteRecruiter(name)} className="text-slate-300 hover:text-red-600 hover:bg-red-50 p-2 rounded-full"><Trash2 size={20} /></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}
      
        {activeTab === 'config' && (
             <div className="p-4 md:p-8 flex-1 overflow-visible">
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mb-6 text-sm">
                    <strong>注意:</strong> ここでの設定はアプリケーション全体の自動判定ロジックに影響します。
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Ranks */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
                        <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-700 flex justify-between items-center">
                            <span>奨学生ランク</span>
                            <button onClick={() => setIsAddingRank(true)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Plus size={20}/></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            {config.ranks.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 hover:bg-slate-50 border-b border-slate-100 last:border-0">
                                    <span>{item}</span>
                                    <button onClick={() => handleConfigUpdate('ranks', 'delete', item)} className="text-slate-300 hover:text-red-500"><X size={16}/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Results */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
                        <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-700 flex justify-between items-center">
                            <span>勧誘結果</span>
                            <button onClick={() => setIsAddingResult(true)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Plus size={20}/></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            {config.results.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 hover:bg-slate-50 border-b border-slate-100 last:border-0">
                                    <span>{item}</span>
                                    <button onClick={() => handleConfigUpdate('results', 'delete', item)} className="text-slate-300 hover:text-red-500"><X size={16}/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Prospects */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
                        <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-700 flex justify-between items-center">
                            <span>見込み度</span>
                            <button onClick={() => setIsAddingProspect(true)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Plus size={20}/></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            {config.prospects.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 hover:bg-slate-50 border-b border-slate-100 last:border-0">
                                    <span>{item}</span>
                                    <button onClick={() => handleConfigUpdate('prospects', 'delete', item)} className="text-slate-300 hover:text-red-500"><X size={16}/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
             </div>
        )}
      </div>

      {/* --- Modals --- */}
      
      {/* 1. Add School Modal */}
      {isAddingSchool && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200">
                  <h4 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                      <MapPin size={28} /> 新規学校登録
                  </h4>
                  <form onSubmit={handleAddSchool} className="space-y-6">
                       <div>
                          <label className="block text-sm font-bold text-slate-500 uppercase mb-2">コード (自動採番)</label>
                          <input type="text" value={nextSchoolCode} readOnly className="w-full bg-slate-100 border border-slate-300 rounded-xl p-4 text-lg text-slate-500 cursor-not-allowed font-mono" />
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-slate-500 uppercase mb-2">市町村</label>
                          <input list="municipalities-modal" type="text" value={newSchool.municipality} onChange={e => setNewSchool(prev => ({ ...prev, municipality: e.target.value }))} className="w-full border border-slate-300 rounded-xl p-4 text-lg" placeholder="例: 水戸市" required autoFocus />
                          <datalist id="municipalities-modal">{municipalities.map(m => <option key={m} value={m} />)}</datalist>
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-slate-500 uppercase mb-2">中学校名</label>
                          <input type="text" value={newSchool.name} onChange={e => setNewSchool(prev => ({ ...prev, name: e.target.value }))} className="w-full border border-slate-300 rounded-xl p-4 text-lg" placeholder="例: 水戸一" required />
                       </div>
                       <div className="flex justify-end gap-4 mt-8">
                          <button type="button" onClick={() => setIsAddingSchool(false)} className="px-6 py-3 text-lg text-slate-600 hover:bg-slate-100 rounded-xl">キャンセル</button>
                          <button type="submit" className="px-6 py-3 text-lg bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold flex items-center gap-2"><Save size={20}/> 追加する</button>
                       </div>
                  </form>
              </div>
          </div>
      )}

      {/* 2. Add Club Modal */}
      {isAddingClub && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200">
                  <h4 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                      <Dumbbell size={28} /> 新規部活動登録
                  </h4>
                  <form onSubmit={handleAddClub} className="space-y-6">
                       <div>
                          <label className="block text-sm font-bold text-slate-500 uppercase mb-2">部活動名</label>
                          <input type="text" value={newClub} onChange={e => setNewClub(e.target.value)} className="w-full border border-slate-300 rounded-xl p-4 text-lg" placeholder="例: 陸上競技" required autoFocus />
                       </div>
                       <div className="flex justify-end gap-4 mt-8">
                          <button type="button" onClick={() => setIsAddingClub(false)} className="px-6 py-3 text-lg text-slate-600 hover:bg-slate-100 rounded-xl">キャンセル</button>
                          <button type="submit" className="px-6 py-3 text-lg bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold flex items-center gap-2"><Save size={20}/> 追加する</button>
                       </div>
                  </form>
              </div>
          </div>
      )}

      {/* 3. Add Recruiter Modal */}
      {isAddingRecruiter && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200">
                  <h4 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                      <Users size={28} /> 新規担当者登録
                  </h4>
                  <form onSubmit={handleAddRecruiter} className="space-y-6">
                       <div>
                          <label className="block text-sm font-bold text-slate-500 uppercase mb-2">担当者名</label>
                          <input type="text" value={newRecruiter} onChange={e => setNewRecruiter(e.target.value)} className="w-full border border-slate-300 rounded-xl p-4 text-lg" placeholder="例: 〇〇教頭" required autoFocus />
                       </div>
                       <div className="flex justify-end gap-4 mt-8">
                          <button type="button" onClick={() => setIsAddingRecruiter(false)} className="px-6 py-3 text-lg text-slate-600 hover:bg-slate-100 rounded-xl">キャンセル</button>
                          <button type="submit" className="px-6 py-3 text-lg bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold flex items-center gap-2"><Save size={20}/> 追加する</button>
                       </div>
                  </form>
              </div>
          </div>
      )}

      {/* 4. Config Add Modals */}
      {/* Rank Modal */}
      {isAddingRank && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
                  <h4 className="text-xl font-bold mb-4">奨学生ランク追加</h4>
                  <form onSubmit={(e) => handleAddConfigItem('ranks', e)} className="space-y-4">
                      <input type="text" value={newRank} onChange={e => setNewRank(e.target.value)} className="w-full border p-3 rounded-lg" placeholder="例: S5" autoFocus />
                      <div className="flex justify-end gap-3">
                          <button type="button" onClick={() => setIsAddingRank(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">キャンセル</button>
                          <button type="submit" disabled={!newRank} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">追加</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
      {/* Result Modal */}
      {isAddingResult && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
                  <h4 className="text-xl font-bold mb-4">勧誘結果追加</h4>
                  <form onSubmit={(e) => handleAddConfigItem('results', e)} className="space-y-4">
                      <input type="text" value={newResult} onChange={e => setNewResult(e.target.value)} className="w-full border p-3 rounded-lg" placeholder="例: その他" autoFocus />
                      <div className="flex justify-end gap-3">
                          <button type="button" onClick={() => setIsAddingResult(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">キャンセル</button>
                          <button type="submit" disabled={!newResult} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">追加</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
      {/* Prospect Modal */}
      {isAddingProspect && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
                  <h4 className="text-xl font-bold mb-4">見込み度追加</h4>
                  <form onSubmit={(e) => handleAddConfigItem('prospects', e)} className="space-y-4">
                      <input type="text" value={newProspect} onChange={e => setNewProspect(e.target.value)} className="w-full border p-3 rounded-lg" placeholder="例: △" autoFocus />
                      <div className="flex justify-end gap-3">
                          <button type="button" onClick={() => setIsAddingProspect(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">キャンセル</button>
                          <button type="submit" disabled={!newProspect} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">追加</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

    </div>
  );
};

export default MasterData;
