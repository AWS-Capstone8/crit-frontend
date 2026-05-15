import UserIcon from '@/assets/icons/user-info-icons/person-icon.svg?react';
import MailIcon from '@/assets/icons/user-info-icons/mail-icon.svg?react';
import CalendarIcon from '@/assets/icons/user-info-icons/calendar-icon.svg?react';

type ItemType = 'name' | 'email' | 'date' | 'accountType';

interface UserInfoModalItemProps {
  type: ItemType;
  value: string;
}

const itemConfig = {
  name: { icon: UserIcon, label: '이름' },
  email: { icon: MailIcon, label: '이메일' },
  date: { icon: CalendarIcon, label: '가입일' },
  accountType: { icon: UserIcon, label: '계정 유형' },
};

const UserInfoModalItem = ({ type, value }: UserInfoModalItemProps) => {
  const { icon: Icon, label } = itemConfig[type];

  return (
    <div className="flex w-full px-7.5 py-4 justify-between items-center">
      <div className="flex justify-center items-center gap-7.5">
        <Icon className="w-6 h-6" />
        <div className="text-black typo-body1-medium">{label}</div>
      </div>
      {type === 'accountType' ? (
        <div className="px-3 py-0.5 justify-center items-center rounded-lg bg-[#E9D3F8] text-[#5A36EA] typo-body4-semibold">
          {value}
        </div>
      ) : (
        <div className="text-black typo-body1-medium">{value}</div>
      )}
    </div>
  );
};

export default UserInfoModalItem;
