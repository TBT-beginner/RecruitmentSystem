
import React, { useState, useMemo } from 'react';
import { SchoolData, ConfigData } from '../types';
import { Save, Trash2, Plus, MapPin, Search, ArrowUpDown, ArrowUp, ArrowDown, Filter, X, Dumbbell, Users, Sliders } from 'lucide-react';

interface MasterDataProps {
  schools: SchoolData[];
  clubs: string[];
  recruiters: string[];
  config: ConfigData;
  onUpdateAll: (schools: SchoolData[], clubs: string[], recruiters: string[], config: ConfigData) => void;
}

type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: keyof SchoolData;
  direction: SortDirection;
}

type MasterTab = 'school' | 'club' | 'recruiter' | 'config';

// Helper function to generate next school code
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

  // Get unique municipalities for filter/add
  const municipalities = useMemo(() => 
    Array.from(new Set(schools.map(s => s.municipality))).sort(), 
  [schools]);

  // Calculate next school code
  const nextSchoolCode = useMemo(() => getNextSchoolCode(schools), [schools]);

  // --- School Handlers ---
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
    alert(`学校を追加しました (コード: ${schoolToAdd.code})`);
  };

  const handleDeleteSchool = (code: string) => {
    if (window.confirm('この学校情報を削除してもよろしいですか？（この学校に紐づく生徒データがある場合、表示に影響が出る可能性があります）')) {
      onUpdateAll(schools.filter(s => s.code !== code), clubs, recruiters, config);
    }
  };

  const handleSort = (key: keyof SchoolData) => {
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

  const cancelEditSchool = () => {
    setEditingId(null);
    setEditingField(null);
  };

  // --- Club Handlers ---
  const handleAddClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClub.trim()) return;
    if (clubs.includes(newClub.trim())) {
        alert('この部活動は既に登録されています。');
        return;
    }
    onUpdateAll(schools, [...clubs, newClub.trim()], recruiters, config);
    setNewClub('');
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

  const cancelEditClub = () => {
    setEditingClubIndex(null);
  };

  // --- Recruiter Handlers ---
  const handleAddRecruiter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecruiter.trim()) return;
    if (recruiters.includes(newRecruiter.trim())) {
        alert('この担当者は既に登録されています。');
        return;
    }
    onUpdateAll(schools, clubs, [...recruiters, newRecruiter.trim()], config);
    setNewRecruiter('');
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

  const cancelEditRecruiter = () => {
    setEditingRecruiterIndex(null);
  };

  // --- Config Handlers ---
  const handleConfigUpdate = (type: Exclude<keyof ConfigData, 'recruitmentTarget'>, action: 'add' | 'delete', value: string) => {
      const currentList = config[type];
      let newList = [...currentList];
      if (action === 'add') {
          if (!value.trim() || currentList.includes(value.trim())) return;
          newList.push(value.trim());
      } else {
          if (window.confirm(`「${value}」を削除しますか？使用中のデータがある場合、表示がおかしくなる可能性があります。`)) {
            newList = newList.filter(v => v !== value);
          } else {
              return;
          }
      }
      onUpdateAll(schools, clubs, recruiters, { ...config, [type]: newList });
  };


  // --- School Processing ---
  const processedSchools = useMemo(() => {
    let result = [...schools];
    if (municipalityFilter) {
      result = result.filter(s => s.municipality === municipalityFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.municipality.toLowerCase().includes(q) ||
        (s.principal && s.principal.toLowerCase().includes(q))
      );
    }
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [schools, municipalityFilter, searchQuery, sortConfig]);

  const getSortIcon = (key: keyof SchoolData) => {
    if (sortConfig?.key !== key) return <ArrowUpDown size={16} className="text-slate-300" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={16} className="text-blue-600" /> 
      : <ArrowDown size={16} className="text-blue-600" />;
  };

  return (
    <div className="h-full flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-4 md:px-8 pt-6 gap-4 md:gap-6 overflow-x-auto shrink-0">
            <button 
                onClick={() => setActiveTab('school')}
                className={`pb-4 px-4 text-lg font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === 'school' 
                    ? 'text-blue-600' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                <div className="flex items-center gap-2">
                    <MapPin size={24} />
                    学校マスタ
                </div>
                {activeTab === 'school' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>}
            </button>
            <button 
                onClick={() => setActiveTab('club')}
                className={`pb-4 px-4 text-lg font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === 'club' 
                    ? 'text-blue-600' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                <div className="flex items-center gap-2">
                    <Dumbbell size={24} />
                    部活動マスタ
                </div>
                 {activeTab === 'club' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>}
            </button>
            <button 
                onClick={() => setActiveTab('recruiter')}
                className={`pb-4 px-4 text-lg font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === 'recruiter' 
                    ? 'text-blue-600' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                <div className="flex items-center gap-2">
                    <Users size={24} />
                    担当者マスタ
                </div>
                 {activeTab === 'recruiter' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>}
            </button>
             <button 
                onClick={() => setActiveTab('config')}
                className={`pb-4 px-4 text-lg font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === 'config' 
                    ? 'text-blue-600' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                <div className="flex items-center gap-2">
                    <Sliders size={24} />
                    設定マスタ
                </div>
                 {activeTab === 'config' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>}
            </button>
        </div>

      <div className="flex-1 p-4 md:p-8 flex flex-col gap-6 md:gap-8 overflow-y-auto">
      {activeTab === 'school' && (
        <>
            {/* Add School Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-shrink-0">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                <Plus size={24} className="text-blue-600" />
                学校マスタ新規追加
                </h2>
                <form onSubmit={handleAddSchool} className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-end">
                <div className="w-full md:w-32">
                    <label className="block text-base font-medium text-slate-700 mb-2">コード</label>
                    <input 
                    type="text" 
                    value={nextSchoolCode}
                    readOnly
                    className="w-full bg-slate-100 border border-slate-300 rounded-lg p-3 text-lg text-slate-500 cursor-not-allowed font-mono"
                    title="自動採番されます"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-base font-medium text-slate-700 mb-2">市町村</label>
                    <input 
                    list="municipalities" 
                    type="text" 
                    value={newSchool.municipality}
                    onChange={e => setNewSchool(prev => ({ ...prev, municipality: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg p-3 text-lg"
                    placeholder="例: 水戸市"
                    required
                    />
                    <datalist id="municipalities">
                    {municipalities.map(m => <option key={m} value={m} />)}
                    </datalist>
                </div>
                <div className="flex-1">
                    <label className="block text-base font-medium text-slate-700 mb-2">中学校名</label>
                    <input 
                    type="text" 
                    value={newSchool.name}
                    onChange={e => setNewSchool(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg p-3 text-lg"
                    placeholder="例: 水戸一"
                    required
                    />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-3 font-medium shadow-sm text-lg w-full md:w-auto">
                    <Save size={24} />
                    追加
                </button>
                </form>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-col overflow-visible">
                {/* Toolbar */}
                <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-slate-50 sticky top-0 z-20">
                <h3 className="font-bold text-slate-700 flex items-center gap-3 text-lg">
                    登録済み学校一覧 ({processedSchools.length}校)
                </h3>
                
                <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center w-full md:w-auto">
                    <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <select
                        value={municipalityFilter}
                        onChange={e => setMunicipalityFilter(e.target.value)}
                        className="pl-10 pr-10 py-3 border border-slate-300 rounded-lg text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white appearance-none cursor-pointer w-full md:w-auto"
                    >
                        <option value="">すべての地域</option>
                        {municipalities.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    </div>

                    <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="検索..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-10 pr-10 py-3 border border-slate-300 rounded-lg text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-400 w-full md:w-72"
                    />
                    {searchQuery && (
                        <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                        >
                        <X size={16} />
                        </button>
                    )}
                    </div>
                </div>
                </div>
                
                {/* Data Table */}
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
                        <th 
                            key={key} 
                            className={`px-6 py-4 cursor-pointer hover:bg-slate-200 transition-colors ${width} select-none`}
                            onClick={() => handleSort(key as keyof SchoolData)}
                        >
                            <div className="flex items-center gap-1">
                            {label}
                            {getSortIcon(key as keyof SchoolData)}
                            </div>
                        </th>
                        ))}
                        <th className="px-6 py-4 text-right w-24">操作</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                    {processedSchools.map(school => (
                        <tr key={school.code} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-5 font-mono text-sm text-slate-500 bg-slate-50/50">
                            {school.code}
                        </td>
                        
                        {['municipality', 'name', 'principal', 'headTeacher', 'phone'].map((field) => (
                            <td 
                            key={field} 
                            className="px-6 py-5 cursor-text relative"
                            onDoubleClick={() => startEditingSchool(school, field as keyof SchoolData)}
                            title="ダブルクリックで編集"
                            >
                            {editingId === school.code && editingField === field ? (
                                <input
                                autoFocus
                                type="text"
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                                onBlur={saveEditSchool}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') saveEditSchool();
                                    if (e.key === 'Escape') cancelEditSchool();
                                }}
                                className="absolute inset-0 w-full h-full px-5 py-4 border-2 border-blue-400 focus:outline-none bg-white shadow-lg z-20 rounded-none text-lg"
                                />
                            ) : (
                                <div className="truncate min-h-[1.5rem]">
                                {school[field as keyof SchoolData] ? (
                                    school[field as keyof SchoolData]
                                ) : (
                                    <span className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity">---</span>
                                )}
                                </div>
                            )}
                            </td>
                        ))}

                        <td className="px-6 py-5 text-right">
                            <button 
                            onClick={() => handleDeleteSchool(school.code)}
                            className="text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors p-2 rounded-full"
                            title="削除"
                            >
                            <Trash2 size={20} />
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
                 <div className="p-3 border-t border-slate-200 bg-slate-50 text-sm text-slate-500 text-center">
                    リストの項目をダブルクリックすると編集できます（コード以外）
                 </div>
            </div>
        </>
      )}

      {activeTab === 'club' && (
        <>
            {/* Add Club Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-shrink-0">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                <Plus size={24} className="text-blue-600" />
                部活動マスタ新規追加
                </h2>
                <form onSubmit={handleAddClub} className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-end">
                <div className="flex-1 max-w-md">
                    <label className="block text-base font-medium text-slate-700 mb-2">部活動名</label>
                    <input 
                    type="text" 
                    value={newClub}
                    onChange={e => setNewClub(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-3 text-lg"
                    placeholder="例: 陸上競技"
                    required
                    />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-3 font-medium shadow-sm text-lg w-full md:w-auto">
                    <Save size={24} />
                    追加
                </button>
                </form>
            </div>

            {/* Club List */}
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-col overflow-visible">
                <div className="p-6 border-b border-slate-200 bg-slate-50">
                     <h3 className="font-bold text-slate-700 flex items-center gap-3 text-lg">
                        登録済み部活動一覧 ({clubs.length}部)
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-base text-left text-slate-600">
                        <thead className="text-sm text-slate-700 uppercase bg-slate-100">
                            <tr>
                                <th className="px-8 py-4 w-24">No.</th>
                                <th className="px-8 py-4">部活動名</th>
                                <th className="px-8 py-4 text-right w-36">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {clubs.map((club, index) => (
                                <tr key={index} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-8 py-5 text-slate-400 font-mono text-sm">{index + 1}</td>
                                    <td 
                                        className="px-8 py-5 font-medium text-slate-800 cursor-text relative"
                                        onDoubleClick={() => startEditingClub(index, club)}
                                        title="ダブルクリックで編集"
                                    >
                                         {editingClubIndex === index ? (
                                            <input
                                            autoFocus
                                            type="text"
                                            value={editClubValue}
                                            onChange={e => setEditClubValue(e.target.value)}
                                            onBlur={saveEditClub}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') saveEditClub();
                                                if (e.key === 'Escape') cancelEditClub();
                                            }}
                                            className="absolute inset-0 w-full h-full px-7 py-4 border-2 border-blue-400 focus:outline-none bg-white shadow-lg z-20 rounded-none text-lg"
                                            />
                                        ) : club}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                         <button 
                                            onClick={() => handleDeleteClub(club)}
                                            className="text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors p-2 rounded-full"
                                            title="削除"
                                            >
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <div className="p-3 border-t border-slate-200 bg-slate-50 text-sm text-slate-500 text-center">
                    リストの項目をダブルクリックすると編集できます
                 </div>
             </div>
        </>
      )}

      {activeTab === 'recruiter' && (
        <>
             {/* Add Recruiter Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-shrink-0">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                <Plus size={24} className="text-blue-600" />
                担当者マスタ新規追加
                </h2>
                <form onSubmit={handleAddRecruiter} className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-end">
                <div className="flex-1 max-w-md">
                    <label className="block text-base font-medium text-slate-700 mb-2">担当者名</label>
                    <input 
                    type="text" 
                    value={newRecruiter}
                    onChange={e => setNewRecruiter(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-3 text-lg"
                    placeholder="例: 〇〇教頭"
                    required
                    />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-3 font-medium shadow-sm text-lg w-full md:w-auto">
                    <Save size={24} />
                    追加
                </button>
                </form>
            </div>

            {/* Recruiter List */}
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-col overflow-visible">
                <div className="p-6 border-b border-slate-200 bg-slate-50">
                     <h3 className="font-bold text-slate-700 flex items-center gap-3 text-lg">
                        登録済み担当者一覧 ({recruiters.length}名)
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-base text-left text-slate-600">
                        <thead className="text-sm text-slate-700 uppercase bg-slate-100">
                            <tr>
                                <th className="px-8 py-4 w-24">No.</th>
                                <th className="px-8 py-4">担当者名</th>
                                <th className="px-8 py-4 text-right w-36">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {recruiters.map((recruiter, index) => (
                                <tr key={index} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-8 py-5 text-slate-400 font-mono text-sm">{index + 1}</td>
                                    <td 
                                        className="px-8 py-5 font-medium text-slate-800 cursor-text relative"
                                        onDoubleClick={() => startEditingRecruiter(index, recruiter)}
                                        title="ダブルクリックで編集"
                                    >
                                         {editingRecruiterIndex === index ? (
                                            <input
                                            autoFocus
                                            type="text"
                                            value={editRecruiterValue}
                                            onChange={e => setEditRecruiterValue(e.target.value)}
                                            onBlur={saveEditRecruiter}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') saveEditRecruiter();
                                                if (e.key === 'Escape') cancelEditRecruiter();
                                            }}
                                            className="absolute inset-0 w-full h-full px-7 py-4 border-2 border-blue-400 focus:outline-none bg-white shadow-lg z-20 rounded-none text-lg"
                                            />
                                        ) : recruiter}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                         <button 
                                            onClick={() => handleDeleteRecruiter(recruiter)}
                                            className="text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors p-2 rounded-full"
                                            title="削除"
                                            >
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <div className="p-3 border-t border-slate-200 bg-slate-50 text-sm text-slate-500 text-center">
                    リストの項目をダブルクリックすると編集できます
                 </div>
             </div>
        </>
      )}
      
      {activeTab === 'config' && (
         <div className="flex-1 overflow-visible">
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mb-6 text-sm">
                <strong>注意:</strong> ここでの設定はアプリケーション全体の自動判定ロジック（「完了」「見送り」判定など）に影響します。
                特に「未定」「確約/合格」「辞退」「保留」「○」「×」といった基本キーワードを変更・削除すると、自動ステータス更新が正しく動作しなくなる場合があります。
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Ranks */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-700 flex justify-between items-center">
                        <span>奨学生ランク</span>
                    </div>
                     <div className="p-4 border-b border-slate-100 bg-white">
                        <form onSubmit={(e) => { e.preventDefault(); handleConfigUpdate('ranks', 'add', newRank); setNewRank(''); }} className="flex gap-2">
                            <input type="text" value={newRank} onChange={e => setNewRank(e.target.value)} placeholder="追加..." className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm" />
                            <button type="submit" disabled={!newRank} className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 disabled:opacity-50"><Plus size={18}/></button>
                        </form>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 max-h-96">
                        {config.ranks.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 hover:bg-slate-50 border-b border-slate-100 last:border-0">
                                <span>{item}</span>
                                <button onClick={() => handleConfigUpdate('ranks', 'delete', item)} className="text-slate-300 hover:text-red-500"><X size={16}/></button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Results */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-700 flex justify-between items-center">
                        <span>勧誘結果</span>
                    </div>
                     <div className="p-4 border-b border-slate-100 bg-white">
                        <form onSubmit={(e) => { e.preventDefault(); handleConfigUpdate('results', 'add', newResult); setNewResult(''); }} className="flex gap-2">
                            <input type="text" value={newResult} onChange={e => setNewResult(e.target.value)} placeholder="追加..." className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm" />
                            <button type="submit" disabled={!newResult} className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 disabled:opacity-50"><Plus size={18}/></button>
                        </form>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 max-h-96">
                        {config.results.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 hover:bg-slate-50 border-b border-slate-100 last:border-0">
                                <span>{item}</span>
                                <button onClick={() => handleConfigUpdate('results', 'delete', item)} className="text-slate-300 hover:text-red-500"><X size={16}/></button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Prospects */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-700 flex justify-between items-center">
                        <span>見込み度</span>
                    </div>
                     <div className="p-4 border-b border-slate-100 bg-white">
                        <form onSubmit={(e) => { e.preventDefault(); handleConfigUpdate('prospects', 'add', newProspect); setNewProspect(''); }} className="flex gap-2">
                            <input type="text" value={newProspect} onChange={e => setNewProspect(e.target.value)} placeholder="追加..." className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm" />
                            <button type="submit" disabled={!newProspect} className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 disabled:opacity-50"><Plus size={18}/></button>
                        </form>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 max-h-96">
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
    </div>
  );
};

export default MasterData;
