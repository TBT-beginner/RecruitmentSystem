
// 固定のEnumを削除し、スプレッドシート管理のための文字列型に変更
export type ScholarshipRank = string;
export type RecruitmentResult = string;
export type ProspectLevel = string;
export type Gender = string;

// スプレッドシートで管理するため、固定のUnion型からstringに変更
export type RecruiterType = string;

export const GenderValues = {
  MALE: '男',
  FEMALE: '女',
};

export interface SchoolData {
  code: string;
  name: string;
  municipality: string;
  principal?: string;
  phone?: string;
  headTeacher?: string; // 学年主任・進路指導主事
}

export interface StudentProfile {
  id: string;
  no: number;
  municipality: string;
  schoolName: string; // 中学校名
  schoolCode: string;
  principalName: string; // 学校長名
  teacherInCharge: string; // 学年主任・進路指導主事
  schoolPhone: string;
  clubName: string;
  studentName: string;
  studentFurigana: string;
  gender: Gender;
  clubAchievements: string; // 部活動実績（ポジションや成績）
  scoreInfo: string; // 旧:学業成績。目的を隠蔽するため汎用的な名称に変更
  scholarshipRank: ScholarshipRank;
  recruiterType: RecruiterType; // 校長/教頭
  callDatePrincipal?: string; // 校長/教頭から電話した日付
  callDateAdvisor?: string; // 顧問から電話した日付
  visitDate?: string; // 訪問日 または×
  prospect: ProspectLevel;
  result: RecruitmentResult;
  notes?: string;
}

export type TabType = 'list' | 'form' | 'dashboard' | 'master';

export interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  hd?: string; // Hosted Domain (e.g. kiryo.ac.jp)
}

export interface ConfigData {
  ranks: string[];
  results: string[];
  prospects: string[];
}
