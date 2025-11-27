import React from 'react';
import { GraduationCap, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  error: string | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
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
            
            <p className="text-slate-600 text-center text-sm mb-4">
              スプレッドシートは自動的に連携されます。<br />
              Googleアカウントでログインしてください。
            </p>

            <button
                onClick={onLogin}
                className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm"
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