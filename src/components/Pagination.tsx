import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  if (totalItems === 0) return null;

  // Calculate visible range
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        start = 2;
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      // Always show last
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="mt-8 pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Items count & Per-page selector */}
      <div className="flex items-center gap-3 text-sm text-slate-600">
        <span className="font-medium text-slate-700">
          총 <span className="text-indigo-600 font-bold">{totalItems}</span>개 중{' '}
          <span className="font-semibold text-slate-900">
            {startIndex}-{endIndex}
          </span>
          번째 공고
        </span>

        <div className="flex items-center gap-1.5 ml-2">
          <span className="text-xs text-slate-400">페이지당:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-xs cursor-pointer"
          >
            <option value={12}>12개씩 보기</option>
            <option value={24}>24개씩 보기</option>
            <option value={36}>36개씩 보기</option>
            <option value={48}>48개씩 보기</option>
            <option value={96}>96개씩 보기</option>
          </select>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          title="첫 페이지"
          className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-30 disabled:pointer-events-none transition shadow-xs"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Prev Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="이전 페이지"
          className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-30 disabled:pointer-events-none transition shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-1">
          {getPageNumbers().map((page, index) =>
            typeof page === 'number' ? (
              <button
                key={index}
                onClick={() => onPageChange(page)}
                className={`min-w-[36px] h-9 px-2 text-sm font-semibold rounded-lg transition shadow-xs ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white border border-indigo-600 shadow-indigo-100'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {page}
              </button>
            ) : (
              <span
                key={index}
                className="w-8 text-center text-slate-400 font-medium select-none"
              >
                {page}
              </span>
            )
          )}
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="다음 페이지"
          className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-30 disabled:pointer-events-none transition shadow-xs"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          title="마지막 페이지"
          className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-30 disabled:pointer-events-none transition shadow-xs"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
