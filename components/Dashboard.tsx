import React, { useState, useMemo } from 'react';
import { StudentProfile, SchoolData } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Filter, X, Edit2, Check } from 'lucide-react';
import FilterModal, { FilterState } from './FilterModal';

interface DashboardProps {
  students: StudentProfile[];
  recruitmentTarget: number;
  setRecruitmentTarget: (target: number) => void;
  schools: SchoolData[];
  clubs: string[];
  recruiters: string[];
  ranks: string[];
  prospects: string[];
  results: string[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard: React.FC<DashboardProps> = ({ 
    students, recruitmentTarget, setRecruitmentTarget, schools, clubs, recruiters, ranks, prospects, results 
}) => {
  // Target Editing State
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState(recruitmentTarget.toString());

  // Filter Modal State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    municipalities: [],
    schoolNames: [],
    clubNames: [],
    recruiterTypes: [],
    actions: []
  });

  // Filtered Data Logic
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      // Municipality Filter
      if (filters.municipalities.length > 0 && !filters.municipalities.includes(s.municipality)) return false;
      // School Filter
      if (filters.schoolNames.length > 0 && !filters.schoolNames.includes(s.schoolName)) return false;
      // Club Filter
      if (filters.clubNames.length > 0 && !filters.clubNames.includes(s.clubName)) return false;
      // Recruiter Filter
      if (filters.recruiterTypes.length > 0 && !filters.recruiterTypes.includes(s.recruiterType)) return false;
      
