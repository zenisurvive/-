import React from 'react';
import { Building, MapPin, Award, Bookmark } from 'lucide-react';
import { JobItem, RegionType } from '../types';

interface StatsBannerProps {
  jobs: JobItem[];
  bookmarkedCount: number;
  onSelectRegion: (region: RegionType) => void;
  onSelectCategory: (category: string) => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  jobs,
  bookmarkedCount,
  onSelectRegion,
  onSelectCategory,
}) => {
  const seoulCount = jobs.filter(j => j.region === '서울').length;
  const gyeonggiCount = jobs.filter(j => j.region === '경기' || j.region === '인천').length;
  const nonCapitalCount = jobs.filter(j => !['서울', '경기', '인천'].includes(j.region)).length;
  const big5Count = jobs.filter(j => j.category === 'Big 5').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <div 
        onClick={() => onSelectRegion('전국')}
        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-indigo-300 transition group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">전국 등록 병원</span>
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition">
            <Building className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-slate-900">{jobs.length}</span>
          <span className="text-xs text-slate-400 font-medium">개 기관</span>
        </div>
      </div>

      <div 
        onClick={() => onSelectCategory('Big 5')}
        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-rose-300 transition group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">주요 상급종합 (Big 5)</span>
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-100 transition">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-rose-600">{big5Count}</span>
          <span className="text-xs text-slate-400 font-medium">개 병원</span>
        </div>
      </div>

      <div 
        onClick={() => onSelectRegion('전국')}
        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">권역별 분포</span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-600 flex-wrap">
          <span onClick={(e) => { e.stopPropagation(); onSelectRegion('서울'); }} className="hover:text-indigo-600 cursor-pointer">서울 <strong className="text-slate-900">{seoulCount}</strong></span>
          <span className="text-slate-300">•</span>
          <span onClick={(e) => { e.stopPropagation(); onSelectRegion('경기'); }} className="hover:text-indigo-600 cursor-pointer">경기/인천 <strong className="text-slate-900">{gyeonggiCount}</strong></span>
          <span className="text-slate-300">•</span>
          <span className="text-indigo-600 font-semibold">지방 <strong className="text-slate-900">{nonCapitalCount}</strong></span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">관심 등록 공고</span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Bookmark className="w-4 h-4 fill-amber-500/20" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-amber-600">{bookmarkedCount}</span>
          <span className="text-xs text-slate-400 font-medium">개 스크랩</span>
        </div>
      </div>
    </div>
  );
};
