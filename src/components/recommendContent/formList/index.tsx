import { useState, useRef, useEffect } from 'react';
import FormContainer from '@/components/recommendContent/formList/formContainer';
import CheckBox from '@/components/recommendContent/formList/checkBox';
import TimeSlider from '@/components/recommendContent/formList/timeSlider';
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
        className="flex flex-col collapse-panel gap-4"
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
        <div className="flex w-234 py-9 px-8 flex-col justify-center items-center gap-6 rounded-xl border border-black/10 bg-white">
          <div className="flex pb-14 pl-6 pr-4 flex-col items-start gap-12">
            <div className="flex w-196 h-21 items-start gap-6">
              <div className="flex-1">
                <FormContainer
                  title="Keyword"
                  placeholder="예) 여행브이로그 / 다이어트 식단"
                  value={keyword}
                  onChange={setKeyword}
                />
              </div>
              <div className="flex flex-col items-start gap-2 justify-center h-full w-60 shrink-0">
                <div className="typo-body1-medium text-[#0A0A0A]">내 채널 스타일 반영</div>
                <label
                  className={`flex items-center gap-2 ${isLoggedIn ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                >
                  <input
                    type="checkbox"
                    checked={useChannelData}
                    onChange={e => isLoggedIn && setUseChannelData(e.target.checked)}
                    disabled={!isLoggedIn}
                    className="w-5 h-5 accent-[#7C5CFF]"
                  />
                  <span className="typo-label text-[#717171] whitespace-nowrap">
                    {!isLoggedIn
                      ? '로그인 후 사용 가능'
                      : useChannelData
                        ? '채널 데이터를 분석하여 맞춤 추천'
                        : '키워드·카테고리만으로 추천'}
                  </span>
                </label>
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
