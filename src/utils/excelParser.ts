import * as XLSX from 'xlsx';
import { JobItem } from '../types';
import { nationwideUniversityHospitals } from '../data/hospitalsData';

export function inferRegion(hospitalName: string, explicitRegion?: string): string {
  if (explicitRegion && explicitRegion.trim()) {
    const trimmed = explicitRegion.trim();
    if (['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '충남', '충북', '충청', '경남', '경북', '경상', '전남', '전북', '전라', '강원', '제주', '세종'].includes(trimmed)) {
      return trimmed;
    }
  }

  const name = hospitalName.toLowerCase();
  
  if (name.includes('제주') || name.includes('한라')) {
    return '제주';
  }
  if (name.includes('강원') || name.includes('춘천') || name.includes('원주') || name.includes('강릉')) {
    return '강원';
  }
  if (name.includes('부산') || name.includes('동아대') || name.includes('해운대') || name.includes('고신대') || name.includes('양산')) {
    return '부산';
  }
  if (name.includes('울산')) {
    return '울산';
  }
  if (name.includes('대구') || name.includes('영남대') || name.includes('계명대') || name.includes('동산병원') || name.includes('파티마')) {
    return '대구';
  }
  if (name.includes('경북대') || name.includes('칠곡') || name.includes('안동') || name.includes('경주') || name.includes('포항') || name.includes('구미')) {
    return '대구';
  }
  if (name.includes('진주') || name.includes('창원') || name.includes('경상대') || name.includes('마산')) {
    return '경상';
  }
  if (name.includes('광주') || name.includes('전남대') || name.includes('조선대') || name.includes('화순') || name.includes('빛고을')) {
    return '광주';
  }
  if (name.includes('전북대') || name.includes('전주') || name.includes('익산') || name.includes('원광대') || name.includes('예수병원') || name.includes('순천') || name.includes('목포') || name.includes('여수')) {
    return '전라';
  }
  if (name.includes('대전') || name.includes('충남대') || name.includes('을지대') || name.includes('건양대') || name.includes('대전성모') || name.includes('세종')) {
    return '대전';
  }
  if (name.includes('충북') || name.includes('청주') || name.includes('천안') || name.includes('단국대') || name.includes('순천향대천안') || name.includes('충주')) {
    return '충청';
  }
  if (name.includes('인천') || name.includes('길병원') || name.includes('인하대') || name.includes('국제성모')) {
    return '인천';
  }
  if (name.includes('분당') || name.includes('부천') || name.includes('수원') || name.includes('안양') || 
      name.includes('성빈센트') || name.includes('아주대') || name.includes('구리') || name.includes('일산') || 
      name.includes('의정부') || name.includes('평촌') || name.includes('고양') || name.includes('파주') ||
      name.includes('동탄') || name.includes('안산') || name.includes('국민건강보험') || name.includes('국립암센터') ||
      name.includes('경기')) {
    return '경기';
  }
  
  // Default to Seoul
  return '서울';
}

export function inferCategory(hospitalName: string): string {
  const name = hospitalName;
  if (['서울대병원', '서울아산병원', '삼성서울병원', '연세대학교의료원', '서울성모병원', '신촌세브란스', '강남세브란스'].some(h => name.includes(h))) {
    return 'Big 5';
  }
  if (name.includes('성모')) {
    return '가톨릭 성모계열';
  }
  if (name.includes('대학교') || name.includes('대병원') || name.includes('의료원') || name.includes('세브란스') || name.includes('아산병원')) {
    return '대학병원/의료원';
  }
  return '종합/전문병원';
}

export function parseExcelBuffer(buffer: ArrayBuffer): JobItem[] {
  const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) return nationwideUniversityHospitals;
  const worksheet = workbook.Sheets[firstSheetName];

  // Try raw 2D array first to handle arbitrary title headers or 2-column lists
  const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];
  
  const jobs: JobItem[] = [];

  // Check if there is a structured header row
  let headerRowIdx = -1;
  let colMap: { [key: string]: number } = {};

  for (let i = 0; i < Math.min(rawRows.length, 10); i++) {
    const row = rawRows[i];
    if (!Array.isArray(row)) continue;
    const rowStr = row.map(c => String(c || '').trim().toLowerCase());
    
    const hospitalCol = rowStr.findIndex(c => c.includes('병원') || c.includes('기관') || c.includes('hospital') || c.includes('기업'));
    if (hospitalCol !== -1 && rowStr.some(c => c.includes('지역') || c.includes('링크') || c.includes('파트') || c.includes('마감') || c.includes('url') || c.includes('급여'))) {
      headerRowIdx = i;
      rowStr.forEach((c, idx) => {
        if (c.includes('병원') || c.includes('기관') || c.includes('hospital')) colMap.hospital = idx;
        if (c.includes('지역') || c.includes('위치') || c.includes('region')) colMap.region = idx;
        if (c.includes('파트') || c.includes('직무') || c.includes('분야') || c.includes('채용') || c.includes('dept')) colMap.department = idx;
        if (c.includes('급여') || c.includes('연봉') || c.includes('salary')) colMap.salary = idx;
        if (c.includes('마감') || c.includes('기간') || c.includes('deadline')) colMap.deadline = idx;
        if (c.includes('링크') || c.includes('상세') || c.includes('url') || c.includes('link') || c.includes('홈페이지')) colMap.link = idx;
      });
      break;
    }
  }

  if (headerRowIdx !== -1 && colMap.hospital !== undefined) {
    for (let i = headerRowIdx + 1; i < rawRows.length; i++) {
      const row = rawRows[i];
      if (!Array.isArray(row)) continue;
      const hospital = String(row[colMap.hospital] || '').trim();
      if (!hospital || hospital.startsWith('★') || hospital.startsWith('※')) continue;

      const rawLink = colMap.link !== undefined ? String(row[colMap.link] || '').trim() : '';
      const explicitRegion = colMap.region !== undefined ? String(row[colMap.region] || '').trim() : '';
      const department = colMap.department !== undefined ? String(row[colMap.department] || '').trim() : '임상병리사';
      const salary = colMap.salary !== undefined ? String(row[colMap.salary] || '').trim() : '병원 내규에 따름';
      const deadline = colMap.deadline !== undefined ? String(row[colMap.deadline] || '').trim() : '채용공고 참조';

      jobs.push({
        id: `excel-job-${i}-${Math.random().toString(36).substr(2, 5)}`,
        hospital,
        region: inferRegion(hospital, explicitRegion),
        department: department || '임상병리사',
        salary: salary || '병원 내규에 따름',
        deadline: deadline || '채용공고 참조',
        link: rawLink && (rawLink.startsWith('http') || rawLink.startsWith('www')) ? (rawLink.startsWith('www') ? `https://${rawLink}` : rawLink) : '#',
        category: inferCategory(hospital),
      });
    }
  } else {
    let idx = 0;
    for (const row of rawRows) {
      if (!Array.isArray(row) || row.length === 0) continue;
      
      const col0 = String(row[0] || '').trim();
      const col1 = String(row[1] || '').trim();

      if (!col0 || col0.includes('★') || (col0.includes('채용공고') && col0.includes('★☆★'))) {
        continue;
      }

      let hospital = col0;
      let link = col1;

      if (col0.startsWith('http') && !col1.startsWith('http')) {
        hospital = col1;
        link = col0;
      }

      if (!link || link === 'undefined' || link === 'null') {
        link = '#';
      } else if (link.startsWith('www.')) {
        link = `https://${link}`;
      }

      if (hospital.length > 0) {
        jobs.push({
          id: `excel-job-${idx++}`,
          hospital,
          region: inferRegion(hospital),
          department: '진단검사의학과 / 병리과 임상병리사',
          salary: '병원 내규에 따름',
          deadline: '공고 확인',
          link,
          category: inferCategory(hospital),
        });
      }
    }
  }

  // Merge parsed excel jobs with nationwide dataset to ensure full coverage
  return mergeWithNationwideHospitals(jobs);
}

export function mergeWithNationwideHospitals(customJobs: JobItem[]): JobItem[] {
  if (customJobs.length === 0) return nationwideUniversityHospitals;

  const result: JobItem[] = [...customJobs];
  const customHospitalNames = new Set(
    customJobs.map(j => j.hospital.replace(/\s+/g, '').toLowerCase())
  );

  // Add any nationwide university hospitals that are not present in customJobs
  for (const nationHosp of nationwideUniversityHospitals) {
    const norm = nationHosp.hospital.replace(/\s+/g, '').toLowerCase();
    let alreadyExists = false;
    for (const name of customHospitalNames) {
      if (name.includes(norm) || norm.includes(name) || (name.slice(0, 4) === norm.slice(0, 4) && name.length >= 4)) {
        alreadyExists = true;
        break;
      }
    }

    if (!alreadyExists) {
      result.push(nationHosp);
    }
  }

  return result;
}

export const defaultSampleJobs: JobItem[] = nationwideUniversityHospitals;

