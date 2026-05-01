import CircleProgress from './circleProgress';

const AlgorithmScore = () => {
  return (
    <div className="flex w-full px-2 py-4 flex-col justify-center items-center gap-2 rounded-xl border border-[#8257B4]">
      <div className="flex w-full h-7 p-3 typo-title text-black">Algorithm Score</div>
      <div className="flex items-center gap-2 self-stretch">
        <div className="flex items-center justify-center p-3">
          <CircleProgress score={80} rank="상위 42%" />
        </div>
        <div className="flex flex-col w-full gap-2.5 items-start">
          <div className="typo-body-bold leading-[140%] tracking-tight text-black">
            점수 구성 요인
          </div>
          <div className="flex flex-col items-center gap-2.5 self-stretch"></div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmScore;
