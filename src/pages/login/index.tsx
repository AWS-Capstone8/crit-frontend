import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CritLogo from '@/assets/icons/critLogo.svg?react';
import GoogleIcon from '@/assets/icons/google-icon.svg?react';
import useUserStore from '@/stores/useUserStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const setUser = useUserStore(s => s.setUser);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get('token');
    const channelName = params.get('channelName');
    const channelURL = params.get('channelUrl');
    // 이메일과 가입일을 로그인했을 때, 추가로 받으면 좋을 것 같습니다. (가입일이라 함은 CRiT 서비스를 가입한 날짜)

    if (token) {
      localStorage.setItem('token', token);
      setUser(channelName, channelURL);
      navigate('/');
    }
  }, [navigate, setUser]);

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_AUTH_URL}/oauth2/authorization/google`;
  };

  const handleMockLogin = () => {
    localStorage.setItem('token', 'mock-jwt-token-for-development');
    setUser('CRiT', 'https://www.youtube.com/@CRiT');
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-8">
        <CritLogo className="w-[330px] h-[165px]" />

        <div className="flex w-[612px] flex-col items-start gap-8">
          <div className="flex flex-col items-start gap-3 self-stretch">
            <div className="text-[#232323] typo-login-title">Sign in</div>
            <div className="text-[#969696] typo-login-body">구글 계정으로 로그인하세요.</div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex h-[54px] px-2 py-4 justify-center items-center self-stretch rounded-[10px] border border-[#E6E8E7] bg-[#CDC1FF] cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-[#232323] typo-login-body">Sign in with Google</span>
              <GoogleIcon className="w-6 h-6" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/recommend')}
            className="flex h-[54px] px-2 py-4 justify-center items-center self-stretch rounded-[10px] border border-[#E6E8E7] bg-white cursor-pointer hover:bg-gray-50"
          >
            <span className="text-[#969696] typo-login-guest">비회원으로 둘러보기</span>
          </button>

          {import.meta.env.VITE_USE_MOCK === 'true' && (
            <button
              type="button"
              onClick={handleMockLogin}
              className="flex h-[54px] px-2 py-4 justify-center items-center self-stretch rounded-[10px] border border-dashed border-gray-400 bg-gray-100 cursor-pointer"
            >
              <span className="text-gray-600 typo-body-bold">🧪 개발자 로그인</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
