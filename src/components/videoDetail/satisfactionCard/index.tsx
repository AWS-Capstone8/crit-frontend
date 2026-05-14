import { useState } from 'react';

const SatisfactionCard = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitRating = () => {
    if (rating === 0) return;
    setIsSubmitted(true);
  };

  return (
    <div className="flex flex-col flex-1 w-full px-6 py-5 gap-4 justify-center items-center bg-white rounded-xl border-[0.1px] border-[#8257B4]">
      <div className="text-[#6452CE] typo-body4-semibold">분석 결과가 만족스러우신가요?</div>
      {isSubmitted ? (
        <div className="flex flex-col items-center gap-2 animate-fade-in">
          <div className="text-[#5AC467] typo-body4-semibold">제출이 완료되었습니다!</div>
          <div className="text-gray-500 typo-body5">소중한 피드백 감사합니다 ✨</div>
        </div>
      ) : (
        <>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <svg
                key={star}
                className={`w-8 h-8 cursor-pointer transition-all duration-200 ${
                  star <= (hoverRating || rating) ? 'text-[#FFD700] scale-110' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <button
            onClick={handleSubmitRating}
            disabled={rating === 0}
            className={`px-6 py-2 rounded-lg typo-body5 transition-all duration-200 ${
              rating > 0
                ? 'bg-[#D9D2FF] text-white hover:bg-[#6B42FF] active:bg-[#C4B8FF] cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            제출하기
          </button>
        </>
      )}
    </div>
  );
};

export default SatisfactionCard;
