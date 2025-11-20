
import React, { useState, useEffect } from 'react';
import { StudentProfile, TabType, SchoolData, GoogleUser } from './types';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import Dashboard from './components/Dashboard';
import MasterData from './components/MasterData';
import Login from './components/Login';
import { sheetService } from './services/sheetService';
import { LayoutDashboard, List, UserPlus, GraduationCap, Settings, Menu, ChevronLeft, LogOut, Loader2 } from 'lucide-react';

// Spreadsheet ID hardcoded here
const SPREADSHEET_ID = '1Xfq3GPnLGzFM2z4vG3eDStlUKSHpWQJqMneeDRgrzDY';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // App Data State
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [students, setStudents] = useState<StudentProfile[]>([]); // Start empty, fetch on load
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [clubs, setClubs] = useState<string[]>([]);
  
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Initialize Logic
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle Login Logic
  const handleLogin = async () => {
    setLoginError(null);
    
    try {
        const token = await sheetService.login();
        const userInfo = await sheetService.getUserInfo(token);
        
        // Domain restriction check
        if (userInfo.hd !== 'kiryo.ac.jp') {
             setLoginError("kiryo.ac.jp ドメインのアカウントのみアクセス可能です。");
             return;
        }

        setAccessToken(token);
        setUser(userInfo);
        
        // Fetch Data
        setIsLoading(true);
        try {
            const data = await sheetService.fetchAllData(SPREADSHEET_ID, token);
            setStudents(data.students);
            setSchools(data.schools);
            setClubs(data.clubs);
        } catch (e: any) {
            console.error(e);
            let errorMsg = "データの取得に失敗しました。";
            if (e.message && e.message.includes('400')) {
                errorMsg += "スプレッドシートに「Students」「Schools」「Clubs」シートが存在するか確認してください。";
            } else if (e.message && e.message.includes('403')) {
                errorMsg += "スプレッドシートへのアクセス権限がありません。";
            }
            setLoginError(errorMsg);
            setAccessToken(null);
            setUser(null);
        } finally {
            setIsLoading(false);
        }

    } catch (error: any) {
        console.error(error);
        setLoginError("ログインに失敗しました。" + (error.message || "ポップアップがブロックされていないか確認してください。"));
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAccessToken(null);
    setStudents([]);
  };

  // Recruitment Target State
  const [recruitmentTarget, setRecruitmentTarget] = useState<number>(30);

  // Calculate next ID for new entries (Fallback logic if needed)
  const nextNo = students.length > 0 ? Math.max(...students.map(s => s.no)) + 1 : 1;

  const handleNavClick = (tab: TabType) => {
    setActiveTab(tab);
    setEditingStudent(null);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Helper to generate ID safely
  const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // CRUD Operations with API
  const handleAddStudent = async (newStudent: StudentProfile) => {
    if (!accessToken) return;
    const studentWithId = { ...newStudent, id: generateId() };
    
    // Optimistic Update
    setStudents(prev => [...prev, studentWithId]);
    setActiveTab('list');

    try {
        await sheetService.appendStudent(SPREADSHEET_ID, accessToken, studentWithId);
    } catch (e) {
        alert("保存に失敗しました。リロードしてください。");
        console.error(e);
    }
  };

  const handleUpdateStudent = async (updatedStudent: StudentProfile) => {
    if (!accessToken) return;

    // Optimistic Update
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    if (activeTab === 'form') {
      setEditingStudent(null);
      setActiveTab('list');
    }

    try {
        await sheetService.updateStudent(SPREADSHEET_ID, accessToken, updatedStudent, students);
    } catch (e) {
        alert("更新に失敗しました。");
        console.error(e);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!accessToken) return;
    if (window.confirm('本当にこの生徒データを削除しますか？')) {
      const target = students.find(s => s.id === id);
      
      // Optimistic Update
      setStudents(prev => prev.filter(s => s.id !== id));
      if (editingStudent?.id === id) {
        setEditingStudent(null);
        setActiveTab('list');
      }

      try {
          await sheetService.deleteStudent(SPREADSHEET_ID, accessToken, id);
      } catch (e) {
          alert("削除に失敗しました。");
          console.error(e);
      }
    }
  };

  // Master Data Sync Wrapper
  const handleSchoolsUpdate = async (newSchools: SchoolData[]) => {
      setSchools(newSchools);
      if (accessToken) {
          await sheetService.syncMasterData(SPREADSHEET_ID, accessToken, newSchools, clubs);
      }
  };

  const handleClubsUpdate = async (newClubs: string[]) => {
      setClubs(newClubs);
       if (accessToken) {
          await sheetService.syncMasterData(SPREADSHEET_ID, accessToken, schools, newClubs);
      }
  };

  const handleDirectAddSchool = async (newSchool: SchoolData) => {
    const updatedSchools = [...schools, newSchool];
    setSchools(updatedSchools);
     if (accessToken) {
        await sheetService.syncMasterData(SPREADSHEET_ID, accessToken, updatedSchools, clubs);
    }
  };

  const startEdit = (student: StudentProfile) => {
    setEditingStudent(student);
    setActiveTab('form');
  };

  const cancelEdit = () => {
    setEditingStudent(null);
    setActiveTab('list');
  };

  if (!user || !accessToken) {
      return (
        <>
            {isLoading && (
                <div className="fixed inset-0 bg-white/80 z-50 flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                    <p className="text-slate-600 font-bold">データを読み込んでいます...</p>
                </div>
            )}
            <Login 
                onLogin={handleLogin} 
                error={loginError}
            />
        </>
      );
  }

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

        <div className="px-6 py-4 flex items-center gap-3 border-b border-slate-800 min-w-[18rem]">
            <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-slate-600" />
            <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
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

        <div className="p-4 border-t border-slate-800 min-w-[18rem]">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-sm py-2">
             <LogOut size={16} /> ログアウト
          </button>
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
             接続先: Google Sheets
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-hidden relative bg-slate-50">
          {activeTab === 'dashboard' && (
            <Dashboard 
              students={students} 
              recruitmentTarget={recruitmentTarget}
              setRecruitmentTarget={setRecruitmentTarget}
              clubs={clubs}
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
              setSchools={handleSchoolsUpdate}
              clubs={clubs}
              setClubs={handleClubsUpdate}
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
