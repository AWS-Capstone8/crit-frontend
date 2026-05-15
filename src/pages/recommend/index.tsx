import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/header';
import TabList from '@/components/recommendContent/tabList';
import FormList from '@/components/recommendContent/formList';
import FormAnswer from '@/components/recommendContent/formAnswer';
import FormSubject from '@/components/recommendContent/formSubject';
import useRecommendStore from '@/stores/useRecommendStore';
import useAIFormStore from '@/stores/useAIFormStore';

import Footer from '@/components/footer';

const RecommendPage = () => {
  const location = useLocation();
  const initialKeyword = (location.state as { keyword?: string })?.keyword || '';

  const [showSubject, setShowSubject] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const autoSelectSubject = useRecommendStore(s => s.autoSelectSubject);
  const recommendations = useRecommendStore(s => s.recommendations);
  const clearRecommendStore = useRecommendStore(s => s.clear);
  const clearAIFormStore = useAIFormStore(s => s.clear);

  // 외부에서 주제 선택 후 진입한 경우
  useEffect(() => {
    if (autoSelectSubject && recommendations.length > 0) {
      setShowSubject(true);
      setShowAnswer(true);
    }
  }, [autoSelectSubject, recommendations]);

  // 페이지 떠날 때 store 초기화 (autoSelectSubject가 아닌 경우에만)
  useEffect(() => {
    return () => {
      // 다른 페이지로 이동 시 store 초기화
      if (!autoSelectSubject) {
        clearRecommendStore();
        clearAIFormStore();
      }
    };
  }, [autoSelectSubject, clearRecommendStore, clearAIFormStore]);

  const handleSearch = () => {
    setShowSubject(true);
    setShowAnswer(false);
  };

  const handleSelectSubject = () => {
    setShowAnswer(true);
  };

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center px-10 gap-10">
        <div className="flex flex-col items-center mt-20 w-full mx-auto animate-fade-in-up">
          <div className="relative z-10 mb-[-32px]">
            <TabList tabs={['롱폼', '숏폼']} />
          </div>
          <FormList onSearch={handleSearch} initialKeyword={initialKeyword} />
        </div>
        {showSubject && (
          <div className="animate-fade-in-up">
            <FormSubject onSelect={handleSelectSubject} />
          </div>
        )}
        {showAnswer && (
          <div className="flex flex-col items-center self-stretch w-full mx-auto animate-fade-in-up">
            <FormAnswer />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default RecommendPage;
