
import React, { useState, useMemo } from 'react';
import { StudentProfile, ProspectLevel, RecruitmentResult, ScholarshipRank } from '../types';
import { CLUBS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Filter, X, Settings, Check, Edit2 } from 'lucide-react';

interface DashboardProps {
  students: StudentProfile[];
  recruitmentTarget: number;
  setRecruitmentTarget: (target: number) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard: React.FC<DashboardProps> = ({ students, recruitmentTarget, setRecruitmentTarget }) => {
  // Target Editing State
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState(recruitmentTarget.toString());

  // Filter States
  const [schoolFilter, setSchoolFilter] = useState("");
  const [clubFilter, setClubFilter] = useState("");

  // Extract unique options for filters
  const schoolOptions = Array.from(new Set(students.map(s => s.schoolName))).sort();
  const clubOptions = Array.from(new Set(students.map(s => s.clubName))).sort();

  // Filtered Data
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSchool = schoolFilter ? s.schoolName === schoolFilter : true;
      const matchesClub = clubFilter ? s.clubName === clubFilter : true;
      return matchesSchool && matchesClub;
    });
  }, [students, schoolFilter, clubFilter]);

  // 1. Data for Prospect Distribution
  const prospectData = Object.values(ProspectLevel).map(level => ({
    name: level,
    count: filteredStudents.filter(s => s.prospect === level).length
  }));

  // 2. Data for Club Distribution (Fixed Order)
  const clubCounts: Record<string, number> = {};
  filteredStudents.forEach(s => {
    clubCounts[s.clubName] = (clubCounts[s.clubName] || 0) + 1;
  });
  
  // Use CLUBS constant for ordering to avoid ranking
  const clubData = CLUBS.map(clubName => ({
    name: clubName,
    count: clubCounts[clubName] || 0
  }));

  // 3. Data for Rank Distribution
  const rankData = Object.values(ScholarshipRank).map(rank => ({
    name: rank,
    count: filteredStudents.filter(s => s.scholarshipRank === rank).length
  }));

  // 4. Funnel Data (Simple approximation)
  const total = filteredStudents.length;
  const contacted = filteredStudents.filter(s => s.callDatePrincipal || s.callDateAdvisor).length;
  const visited = filteredStudents.filter(s => s.visitDate && s.visitDate !== '×').length;
  const accepted = filteredStudents.filter(s => s.result === RecruitmentResult.ACCEPTED).length;

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
    }
    setIsEditingTarget(false);
  };

  const achievementRate = Math.min(100, Math.round((accepted / recruitmentTarget) * 100));

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 overflow-y-auto h-full pb-48">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800">勧誘状況ダッシュボード</h2>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex items-center gap-2 text-slate-500 font-bold text-lg">
          <Filter size={24} />
          <span>絞り込み:</span>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <select 
              value={schoolFilter}
              onChange={(e) => setSchoolFilter(e.target.value)}
              className="w-full border border-slate-300 rounded-xl py-3 pl-4 pr-10 text-lg focus:ring-2 focus:ring-blue-200 outline-none md:min-w-[200px]"
            >
              <option value="">すべての中学校</option>
              {schoolOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="relative w-full md:w-auto">
            <select 
              value={clubFilter}
              onChange={(e) => setClubFilter(e.target.value)}
              className="w-full border border-slate-300 rounded-xl py-3 pl-4 pr-10 text-lg focus:ring-2 focus:ring-blue-200 outline-none md:min-w-[200px]"
            >
              <option value="">すべての部活</option>
              {clubOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {(schoolFilter || clubFilter) && (
          <button 
            onClick={() => { setSchoolFilter(""); setClubFilter(""); }}
            className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors self-end md:self-auto"
            title="条件をクリア"
          >
            <X size={24} />
          </button>
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
          <p className="text-4xl font-bold text-green-600">{filteredStudents.filter(s => s.prospect === ProspectLevel.HIGH).length}<span className="text-lg font-normal text-slate-400 ml-2">名</span></p>
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

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-white p-4 md:p-8 rounded-xl shadow-sm border border-slate-200 h-96 md:h-[30rem] flex flex-col min-w-0">
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
                  label={({name, count}) => count > 0 ? `${name}: ${count}` : ''}
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

        <div className="bg-white p-4 md:p-8 rounded-xl shadow-sm border border-slate-200 h-96 md:h-[30rem] flex flex-col min-w-0">
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
      </div>

       {/* Charts Row 2 */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
        <div className="bg-white p-4 md:p-8 rounded-xl shadow-sm border border-slate-200 h-96 md:h-[30rem] flex flex-col min-w-0">
           <h3 className="text-lg font-bold text-slate-700 mb-4 uppercase tracking-wide flex-shrink-0">部活動別人数 (一覧)</h3>
           <div className="flex-1 min-h-0 w-full">
             <ResponsiveContainer width="99%" height="100%">
               <BarChart data={clubData} margin={{ top: 5, right: 20, left: 10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} tick={{fontSize: 12}} height={70} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

         <div className="bg-white p-4 md:p-8 rounded-xl shadow-sm border border-slate-200 h-96 md:h-[30rem] flex flex-col min-w-0">
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
    </div>
  );
};

export default Dashboard;
