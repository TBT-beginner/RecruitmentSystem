
import React, { useState, useEffect, useMemo } from 'react';
import { StudentProfile, Gender, ScholarshipRank, ProspectLevel, RecruitmentResult, SchoolData, RecruiterType } from '../types';
import { RECRUITERS } from '../constants';
import { Save, X, Plus, School, Trash2, Calendar, XCircle, ChevronLeft } from 'lucide-react';

interface StudentFormProps {
  initialData?: StudentProfile | null;
  onSubmit: (data: StudentProfile) => void;
  onDelete?: (id: string) => void;
  onCancel: () => void;
  nextId: number;
  schools: SchoolData[];
  clubs: string[];
  onAddSchool: (school: SchoolData) => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ initialData, onSubmit, onDelete, onCancel, nextId, schools, clubs, onAddSchool }) => {
  // Extract unique municipalities from schools list
  const municipalities = useMemo(() => Array.from(new Set(schools.map(s => s.municipality))).sort(), [schools]);

  const [formData, setFormData] = useState<StudentProfile>({
    id: '',
    no: nextId,
    municipality: municipalities[0] || '',
    schoolName: '',
    schoolCode: '',
    principalName: '',
    teacherInCharge: '',
    schoolPhone: '',
    clubName: '',
    studentName: '',
    studentFurigana: '',
    gender: '' as Gender,
    clubAchievements: '',
    academicScore: '',
    scholarshipRank: '' as ScholarshipRank,
    recruiterType: '校長',
    callDatePrincipal: '',
    callDateAdvisor: '',
    visitDate: '',
    prospect: ProspectLevel.UNKNOWN,
    result: RecruitmentResult.PENDING,
    notes: ''
  });

  // New School Modal State
  const [isAddingSchool, setIsAddingSchool] = useState(false);
  const [newSchoolData, setNewSchoolData] = useState<Partial<SchoolData>>({
    municipality: '県外',
    name: ''
  });

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Filter schools based on municipality
  const availableSchools = schools.filter(s => s.municipality === formData.municipality);

  // Check if the current selected school exists in the database (for styling auto-filled fields)
  const isSchoolSelected = schools.some(s => s.name === formData.schoolName && s.municipality === formData.municipality);

  // Handle school selection change to auto-fill details
  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    const schoolInfo = schools.find(s => s.name === selectedName && s.municipality === formData.municipality);

    setFormData(prev => ({
      ...prev,
      schoolName: selectedName,
      schoolCode: schoolInfo ? schoolInfo.code : '',
      principalName: schoolInfo ? schoolInfo.principal || '' : '',
      schoolPhone: schoolInfo ? schoolInfo.phone || '' : '',
      teacherInCharge: schoolInfo ? schoolInfo.headTeacher || '' : '',
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Special handler for visit date (combines date picker and X button)
  const handleVisitDateChange = (value: string) => {
    setFormData(prev => {
        const updates: any = { visitDate: value };
        // If visit is impossible (x), set result to DECLINED
        if (value === '×') {
            updates.result = RecruitmentResult.DECLINED;
        }
        return { ...prev, ...updates };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (window.confirm('この内容で保存してもよろしいですか？')) {
        onSubmit(formData);
    }
  };
  
  const handleDelete = () => {
    // Confirmation is handled in App.tsx logic passed via onDelete usually, but good to have double check or relying on passed prop.
    // We will trigger the passed onDelete which likely has logic, but if we want inline confirm:
    if (onDelete && formData.id) {
        onDelete(formData.id);
    }
  };

  const handleCancel = () => {
    if (window.confirm('入力内容を破棄して一覧に戻りますか？')) {
        onCancel();
    }
  };

  // Add New School Logic
  const handleSaveNewSchool = () => {
    if (!newSchoolData.name || !newSchoolData.municipality) return;
    
    // Auto generate code
    const codes = schools.map(s => parseInt(s.code, 10)).filter(n => !isNaN(n));
    const maxId = codes.length > 0 ? Math.max(...codes) : 0;
    const newCode = (maxId + 1).toString();

    const newSchool: SchoolData = {
      code: newCode,
      name: newSchoolData.name,
      municipality: newSchoolData.municipality,
      principal: '',
      phone: '',
      headTeacher: ''
    };

    onAddSchool(newSchool);
    
    // Update form to select this new school immediately
    setFormData(prev => ({
      ...prev,
      municipality: newSchool.municipality,
      schoolName: newSchool.name,
      schoolCode: newSchool.code
    }));

    setIsAddingSchool(false);
    setNewSchoolData({ municipality: '県外', name: '' });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 border border-slate-200 max-w-6xl mx-auto overflow-y-auto max-h-[calc(100vh-6rem)] md:max-h-[calc(100vh-8rem)] relative pb-24">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-3">
          {initialData ? '生徒情報編集' : '新規生徒登録'}
        </h2>
        <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600">
          <X size={32} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
        
        {/* Section 1: Student Info (Top Priority) */}
        <div className="bg-white p-4 md:p-8 rounded-2xl border-2 border-blue-100 shadow-sm">
          <h3 className="text-xl font-bold text-blue-700 uppercase tracking-wide mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
            1. 生徒基本情報
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div>
              <label className="block text-lg font-medium text-slate-700 mb-2">生徒氏名 <span className="text-red-500">*</span></label>
              <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} required className="w-full border-slate-300 rounded-lg shadow-sm p-3 text-lg border focus:ring-blue-500 focus:border-blue-500" placeholder="例: 茨城 太郎" />
            </div>
            <div>
              <label className="block text-lg font-medium text-slate-700 mb-2">生徒氏名 ふりがな</label>
              <input type="text" name="studentFurigana" value={formData.studentFurigana} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-3 text-lg border focus:ring-blue-500 focus:border-blue-500" placeholder="例: いばらき たろう" />
            </div>
             <div>
              <label className="block text-lg font-medium text-slate-700 mb-2">性別 <span className="text-red-500">*</span></label>
              <select 
                name="gender" 
                value={formData.gender} 
                onChange={handleChange} 
                required
                className="w-full border-slate-300 rounded-lg shadow-sm p-3 text-lg border focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">選択してください</option>
                {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            
             <div>
              <label className="block text-lg font-medium text-slate-700 mb-2">部活動名 <span className="text-red-500">*</span></label>
              <select 
                name="clubName" 
                value={formData.clubName} 
                onChange={handleChange} 
                required
                className="w-full border-slate-300 rounded-lg shadow-sm p-3 text-lg border focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">選択してください</option>
                {clubs.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
             <div>
              <label className="block text-lg font-medium text-slate-700 mb-2">奨学生ランク <span className="text-red-500">*</span></label>
              <select 
                name="scholarshipRank" 
                value={formData.scholarshipRank} 
                onChange={handleChange} 
                required
                className="w-full border-slate-300 rounded-lg shadow-sm p-3 text-lg border focus:ring-blue-500 focus:border-blue-500 font-medium text-slate-700 bg-white"
              >
                <option value="">選択してください</option>
                {Object.values(ScholarshipRank).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div></div>
            
            <div className="md:col-span-3">
              <label className="block text-lg font-medium text-slate-700 mb-2">部活動実績（ポジションや成績）</label>
              <input type="text" name="clubAchievements" value={formData.clubAchievements} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-3 text-lg border focus:ring-blue-500 focus:border-blue-500" placeholder="例: 県大会ベスト4、ピッチャー" />
            </div>
             <div className="md:col-span-3">
              <label className="block text-lg font-medium text-slate-700 mb-2">学業成績 ※直近の校内テスト</label>
              <input type="text" name="academicScore" value={formData.academicScore} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-3 text-lg border focus:ring-blue-500 focus:border-blue-500" placeholder="例: 5教科 320点" />
            </div>
          </div>
        </div>

        {/* Section 2: School Info */}
        <div className="bg-slate-50 p-4 md:p-8 rounded-2xl border border-slate-200">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-2">
             <h3 className="text-xl font-bold text-slate-600 uppercase tracking-wide flex items-center gap-3">
                <div className="w-2 h-8 bg-slate-400 rounded-full"></div>
                2. 学校情報
             </h3>
             <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm w-fit">
                <span className="inline-block w-3 h-3 bg-slate-100 border border-slate-300 mr-2 rounded-sm align-middle"></span>
                は自動記入(学校マスタ)
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div>
              <label className="block text-lg font-medium text-slate-700 mb-2">市町村 <span className="text-red-500">*</span></label>
              <select
                name="municipality"
                value={formData.municipality}
                onChange={(e) => {
                  handleChange(e);
                  // Reset school when city changes
                  setFormData(prev => ({ ...prev, municipality: e.target.value, schoolName: '', schoolCode: '', principalName: '', schoolPhone: '', teacherInCharge: '' }));
                }}
                className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 text-lg border bg-white"
              >
                {municipalities.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-lg font-medium text-slate-700 mb-2">中学校名 <span className="text-red-500">*</span></label>
              <div className="flex flex-col md:flex-row gap-3">
                 <div className="flex-1">
                    {availableSchools.length > 0 ? (
                        <select
                        name="schoolName"
                        value={formData.schoolName}
                        onChange={handleSchoolChange}
                        className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 text-lg border bg-white"
                        >
                        <option value="">選択してください</option>
                        {availableSchools.map(s => <option key={s.code} value={s.name}>{s.name}</option>)}
                        </select>
                    ) : (
                        <input
                            type="text"
                            name="schoolName"
                            value={formData.schoolName}
                            onChange={handleChange}
                            placeholder="直接入力"
                            className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 text-lg border bg-white"
                        />
                    )}
                 </div>
                 <button 
                    type="button"
                    onClick={() => setIsAddingSchool(true)}
                    className="bg-white border border-blue-300 text-blue-600 px-4 py-3 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2 text-base whitespace-nowrap"
                 >
                    <Plus size={20} />
                    新規学校登録
                 </button>
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-slate-700 mb-2">コード</label>
              <input 
                type="text" 
                name="schoolCode" 
                value={formData.schoolCode} 
                onChange={handleChange} 
                readOnly={isSchoolSelected}
                className={`w-full border-slate-300 rounded-lg shadow-sm p-3 text-lg border ${isSchoolSelected ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white focus:ring-blue-500'}`} 
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-slate-700 mb-2">学校長名</label>
              <input 
                type="text" 
                name="principalName" 
                value={formData.principalName} 
                onChange={handleChange} 
                readOnly={isSchoolSelected}
                className={`w-full border-slate-300 rounded-lg shadow-sm p-3 text-lg border ${isSchoolSelected ? 'bg-slate-100 text-slate-500' : 'bg-white focus:ring-blue-500'}`} 
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-slate-700 mb-2">電話番号</label>
              <input 
                 type="text" 
                 name="schoolPhone" 
                 value={formData.schoolPhone} 
                 onChange={handleChange} 
                 readOnly={isSchoolSelected}
                 className={`w-full border-slate-300 rounded-lg shadow-sm p-3 text-lg border ${isSchoolSelected ? 'bg-slate-100 text-slate-500' : 'bg-white focus:ring-blue-500'}`} 
              />
            </div>
             <div className="md:col-span-3">
              <label className="block text-lg font-medium text-slate-700 mb-2">学年主任・進路指導主事</label>
              <input 
                type="text" 
                name="teacherInCharge" 
                value={formData.teacherInCharge} 
                onChange={handleChange} 
                className="w-full border-slate-300 rounded-lg shadow-sm p-3 text-lg border bg-white focus:ring-blue-500" 
                placeholder="氏名を入力" 
              />
            </div>
          </div>
        </div>

        {/* Section 3: Recruitment Status */}
        <div className="bg-orange-50 p-4 md:p-8 rounded-2xl border border-orange-100">
          <h3 className="text-xl font-bold text-orange-700 uppercase tracking-wide mb-6 flex items-center gap-3">
             <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
             3. 勧誘活動状況
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            <div>
              <label className="block text-lg font-medium text-slate-700 mb-2">管理No.</label>
              <input
                type="number"
                name="no"
                value={formData.no}
                readOnly
                className="w-full bg-slate-200 border-slate-300 rounded-lg shadow-sm p-3 text-lg cursor-not-allowed text-slate-500"
              />
            </div>
             <div>
              <label className="block text-lg font-medium text-slate-700 mb-2">担当者</label>
              <select name="recruiterType" value={formData.recruiterType} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-3 text-lg border bg-white focus:ring-orange-500">
                {RECRUITERS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
             <div className="md:col-span-2">
              <label className="block text-lg font-medium text-slate-700 mb-2">訪問日 または×</label>
              <div className="flex gap-2">
                <input 
                    type="date" 
                    name="visitDate" 
                    value={formData.visitDate === '×' ? '' : formData.visitDate} 
                    disabled={formData.visitDate === '×'}
                    onChange={(e) => handleVisitDateChange(e.target.value)} 
                    className={`flex-1 border-slate-300 rounded-lg shadow-sm p-3 text-lg border focus:ring-orange-500 ${formData.visitDate === '×' ? 'bg-slate-100 text-slate-400' : 'bg-white'}`} 
                />
                <button
                    type="button"
                    onClick={() => handleVisitDateChange(formData.visitDate === '×' ? '' : '×')}
                    className={`px-4 rounded-lg border font-bold transition-colors flex items-center justify-center gap-1 ${
                        formData.visitDate === '×' 
                        ? 'bg-red-500 text-white border-red-600' 
                        : 'bg-white text-slate-400 border-slate-300 hover:bg-slate-50'
                    }`}
                >
                    <XCircle size={20} />
                    <span>訪問不可</span>
                </button>
              </div>
            </div>

             <div>
              <label className="block text-lg font-medium text-slate-700 mb-2">管理職TEL</label>
              <input type="date" name="callDatePrincipal" value={formData.callDatePrincipal} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-3 text-lg border bg-white focus:ring-orange-500" />
            </div>
             <div>
              <label className="block text-lg font-medium text-slate-700 mb-2">顧問TEL</label>
              <input type="date" name="callDateAdvisor" value={formData.callDateAdvisor} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-3 text-lg border bg-white focus:ring-orange-500" />
            </div>
            

             <div className="">
              <label className="block text-lg font-medium text-slate-700 mb-2">見込み</label>
              <select name="prospect" value={formData.prospect} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-3 text-lg border font-bold text-blue-600 bg-white focus:ring-orange-500">
                {Object.values(ProspectLevel).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="">
              <label className="block text-lg font-medium text-slate-700 mb-2">結果</label>
              <select name="result" value={formData.result} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-3 text-lg border font-bold text-red-600 bg-white focus:ring-orange-500">
                {Object.values(RecruitmentResult).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Mobile optimized action buttons */}
        <div className="flex flex-row justify-between md:justify-end gap-3 pt-3 md:pt-4 border-t border-slate-200 fixed bottom-0 left-0 right-0 md:absolute md:bottom-auto md:left-auto md:right-auto bg-white/95 md:bg-transparent backdrop-blur-sm p-2 md:p-0 md:static z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:shadow-none">
          {/* Delete Button (Only when editing existing data) */}
          {initialData && onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 md:flex-none px-3 md:px-8 py-2 md:py-3 text-sm md:text-lg bg-red-50 border border-red-200 text-red-600 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-1 md:gap-2 whitespace-nowrap min-w-[30%]"
            >
              <Trash2 size={18} className="md:hidden" />
              <Trash2 size={20} className="hidden md:block" />
              <span className="font-medium">削除</span>
            </button>
          )}
          
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 md:flex-none px-3 md:px-8 py-2 md:py-3 text-sm md:text-lg bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap text-center flex items-center justify-center gap-1"
          >
             <ChevronLeft size={18} className="md:hidden" />
             <span className="font-medium">戻る</span>
          </button>
          <button
            type="submit"
            className="flex-1 md:flex-none px-3 md:px-10 py-2 md:py-3 text-sm md:text-lg bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 md:gap-3 shadow-md font-bold whitespace-nowrap min-w-[30%]"
          >
            <Save size={18} className="md:hidden" />
            <Save size={24} className="hidden md:block" />
            保存
          </button>
        </div>
      </form>

      {/* Modal for Adding New School */}
      {isAddingSchool && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200">
                <h4 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <School size={28} />
                    新規学校登録
                </h4>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-500 uppercase mb-2">市町村</label>
                         <input 
                            list="municipalities-modal" 
                            type="text" 
                            value={newSchoolData.municipality}
                            onChange={e => setNewSchoolData(prev => ({ ...prev, municipality: e.target.value }))}
                            className="w-full border border-slate-300 rounded-xl p-4 text-lg"
                            placeholder="例: 県外, 水戸市"
                        />
                        <datalist id="municipalities-modal">
                           {municipalities.map(m => <option key={m} value={m} />)}
                        </datalist>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-500 uppercase mb-2">学校名</label>
                        <input 
                            type="text" 
                            value={newSchoolData.name}
                            onChange={e => setNewSchoolData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full border border-slate-300 rounded-xl p-4 text-lg"
                            placeholder="例: 新規中学校"
                            autoFocus
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-8">
                    <button 
                        onClick={() => setIsAddingSchool(false)}
                        className="px-6 py-3 text-lg text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                        キャンセル
                    </button>
                    <button 
                        onClick={handleSaveNewSchool}
                        disabled={!newSchoolData.name || !newSchoolData.municipality}
                        className="px-6 py-3 text-lg bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-bold"
                    >
                        追加して選択
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default StudentForm;
