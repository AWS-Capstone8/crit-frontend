# CRiT Frontend

유튜브 크리에이터를 위한 AI 기반 채널 분석 및 콘텐츠 추천 서비스입니다.

## 기술 스택

- React 19
- TypeScript 5.9
- Vite 8
- Tailwind CSS 4
- React Router 7
- Zustand (상태 관리)
- D3.js (데이터 시각화)
- Axios
- MSW (API 목업)
- ESLint + Prettier

## 시작하기

```bash
# 패키지 설치
pnpm install

# 개발 서버 실행
pnpm run dev

# 빌드
pnpm build

# 프리뷰
pnpm preview
```

## 스크립트

| 명령어              | 설명               |
| ------------------- | ------------------ |
| `pnpm run dev`      | 개발 서버 실행     |
| `pnpm build`        | 프로덕션 빌드      |
| `pnpm preview`      | 빌드 결과 미리보기 |
| `pnpm lint`         | ESLint 검사        |
| `pnpm lint:fix`     | ESLint 자동 수정   |
| `pnpm format`       | Prettier 포맷팅    |
| `pnpm format:check` | Prettier 포맷 검사 |

## 주요 기능

### 🔐 인증

- Google OAuth 로그인
- 토큰 기반 인증 및 라우트 보호
- 마이페이지 (프로필 정보 확인)

### 📊 채널 분석

- 채널 요약 정보 (구독자, 총 조회수, 영상 수)
- 알고리즘 점수 시각화
- 영상 목록 및 상세 분석
  - 조회수 성장률
  - 평균 시청 시간
  - 시청자 만족도
  - 시청자 유지율 그래프
- AI 요약 및 개선점 제안
- 이어서 만들면 좋은 콘텐츠 추천

### 🎬 영상 추천

- 키워드, 카테고리, 영상 길이 기반 검색
- AI 주제 추천
- 추천 결과 목록

## 프로젝트 구조

```
src/
├── api/             # API 설정 및 요청
├── assets/          # 정적 리소스 (아이콘, 이미지)
├── components/      # 재사용 컴포넌트
│   ├── channel/     # 채널 관련 컴포넌트
│   ├── header/      # 헤더
│   ├── recommendContent/  # 영상 추천 폼
│   └── videoDetail/ # 영상 상세 분석 컴포넌트
├── mocks/           # MSW 목업 데이터
├── pages/           # 페이지 컴포넌트
│   ├── analysis/    # 채널 분석 페이지
│   ├── login/       # 로그인 페이지
│   ├── main/        # 메인 페이지
│   └── recommend/   # 영상 추천 페이지
├── routes/          # 라우팅 설정
├── stores/          # Zustand 스토어
├── index.css        # 글로벌 스타일
└── index.tsx        # 엔트리 포인트
```

## 경로 별칭

`@/*` → `src/*` 경로 별칭이 설정되어 있습니다.

```tsx
import MainPage from '@/pages/main';
```
