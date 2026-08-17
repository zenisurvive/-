import React, { useState } from 'react';
import { ExternalLink, Bookmark, MapPin, Building2, Copy, Check, Briefcase } from 'lucide-react';
import { JobItem } from '../types';

interface JobCardProps {
  job: JobItem;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (job.link && job.link !== '#') {
      navigator.clipboard.writeText(job.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getRegionBadgeColor = (region: string) => {
    switch (region) {
      case '서울':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case '경기':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case '인천':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case '강원':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case '대전':
      case '충청':
      case '충남':
      case '충북':
      case '세종':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case '광주':
      case '전라':
      case '전남':
      case '전북':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case '대구':
      case '경북':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case '부산':
      case '울산':
      case '경남':
      case '경상':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case '제주':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getCategoryBadge = (category?: string) => {
    if (category === 'Big 5') {
      return 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
    }
    if (category === '가톨릭 성모계열') {
      return 'bg-purple-50 text-purple-700 border-purple-200';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const hasValidLink = job.link && job.link !== '#' && job.link.startsWith('http');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition duration-200 flex flex-col p-5 group hover:border-indigo-300">
      {/* Top row: Hospital & Category & Bookmark */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
            <span className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${getRegionBadgeColor(job.region)}`}>
              <MapPin className="w-3 h-3 inline mr-0.5 -mt-0.5" />
              {job.region}
            </span>
            {job.category && (
              <span className={`text-[11px] px-2 py-0.5 rounded-md border ${getCategoryBadge(job.category)}`}>
                {job.category}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>{job.hospital}</span>
          </h3>
        </div>

        <button
          onClick={() => onToggleBookmark(job.id)}
          title={isBookmarked ? '관심 공고 해제' : '관심 공고 저장'}
          className={`p-2 rounded-xl transition ${
            isBookmarked
              ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
              : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
        </button>
      </div>

      {/* Body info */}
      <div className="space-y-2 py-3 border-y border-slate-100 text-sm my-auto">
        <div className="flex items-center justify-between text-slate-600">
          <span className="text-slate-400 text-xs flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5" />
            모집 직무
          </span>
          <span className="font-medium text-slate-800 text-right truncate max-w-[180px]">
            {job.department || '임상병리사'}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span className="text-slate-400 text-xs">급여 / 대우</span>
          <span className="font-medium text-slate-700 text-xs">
            {job.salary || '병원 내규에 따름'}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span className="text-slate-400 text-xs">접수 마감</span>
          <span className="text-xs font-semibold text-rose-600">
            {job.deadline || '채용공고 페이지 참조'}
          </span>
        </div>
      </div>

      {/* Footer link button */}
      <div className="pt-3 flex items-center gap-2">
        {hasValidLink ? (
          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition active:scale-98"
          >
            <span>공고 상세보기</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <div className="flex-1 py-2 text-center text-xs text-slate-400 bg-slate-100 rounded-xl font-medium">
            공고 링크 준비중
          </div>
        )}

        {hasValidLink && (
          <button
            onClick={handleCopy}
            title="공고 링크 복사"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};
