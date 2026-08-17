import React, { useState } from 'react';
import { ExternalLink, Bookmark, Building2, Copy, Check } from 'lucide-react';
import { JobItem } from '../types';

interface JobTableProps {
  jobs: JobItem[];
  bookmarkedIds: Set<string>;
  onToggleBookmark: (id: string) => void;
}

export const JobTable: React.FC<JobTableProps> = ({
  jobs,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, link: string) => {
    if (link && link !== '#') {
      navigator.clipboard.writeText(link);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 w-12 text-center">관심</th>
              <th className="py-3.5 px-4 w-24">지역</th>
              <th className="py-3.5 px-4">병원/기관명</th>
              <th className="py-3.5 px-4">분류</th>
              <th className="py-3.5 px-4">채용 부서 / 직무</th>
              <th className="py-3.5 px-4 text-right">공고 링크</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.map((job) => {
              const isBookmarked = bookmarkedIds.has(job.id);
              const hasValidLink = job.link && job.link !== '#' && job.link.startsWith('http');
              const isCopied = copiedId === job.id;

              return (
                <tr key={job.id} className="hover:bg-indigo-50/40 transition">
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onToggleBookmark(job.id)}
                      className="p-1 rounded-lg text-slate-300 hover:text-amber-500 transition"
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {job.region}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>{job.hospital}</span>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-500">
                    {job.category || '종합/전문병원'}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {job.department || '임상병리사'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      {hasValidLink ? (
                        <>
                          <a
                            href={job.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition"
                          >
                            <span>공고 바로가기</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleCopy(job.id, job.link)}
                            title="링크 복사"
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400">링크 미등록</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
