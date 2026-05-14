import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentItem from './contentItem';
import TimeSlider from '@/components/recommendContent/formList/timeSlider';
import SparkIcon from '@/assets/icons/score-icons/video-detail/sparkle-icon.svg?react';
import InfoIcon from '@/assets/icons/score-icons/video-detail/info-icon.svg?react';
import useCurrentVideoStore from '@/stores/useCurrentVideoStore';
import useUserStore from '@/stores/useUserStore';
import useRecommendStore from '@/stores/useRecommendStore';
import useAIFormStore from '@/stores/useAIFormStore';
import { postRecommend, postScript } from '@/api/command';

interface RecommendItem {
  suggestedTitle: string;
  conceptSummary: string;
}

const RecommendContent = () => {
  const navigate = useNavigate();
  const videoAnalysis = useCurrentVideoStore(s => s.videoAnalysis);
  const isLoading = useCurrentVideoStore(s => s.isLoading);
  const channelURL = useUserStore(s => s.channelURL);
  const setFormInput = useRecommendStore(s => s.setFormInput);
  const setRecommendationsStore = useRecommendStore(s => s.setRecommendations);
  const setSelectedSubjectIndex = useRecommendStore(s => s.setSelectedSubjectIndex);
  const setAutoSelectSubject = useRecommendStore(s => s.setAutoSelectSubject);
  const setAIFormData = useAIFormStore(s => s.setData);

  const [showForm, setShowForm] = useState(true);
  const [time, setTime] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingScript, setIsLoadingScript] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 키워드, 카테고리는 videoInfo에서 가져옴
  const keyword = videoAnalysis?.videoInfo?.keyword ?? '';
  const category = videoAnalysis?.videoInfo?.category ?? '';

  // 추천 결과
  const [recommendations, setRecommendations] = useState<RecommendItem[]>([]);

  const handleSearch = async () => {
    if (time === 0) {
      setErrorMsg('영상 길이(Time)를 입력해주세요.');
      return;
    }
    setErrorMsg('');

    if (!channelURL) return;

    setIsSearching(true);

    try {
      const res = await postRecommend({
        requestURL: channelURL,
        keywords: keyword,
        category: category,
      });
      setRecommendations(res.slice(0, 3)); // 주제 3개만
      setShowForm(false);
    } catch (err) {
      console.error('추천 요청 실패:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setShowForm(true);
    setTime(0);
    setRecommendations([]);
  };

  const handleVideoRecommend = async (index: number) => {
    if (!channelURL) return;

    setIsLoadingScript(true);

    const selectedItem = recommendations[index];
    const title = selectedItem?.suggestedTitle ?? '';
    const concept = selectedItem?.conceptSummary ?? '';

    try {
      // postScript API 호출
      const res = await postScript({
        requestURL: channelURL,
        title,
        concept,
        keywords: keyword,
        category: category,
        time: time,
      });

      const resultItem = res[0] ?? res;

      // AIFormStore에 결과 저장
      setAIFormData({
        conceptSummary: resultItem.conceptSummary ?? '',
        suggestedTitles: (resultItem.suggestedTitles ?? []).slice(0, 3),
        thumbnail: {
          thumbnailImage: resultItem.thumbnail?.thumbnailImage ?? '',
          thumbnailGuide: resultItem.thumbnail?.thumbnailGuide ?? '',
        },
        similarVideos: resultItem.similarVideos ?? [],
        similarCreators: resultItem.similarCreators ?? [],
      });

      // RecommendStore에 데이터 세팅
      setFormInput({
        requestURL: channelURL,
        keywords: keyword,
        category: category,
        time: time,
      });
      setRecommendationsStore(recommendations);
      setSelectedSubjectIndex(index);
      setAutoSelectSubject(true);

      // /recommend 페이지로 이동
      navigate('/recommend');
    } catch (err) {
      console.error('스크립트 요청 실패:', err);
    } finally {
      setIsLoadingScript(false);
    }
  };

  return (
    <div className="flex flex-col w-full px-6 py-7 justify-center items-start gap-3.5 bg-white rounded-xl border-[0.1px] border-[#8257B4]">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-1 text-[#6452CE] typo-body4-semibold">
          <SparkIcon className="w-4 h-4" />
          이어서 만들면 좋은 콘텐츠
        </div>
        {!showForm && (
          <div
            onClick={handleReset}
            className="px-3 py-1 rounded-md bg-[#D9D2FF] hover:bg-[#6B42FF] active:bg-[#C4B8FF] text-white typo-body6 cursor-pointer transition-colors"
          >
            다시 검색
          </div>
        )}
      </div>

      <div className="relative w-full">
        {/* 검색 폼 오버레이 */}
        {showForm && (
          <div className="flex flex-col w-full gap-5 py-4">
            {isLoading ? (
              <div className="flex w-full justify-center items-center py-8 text-gray-400 animate-loading-pulse typo-body5">
                데이터를 불러오는 중...
              </div>
            ) : (
              <div className="flex flex-col w-full gap-5 p-5 rounded-xl border-[0.1px] border-[#8257B4]">
                <div className="flex w-full items-start justify-between gap-6">
                  {/* 키워드 (고정) */}
                  <div className="flex flex-col w-[30%] gap-2">
                    <div className="flex items-center gap-1.5 text-black typo-body4-semibold">
                      Keyword
                      <div className="relative group">
                        <InfoIcon className="w-4 h-4 text-[#8257B4] cursor-pointer" />
                        <div className="absolute left-0 bottom-full mb-2 px-3 py-2 bg-white/85 backdrop-blur-[27px] text-black typo-body6 rounded-xl border border-[#6B42FF] whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          해당 영상의 키워드를 기반으로 AI가 콘텐츠를 추천합니다.
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2.5 rounded-lg bg-[#F5EFFF] border border-[#8257B4] text-[#6452CE] typo-body5">
                      {keyword || '키워드 없음'}
                    </div>
                  </div>

                  {/* 카테고리 (고정) */}
                  <div className="flex flex-col w-[30%] gap-2">
                    <div className="flex items-center gap-1.5 text-black typo-body4-semibold">
                      Category
                      <div className="relative group">
                        <InfoIcon className="w-4 h-4 text-[#8257B4] cursor-pointer" />
                        <div className="absolute left-0 bottom-full mb-2 px-3 py-2 bg-white/85 backdrop-blur-[27px] text-black typo-body6 rounded-xl border border-[#6B42FF] whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          해당 영상의 카테고리를 기반으로 AI가 콘텐츠를 추천합니다.
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2.5 rounded-lg bg-[#F5EFFF] border border-[#8257B4] text-[#6452CE] typo-body5">
                      {category || '카테고리 없음'}
                    </div>
                  </div>

                  {/* 시간 설정 */}
                  <div className="flex flex-col w-[30%] gap-6">
                    <div className="text-black typo-body4-semibold">Time</div>
                    <TimeSlider value={time} onChange={setTime} compact />
                  </div>
                </div>

                {/* 검색 버튼 */}
                <div className="flex w-full items-center relative">
                  {errorMsg && (
                    <div className="absolute right-0 text-red-500 typo-body5">{errorMsg}</div>
                  )}
                  <div
                    onClick={handleSearch}
                    className={`flex py-2 px-8 mx-auto justify-center items-center rounded-lg typo-body4-semibold text-white cursor-pointer transition-colors ${
                      isSearching
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-[#7C5CFF] hover:bg-[#6344DD] active:bg-[#8B6FFF]'
                    }`}
                  >
                    {isSearching ? '검색 중...' : '콘텐츠 추천 받기'}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 추천 결과 */}
        {!showForm && (
          <div className="flex w-full justify-center items-stretch gap-5 py-4">
            {recommendations.length > 0 ? (
              recommendations.map((item, index) => (
                <ContentItem
                  key={index}
                  title={item.suggestedTitle}
                  concept={item.conceptSummary}
                  onVideoRecommend={() => handleVideoRecommend(index)}
                  isLoading={isLoadingScript}
                />
              ))
            ) : (
              <div className="text-gray-400 typo-body5">추천 결과가 없습니다.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendContent;
