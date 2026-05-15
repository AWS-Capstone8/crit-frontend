import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import CloseIcon from '@/assets/icons/user-info-icons/close-icon.svg?react';
import RocketIcon from '@/assets/icons/user-info-icons/rocket-icon.svg?react';
import useUserStore from '@/stores/useUserStore';
import UserInfoModalItem from '@/components/userInfoModalItem';

interface UserInfoModalProps {
  onClose: () => void;
}

const UserInfoModal = ({ onClose }: UserInfoModalProps) => {
  const channelName = useUserStore(s => s.channelName);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="flex flex-col w-212 px-15 py-12 justify-center items-center gap-7.5 bg-white rounded-xl animate-modal-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex w-full justify-between items-center">
          <div className="text-black typo-title2">마이페이지</div>
          <CloseIcon className="w-7.5 h-7.5 cursor-pointer" onClick={onClose} />
        </div>
        <div className="flex w-full justify-between items-center px-15 py-14 bg-[#F5EFFF] rounded-xl">
          <div className="flex flex-col w-full justify-center items-start gap-5">
            <div className="w-full justify-start items-center typo-title1">
              안녕하세요, <span className="text-[#6B4EFF]">{channelName}</span>님!
            </div>
            <div className="w-full justify-start items-center text-[#717171] typo-body1-medium">
              CRiT과 함께 더 성장하는 크리에이터가 되어보세요.
            </div>
          </div>
          <RocketIcon className="w-19 h-19" />
        </div>
        <div className="flex flex-col w-full justify-center items-center gap-8">
          <div className="w-full justify-start items-center text-black typo-title1">
            프로필 정보
          </div>
          <div className="flex flex-col w-full px-5.5 py-2.5 justify-center items-center gap-2.5 rounded-xl border border-[#8257B4]">
            <UserInfoModalItem type="name" value={channelName ?? '사용자'} />
            <div className="w-full h-px bg-[#8257B4]"></div>
            <UserInfoModalItem type="email" value="name@example.com" />
            <div className="w-full h-px bg-[#8257B4]"></div>
            <UserInfoModalItem type="date" value="0000.00.00" />
            <div className="w-full h-px bg-[#8257B4]"></div>
            <UserInfoModalItem type="accountType" value="무료 사용자" />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default UserInfoModal;
