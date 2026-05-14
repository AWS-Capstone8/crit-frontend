import BulbIcon from '@/assets/icons/score-icons/video-detail/purple-bulb-icon.svg?react';

interface ContentItemProps {
  title: string;
  concept: string;
  onVideoRecommend?: () => void;
  isLoading?: boolean;
}

const ContentItem = ({ title, concept, onVideoRecommend, isLoading = false }: ContentItemProps) => {
  return (
    <div className="flex flex-col w-full px-5.5 py-4.5 justify-center items-center gap-3 rounded-xl border-[0.5px] border-[#8257B4]">
      <div className="flex w-full justify-between items-center gap-2">
        <div className="flex justify-start items-start gap-2.5">
          <BulbIcon className="shrink-0" />
          <div className="flex flex-col gap-1.5 w-full justify-center items-start">
            <div className="w-full justify-start items-center text-black typo-body4-semibold">
              {title}
            </div>
            <div className="w-full justify-start items-center text-black typo-body5">{concept}</div>
          </div>
        </div>
        <div className="px-4.5 py-1 justify-center items-center rounded-xl border-[0.5px] border-[#8257B4] shadow-[0_1px_4px_0_rgba(0,0,0,0.25)] text-[#4F378A] typo-body6 shrink-0 cursor-pointer hover:bg-[#F5EFFF] active:bg-[#E8DEFF] transition-colors">
          아이디어
        </div>
      </div>
      <div
        onClick={isLoading ? undefined : onVideoRecommend}
        className={`px-23 py-1 justify-center items-center rounded-xl border-[0.5px] border-[#8257B4] shadow-[0_1px_4px_0_rgba(0,0,0,0.25)] typo-body6 transition-colors ${
          isLoading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'text-[#4F378A] cursor-pointer hover:bg-[#D9D2FF] hover:text-[#4F378A] active:bg-[#C4B8FF]'
        }`}
      >
        {isLoading ? '로딩 중...' : '영상 추천'}
      </div>
    </div>
  );
};

export default ContentItem;
