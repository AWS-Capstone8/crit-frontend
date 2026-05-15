import DetailScoreContainer from './detailScoreContainer';
import useCurrentVideoStore from '@/stores/useCurrentVideoStore';

// API name을 UI title로 매핑
const nameToTitle: Record<string, string> = {
  '도달률': '도달률',
  '시청 지속 시간': '시청 지속 시간',
  '추천 확장성': '추천 확장성',
};

const DetailScore = () => {
  const videoAnalysis = useCurrentVideoStore(s => s.videoAnalysis);
  const isLoading = useCurrentVideoStore(s => s.isLoading);

  const factors = videoAnalysis?.factors;
  const showLoading = isLoading || !factors;

  // 로딩 중이거나 데이터 없으면 기본 3개 표시
  if (showLoading || factors.length === 0) {
    return (
      <div className="flex w-full gap-7 justify-center items-stretch">
        <DetailScoreContainer title="도달률" isLoading />
        <DetailScoreContainer title="시청 지속 시간" isLoading />
        <DetailScoreContainer title="추천 확장성" isLoading />
      </div>
    );
  }
  
  return (
    <div className="flex w-full gap-7 justify-center items-stretch">
      <DetailScoreContainer factorName="CTR (클릭률)" />
      <DetailScoreContainer factorName="시청 지속 시간" />
      <DetailScoreContainer factorName="추천 확장성" />
    </div>
  );
};

export default DetailScore;
