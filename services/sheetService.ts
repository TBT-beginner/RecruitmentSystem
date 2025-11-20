
import { StudentProfile, SchoolData, ConfigData } from '../types';
import { DEFAULT_RANKS, DEFAULT_RESULTS, DEFAULT_PROSPECTS, DEFAULT_TARGET } from '../constants';

declare const google: any;

const CLIENT_ID = '332287116708-dajufjesrq082kb96000472ef11nhr38.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';

export class SheetService {
  private tokenClient: any;
  private accessToken: string | null = null;

  constructor() {
    this.initClient();
  }

  private initClient() {
    if (typeof google !== 'undefined' && google.accounts) {
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response: any) => {
          if (response.error !== undefined) {
            throw (response);
          }
          this.accessToken = response.access_token;
        },
      });
    }
  }

  public login(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.tokenClient) {
        this.initClient();
        if (!this.tokenClient) {
            reject('Google JS SDK not loaded');
            return;
        }
      }

      this.tokenClient.callback = (resp: any) => {
        if (resp.error) {
          reject(resp);
        } else {
          this.accessToken = resp.access_token;
          resolve(resp.access_token);
        }
      };

      this.tokenClient.requestAccessToken({ prompt: 'consent' });
    });
  }

  public async getUserInfo(accessToken: string): Promise<any> {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return await response.json();
  }

  public async fetchAllData(spreadsheetId: string, accessToken: string) {
    // Batch fetching would be better, but individual requests are simpler to debug for now
    
    // Fetch Students
    const studentsResp = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Students!A2:V?valueRenderOption=FORMATTED_VALUE`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const studentsData = await studentsResp.json();
    
    // Fetch Schools
    const schoolsResp = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Schools!A2:F?valueRenderOption=FORMATTED_VALUE`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const schoolsData = await schoolsResp.json();

    // Fetch Clubs
    const clubsResp = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Clubs!A2:A?valueRenderOption=FORMATTED_VALUE`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const clubsData = await clubsResp.json();

    // Fetch Recruiters
    const recruitersResp = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Recruiters!A2:A?valueRenderOption=FORMATTED_VALUE`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const recruitersData = await recruitersResp.json();

    // Fetch Config (Ranks, Results, Prospects, Target)
    let configData: ConfigData = { 
        ranks: DEFAULT_RANKS, 
        results: DEFAULT_RESULTS, 
        prospects: DEFAULT_PROSPECTS,
        recruitmentTarget: DEFAULT_TARGET
    };
    try {
        // Config Sheet Structure: A=Rank, B=Result, C=Prospect, D=Target
        const configResp = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Config!A2:D?valueRenderOption=FORMATTED_VALUE`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const configResult = await configResp.json();
        if (configResult.values) {
            configData = {
                ranks: configResult.values.map((r: any[]) => r[0]).filter((v: any) => v),
                results: configResult.values.map((r: any[]) => r[1]).filter((v: any) => v),
                prospects: configResult.values.map((r: any[]) => r[2]).filter((v: any) => v),
                // Target is expected in D2 (first row of data, index 3)
                recruitmentTarget: (configResult.values[0] && configResult.values[0][3]) 
                    ? parseInt(configResult.values[0][3], 10) 
                    : DEFAULT_TARGET
            };
            
            // Fallback if empty
            if (configData.ranks.length === 0) configData.ranks = DEFAULT_RANKS;
            if (configData.results.length === 0) configData.results = DEFAULT_RESULTS;
            if (configData.prospects.length === 0) configData.prospects = DEFAULT_PROSPECTS;
            if (isNaN(configData.recruitmentTarget)) configData.recruitmentTarget = DEFAULT_TARGET;
        }
    } catch (e) {
        console.warn("Config sheet not found or invalid, using defaults", e);
    }

    return {
        students: this.mapRowsToStudents(studentsData.values || []),
        schools: this.mapRowsToSchools(schoolsData.values || []),
        clubs: (clubsData.values || []).map((row: any[]) => row[0]).filter((c: any) => c),
        recruiters: (recruitersData.values || []).map((row: any[]) => row[0]).filter((r: any) => r),
        config: configData
    };
  }

  public async appendStudent(spreadsheetId: string, accessToken: string, student: StudentProfile) {
    const row = this.mapStudentToRow(student);
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Students!A:A:append?valueInputOption=USER_ENTERED`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [row] })
    });
  }

  public async updateStudent(spreadsheetId: string, accessToken: string, student: StudentProfile, allStudents: StudentProfile[]) {
    const idResp = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Students!A:A`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const idData = await idResp.json();
    const rows = idData.values || [];
    
    const rowIndex = rows.findIndex((r: string[]) => r[0] === student.id);
    
    if (rowIndex === -1) {
        throw new Error("Student ID not found in Sheet");
    }

    const sheetRowNumber = rowIndex + 1; 
    const rowData = this.mapStudentToRow(student);

    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Students!A${sheetRowNumber}:V${sheetRowNumber}?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [rowData] })
    });
  }
  
  public async deleteStudent(spreadsheetId: string, accessToken: string, studentId: string) {
    const idResp = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Students!A:A`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const idData = await idResp.json();
    const rows = idData.values || [];
    const rowIndex = rows.findIndex((r: string[]) => r[0] === studentId);
    
    if (rowIndex === -1) return;

    const metaResp = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const metaData = await metaResp.json();
    const studentSheet = metaData.sheets.find((s: any) => s.properties.title === 'Students');
    
    if (!studentSheet) return;
    
    const sheetId = studentSheet.properties.sheetId;
    
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            requests: [{
                deleteDimension: {
                    range: {
                        sheetId: sheetId,
                        dimension: "ROWS",
                        startIndex: rowIndex,
                        endIndex: rowIndex + 1
                    }
                }
            }]
        })
    });
  }
  
  public async syncMasterData(spreadsheetId: string, accessToken: string, schools: SchoolData[], clubs: string[], recruiters: string[], config: ConfigData) {
     // Sync Schools
     const schoolRows = schools.map(this.mapSchoolToRow);
     await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Schools!A2:F?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: schoolRows })
    });
    
    // Sync Clubs
    const clubRows = clubs.map(c => [c]);
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Clubs!A2:A?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: clubRows })
    });

    // Sync Recruiters
    const recruiterRows = recruiters.map(r => [r]);
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Recruiters!A2:A?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: recruiterRows })
    });

    // Sync Config (Ranks, Results, Prospects, Target)
    // Determine max length to ensure all lists are covered
    const maxLength = Math.max(config.ranks.length, config.results.length, config.prospects.length);
    const configRows = [];
    for (let i = 0; i < maxLength; i++) {
        configRows.push([
            config.ranks[i] || '',
            config.results[i] || '',
            config.prospects[i] || '',
            // Target is only in the first row (D2)
            (i === 0 ? config.recruitmentTarget.toString() : '') 
        ]);
    }
    
    // If lists are empty but we need to save target
    if (maxLength === 0) {
        configRows.push(['', '', '', config.recruitmentTarget.toString()]);
    }

    // Clear existing first (optional but safer if list shrinks) - simplify by just overwriting for now
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Config!A2:D?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: configRows })
    });
  }

  // --- Mappers ---

  private mapRowsToStudents(rows: any[][]): StudentProfile[] {
    return rows.map(row => ({
        id: row[0]?.toString() || '',
        no: Number(row[1]) || 0,
        municipality: row[2] || '',
        schoolName: row[3] || '',
        schoolCode: row[4]?.toString() || '',
        principalName: row[5] || '',
        teacherInCharge: row[6] || '',
        schoolPhone: row[7]?.toString() || '',
        clubName: row[8] || '',
        studentName: row[9] || '',
        studentFurigana: row[10] || '',
        gender: row[11] || '',
        clubAchievements: row[12] || '',
        scoreInfo: row[13]?.toString() || '',
        scholarshipRank: row[14] || '',
        recruiterType: row[15] || '',
        callDatePrincipal: row[16] || '',
        callDateAdvisor: row[17] || '',
        visitDate: row[18] || '',
        prospect: row[19] || '未定',
        result: row[20] || '未定',
        notes: row[21] || ''
    }));
  }

  private mapStudentToRow(s: StudentProfile): any[] {
      return [
          s.id, s.no, s.municipality, s.schoolName, s.schoolCode, s.principalName, s.teacherInCharge, s.schoolPhone,
          s.clubName, s.studentName, s.studentFurigana, s.gender, s.clubAchievements, s.scoreInfo, s.scholarshipRank,
          s.recruiterType, s.callDatePrincipal, s.callDateAdvisor, s.visitDate, s.prospect, s.result, s.notes
      ];
  }

  private mapRowsToSchools(rows: any[][]): SchoolData[] {
      return rows.map(row => ({
          code: row[0]?.toString() || '',
          name: row[1] || '',
          municipality: row[2] || '',
          principal: row[3] || '',
          phone: row[4]?.toString() || '',
          headTeacher: row[5] || ''
      }));
  }
  
  private mapSchoolToRow(s: SchoolData): any[] {
      return [s.code, s.name, s.municipality, s.principal, s.phone, s.headTeacher];
  }
}

export const sheetService = new SheetService();
