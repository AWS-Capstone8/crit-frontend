import DetailScoreContainer from './detailScoreContainer';
import useCurrentVideoStore from '@/stores/useCurrentVideoStore';

const DetailScore = () => {
  const videoAnalysis = useCurrentVideoStore(s => s.videoAnalysis);
  const isLoading = useCurrentVideoStore(s => s.isLoading);

  const factors = videoAnalysis?.factors;
  const showLoading = isLoading || !factors;

  // 로딩 중이거나 데이터 없으면 기본 3개 표시
  if (showLoading || factors.length === 0) {
    return (
      <div className="flex w-full gap-7 justify-center items-stretch">
        <DetailScoreContainer factorName="도달률" />
        <DetailScoreContainer factorName="시청 지속 시간" />
        <DetailScoreContainer factorName="추천 확장성" />
      </div>
    );
  }

  return (
    <div className="flex w-full gap-7 justify-center items-stretch">
      <DetailScoreContainer factorName="도달률" />
      <DetailScoreContainer factorName="시청 지속 시간" />
      <DetailScoreContainer factorName="추천 확장성" />
    </div>
  );
};

export default DetailScore;
