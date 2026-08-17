import React, { useRef, useState } from 'react';
import { X, Upload, FileSpreadsheet, Download, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { parseExcelBuffer } from '../utils/excelParser';
import { JobItem } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: (jobs: JobItem[], fileName: string) => void;
  onResetDefault: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onDataLoaded,
  onResetDefault,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      setErrorMsg('엑셀 파일(.xlsx, .xls) 또는 .csv 파일만 업로드 가능합니다.');
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const jobs = parseExcelBuffer(buffer);
      if (jobs.length === 0) {
        setErrorMsg('엑셀 파일에서 병원 및 채용 정보를 찾을 수 없습니다. 양식을 확인해주세요.');
        return;
      }
      setSuccessMsg(`성공적으로 ${jobs.length}개의 채용 정보가 로드되었습니다!`);
      setTimeout(() => {
        onDataLoaded(jobs, file.name);
        onClose();
      }, 700);
    } catch (err) {
      console.error(err);
      setErrorMsg('파일을 파싱하는 중 오류가 발생했습니다.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDownloadSample = () => {
    const sampleData = [
      { '병원명': '서울대학교병원', '지역': '서울', '채용파트': '진단검사의학과', '급여': '기관내규', '마감일': '상시채용', '상세링크': 'https://www.snuh.org' },
      { '병원명': '분당서울대병원', '지역': '경기', '채용파트': '생리학검사', '급여': '3800~4200', '마감일': '2024-12-31', '상세링크': 'https://snubh.recruiter.co.kr' },
      { '병원명': '인천성모병원', '지역': '인천', '채용파트': '혈액학', '급여': '병원내규', '마감일': '채용시까지', '상세링크': 'https://cmcism.recruiter.co.kr' },
    ];
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '채용공고');
    XLSX.writeFile(wb, '채용정보_샘플양식.xlsx');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">엑셀(Excel) 데이터 업로드</h2>
              <p className="text-xs text-slate-500">새로운 채용공고 엑셀 파일을 불러옵니다</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-5 border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${
            dragActive
              ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
              : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls, .csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <p className="font-semibold text-slate-800 text-sm">
            엑셀 파일을 드래그하여 놓거나 클릭하여 선택
          </p>
          <p className="text-xs text-slate-500 mt-1">
            지원 파일 형식: .xlsx, .xls, .csv
          </p>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="mt-3.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-3.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
          <button
            onClick={handleDownloadSample}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-indigo-600 hover:text-indigo-700 font-medium hover:bg-indigo-50 rounded-xl transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>샘플 양식 다운로드</span>
          </button>

          <button
            onClick={() => {
              onResetDefault();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-slate-600 hover:text-slate-900 font-medium hover:bg-slate-100 rounded-xl transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>기본 데이터 복원</span>
          </button>
        </div>
      </div>
    </div>
  );
};
