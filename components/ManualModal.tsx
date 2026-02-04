import React, { useState, useEffect } from 'react';
import { X, BookOpen, LayoutDashboard, List, UserPlus, Settings, MousePointer, Edit2, Filter } from 'lucide-react';

export type ManualSection = 'dashboard' | 'list' | 'form' | 'master' | 'intro';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSection: ManualSection;
}

const ManualModal: React.FC<ManualModalProps> = ({ isOpen, onClose, initialSection }) => {
  const [activeSection, setActiveSection] = useState<ManualSection>(initialSection);

  useEffect(() => {
    if (isOpen) {
      setActiveSection(initialSection);
    }
  }, [isOpen, initialSection]);

  if (!isOpen) return null;

  const sections: { id: ManualSection; label: string; icon: React.ReactNode }[] = [
    { id: 'intro', label: 'はじめに', icon: <BookOpen size={18} /> },
    { id: 'dashboard', label: 'ダッシュボード', icon: <LayoutDashboard size={18} /> },
    { id: 'list', label: '生徒リスト', icon: <List size={18} /> },
    { id: 'form', label: '生徒登録・編集', icon: <UserPlus size={18} /> },
    { id: 'master', label: 'マスタ設定', icon: <Settings size={18} /> },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 flex-shrink-0 flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded text-white">
               <BookOpen size={20} />
            </div>
            <h2 className="font-bold text-slate-700">操作マニュアル</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {section.icon}
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center md:hidden">
             <span className="font-bold text-slate-700">{sections.find(s => s.id === activeSection)?.label}</span>
             <button onClick={onClose}><X size={24} className="text-slate-400" /></button>
          </div>
          <div className="hidden md:flex justify-end p-4 absolute top-0 right-0 z-10">
             <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} className="text-slate-400 hover:text-slate-600" />
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-10 text-slate-700 leading-relaxed">
            {activeSection === 'intro' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-800 border-b pb-2">このシステムについて</h3>
                <p>
                  2027年度入試に向けた、特技推薦勧誘活動を効率化するための管理システムです。<br/>
                  Googleスプレッドシートと連携し、生徒情報の蓄積、進捗管理、分析を一元的に行うことができます。
                </p>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <h4 className="font-bold text-blue-800 mb-2">主な機能</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>勧誘状況の可視化（ダッシュボード）</li>
                    <li>生徒情報の一覧管理・検索・絞り込み</li>
                    <li>PC/タブレット/スマホに対応した入力フォーム</li>
                    <li>学校・部活・担当者のマスタ管理</li>
                  </ul>
                </div>
              </div>
            )}

            {activeSection === 'dashboard' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-slate-800 border-b pb-2">ダッシュボードの見方</h3>
                
                <section>
                    <h4 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <Filter size={20} className="text-blue-500"/> データの絞り込み
                    </h4>
                    <p className="mb-2">
                        画面上部の「絞り込み」ボタンから、特定の市町村、中学校、部活動などでデータをフィルタリングできます。
                        ダッシュボード上のすべての数字とグラフは、この絞り込み結果に基づいて再計算されます。
                    </p>
                </section>

                <section>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">目標人数の設定</h4>
                    <p className="mb-2">
                        「確約/合格」カードにある <Edit2 size={16} className="inline text-slate-400"/> アイコン（または数字部分）をクリックすると、
                        今年度の採用目標人数を変更できます。目標に対する達成率がバーで表示されます。
                    </p>
                </section>

                <section>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">グラフの種類</h4>
                    <ul className="space-y-3 list-disc list-inside text-sm md:text-base">
                        <li><strong>見込み度合い分布:</strong> 現在のリストにおける生徒の見込みランク（○、△など）の割合です。</li>
                        <li><strong>勧誘ファネル:</strong> リスト登録から合格までの歩留まり（各段階に何人進んでいるか）を表示します。</li>
                        <li><strong>部活動別詳細:</strong> 部活ごとの「対象総数」「声掛け済み（接触あり）」「見込み○」の人数を棒グラフで比較できます。</li>
                    </ul>
                </section>
              </div>
            )}

            {activeSection === 'list' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-slate-800 border-b pb-2">生徒リストの操作</h3>
                
                <section>
                    <h4 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <MousePointer size={20} className="text-blue-500"/> クイック編集機能（PC版）
                    </h4>
                    <p className="mb-2">
                        PCで閲覧時、表の中の特定のセルを<strong>ダブルクリック</strong>することで、編集画面を開かずに直接データを修正できます。
                    </p>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm">
                        <strong>編集可能な項目:</strong>
                        <ul className="list-disc list-inside mt-1 ml-2">
                            <li>管理職TEL / 顧問TELの日付</li>
                            <li>訪問日（「×」ボタンで訪問不可も設定可能）</li>
                            <li>見込みランク</li>
                            <li>結果</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">並び替えと絞り込み</h4>
                    <p className="mb-2">
                        項目のヘッダー（「No.」「次対応」など）をクリックすると、昇順・降順で並び替えができます。<br/>
                        特に<strong>「次対応」</strong>で並び替えると、「管理職TEL」が必要な生徒が上位に来るため、優先順位の確認に便利です。
                    </p>
                </section>

                 <section>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">詳細・メモ入力</h4>
                    <p className="mb-2">
                        生徒名をクリック（スマホの場合）、または右側の目のアイコンをクリックすると詳細画面が開きます。<br/>
                        詳細画面では、面談記録などの<strong>フリーメモ</strong>を保存することができます。
                    </p>
                </section>
              </div>
            )}

            {activeSection === 'form' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-slate-800 border-b pb-2">生徒情報の登録・編集</h3>
                
                <section>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">学校の入力について</h4>
                    <p className="mb-2">
                        「市町村」を選択すると、登録済みの「中学校名」がリストから選択できるようになります。<br/>
                        リストにない新しい中学校の場合は、「新規学校登録」ボタンからその場で追加し、そのまま選択することが可能です。
                    </p>
                    <p className="text-sm text-slate-500">
                        ※既存の学校を選択すると、学校長名や電話番号などはマスタデータから自動で補完されます。
                    </p>
                </section>

                <section>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">訪問不可の記録</h4>
                    <p className="mb-2">
                        「訪問日」の項目の横にある「訪問不可」ボタンを押すと、訪問日が「×」となり、結果が自動的に「辞退（または×）」として記録されます。
                    </p>
                </section>
              </div>
            )}

            {activeSection === 'master' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-slate-800 border-b pb-2">マスタデータの管理</h3>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <p className="text-sm text-yellow-800">
                        ここでの変更は、システム全体の選択肢や自動入力に反映されます。慎重に操作してください。
                    </p>
                </div>

                <section>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">学校マスタ</h4>
                    <p className="mb-2">
                        中学校の基本情報（所在地、校長名、電話番号など）を管理します。<br/>
                        リスト内のセルをダブルクリックすることで、その場で情報を修正できます。
                    </p>
                </section>

                <section>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">設定マスタ</h4>
                    <p className="mb-2">
                        以下の選択肢を自由にカスタマイズできます。
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong>奨学生ランク:</strong> S1, S2, なし 等</li>
                        <li><strong>勧誘結果:</strong> S1, 保留, 辞退 等</li>
                        <li><strong>見込み度:</strong> ○, △, × 等</li>
                    </ul>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualModal;