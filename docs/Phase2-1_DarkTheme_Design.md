# Phase 2.1 다크 테마 CSS 변수 시스템 구축 설계서

## 개요

본 문서는 MES UI 프레임워크의 다크 테마 CSS 변수 시스템 구축을 위한 상세 설계를 다룹니다. 이 단계에서는 CSS 커스텀 프로퍼티를 활용한 색상, 타이포그래피, 간격 시스템을 정의하고, 라이트/다크 테마 전환 기능을 구현하며, Vue 3 Composition API를 활용한 테마 관리 컴포저블을 작성합니다.

## 설계 목표

### 주요 목표
1. **일관된 디자인 시스템**: CSS 변수를 통한 통일된 색상 및 스타일 관리
2. **테마 전환 기능**: 사용자가 라이트/다크 테마를 자유롭게 전환할 수 있는 시스템
3. **확장 가능성**: 향후 추가 테마나 커스터마이징을 쉽게 적용할 수 있는 구조
4. **성능 최적화**: CSS 변수를 활용한 효율적인 스타일 적용
5. **접근성 준수**: WCAG 2.1 AA 기준을 만족하는 색상 대비

### 기술적 요구사항
- CSS Custom Properties (CSS Variables) 활용
- Vue 3 Composition API 기반 테마 관리
- localStorage를 통한 테마 설정 영속화
- 시스템 테마 자동 감지 지원
- 부드러운 테마 전환 애니메이션

## 색상 시스템 설계

### 다크 테마 색상 팔레트

#### 배경색 (Background Colors)
```css
:root[data-theme="dark"] {
  /* Primary Backgrounds */
  --bg-primary: #0f172a;      /* 메인 배경 - 깊은 슬레이트 */
  --bg-secondary: #1e293b;    /* 카드/패널 배경 */
  --bg-tertiary: #334155;     /* 호버/활성 상태 */
  
  /* Surface Colors */
  --surface-1: #475569;       /* 입력 필드, 버튼 */
  --surface-2: #64748b;       /* 테두리, 구분선 */
  --surface-3: #94a3b8;       /* 비활성 요소 */
}
```

#### 텍스트 색상 (Text Colors)
```css
:root[data-theme="dark"] {
  /* Text Hierarchy */
  --text-primary: #f8fafc;    /* 주요 텍스트 */
  --text-secondary: #e2e8f0;  /* 보조 텍스트 */
  --text-tertiary: #cbd5e1;   /* 캡션, 라벨 */
  --text-muted: #94a3b8;      /* 비활성, 플레이스홀더 */
  --text-inverse: #0f172a;    /* 역방향 텍스트 (버튼 내부 등) */
}
```

#### 브랜드 색상 (Brand Colors)
```css
:root[data-theme="dark"] {
  /* Primary Brand */
  --primary: #3b82f6;         /* 메인 브랜드 색상 */
  --primary-hover: #2563eb;   /* 호버 상태 */
  --primary-light: #93c5fd;   /* 연한 톤 */
  --primary-dark: #1d4ed8;    /* 진한 톤 */
  
  /* Secondary */
  --secondary: #64748b;       /* 보조 브랜드 */
  --secondary-hover: #475569; /* 보조 브랜드 호버 */
  --accent: #f59e0b;          /* 강조색 */
  
  /* Status Colors */
  --success: #10b981;         /* 성공 */
  --success-light: #34d399;   /* 성공 연한 톤 */
  --warning: #f59e0b;         /* 경고 */
  --warning-light: #fbbf24;   /* 경고 연한 톤 */
  --error: #ef4444;           /* 에러 */
  --error-light: #f87171;     /* 에러 연한 톤 */
  --info: #06b6d4;            /* 정보 */
  --info-light: #22d3ee;      /* 정보 연한 톤 */
}
```

### 라이트 테마 색상 팔레트

