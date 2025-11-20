
import React, { useState, useMemo } from 'react';
import { StudentProfile, ConfigData } from '../types';
import { Edit, Eye, ArrowUpDown, ArrowUp, ArrowDown, ChevronUp, ChevronDown, Filter, X, Save } from 'lucide-react';

interface StudentListProps {
  students: StudentProfile[];
  onEdit: (student: StudentProfile) => void;
  onDelete: (id: string) => void;
  onUpdate?: (student: StudentProfile) => void;
  config: ConfigData;
}

type SortDirection = 'asc' | 'desc';
interface SortConfig {
  key: keyof StudentProfile | 'nextAction';
  direction: SortDirection;
}

interface EditingCell {
    studentId: string;
    field: keyof StudentProfile;
}

// Define priority for next actions (Lower number = Higher priority)
const ACTION_PRIORITIES: Record<string, number> = {
  "管理職TEL": 1,
  "顧問TEL": 2,
  "訪問日設定": 3,
  "結果記入": 4,
  "結果待": 5,
  "完了": 6,
  "見送り": 7
};

const StudentList: React.FC<StudentListProps> = ({ students, onEdit, onDelete, onUpdate, config }) => {
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  
  // Filtering & Sorting State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [schoolFilter, setSchoolFilter] = useState("");
  const [clubFilter, setClubFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  
  // State for memo editing in detail view
  const [memoText, setMemoText] = useState("");

  // State for inline editing
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);

  // Extract unique options for filters
  const schoolOptions = useMemo(() => Array.from(new Set(students.map(s => s.schoolName))).sort(), [students]);
  const clubOptions = useMemo(() => Array.from(new Set(students.map(s => s.clubName))).sort(), [students]);
  const actionOptions = Object.keys(ACTION_PRIORITIES);

  const getNextAction = (student: StudentProfile) => {
    // 注意: このロジックはスプレッドシート内の特定の文字列（未定, 保留, ○, ×, S1-S4など）に依存しています。
    // 文字列が変更されると正しく機能しない可能性があります。
    
    // 完了: 未定でも保留でもない (つまりS1, S2... 合格、または×などの完了ステータス)
    if (student.result !== '未定' && student.result !== '保留') {
      return { text: "完了", color: "text-slate-400 bg-slate-100" };
    }
    
    // 見送り: 見込みが×
    if (student.prospect === '×') {
       return { text: "見送り", color: "text-slate-400 bg-slate-100" };
    }
    
    // 結果待: 見込みが○
    if (student.prospect === '○') {
      return { text: "結果待", color: "text-blue-600 bg-blue-50 border-blue-200" };
    }
    
    if (student.visitDate && student.visitDate !== '×') {
      return { text: "結果記入", color: "text-orange-600 bg-orange-50 border-orange-200 animate-pulse" };
    }

    if (student.callDateAdvisor) {
       return { text: "訪問日設定", color: "text-purple-600 bg-purple-50 border-purple-200" };
    }

    if (student.callDatePrincipal) {
       return { text: "顧問TEL", color: "text-indigo-600 bg-indigo-50 border-indigo-200" };
    }

    return { text: "管理職TEL", color: "text-red-600 bg-red-50 border-red-200 font-bold" };
  };

  // Filter and Sort Logic
  const processedStudents = useMemo(() => {
    let result = [...students];

    // Filtering
    if (schoolFilter) {
      result = result.filter(s => s.schoolName === schoolFilter);
    }
    if (clubFilter) {
      result = result.filter(s => s.clubName === clubFilter);
    }
    if (actionFilter) {
      result = result.filter(s => getNextAction(s).text === actionFilter);
    }

    // Sorting
    if (sortConfig) {
      result.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        if (sortConfig.key === 'nextAction') {
           aValue = ACTION_PRIORITIES[getNextAction(a).text] || 99;
           bValue = ACTION_PRIORITIES[getNextAction(b).text] || 99;
        } else {
           aValue = a[sortConfig.key] || '';
           bValue = b[sortConfig.key] || '';
        }
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [students, schoolFilter, clubFilter, actionFilter, sortConfig]);

  const handleSort = (key: keyof StudentProfile | 'nextAction') => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof StudentProfile | 'nextAction') => {
    if (sortConfig?.key !== key) return <ArrowUpDown size={16} className="text-slate-300" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={16} className="text-blue-600" /> 
      : <ArrowDown size={16} className="text-blue-600" />;
  };

  const getProspectColor = (prospect: string) => {
    if (prospect === '○') return 'bg-green-100 text-green-800 border-green-200 font-bold';
    if (prospect === '×') return 'bg-slate-100 text-slate-400 border-slate-200';
    if (prospect === '未定') return 'bg-yellow-50 text-yellow-700 border-yellow-100';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const getResultColor = (result: string) => {
    // S1~S4, なし は合格扱い
    if (['S1', 'S2', 'S3', 'S4', 'なし', '確約/合格'].includes(result)) return 'bg-orange-100 text-orange-800 border-orange-200 font-bold';
    // ×または辞退 は辞退扱い
    if (result === '×' || (result && result.includes('辞退'))) return 'bg-gray-200 text-gray-500 border-gray-300 line-through';
    // その他（未定、保留など）
    return 'text-slate-600';
  };

  const handleOpenDetail = (student: StudentProfile) => {
    setSelectedStudent(student);
    setMemoText(student.notes || "");
    setDetailModalOpen(true);
  };

  const handleSaveMemo = () => {
    if (selectedStudent && onUpdate) {
      if (window.confirm('メモを保存しますか？')) {
        const updatedStudent = { ...selectedStudent, notes: memoText };
        onUpdate(updatedStudent);
        setSelectedStudent(updatedStudent);
      }
    }
  };

  const handleCloseDetail = () => {
    if (selectedStudent && selectedStudent.notes !== memoText) {
        if (!window.confirm('変更が保存されていません。閉じてもよろしいですか？')) {
            return;
        }
    }
    setDetailModalOpen(false);
  };

  // Inline Editing Handlers
  const handleCellDoubleClick = (studentId: string, field: keyof StudentProfile) => {
    setEditingCell({ studentId, field });
  };

  const handleCellUpdate = (val: string, student: StudentProfile, field: keyof StudentProfile) => {
    let updatedStudent = { ...student, [field]: val };
    // If visit date is set to '×', result becomes '×' (or declined)
    if (field === 'visitDate' && val === '×') {
        // 設定リストに '×' があればそれを使う、なければ '辞退' を探す
        const declined = config.results.includes('×') ? '×' : (config.results.find(r => r.includes('辞退')) || '×');
        updatedStudent.result = declined;
    }

    if (onUpdate) {
        onUpdate(updatedStudent);
    }
    setEditingCell(null);
  };

  const handleFilterChange = (setter: (val: string) => void, value: string) => {
    setter(value);
    // Auto-collapse filters on mobile when selection is made to save space
    if (window.innerWidth < 768 && value !== "") {
        setIsFilterOpen(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Filter Toolbar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col gap-4">
         <div className="flex items-center justify-between w-full">
             <div className="flex items-center gap-2 text-slate-500 font-bold text-base">
                <Filter size={20} />
                絞り込み:
             </div>
             <div className="flex items-center gap-4">
                 <div className="text-sm text-slate-400">
                    {processedStudents.length} 件表示
                 </div>
                 <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)} 
                    className={`md:hidden border p-2 rounded-md text-slate-600 transition-colors ${isFilterOpen ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white border-slate-300 hover:bg-slate-50'}`}
                    title={isFilterOpen ? "フィルタを閉じる" : "フィルタを開く"}
                 >
                    {isFilterOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                 </button>
             </div>
         </div>
        
        {/* Filters Group - Collapsible on Mobile */}
        <div className={`flex flex-col md:flex-row gap-4 w-full md:w-auto transition-all duration-300 ${isFilterOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 md:max-h-none md:opacity-100 overflow-hidden'}`}>
            <select 
                value={actionFilter}
                onChange={(e) => handleFilterChange(setActionFilter, e.target.value)}
                className="border border-slate-300 rounded-md py-2 pl-3 pr-10 text-base focus:ring-2 focus:ring-blue-200 outline-none h-10 w-full md:w-auto bg-white"
            >
                <option value="">すべてのアクション</option>
                {actionOptions.map(a => <option key={a} value={a}>{a}</option>)}
            </select>

            <select 
                value={schoolFilter}
                onChange={(e) => handleFilterChange(setSchoolFilter, e.target.value)}
                className="border border-slate-300 rounded-md py-2 pl-3 pr-10 text-base focus:ring-2 focus:ring-blue-200 outline-none h-10 w-full md:w-auto bg-white"
            >
                <option value="">すべての中学校</option>
                {schoolOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select 
                value={clubFilter}
                onChange={(e) => handleFilterChange(setClubFilter, e.target.value)}
                className="border border-slate-300 rounded-md py-2 pl-3 pr-10 text-base focus:ring-2 focus:ring-blue-200 outline-none h-10 w-full md:w-auto bg-white"
            >
                <option value="">すべての部活</option>
                {clubOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

             {(schoolFilter || clubFilter || actionFilter) && (
                <button 
                    onClick={() => { setSchoolFilter(""); setClubFilter(""); setActionFilter(""); }}
                    className="text-slate-400 hover:text-red-500 text-base flex items-center gap-1 px-3 py-2 rounded hover:bg-red-50 transition-colors self-start md:self-auto border border-transparent md:border-slate-200"
                >
                    <X size={18} />
                    条件クリア
                </button>
            )}
        </div>
      </div>

      <div className="flex-1 overflow-auto relative">
        <table className="min-w-full text-base text-left text-slate-600 whitespace-nowrap border-separate border-spacing-0">
          <thead className="text-sm text-slate-700 uppercase bg-slate-100 sticky top-0 z-20">
            <tr>
              <th className="hidden md:table-cell px-3 py-3 w-16 cursor-pointer hover:bg-slate-200 bg-slate-100 z-20 border-b border-slate-200" onClick={() => handleSort('no')}>
                  <div className="flex items-center gap-1">No. {getSortIcon('no')}</div>
              </th>
              <th className="hidden md:table-cell px-3 py-3 cursor-pointer hover:bg-slate-200 bg-slate-100 z-20 border-b border-slate-200" onClick={() => handleSort('nextAction')}>
                  <div className="flex items-center gap-1">次対応 {getSortIcon('nextAction')}</div>
              </th>
              <th className="hidden md:table-cell px-3 py-3 cursor-pointer hover:bg-slate-200 bg-slate-100 z-20 border-b border-slate-200" onClick={() => handleSort('schoolName')}>
                  <div className="flex items-center gap-1">学校・担当 {getSortIcon('schoolName')}</div>
              </th>
              <th className="px-3 py-3 cursor-pointer hover:bg-slate-200 bg-slate-100 z-20 border-b border-slate-200" onClick={() => handleSort('studentName')}>
                  <div className="flex items-center gap-1">氏名・部活 {getSortIcon('studentName')}</div>
              </th>
              <th className="hidden md:table-cell px-3 py-3 cursor-pointer hover:bg-slate-200 bg-slate-100 z-20 border-b border-slate-200" onClick={() => handleSort('scholarshipRank')}>
                  <div className="flex items-center gap-1">成績 {getSortIcon('scholarshipRank')}</div>
              </th>
              <th className="hidden md:table-cell px-3 py-3 cursor-pointer hover:bg-slate-200 bg-slate-100 z-20 border-b border-slate-200" onClick={() => handleSort('callDatePrincipal')}>
                  <div className="flex items-center gap-1">管理職TEL {getSortIcon('callDatePrincipal')}</div>
              </th>
              <th className="hidden md:table-cell px-3 py-3 cursor-pointer hover:bg-slate-200 bg-slate-100 z-20 border-b border-slate-200" onClick={() => handleSort('callDateAdvisor')}>
                  <div className="flex items-center gap-1">顧問TEL {getSortIcon('callDateAdvisor')}</div>
              </th>
              <th className="hidden md:table-cell px-3 py-3 cursor-pointer hover:bg-slate-200 bg-slate-100 z-20 border-b border-slate-200" onClick={() => handleSort('visitDate')}>
                  <div className="flex items-center gap-1">訪問 {getSortIcon('visitDate')}</div>
              </th>
              <th className="hidden md:table-cell px-3 py-3 text-center cursor-pointer hover:bg-slate-200 bg-slate-100 z-20 border-b border-slate-200" onClick={() => handleSort('prospect')}>
                  <div className="flex items-center justify-center gap-1">見込 {getSortIcon('prospect')}</div>
              </th>
              <th className="hidden md:table-cell px-3 py-3 text-center cursor-pointer hover:bg-slate-200 bg-slate-100 z-20 border-b border-slate-200" onClick={() => handleSort('result')}>
                   <div className="flex items-center justify-center gap-1">結果 {getSortIcon('result')}</div>
              </th>
              {/* Only show operations on Desktop, mobile uses row click on name */}
              <th className="hidden md:table-cell px-3 py-3 text-right sticky right-0 bg-slate-100 shadow-[-5px_0_5px_-5px_rgba(0,0,0,0.1)] z-30 border-b border-slate-200 w-[80px]">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {processedStudents.map((student) => {
              const nextAction = getNextAction(student);
              return (
              <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                <td className="hidden md:table-cell px-3 py-3 font-medium text-slate-900 border-b border-slate-100">{student.no}</td>
                <td className="hidden md:table-cell px-3 py-3 border-b border-slate-100">
                   <span className={`inline-block px-2 py-1 rounded text-xs font-bold border ${nextAction.color}`}>
                     {nextAction.text}
                   </span>
                </td>
                <td className="hidden md:table-cell px-3 py-3 border-b border-slate-100">
                  <div className="text-slate-900 font-medium text-base">{student.schoolName}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{student.municipality}</div>
                  <div className="text-xs text-slate-500 mt-1">担: {student.recruiterType}</div>
                </td>
                {/* Mobile: This cell is the primary interaction point */}
                <td 
                    className="px-3 py-3 border-b border-slate-100 cursor-pointer md:cursor-auto active:bg-blue-50 md:active:bg-transparent"
                    onClick={() => {
                        if (window.innerWidth < 768) {
                            handleOpenDetail(student);
                        }
                    }}
                >
                  <div className="font-bold text-slate-800 text-lg flex gap-2 items-center">
                    {student.studentName}
                    {/* Visible only on Desktop in this layout */}
                    <span className="hidden md:inline text-sm font-normal text-slate-400">({student.gender})</span>
                  </div>
                  {/* Additional info visible on Mobile to give context */}
                  <div className="md:hidden text-xs text-indigo-600 font-medium mt-1 flex items-center gap-2">
                    <span>{student.clubName}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] border ${nextAction.color}`}>{nextAction.text}</span>
                  </div>
                  
                  <div className="hidden md:block text-xs text-slate-400 mb-0.5">{student.studentFurigana}</div>
                  <div className="hidden md:block text-indigo-600 font-semibold text-base">{student.clubName}</div>
                  <div className="hidden md:block text-xs text-slate-500 max-w-[150px] truncate" title={student.clubAchievements}>{student.clubAchievements || '-'}</div>
                </td>
                <td className="hidden md:table-cell px-3 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${student.scholarshipRank.startsWith('S') ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 'bg-white border-slate-200'}`}>
                      {student.scholarshipRank}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">{student.scoreInfo || '-'}</div>
                </td>
                
                {/* Inline Editable: Principal Call Date */}
                <td 
                    className="hidden md:table-cell px-3 py-3 cursor-pointer hover:bg-blue-50 relative border-b border-slate-100"
                    onDoubleClick={() => handleCellDoubleClick(student.id, 'callDatePrincipal')}
                    title="ダブルクリックで編集"
                >
                  {editingCell?.studentId === student.id && editingCell?.field === 'callDatePrincipal' ? (
                      <input 
                        type="date" 
                        autoFocus
                        defaultValue={student.callDatePrincipal || ''}
                        onBlur={(e) => handleCellUpdate(e.target.value, student, 'callDatePrincipal')}
                        onKeyDown={(e) => e.key === 'Enter' && handleCellUpdate((e.target as HTMLInputElement).value, student, 'callDatePrincipal')}
                        className="absolute inset-0 w-full h-full border-2 border-blue-500 rounded px-1 text-sm"
                      />
                  ) : (
                    <span className={student.callDatePrincipal ? "text-slate-700 font-medium text-base" : "text-slate-300 text-sm"}>
                        {student.callDatePrincipal || '-'}
                    </span>
                  )}
                </td>

                 {/* Inline Editable: Advisor Call Date */}
                <td 
                    className="hidden md:table-cell px-3 py-3 cursor-pointer hover:bg-blue-50 relative border-b border-slate-100"
                    onDoubleClick={() => handleCellDoubleClick(student.id, 'callDateAdvisor')}
                    title="ダブルクリックで編集"
                >
                    {editingCell?.studentId === student.id && editingCell?.field === 'callDateAdvisor' ? (
                      <input 
                        type="date" 
                        autoFocus
                        defaultValue={student.callDateAdvisor || ''}
                        onBlur={(e) => handleCellUpdate(e.target.value, student, 'callDateAdvisor')}
                        onKeyDown={(e) => e.key === 'Enter' && handleCellUpdate((e.target as HTMLInputElement).value, student, 'callDateAdvisor')}
                        className="absolute inset-0 w-full h-full border-2 border-blue-500 rounded px-1 text-sm"
                      />
                  ) : (
                    <span className={student.callDateAdvisor ? "text-slate-700 font-medium text-base" : "text-slate-300 text-sm"}>
                        {student.callDateAdvisor || '-'}
                    </span>
                  )}
                </td>

                 {/* Inline Editable: Visit Date with Popover */}
                <td 
                    className="hidden md:table-cell px-3 py-3 cursor-pointer hover:bg-blue-50 relative border-b border-slate-100"
                    onDoubleClick={() => handleCellDoubleClick(student.id, 'visitDate')}
                    title="ダブルクリックで編集"
                >
                   {editingCell?.studentId === student.id && editingCell?.field === 'visitDate' ? (
                      <div className="absolute inset-0 bg-white border-2 border-blue-500 rounded flex items-center z-10 px-1 gap-1 shadow-lg">
                          <input 
                            type="date" 
                            autoFocus
                            defaultValue={student.visitDate === '×' ? '' : student.visitDate}
                            onChange={(e) => handleCellUpdate(e.target.value, student, 'visitDate')}
                            onBlur={() => setEditingCell(null)} 
                            className="flex-1 text-sm outline-none w-24 bg-transparent h-full"
                          />
                          <button 
                            onMouseDown={(e) => {
                                e.preventDefault(); // Prevent input blur from triggering before click
                                e.stopPropagation();
                                handleCellUpdate('×', student, 'visitDate');
                            }}
                            className="bg-red-100 hover:bg-red-200 text-red-600 px-2 py-0.5 rounded text-xs font-bold border border-red-200 mr-1 flex-shrink-0"
                          >
                            ×
                          </button>
                      </div>
                  ) : (
                    <span className={student.visitDate && student.visitDate !== '×' ? "text-blue-600 font-bold text-base" : (student.visitDate === '×' ? "text-red-500 font-bold" : "text-slate-400 text-sm")}>
                        {student.visitDate || '-'}
                    </span>
                  )}
                </td>
                
                {/* Inline Editable: Prospect */}
                <td 
                  className="hidden md:table-cell px-3 py-3 text-center cursor-pointer hover:bg-blue-50 relative border-b border-slate-100"
                  onDoubleClick={() => handleCellDoubleClick(student.id, 'prospect')}
                  title="ダブルクリックで編集"
                >
                  {editingCell?.studentId === student.id && editingCell?.field === 'prospect' ? (
                    <select
                      autoFocus
                      value={student.prospect}
                      onChange={(e) => handleCellUpdate(e.target.value, student, 'prospect')}
                      onBlur={() => setEditingCell(null)}
                      className="absolute inset-0 w-full h-full border-2 border-blue-500 rounded px-1 text-sm"
                    >
                      {config.prospects.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-sm border ${getProspectColor(student.prospect)}`}>
                      {student.prospect}
                    </span>
                  )}
                </td>
                
                {/* Inline Editable: Result */}
                <td 
                  className="hidden md:table-cell px-3 py-3 text-center cursor-pointer hover:bg-blue-50 relative border-b border-slate-100"
                  onDoubleClick={() => handleCellDoubleClick(student.id, 'result')}
                  title="ダブルクリックで編集"
                >
                  {editingCell?.studentId === student.id && editingCell?.field === 'result' ? (
                    <select
                      autoFocus
                      value={student.result}
                      onChange={(e) => handleCellUpdate(e.target.value, student, 'result')}
                      onBlur={() => setEditingCell(null)}
                      className="absolute inset-0 w-full h-full border-2 border-blue-500 rounded px-1 text-sm"
                    >
                      {config.results.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded-md text-xs ${getResultColor(student.result)}`}>
                      {student.result}
                    </span>
                  )}
                </td>

                <td className="hidden md:table-cell px-3 py-3 text-right sticky right-0 bg-white shadow-[-5px_0_5px_-5px_rgba(0,0,0,0.1)] border-b border-slate-100 group-hover:bg-slate-50 transition-colors z-10">
                  <div className="flex items-center justify-end gap-1">
                     <button 
                      onClick={() => handleOpenDetail(student)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="詳細・メモ"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )})}
            {processedStudents.length === 0 && (
              <tr>
                <td colSpan={12} className="px-6 py-12 text-center text-slate-400 text-lg">
                    {students.length === 0 
                        ? "登録された生徒がいません。右上のボタンから追加してください。" 
                        : "条件に一致する生徒が見つかりません。"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {detailModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[95vh] overflow-hidden pb-16 md:pb-0 relative">
              <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                <h3 className="font-bold text-slate-800 flex items-center gap-3 text-xl md:text-2xl">
                  <div className="bg-blue-600 text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-base md:text-lg">
                    {selectedStudent.no}
                  </div>
                  <span className="truncate max-w-[180px] md:max-w-none">{selectedStudent.studentName}</span>
                  <span className="text-sm md:text-base font-normal text-slate-500 mt-1 whitespace-nowrap">詳細</span>
                </h3>
                <button onClick={handleCloseDetail} className="text-slate-400 hover:text-slate-600">
                  <X size={28} />
                </button>
              </div>
              
              <div className="p-6 md:p-8 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
                {/* Left Column: Read-only info */}
                <div className="space-y-6 md:space-y-8">
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3">学校情報</h4>
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-3 text-base md:text-lg">
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">学校名</span>
                        <span className="font-medium">{selectedStudent.schoolName} ({selectedStudent.municipality})</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                         <span className="text-slate-500">学校長</span>
                         <span className="font-medium">{selectedStudent.principalName || '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                         <span className="text-slate-500">主任・進路</span>
                         <span className="font-medium">{selectedStudent.teacherInCharge || '-'}</span>
                      </div>
                       <div className="flex justify-between">
                         <span className="text-slate-500">電話番号</span>
                         <span className="font-medium">{selectedStudent.schoolPhone || '-'}</span>
                      </div>
                    </div>
                  </div>

                   <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3">生徒情報</h4>
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-3 text-base md:text-lg">
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">部活動</span>
                        <span className="font-bold text-indigo-600">{selectedStudent.clubName}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                         <span className="text-slate-500">実績</span>
                         <span className="font-medium text-right">{selectedStudent.clubAchievements || '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                         <span className="text-slate-500">ランク</span>
                         <span className="font-bold text-orange-600">{selectedStudent.scholarshipRank}</span>
                      </div>
                       <div className="flex justify-between">
                         <span className="text-slate-500">参考情報</span>
                         <span className="font-medium">{selectedStudent.scoreInfo || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Status & Editable Memo */}
                <div className="flex flex-col h-full">
                   <div className="mb-8">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3">進捗ステータス</h4>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                       <div className="bg-slate-50 p-3 md:p-4 rounded-lg border border-slate-100">
                          <div className="text-xs md:text-sm text-slate-500 mb-1">担当</div>
                          <div className="font-bold text-slate-700 text-base md:text-lg">{selectedStudent.recruiterType}</div>
                       </div>
                       <div className="bg-slate-50 p-3 md:p-4 rounded-lg border border-slate-100">
                          <div className="text-xs md:text-sm text-slate-500 mb-1">見込み</div>
                          <div className={`font-bold text-base md:text-lg ${selectedStudent.prospect === '○' ? 'text-green-600' : ''}`}>{selectedStudent.prospect}</div>
                       </div>
                       <div className="bg-slate-50 p-3 md:p-4 rounded-lg border border-slate-100">
                          <div className="text-xs md:text-sm text-slate-500 mb-1">管理職TEL</div>
                          <div className="font-bold text-slate-700 text-base md:text-lg">{selectedStudent.callDatePrincipal || '-'}</div>
                       </div>
                       <div className="bg-slate-50 p-3 md:p-4 rounded-lg border border-slate-100">
                          <div className="text-xs md:text-sm text-slate-500 mb-1">顧問TEL</div>
                          <div className="font-bold text-slate-700 text-base md:text-lg">{selectedStudent.callDateAdvisor || '-'}</div>
                       </div>
                       <div className="bg-slate-50 p-3 md:p-4 rounded-lg border border-slate-100">
                          <div className="text-xs md:text-sm text-slate-500 mb-1">結果</div>
                          <div className="font-bold text-slate-700 text-base md:text-lg">{selectedStudent.result}</div>
                       </div>
                       <div className="bg-slate-50 p-3 md:p-4 rounded-lg border border-slate-100">
                          <div className="text-xs md:text-sm text-slate-500 mb-1">訪問日または×</div>
                          <div className="font-bold text-blue-600 text-base md:text-lg">{selectedStudent.visitDate || '-'}</div>
                       </div>
                    </div>
                   </div>

                   <div className="flex-1 flex flex-col">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-3">
                        メモ・備考
                        <span className="text-xs font-normal normal-case bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">編集可能</span>
                      </h4>
                      <textarea
                        className="flex-1 w-full border border-slate-300 rounded-xl p-4 text-base md:text-lg leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-32 md:h-auto"
                        placeholder="面談の記録や特記事項を入力してください..."
                        value={memoText}
                        onChange={(e) => setMemoText(e.target.value)}
                      ></textarea>
                   </div>
                </div>
              </div>

              <div className="p-2 md:p-6 border-t border-slate-200 flex flex-row justify-end gap-2 md:gap-3 bg-white/95 backdrop-blur-sm absolute bottom-0 left-0 right-0 z-20 md:static">
                 <button 
                  onClick={() => onEdit(selectedStudent)}
                  className="flex-1 md:flex-none px-3 py-2 md:py-3 text-sm md:text-base bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-1 md:gap-2 min-w-[30%]"
                >
                  <Edit size={18} />
                  <span>編集</span>
                </button>
                <button 
                  onClick={handleCloseDetail}
                  className="flex-1 md:flex-none px-3 py-2 md:py-3 text-sm md:text-base bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-center min-w-[30%]"
                >
                  閉じる
                </button>
                <button 
                  onClick={handleSaveMemo}
                  className="flex-1 md:flex-none px-3 py-2 md:py-3 text-sm md:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 md:gap-2 shadow-sm font-bold min-w-[30%]"
                >
                  <Save size={18} />
                  <span>保存</span>
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
