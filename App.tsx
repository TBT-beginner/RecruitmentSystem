
import React, { useState, useEffect } from 'react';
import { INITIAL_STUDENTS, INITIAL_SCHOOL_DATABASE, CLUBS as INITIAL_CLUBS } from './constants';
import { StudentProfile, TabType, SchoolData } from './types';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import Dashboard from './components/Dashboard';
import MasterData from './components/MasterData';
import { LayoutDashboard, List, UserPlus, GraduationCap, Settings, Menu, ChevronLeft } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [students, setStudents] = useState<StudentProfile[]>(INITIAL_STUDENTS);
  const [schools, setSchools] = useState<SchoolData[]>(INITIAL_SCHOOL_DATABASE);
  const [clubs, setClubs] = useState<string[]>(INITIAL_CLUBS);
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);
  
  // Initialize sidebar state based on screen width
  // Default to false (closed) for mobile-first approach
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Set initial state based on current width
    handleResize();

    // Optional: Listen for resize if we want dynamic adapting
    // window.addEventListener('resize', handleResize);
    // return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Recruitment Target State
  const [recruitmentTarget, setRecruitmentTarget] = useState<number>(30);

  // Calculate next ID for new entries
  const nextNo = students.length > 0 ? Math.max(...students.map(s => s.no)) + 1 : 1;

  const handleNavClick = (tab: TabType) => {
    setActiveTab(tab);
    setEditingStudent(null);
    // Close sidebar on mobile when a link is clicked
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleAddStudent = (newStudent: StudentProfile) => {
    const studentWithId = { ...newStudent, id: crypto.randomUUID() };
    setStudents(prev => [...prev, studentWithId]);
    setActiveTab('list');
  };

  const handleUpdateStudent = (updatedStudent: StudentProfile) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    // Only close edit mode if we were in the form view
    if (activeTab === 'form') {
      setEditingStudent(null);
      setActiveTab('list');
    }
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm('本当にこの生徒データを削除しますか？')) {
      setStudents(prev => prev.filter(s => s.id !== id));
      // If we were editing this student, go back to list
      if (editingStudent?.id === id) {
        setEditingStudent(null);
        setActiveTab('list');
      }
    }
  };

  // Callback to add a school directly from StudentForm
  const handleDirectAddSchool = (newSchool: SchoolData) => {
    setSchools(prev => [...prev, newSchool]);
  };

  const startEdit = (student: StudentProfile) => {
    setEditingStudent(student);
    setActiveTab('form');
  };

  const cancelEdit = () => {
    setEditingStudent(null);
    setActiveTab('list');
  };

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden relative">
      
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar Navigation */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-40 h-full bg-slate-900 text-white shadow-xl flex flex-col transition-all duration-300 ease-in-out
          md:relative
          ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72 md:translate-x-0 md:w-0 md:opacity-0 md:overflow-hidden'}
        `}
      >
        <div className="p-6 border-b border-slate-800 flex items-center gap-3 min-w-[18rem]">
          <div className="bg-blue-600 p-2 rounded-lg">
            <GraduationCap size={32} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl leading-tight">2026年度入試</h1>
            <p className="text-sm text-slate-400">特技推薦勧誘管理</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-3 min-w-[18rem] overflow-y-auto">
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all text-lg ${
              activeTab === 'dashboard' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard size={24} />
            <span className="font-medium">ダッシュボード</span>
          </button>
          <button
            onClick={() => handleNavClick('list')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all text-lg ${
              activeTab === 'list' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <List size={24} />
            <span className="font-medium">生徒リスト</span>
            <span className="ml-auto bg-slate-700 text-sm px-3 py-1 rounded-full">{students.length}</span>
          </button>
          <button
            onClick={() => handleNavClick('form')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all text-lg ${
              activeTab === 'form' && !editingStudent 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <UserPlus size={24} />
            <span className="font-medium">新規登録</span>
          </button>
          
          <div className="pt-4 mt-4 border-t border-slate-800">
             <button
              onClick={() => handleNavClick('master')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all text-lg ${
                activeTab === 'master'
                  ? 'bg-slate-700 text-white shadow-md' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Settings size={24} />
              <span className="font-medium">マスタ管理</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800 text-sm text-slate-500 text-center min-w-[18rem]">
          © 2025 Recruitment System
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative w-full min-w-0">
        {/* Header Bar */}
        <header className="h-16 md:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
              title={isSidebarOpen ? "メニューを閉じる" : "メニューを開く"}
            >
              {isSidebarOpen ? <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" /> : <Menu className="w-6 h-6 md:w-7 md:h-7" />}
            </button>
            <h2 className="text-lg md:text-2xl font-bold text-slate-800 truncate">
              {activeTab === 'dashboard' && '勧誘状況サマリー'}
              {activeTab === 'list' && '勧誘対象生徒一覧'}
              {activeTab === 'master' && 'マスタデータ管理'}
              {activeTab === 'form' && (editingStudent ? '生徒情報編集' : '新規生徒登録')}
            </h2>
          </div>
          <div className="text-sm text-slate-500 hidden md:block whitespace-nowrap ml-4">
            最終更新: {new Date().toLocaleDateString()}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-hidden relative bg-slate-50">
          {activeTab === 'dashboard' && (
            <Dashboard 
              students={students} 
              recruitmentTarget={recruitmentTarget}
              setRecruitmentTarget={setRecruitmentTarget}
            />
          )}
          
          {activeTab === 'list' && (
            <div className="h-full p-4 md:p-6">
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden">
                <StudentList 
                  students={students} 
                  onEdit={startEdit} 
                  onDelete={handleDeleteStudent} 
                  onUpdate={handleUpdateStudent}
                />
               </div>
            </div>
          )}

          {activeTab === 'master' && (
            <MasterData 
              schools={schools} 
              setSchools={setSchools} 
              clubs={clubs}
              setClubs={setClubs}
            />
          )}

          {activeTab === 'form' && (
            <div className="h-full p-4 md:p-6 overflow-y-auto">
              <StudentForm 
                initialData={editingStudent}
                onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}
                onDelete={handleDeleteStudent}
                onCancel={cancelEdit}
                nextId={nextNo}
                schools={schools}
                clubs={clubs}
                onAddSchool={handleDirectAddSchool}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
