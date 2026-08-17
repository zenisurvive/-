import React, { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

interface AdBannerProps {
  position: 'top' | 'bottom';
  adClient?: string; // e.g. "ca-pub-XXXXXXXXXXXXXXXX"
  adSlot?: string;   // e.g. "1234567890"
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export const AdBanner: React.FC<AdBannerProps> = ({
  position,
  adClient = '', // Replace with your real ca-pub-xxx or configure via env
  adSlot = '',
  className = '',
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const isLoadedRef = useRef(false);

  useEffect(() => {
    // Only load external AdSense script if adClient is provided
    if (adClient && !document.getElementById('adsense-script')) {
      const script = document.createElement('script');
      script.id = 'adsense-script';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Only trigger adsbygoogle if adClient and adSlot are provided and not already triggered
    if (adClient && adSlot && adRef.current && !isLoadedRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isLoadedRef.current = true;
      } catch (err) {
        console.warn('AdSense load error:', err);
      }
    }
  }, [adClient, adSlot]);

  const isTop = position === 'top';

  return (
    <div
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
        isTop ? 'my-4' : 'mt-8 mb-4'
      } ${className}`}
    >
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-r from-slate-50 via-indigo-50/20 to-slate-50 p-3 sm:p-4 text-center transition shadow-xs">
        {/* Top small sponsor badge */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1.5 px-1">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            {isTop ? '스폰서 배너 (상단 광고 영역)' : '스폰서 배너 (하단 광고 영역)'}
          </span>
          <span className="text-[10px] text-slate-300">ADVERTISEMENT</span>
        </div>

        {/* Real AdSense Slot or Clean Placeholder */}
        {adClient && adSlot ? (
          <div className="min-h-[90px] flex items-center justify-center overflow-hidden">
            <ins
              ref={adRef}
              className="adsbygoogle block w-full text-center"
              style={{ display: 'block', minHeight: '90px' }}
              data-ad-client={adClient}
              data-ad-slot={adSlot}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        ) : (
          <div className="min-h-[80px] sm:min-h-[90px] rounded-xl border border-dashed border-indigo-200/60 bg-white/70 flex flex-col items-center justify-center p-3 text-center">
            <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                구글 애드센스 준비 완료
              </span>
              <p className="text-xs sm:text-sm font-medium text-slate-700">
                {isTop
                  ? '구글 애드센스 승인 후 게시자 ID(ca-pub-xxx)를 넣으면 실제 맞춤 광고가 표시됩니다'
                  : '병원 채용 및 임상병리 관련 타깃 맞춤 광고가 깔끔하게 노출되는 영역입니다'}
              </p>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              반응형 배너 규격 (PC 리더보드 728x90 / 모바일 320x100 자동 최적화)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
