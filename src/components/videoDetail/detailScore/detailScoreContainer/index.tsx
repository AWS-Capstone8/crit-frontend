import { useState } from 'react';
import InfoIcon from '@/assets/icons/score-icons/video-detail/info-icon.svg?react';
import ClickIcon from '@/assets/icons/score-icons/video-detail/click-icon.svg?react';
import AlarmIcon from '@/assets/icons/score-icons/video-detail/orange-alarm-icon.svg?react';
import StarIcon from '@/assets/icons/score-icons/video-detail/star-icon.svg?react';
import useCurrentVideoStore from '@/stores/useCurrentVideoStore';

interface ScoreContainerProps {
  factorName: string;
}

const titleConfig: Record<
  string,
  {
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    bgColor: string;
    badgeBg: string;
    textColor: string;
    barFill: string;
    barTrack: string;
    definition: string;
  }
> = {
  도달률: {
    Icon: ClickIcon,
    bgColor: 'bg-[#DEF3E195]',
    badgeBg: 'bg-[#DEF3E195]',
    textColor: 'text-[#5AC467]',
    barFill: '#5AC467',
    barTrack: '#DEF3E1',
    definition:
      '영상이 얼마나 많은 시청자에게 노출되었는지를 나타내며, 콘텐츠의 확산력을 측정하는 지표입니다.',
  },
  '시청 지속 시간': {
    Icon: AlarmIcon,
    bgColor: 'bg-[#FFFCEF]',
    badgeBg: 'bg-[#FFFCEF]',
    textColor: 'text-[#FF9D00]',
    barFill: '#FF9D00',
    barTrack: '#FFFCEF',
    definition:
      '시청자가 영상을 얼마나 오래 시청했는지를 나타내며, 콘텐츠의 몰입도를 측정하는 핵심 지표입니다.',
  },
  '추천 확장성': {
    Icon: StarIcon,
    bgColor: 'bg-[#FFEFEF]',
    badgeBg: 'bg-[#FFEFEF]',
    textColor: 'text-[#FF0000]',
    barFill: '#FF0000',
    barTrack: '#FFEFEF',
    definition:
      '유튜브 알고리즘이 이 영상을 다른 시청자에게 추천할 가능성을 나타내는 종합 지표입니다.',
  },
};

const DetailScoreContainer = ({ factorName }: ScoreContainerProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const videoAnalysis = useCurrentVideoStore(s => s.videoAnalysis);
  const isLoading = useCurrentVideoStore(s => s.isLoading);

  const factors = videoAnalysis?.factors;
  const factor = factors?.find(f => f.name === factorName);

  const config = titleConfig[factorName];

  // config가 없으면 렌더링하지 않음
  if (!config) return null;

  const Icon = config.Icon;

  const showLoading = isLoading || !factor;
  const score = factor?.score ?? 0;
  const topPercent = factor?.topPercent ?? 0;
  const avgDiff = factor?.changePercent ?? 0;
  const content = factor?.description ?? '';

  return (
    <div className="flex flex-col w-full px-8 py-7 gap-4 justify-start items-center rounded-xl bg-white border-[0.1px] border-[#8257B4]">
      <div className="flex w-full justify-start items-start gap-2 rounded-xl">
        <div className={`flex justify-center items-center p-3 rounded-xl ${config.bgColor}`}>
          <Icon className="w-7 h-7" />
        </div>
        <div className="flex flex-col w-full justify-center items-center gap-4 py-3 pr-3">
          <div className="flex w-full justify-start items-center gap-1">
            <div className="text-black typo-body4-semibold">{factorName}</div>
            <div
              className="relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <InfoIcon className="w-3.5 h-3.5 cursor-pointer" />
              {showTooltip && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-60 px-3 py-2 rounded-lg bg-white border border-[#8257B4] shadow-lg z-10 typo-body5 text-black">
                  {config.definition}
                </div>
              )}
            </div>
          </div>
          <div className="flex w-full justify-between items-end gap-5 self-stretch">
            <div className="flex justify-center items-center">
              {showLoading ? (
                <div className="text-gray-400 animate-loading-pulse typo-title1">--</div>
              ) : (
                <div className={`typo-title1 ${config.textColor}`}>{score}</div>
              )}
              <div className="typo-body2 text-black">&nbsp;/ 100</div>
            </div>
            <div
              className={`flex justify-center items-center px-3 py-1 rounded-xl ${config.badgeBg} ${config.textColor} typo-body6`}
            >
              {showLoading ? (
                <span className="animate-loading-pulse">계산 중</span>
              ) : (
                `상위 ${topPercent}%`
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className="w-full h-2 rounded-full progress-bar-track"
        style={{ '--progress-track': config.barTrack } as React.CSSProperties}
      >
        <div
          className="h-2 rounded-full transition-all duration-500 progress-bar-fill"
          style={
            {
              '--progress-width': showLoading ? '0%' : `${score}%`,
              '--progress-fill': config.barFill,
            } as React.CSSProperties
          }
        />
      </div>

      {avgDiff != null && avgDiff !== 0 && avgDiff !== -100 && (
        <div className="flex w-full justify-start items-center">
          <div
            className={`flex px-3 py-1 justify-center items-center rounded-xl ${config.bgColor} ${config.textColor} typo-body6`}
          >
            {showLoading ? (
              <span className="animate-loading-pulse">평균 대비 계산 중</span>
            ) : (
              `평균 대비 ${avgDiff >= 0 ? '+' : ''}${avgDiff}%`
            )}
          </div>
        </div>
      )}
      <div className="flex w-full justify-start items-center text-black typo-body5">
        {showLoading ? (
          <span className="text-gray-400 animate-loading-pulse">
            분석 결과를 불러오는 중입니다...
          </span>
        ) : (
          content
        )}
      </div>
    </div>
  );
};

export default DetailScoreContainer;