```css
:root[data-theme="light"] {
  /* Primary Backgrounds */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  
  /* Surface Colors */
  --surface-1: #e2e8f0;
  --surface-2: #cbd5e1;
  --surface-3: #94a3b8;
  
  /* Text Colors */
  --text-primary: #0f172a;
  --text-secondary: #334155;
  --text-tertiary: #64748b;
  --text-muted: #94a3b8;
  --text-inverse: #ffffff;
  
  /* Brand Colors (동일하게 유지) */
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --primary-light: #93c5fd;
  --primary-dark: #1d4ed8;
  
  --secondary: #64748b;
  --secondary-hover: #475569;
  --accent: #f59e0b;
  
  --success: #10b981;
  --success-light: #34d399;
  --warning: #f59e0b;
  --warning-light: #fbbf24;
  --error: #ef4444;
  --error-light: #f87171;
  --info: #06b6d4;
  --info-light: #22d3ee;
}
```

## 타이포그래피 시스템 설계

### 폰트 패밀리
```css
:root {
  /* Sans-serif (UI 기본) */
  --font-sans: 'Pretendard Variable', 'Pretendard', 
               'Noto Sans KR', 'Malgun Gothic', 
               -apple-system, BlinkMacSystemFont, 
               'Segoe UI', sans-serif;
  
  /* Monospace (코드, 데이터) */
  --font-mono: 'JetBrains Mono', 'Fira Code', 
               'SF Mono', 'Monaco', 'Consolas', 
               'Liberation Mono', monospace;
  
  /* Barcode (바코드 전용) */
  --font-barcode: 'Libre Barcode 39', 'Code 39', monospace;
}
```

### 폰트 크기 체계 (Type Scale)
```css
:root {
  /* Font Sizes */
  --text-xs: 0.75rem;     /* 12px - 캡션, 라벨 */
  --text-sm: 0.875rem;    /* 14px - 작은 텍스트 */
  --text-base: 1rem;      /* 16px - 기본 텍스트 */
  --text-lg: 1.125rem;    /* 18px - 강조 텍스트 */
  --text-xl: 1.25rem;     /* 20px - 소제목 */
  --text-2xl: 1.5rem;     /* 24px - 제목 */
  --text-3xl: 1.875rem;   /* 30px - 큰 제목 */
  --text-4xl: 2.25rem;    /* 36px - 메인 제목 */
  
  /* Line Heights */
  --leading-none: 1;        /* 타이트한 제목용 */
  --leading-tight: 1.25;    /* 제목용 */
  --leading-snug: 1.375;    /* 부제목용 */
  --leading-normal: 1.5;    /* 본문용 */
  --leading-relaxed: 1.625; /* 긴 텍스트용 */
  --leading-loose: 2;       /* 여유로운 텍스트용 */
  
  /* Font Weights */
  --font-thin: 100;
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
  --font-black: 900;
}
```

## 간격 시스템 설계

### Spacing Scale (4px 기준)
```css
:root {
  /* Base Spacing Unit */
  --space-unit: 0.25rem; /* 4px */
  
  /* Spacing Scale */
  --space-0: 0;
  --space-1: calc(var(--space-unit) * 1);   /* 4px */
  --space-2: calc(var(--space-unit) * 2);   /* 8px */
  --space-3: calc(var(--space-unit) * 3);   /* 12px */
  --space-4: calc(var(--space-unit) * 4);   /* 16px */
  --space-5: calc(var(--space-unit) * 5);   /* 20px */
  --space-6: calc(var(--space-unit) * 6);   /* 24px */
  --space-8: calc(var(--space-unit) * 8);   /* 32px */
  --space-10: calc(var(--space-unit) * 10); /* 40px */
  --space-12: calc(var(--space-unit) * 12); /* 48px */
  --space-16: calc(var(--space-unit) * 16); /* 64px */
  --space-20: calc(var(--space-unit) * 20); /* 80px */
  --space-24: calc(var(--space-unit) * 24); /* 96px */
  
  /* Semantic Spacing */
  --gap-xs: var(--space-1);
  --gap-sm: var(--space-2);
  --gap-md: var(--space-4);
  --gap-lg: var(--space-6);
  --gap-xl: var(--space-8);
  
  /* Component Spacing */
  --padding-xs: var(--space-2);
  --padding-sm: var(--space-3);
  --padding-md: var(--space-4);
  --padding-lg: var(--space-6);
  --padding-xl: var(--space-8);
  
  --margin-xs: var(--space-2);
  --margin-sm: var(--space-3);
  --margin-md: var(--space-4);
  --margin-lg: var(--space-6);
  --margin-xl: var(--space-8);
}
```

