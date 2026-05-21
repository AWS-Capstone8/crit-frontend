import { useState, useRef, useEffect } from 'react';
import FormContainer from '@/components/recommendContent/formList/formContainer';
import CheckBox from '@/components/recommendContent/formList/checkBox';
import TimeSlider from '@/components/recommendContent/formList/timeSlider';
import ToggleSwitch from '@/components/recommendContent/formList/toggleSwitch';
import InfoIcon from '@/assets/icons/score-icons/video-detail/info-icon.svg?react';
import { postRecommend } from '@/api/command';
import useRecommendStore from '@/stores/useRecommendStore';
import useUserStore from '@/stores/useUserStore';
import { useShallow } from 'zustand/react/shallow';

const categories = [
  '영화 / 애니메이션',
  '자동차',
  '음악',
  '동물',
  '스포츠',
  '여행 / 이벤트',
  '게임',
  '인물 / 블로그',
  '코미디',
  '엔터테인먼트',
  '뉴스 / 정치',
  '노하우 / 스타일',
  '교육',
  '과학 / 기술',
];

interface FormListProps {
  onSearch?: () => void;
  initialKeyword?: string;
}

const FormList = ({ onSearch, initialKeyword = '' }: FormListProps) => {
  const [collapsed, setCollapsed] = useState(() => {
    const { autoSelectSubject, formInput } = useRecommendStore.getState();
    return autoSelectSubject && !!formInput.keywords;
  });
  const [searched, setSearched] = useState(() => {
    const { autoSelectSubject, formInput } = useRecommendStore.getState();
    return autoSelectSubject && !!formInput.keywords;
  });
  const channelURL = useUserStore(s => s.channelURL);
  const [errorMsg, setErrorMsg] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);
  const { setRecommendations, setFormInput, formInput } = useRecommendStore(
    useShallow(s => ({
      setRecommendations: s.setRecommendations,
      setFormInput: s.setFormInput,
      formInput: s.formInput,
    })),
  );

  const isLoggedIn = !!channelURL;
  const [keyword, setKeyword] = useState(formInput.keywords || initialKeyword);
  const [useChannelData, setUseChannelData] = useState(isLoggedIn);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    // formInput.category가 "{카테고리1, 카테고리2}" 형식이면 파싱
    if (formInput.category) {
      const parsed = formInput.category.replace(/[{}]/g, '').split(', ').filter(Boolean);
      return parsed;
    }
    return [];
  });
  const [time, setTime] = useState(formInput.time || 0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, []);

  const handleCategoryToggle = (category: string, checked: boolean) => {
    setSelectedCategories(prev =>
      checked ? [...prev, category] : prev.filter(c => c !== category),
    );
  };

  const handleReset = () => {
    setKeyword('');
    setSelectedCategories([]);
    setTime(0);
  };

  const handleSearch = async () => {
    const missing: string[] = [];
    if (!keyword.trim()) missing.push('Keyword');
    if (selectedCategories.length === 0) missing.push('Category');
    if (time === 0) missing.push('Time');

    if (missing.length > 0) {
      setErrorMsg(`${missing.join(', ')}을(를) 입력해주세요.`);
      return;
    }

    setErrorMsg('');
    setCollapsed(true);
    setSearched(true);

    const requestURL = useChannelData ? channelURL || '' : '';

    try {
      const res = await postRecommend({
        requestURL,
        keywords: keyword,
        category: `{${selectedCategories.join(', ')}}`,
      });
      setRecommendations(res);
      setFormInput({
        requestURL,
        keywords: keyword,
        category: `{${selectedCategories.join(', ')}}`,
        time,
      });

      onSearch?.();
    } catch (err) {
      console.error('추천 요청 실패:', err);
    }
  };

  return (
    <div className="flex w-250 pt-18 pb-12 px-8 flex-col justify-end items-center gap-10 rounded-xl bg-[#F5EFFF]">
      <div
        ref={contentRef}
        className={`flex flex-col collapse-panel gap-4 ${!collapsed ? 'is-open' : ''}`}
        style={
          {
            '--collapse-max-height': collapsed ? '0px' : `${contentHeight}px`,
            '--collapse-opacity': collapsed ? 0 : 1,
          } as React.CSSProperties
        }
      >
        <div className="flex justify-center w-full typo-body1-medium text-[#717171] text-center whitespace-pre-line">
          {
            '원하는 키워드와 채널 정보를 입력하면\nAI가 트렌드와 채널 데이터를 분석해 맞춤 콘텐츠 아이디어를 추천합니다.'
          }
        </div>
        <div className="flex w-234 py-9 px-8 flex-col justify-center items-center gap-6 rounded-xl border border-black/10 bg-white overflow-visible">
          <div className="flex w-full pb-14 pl-6 pr-4 flex-col items-start gap-12 overflow-visible">
            <div className="flex w-full items-start gap-6 overflow-visible">
              <div className="flex-1 min-w-0">
                <FormContainer
                  title="Keyword"
                  placeholder="예) 여행브이로그 / 다이어트 식단"
                  value={keyword}
                  onChange={setKeyword}
                />
              </div>
              <div className="flex-1 min-w-0">
                <FormContainer
                  title="채널 스타일 분석"
                  titleAddon={
                    <div className="relative group overflow-visible">
                      <InfoIcon className="w-4 h-4 text-[#8257B4] cursor-pointer shrink-0" />
                      <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 px-3 py-2 bg-white/85 backdrop-blur-[27px] text-black typo-body6 rounded-xl border border-[#6B42FF] whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        {isLoggedIn
                          ? '내 채널의 콘텐츠 성향을 분석해 추천 결과에 반영합니다.'
                          : '로그인 후 내 채널 데이터를 분석해 맞춤형 주제를 추천할 수 있습니다.'}
                      </div>
                    </div>
                  }
                  titleRight={
                    <ToggleSwitch
                      checked={useChannelData}
                      onChange={setUseChannelData}
                      disabled={!isLoggedIn}
                    />
                  }
                >
                  <div className="flex h-12 py-1 px-3 items-center self-stretch rounded-lg border border-transparent bg-[#FEF8FF] typo-body2 text-[#717171] truncate">
                    {!isLoggedIn
                      ? '로그인 후 사용 가능'
                      : useChannelData
                        ? channelURL
                        : '키워드·카테고리만으로 추천'}
                  </div>
                </FormContainer>
              </div>
            </div>
            <div className="flex w-196 flex-col items-start gap-4">
              <div className="typo-body1-medium text-[#0A0A0A]">Category</div>
              <div className="h-78 self-stretch grid grid-cols-3 gap-4 content-start">
                {categories.map(category => (
                  <CheckBox
                    key={category}
                    label={category}
                    checked={selectedCategories.includes(category)}
                    onChange={checked => handleCategoryToggle(category, checked)}
                  />
                ))}
              </div>
            </div>
            <div className="flex w-196 flex-col items-start gap-4">
              <div className="typo-body1-medium text-[#0A0A0A]">Time</div>
              <div className="flex w-full items-center justify-between">
                <TimeSlider value={time} onChange={setTime} />
                <div
                  onClick={handleReset}
                  className="flex py-1.5 px-3 justify-center items-center rounded-md bg-[#FF6B6B] hover:bg-[#FF4757] active:bg-[#FF8787] typo-label text-white cursor-pointer transition-colors"
                >
                  초기화
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center relative">
        {errorMsg && <div className="absolute left-0 text-sm text-red-500">{errorMsg}</div>}
        <div
          onClick={handleSearch}
          className="flex py-2.5 px-5 mx-auto justify-center items-center gap-2.5 rounded-lg bg-[#7C5CFF] active:bg-[#6344DD] typo-body1-medium text-white text-center tracking-widest cursor-pointer"
        >
          {searched ? '다시 검색' : '검색'}
        </div>
        {searched && (
          <div
            onClick={() => setCollapsed(!collapsed)}
            className="absolute right-0 flex items-center gap-1 cursor-pointer text-[#0a0a0a89] active:text-[#6B4EFF] typo-label"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-0' : 'rotate-180'}`}
              viewBox="0 0 16 16"
            >
              <path
                d="M4 6l4 4 4-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {collapsed ? '펼치기' : '접기'}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormList;
