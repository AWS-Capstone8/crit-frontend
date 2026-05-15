import { create } from 'zustand';

export interface KeywordData {
  text: string;
  value: number;
}

interface TrendKeywordsStore {
  keywords: KeywordData[];
  isLoading: boolean;
  setKeywords: (keywords: KeywordData[]) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
}

const useTrendKeywordsStore = create<TrendKeywordsStore>(set => ({
  keywords: [],
  isLoading: false,
  setKeywords: keywords => set({ keywords }),
  setLoading: loading => set({ isLoading: loading }),
  clear: () => set({ keywords: [], isLoading: false }),
}));

export default useTrendKeywordsStore;