### 레이아웃 관련 변수
```css
:root {
  /* Component Dimensions */
  --header-height: 60px;
  --toolbar-width: 80px;
  --menu-tree-width: 280px;
  --tab-height: 45px;
  --sidebar-width: 320px;
  
  /* Border Radius */
  --radius-none: 0;
  --radius-sm: 0.125rem;    /* 2px */
  --radius-md: 0.375rem;    /* 6px */
  --radius-lg: 0.5rem;      /* 8px */
  --radius-xl: 0.75rem;     /* 12px */
  --radius-2xl: 1rem;       /* 16px */
  --radius-full: 9999px;    /* 완전한 원형 */
  
  /* Shadow System */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  
  /* Colored Shadows */
  --shadow-primary: 0 4px 14px 0 rgba(59, 130, 246, 0.15);
  --shadow-success: 0 4px 14px 0 rgba(16, 185, 129, 0.15);
  --shadow-warning: 0 4px 14px 0 rgba(245, 158, 11, 0.15);
  --shadow-error: 0 4px 14px 0 rgba(239, 68, 68, 0.15);
}
```

## 애니메이션 및 전환 시스템

### 전환 시간 및 이징
```css
:root {
  /* Transition Durations */
  --transition-fast: 150ms;
  --transition-normal: 200ms;
  --transition-slow: 300ms;
  --transition-slower: 500ms;
  
  /* Easing Functions */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-elastic: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  /* Common Transitions */
  --transition-colors: color var(--transition-normal) var(--ease-in-out),
                       background-color var(--transition-normal) var(--ease-in-out),
                       border-color var(--transition-normal) var(--ease-in-out);
  --transition-opacity: opacity var(--transition-normal) var(--ease-in-out);
  --transition-transform: transform var(--transition-normal) var(--ease-in-out);
  --transition-all: all var(--transition-normal) var(--ease-in-out);
}
```

## 테마 관리 컴포저블 설계

### useTheme 컴포저블 인터페이스
```typescript
interface ThemeConfig {
  name: 'light' | 'dark' | 'auto';
  colors: Record<string, string>;
  fonts: Record<string, string>;
  spacing: Record<string, string>;
}

interface UseThemeReturn {
  // 상태
  currentTheme: Ref<'light' | 'dark'>;
  themeMode: Ref<'light' | 'dark' | 'auto'>;
  isSystemDark: Ref<boolean>;
  
  // 메서드
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  toggleTheme: () => void;
  
  // 유틸리티
  isDark: ComputedRef<boolean>;
  isLight: ComputedRef<boolean>;
  themeClasses: ComputedRef<string[]>;
}
```

### 컴포저블 구현 계획
```typescript
// composables/useTheme.ts
export function useTheme(): UseThemeReturn {
  // 1. 반응형 상태 관리
  // 2. 시스템 테마 감지
  // 3. localStorage 연동
  // 4. DOM 업데이트
  // 5. 테마 전환 애니메이션
}
```

## 파일 구조 설계

