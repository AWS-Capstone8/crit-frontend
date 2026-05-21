import CommentIcon from '@/assets/icons/score-icons/comment-icon.svg?react';

interface Benchmark {
  p25: number;
  p50: number;
  p75: number;
}

interface GuideItemProps {
  comment: string;
  subcomment: string;
  metric?: string;
  current?: number;
  target?: number;
  benchmark?: Benchmark;
}

const metricLabels: Record<string, string> = {
  vps: 'VPS (조회수/구독자)',
  dailyViews: '일평균 조회수',
  uploadFrequency: '업로드 빈도',
  avgDuration: '평균 영상 길이',
  engagement: '시청자 반응',
  shortFormRatio: '숏폼 비율',
};

const formatMetricValue = (metric: string, value: number): string => {
  switch (metric) {
    case 'vps':
      return value.toFixed(3);
    case 'dailyViews':
      return value >= 10000
        ? `${(value / 10000).toFixed(1)}만`
        : Math.round(value).toLocaleString();
    case 'uploadFrequency':
      return `주 ${value.toFixed(1)}회`;
    case 'avgDuration':
      return `${value.toFixed(1)}분`;
    case 'engagement':
      return (value * 100).toFixed(2) + '%';
    case 'shortFormRatio':
      return (value * 100).toFixed(0) + '%';
    default:
      return value.toFixed(2);
  }
};

const GuideItem = ({ comment, subcomment, metric, current, target, benchmark }: GuideItemProps) => {
  const progressPercent =
    benchmark && current != null && benchmark.p75 > 0
      ? Math.min(100, (current / benchmark.p75) * 100)
      : 0;

  return (
    <div className="flex w-full px-5 py-5 justify-start items-start gap-2.5 self-stretch rounded-xl bg-[#F5EFFF]">
      <CommentIcon className="shrink-0 mt-0.5" />
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full justify-start text-black typo-body4-semibold">{comment}</div>
        <div className="flex w-full justify-start text-[#555] typo-body5">{subcomment}</div>
        {metric && benchmark && current != null && (
          <div className="flex flex-col gap-1.5 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#717171]">{metricLabels[metric] ?? metric}</span>
              <span className="text-xs font-semibold text-[#7C5CFF]">
                {formatMetricValue(metric, current)} →{' '}
                {target != null ? formatMetricValue(metric, target) : '-'}
              </span>
            </div>
            <div className="relative w-full h-2 bg-[#E8E0FF] rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-[#7C5CFF] rounded-full transition-all benchmark-progress-fill"
                style={{ '--benchmark-progress': progressPercent } as React.CSSProperties}
              />
              {benchmark.p50 > 0 && (
                <div
                  className="absolute top-0 h-full w-0.5 bg-[#A594F9] benchmark-marker"
                  style={
                    {
                      '--benchmark-marker': Math.min(100, (benchmark.p50 / benchmark.p75) * 100),
                    } as React.CSSProperties
                  }
                  title="중간값"
                />
              )}
            </div>
            <div className="flex justify-between text-[10px] text-[#999]">
              <span>하위 25%</span>
              <span>중간</span>
              <span>상위 25%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideItem;
