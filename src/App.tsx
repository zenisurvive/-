/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { JobItem, RegionType, ViewMode } from './types';
import { parseExcelBuffer, defaultSampleJobs } from './utils/excelParser';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { JobCard } from './components/JobCard';
import { JobTable } from './components/JobTable';
import { StatsBanner } from './components/StatsBanner';
import { SearchX, Loader2 } from 'lucide-react';

export default function App() {
  const [allJobs, setAllJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<RegionType>('전국');
  const [selectedCategory, setSelectedCategory] = useState('전체 분류');
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('job_view_mode') as ViewMode) || 'grid';
  });
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('job_bookmarks');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Load jobs on boot
  const loadDefaultJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/jobs.xlsx');
      if (!res.ok) throw new Error('Cannot load /jobs.xlsx');
      const buffer = await res.arrayBuffer();
      const parsed = parseExcelBuffer(buffer);
      if (parsed.length > 0) {
        setAllJobs(parsed);
      } else {
        setAllJobs(defaultSampleJobs);
      }
    } catch (err) {
      console.warn('Failed to load /jobs.xlsx, using default dataset:', err);
      setAllJobs(defaultSampleJobs);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDefaultJobs();
  }, [loadDefaultJobs]);

  // Persist bookmarks
  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      localStorage.setItem('job_bookmarks', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('job_view_mode', mode);
  };

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return allJobs.filter((job) => {
      // Bookmark filter
      if (showOnlyBookmarks && !bookmarkedIds.has(job.id)) {
        return false;
      }

      // Region filter
      if (selectedRegion !== '전국') {
        if (selectedRegion === '강원') {
          if (job.region !== '강원') return false;
        } else if (selectedRegion === '충청/대전') {
          if (!['충청', '대전', '충남', '충북', '세종'].includes(job.region)) return false;
        } else if (selectedRegion === '전라/광주') {
          if (!['전라', '광주', '전남', '전북'].includes(job.region)) return false;
        } else if (selectedRegion === '대구/경북') {
          if (!['대구', '경북'].includes(job.region)) return false;
        } else if (selectedRegion === '부산/울산/경남') {
          if (!['부산', '울산', '경남', '경상'].includes(job.region)) return false;
        } else if (selectedRegion === '제주') {
          if (job.region !== '제주') return false;
        } else if (job.region !== selectedRegion) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== '전체 분류' && job.category !== selectedCategory) {
        return false;
      }

      // Search term filter
      if (term) {
        const matchHospital = job.hospital.toLowerCase().includes(term);
        const matchDept = (job.department || '').toLowerCase().includes(term);
        const matchRegion = job.region.toLowerCase().includes(term);
        const matchCategory = (job.category || '').toLowerCase().includes(term);
        return matchHospital || matchDept || matchRegion || matchCategory;
      }

      return true;
    });
  }, [allJobs, searchTerm, selectedRegion, selectedCategory, showOnlyBookmarks, bookmarkedIds]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Header */}
      <Header
        totalCount={allJobs.length}
        onRefresh={loadDefaultJobs}
        loading={loading}
      />

      {/* Filter and Navigation Sticky Bar */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        showOnlyBookmarks={showOnlyBookmarks}
        onToggleBookmarks={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
        bookmarkCount={bookmarkedIds.size}
        filteredCount={filteredJobs.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Stats Overview */}
        <StatsBanner
          jobs={allJobs}
          bookmarkedCount={bookmarkedIds.size}
          onSelectRegion={setSelectedRegion}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />

        {/* Content State: Loading, Empty, or List */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
            <p className="text-slate-600 font-medium">전국 대학병원 채용공고 데이터를 불러오는 중입니다...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center my-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">일치하는 채용공고가 없습니다</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
              {showOnlyBookmarks 
                ? '관심 공고로 등록된 병원이 없습니다. 카드 또는 목록에서 북마크 아이콘을 눌러 추가해보세요.'
                : '검색어나 지역 필터를 변경하시거나 전체 조회를 시도해보세요.'}
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRegion('전국');
                  setSelectedCategory('전체 분류');
                  setShowOnlyBookmarks(false);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition"
              >
                필터 전체 초기화
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isBookmarked={bookmarkedIds.has(job.id)}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>
        ) : (
          <JobTable
            jobs={filteredJobs}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={toggleBookmark}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-semibold text-slate-700 text-sm">임상병리사 채용 정보 센터</p>
            <p className="mt-1 text-slate-400">
              본 서비스는 주요 종합/대학병원의 공식 채용공고 페이지 바로가기 편의를 제공합니다.
            </p>
          </div>
          <div className="text-slate-400">
            &copy; {new Date().getFullYear()} Clinical Pathology Career Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