      return true;
    });
  }, [students, filters]);

  const activeFilterCount = filters.municipalities.length + filters.schoolNames.length + filters.clubNames.length + filters.recruiterTypes.length + filters.actions.length;

  // 1. Data for Prospect Distribution
  const prospectData = prospects.map(level => ({
    name: level,
    count: filteredStudents.filter(s => s.prospect === level).length
  }));

  // 2. Data for Club Distribution (Detailed: Total, Contacted, Prospect Circle)
  // Use clubs prop for ordering
  const clubDetailedData = clubs.map(clubName => {
    const clubStudents = filteredStudents.filter(s => s.clubName === clubName);
    const total = clubStudents.length;
    const contacted = clubStudents.filter(s => s.callDatePrincipal || s.callDateAdvisor || (s.visitDate && s.visitDate !== '×')).length;
    const prospectCircle = clubStudents.filter(s => s.prospect === '○').length;
    
    return {
        name: clubName,
        count: total,
        contacted: contacted,
        prospect: prospectCircle
    };
  });

  // 3. Data for Rank Distribution
  const rankData = ranks.map(rank => ({
    name: rank,
    count: filteredStudents.filter(s => s.scholarshipRank === rank).length
  }));

  // 4. Funnel Data (Simple approximation)
  const total = filteredStudents.length;
  const contacted = filteredStudents.filter(s => s.callDatePrincipal || s.callDateAdvisor).length;
  const visited = filteredStudents.filter(s => s.visitDate && s.visitDate !== '×').length;
  
  // 合格定義
  const acceptedStatuses = ['S1', 'S2', 'S3', 'S4', 'なし', '確約/合格'];
  const accepted = filteredStudents.filter(s => acceptedStatuses.includes(s.result)).length;

  const funnelData = [
    { name: 'リスト登録', value: total },
    { name: '電話接触', value: contacted },
    { name: '学校訪問', value: visited },
    { name: '確約/合格', value: accepted },
  ];

  const handleSaveTarget = () => {
    const val = parseInt(tempTarget, 10);
    if (!isNaN(val) && val > 0) {
      setRecruitmentTarget(val);
    } else {
        // Reset to valid current target if invalid input
        setTempTarget(recruitmentTarget.toString());
    }
    setIsEditingTarget(false);
  };

  const achievementRate = recruitmentTarget > 0 ? Math.min(100, Math.round((accepted / recruitmentTarget) * 100)) : 0;

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 overflow-y-auto h-full pb-48">
      
      <FilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={setFilters}
        currentFilters={filters}
        schools={schools}
        clubs={clubs}
        recruiters={recruiters}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800">勧誘状況ダッシュボード</h2>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-2 text-slate-500 font-bold text-lg shrink-0">
          <Filter size={24} />
          <span>絞り込み:</span>
        </div>
        
        <button 
            onClick={() => setIsFilterModalOpen(true)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl border text-lg font-medium transition-colors w-full md:w-auto ${activeFilterCount > 0 ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}
        >
            <span>条件を選択...</span>
            {activeFilterCount > 0 && (
                <span className="bg-blue-600 text-white text-sm px-2 py-0.5 rounded-full ml-2">{activeFilterCount}</span>
            )}
        </button>

        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 flex-1">
             {filters.municipalities.map(m => <span key={m} className="bg-slate-100 px-3 py-1 rounded-full text-sm text-slate-600 flex items-center gap-1">{m} <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => setFilters(prev => ({...prev, municipalities: prev.municipalities.filter(x => x !== m)}))} /></span>)}
             {filters.schoolNames.map(s => <span key={s} className="bg-slate-100 px-3 py-1 rounded-full text-sm text-slate-600 flex items-center gap-1">{s} <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => setFilters(prev => ({...prev, schoolNames: prev.schoolNames.filter(x => x !== s)}))} /></span>)}
             {filters.clubNames.map(c => <span key={c} className="bg-slate-100 px-3 py-1 rounded-full text-sm text-slate-600 flex items-center gap-1">{c} <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => setFilters(prev => ({...prev, clubNames: prev.clubNames.filter(x => x !== c)}))} /></span>)}
             {filters.recruiterTypes.map(r => <span key={r} className="bg-slate-100 px-3 py-1 rounded-full text-sm text-slate-600 flex items-center gap-1">{r} <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => setFilters(prev => ({...prev, recruiterTypes: prev.recruiterTypes.filter(x => x !== r)}))} /></span>)}
             {filters.actions.map(a => <span key={a} className="bg-slate-100 px-3 py-1 rounded-full text-sm text-slate-600 flex items-center gap-1">{a} <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => setFilters(prev => ({...prev, actions: prev.actions.filter(x => x !== a)}))} /></span>)}
             
             <button 
                onClick={() => setFilters({municipalities: [], schoolNames: [], clubNames: [], recruiterTypes: [], actions: []})}
                className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                title="条件をクリア"
            >
                <X size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-w-0">
          <p className="text-base text-slate-500 mb-1">対象総数</p>
          <p className="text-4xl font-bold text-slate-800">{total}<span className="text-lg font-normal text-slate-400 ml-2">名</span></p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-w-0">
          <p className="text-base text-slate-500 mb-1">訪問済み</p>
          <p className="text-4xl font-bold text-blue-600">{visited}<span className="text-lg font-normal text-slate-400 ml-2">名</span></p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-w-0">
          <p className="text-base text-slate-500 mb-1">有力(○)</p>
          <p className="text-4xl font-bold text-green-600">{filteredStudents.filter(s => s.prospect === '○').length}<span className="text-lg font-normal text-slate-400 ml-2">名</span></p>
        </div>
        
        {/* Accepted Card with Goal Setting */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden group min-w-0">
          <div className="flex justify-between items-start mb-1">
            <p className="text-base text-slate-500">確約/合格</p>
            {!isEditingTarget && (
              <button 
                onClick={() => {
                  setTempTarget(recruitmentTarget.toString());
                  setIsEditingTarget(true);
                }}
                className="text-slate-300 hover:text-blue-600 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                title="目標人数を編集"
              >
                <Edit2 size={18} />
              </button>
            )}
          </div>
          
          <div className="flex items-end gap-3 mb-3">
             <p className="text-4xl font-bold text-orange-600">{accepted}</p>
             <div className="text-lg text-slate-500 pb-1.5 font-medium flex items-center">
               / 
               {isEditingTarget ? (
                 <div className="flex items-center ml-2">
                   <input 
                     type="number" 
                     value={tempTarget}
                     onChange={(e) => setTempTarget(e.target.value)}
                     className="w-20 border border-slate-300 rounded px-2 py-1 text-lg focus:ring-2 focus:ring-orange-200 outline-none"
                     autoFocus
                     onBlur={handleSaveTarget}
                     onKeyDown={(e) => e.key === 'Enter' && handleSaveTarget()}
                   />
                   <button onClick={handleSaveTarget} className="ml-2 text-green-600 hover:bg-green-50 rounded p-1"><Check size={20}/></button>
                 </div>
               ) : (
                 <span className="ml-2">{recruitmentTarget}名 (目標)</span>
               )}
             </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-4 mb-2 overflow-hidden">
             <div 
                className="bg-gradient-to-r from-orange-400 to-orange-600 h-4 rounded-full transition-all duration-500" 
                style={{ width: `${achievementRate}%` }}
             ></div>
          </div>
          <p className="text-sm text-right text-orange-600 font-bold">
             達成率: {achievementRate}%
          </p>
        </div>
      </div>

      {/* Charts Layout - 3 Cols Top, Full Width Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* 1. Prospect Pie Chart */}
        <div className="bg-white p-4 md:p-8 rounded-xl shadow-sm border border-slate-200 h-96 flex flex-col min-w-0">
          <h3 className="text-lg font-bold text-slate-700 mb-4 uppercase tracking-wide flex-shrink-0">見込み度合い分布</h3>
          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="99%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 20, left: 0 }}>
                <Pie
                  data={prospectData}
                  cx="50%"
                  cy="50%"
                  innerRadius="40%"
                  outerRadius="70%"
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="count"
                  label={({name, value}) => value > 0 ? `${name}: ${value}` : ''}
                >
                  {prospectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Funnel Chart */}
        <div className="bg-white p-4 md:p-8 rounded-xl shadow-sm border border-slate-200 h-96 flex flex-col min-w-0">
           <h3 className="text-lg font-bold text-slate-700 mb-4 uppercase tracking-wide flex-shrink-0">勧誘ファネル</h3>
           <div className="flex-1 min-h-0 w-full">
             <ResponsiveContainer width="99%" height="100%">
               <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={90} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={30} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

         {/* 3. Rank Chart */}
         <div className="bg-white p-4 md:p-8 rounded-xl shadow-sm border border-slate-200 h-96 flex flex-col min-w-0">
           <h3 className="text-lg font-bold text-slate-700 mb-4 uppercase tracking-wide flex-shrink-0">奨学生ランク分布</h3>
           <div className="flex-1 min-h-0 w-full">
             <ResponsiveContainer width="99%" height="100%">
               <BarChart data={rankData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

       {/* Detailed Club Chart - Full Width Row */}
       <div className="w-full mb-8">
        <div className="bg-white p-4 md:p-8 rounded-xl shadow-sm border border-slate-200 h-96 md:h-[30rem] flex flex-col min-w-0">
           <h3 className="text-lg font-bold text-slate-700 mb-4 uppercase tracking-wide flex-shrink-0">部活動別状況詳細</h3>
           <div className="flex-1 min-h-0 w-full">
             <ResponsiveContainer width="99%" height="100%">
               <BarChart data={clubDetailedData} margin={{ top: 5, right: 20, left: 10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} tick={{fontSize: 12}} height={70} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip 
                  itemSorter={(item) => {
                    if (item.name === '対総総数') return -1;
                    if (item.name === '声掛け済み') return -2;
                    if (item.name === '見込み○') return -3;
                    return 0;
                  }}
                />
                <Legend verticalAlign="top" height={36} />
                {/* 凡例とグラフの表示順序を制御するため、Barの記述順を固定 */}
                <Bar dataKey="count" name="対象総数" fill="#8884d8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="contacted" name="声掛け済み" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                <Bar dataKey="prospect" name="見込み○" fill="#ffc658" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;