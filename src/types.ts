export interface JobItem {
  id: string;
  hospital: string;
  region: string;
  department?: string;
  salary?: string;
  deadline?: string;
  link: string;
  category?: string;
  notes?: string;
}

export type RegionType = 
  | '전국' 
  | '서울' 
  | '경기' 
  | '인천' 
  | '강원' 
  | '충청/대전' 
  | '전라/광주' 
  | '대구/경북' 
  | '부산/울산/경남' 
  | '제주';

export type ViewMode = 'grid' | 'table';
