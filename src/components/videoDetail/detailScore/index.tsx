import DetailScoreContainer from './detailScoreContainer';

const DetailScore = () => {
  return (
    <div className="flex w-full gap-7 justify-center items-stretch">
      <DetailScoreContainer factorName="CTR (클릭률)" />
      <DetailScoreContainer factorName="시청 지속 시간" />
      <DetailScoreContainer factorName="추천 확장성" />
    </div>
  );
};

export default DetailScore;
