
import { SchoolData, Gender, ScholarshipRank, ProspectLevel, RecruitmentResult } from './types';

export const CLUBS = [
  '剣道',
  '柔道',
  'サッカー',
  '野球',
  '卓球',
  '女子バレーボール',
  'バスケットボール',
  '駅伝',
  '山岳',
  'ソフトテニス',
  '書道',
  '将棋',
  '吹奏楽',
  'ダンス',
  'フェンシング',
  'その他'
];

export const RECRUITERS = [
  '校長',
  '萩谷教頭',
  '越川教頭',
  'その他'
];

// Comprehensive School Database based on provided data
export const INITIAL_SCHOOL_DATABASE: SchoolData[] = [
  { code: '1', name: '水戸', municipality: '水戸市', phone: '029-123-4567', principal: '竜　穣一', headTeacher: '川崎・権藤' },
];

// Helper to generate realistic dummy data
const generateDummyStudents = (): any[] => {
  const dummyData = [];
  const familyNames = ['佐藤', '鈴木', '高橋', '田中', '伊藤', '渡辺', '山本', '中村', '小林', '加藤', '吉田', '山田', '佐々木', '山口', '松本', '井上', '木村', '林', '斎藤', '清水'];
  const givenNamesMale = ['大翔', '陽翔', '蓮', '湊', '蒼', '悠真', '樹', '大和', '陽太', '陸'];
  const givenNamesFemale = ['陽葵', '凛', '結菜', '芽依', '詩', '結愛', '莉子', '紬', '澪', '咲良'];
  
  const schools = INITIAL_SCHOOL_DATABASE;
  
  for (let i = 0; i < 50; i++) {
    const gender = i % 3 === 0 ? Gender.FEMALE : Gender.MALE;
    const familyName = familyNames[i % familyNames.length];
    const givenName = gender === Gender.MALE ? givenNamesMale[i % givenNamesMale.length] : givenNamesFemale[i % givenNamesFemale.length];
    const school = schools[i % schools.length];
    
    // Randomize status
    const rand = Math.random();
    let result = RecruitmentResult.PENDING;
    let prospect = ProspectLevel.UNKNOWN;
    let callDateP = '';
    let callDateA = '';
    let visitDate = '';
    
    if (rand > 0.8) {
        result = RecruitmentResult.ACCEPTED;
        prospect = ProspectLevel.HIGH;
        callDateP = '2025-06-10';
        callDateA = '2025-06-15';
        visitDate = '2025-07-01';
    } else if (rand > 0.6) {
        prospect = ProspectLevel.HIGH;
        callDateP = '2025-06-12';
        visitDate = '2025-07-15';
    } else if (rand > 0.4) {
        prospect = ProspectLevel.LOW;
        callDateA = '2025-06-20';
    } else if (rand > 0.2) {
        visitDate = '×';
        result = RecruitmentResult.DECLINED;
    }

    dummyData.push({
      id: (i + 1000).toString(),
      no: i + 1,
      municipality: school.municipality,
      schoolName: school.name,
      schoolCode: school.code,
      principalName: school.principal || '',
      teacherInCharge: school.headTeacher || '',
      schoolPhone: school.phone || '',
      clubName: CLUBS[i % CLUBS.length],
      studentName: `${familyName} ${givenName}`,
      studentFurigana: 'かな', // Simplified for dummy
      gender: gender,
      clubAchievements: i % 4 === 0 ? '県大会出場' : (i % 5 === 0 ? '選抜選手' : 'レギュラー'),
      academicScore: `${250 + (i * 5)}点`,
      scholarshipRank: i % 10 === 0 ? ScholarshipRank.S1 : (i % 5 === 0 ? ScholarshipRank.S2 : ScholarshipRank.NONE),
      recruiterType: RECRUITERS[i % RECRUITERS.length],
      callDatePrincipal: callDateP,
      callDateAdvisor: callDateA,
      visitDate: visitDate,
      prospect: prospect,
      result: result,
      notes: i % 7 === 0 ? '保護者も前向き' : ''
    });
  }
  return dummyData;
};

export const INITIAL_STUDENTS: any[] = generateDummyStudents();
