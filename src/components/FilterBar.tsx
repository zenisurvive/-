import React from 'react';
import { Search, X, LayoutGrid, Table, Bookmark, Sparkles } from 'lucide-react';
import { RegionType, ViewMode } from '../types';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedRegion: RegionType;
  onRegionChange: (region: RegionType) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showOnlyBookmarks: boolean;
  onToggleBookmarks: () => void;
  bookmarkCount: number;
  filteredCount: number;
}

const REGIONS: RegionType[] = [
  '전국',
  '서울',
  '경기',
  '인천',
  '강원',
  '충청/대전',
  '전라/광주',
  '대구/경북',
  '부산/울산/경남',
  '제주'
];
const CATEGORIES = ['전체 분류', 'Big 5', '가톨릭 성모계열', '대학병원/의료원', '종합/전문병원'];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedRegion,
  onRegionChange,
  selectedCategory,
  onCategoryChange,
  viewMode,
  onViewModeChange,
  showOnlyBookmarks,
  onToggleBookmarks,
  bookmarkCount,
  filteredCount,
}) => {
  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Search row and Action buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="병원명, 부서, 키워드 검색 (예: 성모, 세브란스, 아산, 진단검사)..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 flex-shrink-0">
            <button
              onClick={onToggleBookmarks}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition border ${
                showOnlyBookmarks
                  ? 'bg-amber-50 text-amber-800 border-amber-300 ring-2 ring-amber-400/30'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${showOnlyBookmarks ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
              <span>관심 공고</span>
              <span className={`px-1.5 py-0.2 rounded-full text-xs font-semibold ${
                showOnlyBookmarks ? 'bg-amber-200 text-amber-900' : 'bg-slate-100 text-slate-600'
              }`}>
                {bookmarkCount}
              </span>
            </button>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 rounded-lg text-sm transition ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-600 shadow-xs font-medium'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="카드 보기"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('table')}
                className={`p-1.5 rounded-lg text-sm transition ${
                  viewMode === 'table'
                    ? 'bg-white text-indigo-600 shadow-xs font-medium'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="목록 표 보기"
              >
                <Table className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter chips & Region Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1 border-t border-slate-100">
          {/* Region Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-sm">
            {REGIONS.map((region) => (
              <button
                key={region}
                onClick={() => onRegionChange(region)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition text-xs sm:text-sm ${
                  selectedRegion === region
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Categories Quick Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-slate-400 flex items-center gap-1 pl-1 pr-1 font-medium whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              구분:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap transition border ${
                  selectedCategory === cat
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold'
                    : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}

            <div className="text-slate-400 text-xs pl-2 font-medium whitespace-nowrap">
              검색결과: <strong className="text-slate-800">{filteredCount}</strong>건
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
