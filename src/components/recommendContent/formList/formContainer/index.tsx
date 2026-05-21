import type { ReactNode } from 'react';

interface FormContainerProps {
  title: string;
  titleAddon?: ReactNode;
  titleRight?: ReactNode;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  children?: ReactNode;
}

const FormContainer = ({
  title,
  titleAddon,
  titleRight,
  placeholder,
  value,
  onChange,
  disabled = false,
  children,
}: FormContainerProps) => {
  const hasTitleActions = titleAddon || titleRight;

  return (
    <div className="flex w-full h-21 flex-col items-start gap-2">
      {hasTitleActions ? (
        <div className="flex h-7 items-center justify-between self-stretch w-full">
          <div className="flex items-center gap-2">
            <div className="typo-body1-medium text-[#0A0A0A] whitespace-nowrap">{title}</div>
            {titleAddon}
          </div>
          {titleRight}
        </div>
      ) : (
        <div className="flex h-7 items-center gap-2 shrink-0 self-stretch">
          <div className="typo-body1-medium text-[#0A0A0A]">{title}</div>
        </div>
      )}
      {children ?? (
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          disabled={disabled}
          className={`flex h-12 py-1 px-3 items-center shrink-0 self-stretch rounded-lg border border-transparent bg-[#FEF8FF] typo-body2 text-[#0A0A0A] placeholder:typo-body2 placeholder:text-[#0a0a0a89] outline-none ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
        />
      )}
    </div>
  );
};

export default FormContainer;
