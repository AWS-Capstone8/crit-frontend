import { useState } from 'react';
import CopyIcon from '@/assets/icons/copy-icon.svg?react';
import useAIFormStore from '@/stores/useAIFormStore';
import ReferenceList from '@/components/recommendContent/formAnswer/scriptEditor/referenceList';

const formatScript = (text: string) => {
  return text.replace(/\[/g, '\n\n[').replace(/\]\s*/g, ']\n').trim();
};

const ScriptEditor = () => {
  const [copied, setCopied] = useState(false);
  const data = useAIFormStore(s => s.data);
  const script = data?.conceptSummary ?? '';

  const handleCopy = async () => {
    if (!script) return;
    await navigator.clipboard.writeText(formatScript(script));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="inline-flex w-full h-102 py-6 pl-6 pr-5 gap-5 rounded-xl bg-[#fff] border border-[#A594F9]">
      <div className="flex flex-1 flex-col gap-4 animate-fade-in-up">
        <div className="flex w-full typo-title-bold text-[#0A0A0A] items-stretch">AI 대본 초안</div>
        <div className="relative group w-full flex-1 min-h-0">
          <div className="h-full overflow-y-auto px-3 py-4 rounded-xl bg-[#FAFAFA] border border-[#A594F9] typo-body4-semibold text-black whitespace-pre-line break-keep leading-6 script-scroll">
            {script ? (
              formatScript(script)
            ) : (
              <span className="animate-loading-pulse text-gray-400">검색 후 대본이 표시됩니다.</span>
            )}
          </div>
          {script && (
            <button
              type="button"
              onClick={handleCopy}
              className={`absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg border border-[#A594F9] bg-white/90 px-2 py-1 shadow-sm opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 cursor-pointer ${copied ? 'text-[#6B4EFF]' : 'text-[#0a0a0a89] active:text-[#6B4EFF]'}`}
            >
              {!copied && <CopyIcon className="w-4 h-4" />}
              <span className="typo-label">{copied ? '복사완료' : '복사'}</span>
            </button>
          )}
        </div>
      </div>
      <div
        className="flex w-70 shrink-0 flex-col gap-4 animate-fade-in-up"
        style={{ animationDelay: '0.15s' }}
      >
        <div className="flex w-full typo-title-bold text-[#0A0A0A] items-stretch">
          참고 영상 및 크리에이터 추천
        </div>
        <ReferenceList />
      </div>
    </div>
  );
};

export default ScriptEditor;
