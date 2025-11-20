
import React, { useState } from 'react';
import { GraduationCap, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  spreadsheetId: string;
  setSpreadsheetId: (id: string) => void;
  error: string | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, spreadsheetId, setSpreadsheetId, error }) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpreadsheetId(e.target.value);
    // Safe LocalStorage access
    try {
        localStorage.setItem('spreadsheetId', e.target.value);
    } catch (e) {
        // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-8 text-center">
          <div className="inline-flex p-3 bg-white/20 rounded-xl mb-4 backdrop-blur-sm">
            <GraduationCap size={48} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">2026年度入試<br/>特技推薦勧誘管理</h1>
          <p className="text-blue-100 mt-2 text-sm">kiryo.ac.jp 専用</p>
        </div>

        <div className="p-8 space-y-6">
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r flex items-start gap-3">
                    <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                    <div className="text-sm text-red-700">{error}</div>
                </div>
            )}

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    GoogleスプレッドシートID
                </label>
                <input 
                    type="text" 
                    value={spreadsheetId}
                    onChange={handleIdChange}
                    placeholder="1A2B3C..."
                    className="w-full border border-slate-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button 
                    onClick={() => setIsHelpOpen(!isHelpOpen)}
                    className="text-xs text-blue-600 mt-2 hover:underline flex items-center gap-1"
                >
                    <AlertCircle size={12} /> スプレッドシートIDとは？ / シート構成について
                </button>
            </div>

            {isHelpOpen && (
                <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 space-y-2 border border-slate-200">
                    <p>スプレッドシートのURLの <code>/d/</code> と <code>/edit</code> の間の文字列です。</p>
                    <p className="text-xs text-slate-400 break-all">例: docs.google.com/spreadsheets/d/<strong>この部分</strong>/edit</p>
                    <hr className="border-slate-200 my-2"/>
                    <p className="font-bold">必要なシート構成:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li><strong>Students</strong>: 生徒データ (A-V列)</li>
                        <li><strong>Schools</strong>: 学校マスタ (A-F列)</li>
                        <li><strong>Clubs</strong>: 部活マスタ (A列)</li>
                    </ul>
                </div>
            )}

            <button
                onClick={onLogin}
                disabled={!spreadsheetId}
                className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Googleアカウントでログイン
            </button>
            
            <div className="text-center text-xs text-slate-400 mt-4">
                @kiryo.ac.jp のアカウントのみログイン可能です
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
