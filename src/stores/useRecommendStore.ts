import { create } from 'zustand';

interface RecommendItem {
  suggestedTitle: string;
  conceptSummary: string;
}

interface FormInput {
  requestURL: string;
  keywords: string;
  category: string;
  time: number;
}

interface TitleItem {
  [key: string]: unknown;
}

interface RecommendStore {
  // 폼 입력값
  formInput: FormInput;
  setFormInput: (data: FormInput) => void;

  // 추천 주제 (1차 API)
  recommendations: RecommendItem[];
  setRecommendations: (data: RecommendItem[]) => void;

  // 선택된 주제 인덱스
  selectedSubjectIndex: number | null;
  setSelectedSubjectIndex: (index: number | null) => void;

  // 추천 제목 (2차 API)
  titles: TitleItem[];
  setTitles: (data: TitleItem[]) => void;

  // 외부에서 주제 선택 후 진입했는지 여부
  autoSelectSubject: boolean;
  setAutoSelectSubject: (value: boolean) => void;

  clear: () => void;
}

const useRecommendStore = create<RecommendStore>(set => ({
  formInput: { requestURL: '', keywords: '', category: '', time: 0 },
  setFormInput: data => set({ formInput: data }),

  recommendations: [],
  setRecommendations: data => set({ recommendations: data }),

  selectedSubjectIndex: null,
  setSelectedSubjectIndex: index => set({ selectedSubjectIndex: index }),

  titles: [],
  setTitles: data => set({ titles: data }),

  autoSelectSubject: false,
  setAutoSelectSubject: value => set({ autoSelectSubject: value }),

  clear: () =>
    set({
      recommendations: [],
      titles: [],
      formInput: { requestURL: '', keywords: '', category: '', time: 0 },
      selectedSubjectIndex: null,
      autoSelectSubject: false,
    }),
}));

export default useRecommendStore;
