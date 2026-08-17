import React from 'react';
import { Hospital, RefreshCw } from 'lucide-react';

interface HeaderProps {
  totalCount: number;
  onRefresh: () => void;
  loading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  onRefresh,
  loading,
}) => {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-13 h-13 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-inner flex-shrink-0">
              <Hospital className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  임상병리사 채용 정보 센터
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  전국 {totalCount}개 병원 공고
                </span>
              </div>
              <p className="text-slate-300 text-sm mt-1.5 font-normal">
                전국 주요 대학병원 및 상급종합병원 공식 채용포털 실시간 바로가기
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onRefresh}
              disabled={loading}
              title="데이터 새로고침"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
              <span>새로고침</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};


