import VideoTitle from '@/components/recommendContent/formAnswer/videoTitle';
import Thumbnail from '@/components/recommendContent/formAnswer/thumbnail';
import ScriptEditor from '@/components/recommendContent/formAnswer/scriptEditor';

const formAnswer = () => {
  return (
    <div className="flex w-250 pt-12 py-22 px-11 flex-col justify-start items-center gap-10 rounded-xl bg-[#F5EFFF]">
      <div className="flex w-full h-6 typo-title2 text-[#0A0A0A] animate-fade-in-up">
        영상 기획 카드
      </div>
      <div className="flex w-full gap-4 justify-start">
        <div className="animate-fade-in-up animate-delay-150 flex-1">
          <VideoTitle />
        </div>
        <div className="animate-fade-in-up animate-delay-300 flex-1">
          <Thumbnail />
        </div>
      </div>
      <div className="flex w-full h-6 typo-title2 text-[#0A0A0A] animate-fade-in-up animate-delay-450">
        스크립트 에디터
      </div>
      <div className="flex w-full justify-start animate-fade-in-up animate-delay-600">
        <ScriptEditor />
      </div>
    </div>
  );
};

export default formAnswer;
