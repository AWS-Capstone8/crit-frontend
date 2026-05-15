import { useEffect, useState } from 'react';
import ArrowLeftIcon from '@/assets/icons/score-icons/video-detail/arrow-left-icon.svg?react';
import VideoInfo from '@/components/videoDetail/videoInfo';
import DetailScore from '@/components/videoDetail/detailScore';
import AISummaryCard from '@/components/videoDetail/aiSummaryCard';
import ViewGrowthCard from '@/components/videoDetail/viewGrowthCard';
import ViewingTimeCard from '@/components/videoDetail/viewingTimeCard';
import ImprovementPointCard from '@/components/videoDetail/improvementPointCard';
import RecommendActionCard from '@/components/videoDetail/recommendActionCard';
import RecommendContent from '@/components/videoDetail/recommendContent';
import useCurrentVideoStore from '@/stores/useCurrentVideoStore';
import { getVideoAnalysis } from '@/api/command';
import SatisfactionCard from '@/components/videoDetail/satisfactionCard';

interface DetailAnalysisProps {
  onBack: () => void;
}

const DetailAnalysis = ({ onBack }: DetailAnalysisProps) => {
  const videoId = useCurrentVideoStore(s => s.videoId);
  const setVideoAnalysis = useCurrentVideoStore(s => s.setVideoAnalysis);
  const setLoading = useCurrentVideoStore(s => s.setLoading);
  // phase: 0 = 텍스트 보임, 1 = 둘 다 안보임, 2 = 로고 보임, 3 = 둘 다 안보임
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const durations = [2500, 500, 2500, 500]; // 각 phase 지속 시간
    const timeout = setTimeout(() => {
      setPhase(prev => (prev + 1) % 4);
    }, durations[phase]);
    return () => clearTimeout(timeout);
  }, [phase]);

  useEffect(() => {
    const fetchVideoAnalysis = async () => {
      if (!videoId) return;
      setLoading(true);
      try {
        const res = await getVideoAnalysis(videoId);
        setVideoAnalysis(res);
      } catch (err) {
        console.error('영상 분석 요청 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideoAnalysis();
  }, [videoId, setVideoAnalysis, setLoading]);

  return (
    <div className="flex flex-col w-300 items-center gap-6 px-10 py-10  animate-slide-in-right">
      <div
        className="flex w-full justify-start items-center gap-2 cursor-pointer text-black/50 hover:text-[#6B4EFF] transition-colors"
        onClick={onBack}
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <div className="typo-body3">분석 목록으로 돌아가기</div>
      </div>
      <div className="flex flex-col w-full justify-center items-center gap-4">
        <VideoInfo />
      </div>
      <DetailScore />
      <div className="flex w-full justify-center items-stretch gap-4">
        <div className="flex flex-col w-full justify-start items-center gap-5">
          <AISummaryCard />
          <ViewGrowthCard />
          <ViewingTimeCard />
        </div>
        <div className="flex flex-col w-[40%] justify-start items-center gap-5">
          <ImprovementPointCard />
          <RecommendActionCard />
          <SatisfactionCard />
        </div>
      </div>
      <RecommendContent />
    </div>
  );
};

export default DetailAnalysis;