```
src/
├── styles/
│   ├── variables/
│   │   ├── colors.css          # 색상 변수
│   │   ├── typography.css      # 타이포그래피 변수
│   │   ├── spacing.css         # 간격 변수
│   │   ├── animations.css      # 애니메이션 변수
│   │   └── index.css          # 모든 변수 통합
│   ├── themes/
│   │   ├── dark.css           # 다크 테마 변수
│   │   ├── light.css          # 라이트 테마 변수
│   │   └── index.css          # 테마 통합
│   ├── base/
│   │   ├── reset.css          # CSS 리셋
│   │   ├── typography.css     # 기본 타이포그래피
│   │   └── utilities.css      # 유틸리티 클래스
│   └── main.css               # 메인 스타일 파일
├── composables/
│   └── useTheme.ts            # 테마 관리 컴포저블
└── types/
    └── theme.ts               # 테마 관련 타입 정의
```

## 구현 단계

### 1단계: CSS 변수 시스템 구축
1. 기본 변수 파일 생성 (colors, typography, spacing)
2. 다크/라이트 테마 변수 정의
3. 애니메이션 및 전환 변수 설정
4. 변수 통합 및 빌드 시스템 연동

### 2단계: 테마 전환 시스템 구현
1. useTheme 컴포저블 기본 구조 작성
2. 시스템 테마 감지 로직 구현
3. localStorage 연동 및 상태 영속화
4. DOM 업데이트 및 클래스 관리

### 3단계: 테마 적용 및 테스트
1. 기존 컴포넌트에 CSS 변수 적용
2. 테마 전환 버튼 구현
3. 테마 전환 애니메이션 추가
4. 접근성 및 성능 테스트

### 4단계: 최적화 및 문서화
1. CSS 변수 최적화 및 정리
2. 테마 시스템 문서화
3. 사용 가이드 작성
4. 단위 테스트 작성

## 성능 고려사항

### CSS 변수 최적화
- 불필요한 변수 제거
- 변수 상속 구조 최적화
- 런타임 계산 최소화

### 테마 전환 성능
- 부드러운 전환 애니메이션
- 레이아웃 시프트 방지
- 메모리 사용량 최적화

## 접근성 고려사항

### 색상 대비
- WCAG 2.1 AA 기준 준수 (4.5:1 이상)
- 색상 대비 자동 검증 도구 활용
- 고대비 모드 지원

### 사용자 선호도 존중
- 시스템 테마 설정 자동 감지
- prefers-color-scheme 미디어 쿼리 활용
- prefers-reduced-motion 지원

## 테스트 계획

### 단위 테스트
- useTheme 컴포저블 기능 테스트
- 테마 전환 로직 테스트
- localStorage 연동 테스트

### 통합 테스트
- 컴포넌트별 테마 적용 테스트
- 브라우저별 호환성 테스트
- 성능 벤치마크 테스트

### 사용자 테스트
- 테마 전환 사용성 테스트
- 접근성 준수 확인
- 다양한 디바이스에서 동작 확인

## 완료 기준

### 기능적 완료 기준
- [ ] 모든 CSS 변수 정의 완료
- [ ] 다크/라이트 테마 전환 기능 동작
- [ ] useTheme 컴포저블 완전 구현
- [ ] 테마 설정 영속화 기능 동작
- [ ] 시스템 테마 자동 감지 기능

### 품질 기준
- [ ] WCAG 2.1 AA 색상 대비 기준 준수
- [ ] 모든 브라우저에서 정상 동작
- [ ] 테마 전환 시 성능 저하 없음
- [ ] 단위 테스트 커버리지 90% 이상
- [ ] 문서화 완료

### 성능 기준
- [ ] 테마 전환 시간 < 300ms
- [ ] CSS 변수 적용으로 인한 성능 저하 없음
- [ ] 메모리 사용량 증가 < 5%

이 설계서를 바탕으로 체계적이고 확장 가능한 테마 시스템을 구축하여 MES UI 프레임워크의 기반을 마련하겠습니다.