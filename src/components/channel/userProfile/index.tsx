import useChannelStore from '@/stores/useChannelStore';

interface UserProfileProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const UserProfile = ({ onRefresh, isRefreshing }: UserProfileProps) => {
  const data = useChannelStore(s => s.data);
  const channel = data?.channel;

  return (
    <div className="flex w-full h-39 justify-between items-center gap-8 px-6 py-4 rounded-xl border border-[#A594F9]">
      <div className="flex items-center gap-8">
        <div className="w-30 h-30 rounded-full bg-gray-500 overflow-hidden shrink-0">
          {channel?.profileImageUrl && (
            <img
              src={channel.profileImageUrl}
              alt={channel.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex flex-col justify-start gap-3">
          <div className="w-full typo-title2 text-black">{channel?.name ?? 'channel ID'}</div>
          <div className="flex flex-col w-full justify-start gap-2">
            <div className="typo-body1-medium text-black">{channel?.handle ?? 'youtube_name'}</div>
            <div className="typo-body1-medium text-black">
              구독자 {channel?.subscriberCount ? channel.subscriberCount.toLocaleString() : 'n'}명
            </div>
          </div>
        </div>
      </div>
      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#7C5CFF] text-white typo-body5 cursor-pointer hover:bg-[#6344DD] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 11-2.2-5.9M21 3v5h-5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {isRefreshing ? '갱신 중...' : '강제 갱신'}
        </button>
      )}
    </div>
  );
};

export default UserProfile;
