# Phase 2-2: 타이포그래피 및 아이콘 시스템 구현 설계서

## 개요

본 문서는 MES UI 프레임워크의 타이포그래피 및 아이콘 시스템 구현을 위한 상세 설계서입니다. Pretendard 폰트와 JetBrains Mono 폰트를 적용하고, 체계적인 폰트 크기 및 라인 높이 시스템을 구축하며, Lucide 아이콘 라이브러리를 통합하여 MES 특화 아이콘 매핑을 구현합니다.

## 설계 목표

1. **일관된 타이포그래피**: 모든 UI 요소에서 통일된 폰트 시스템 적용
2. **가독성 최적화**: MES 업무 환경에 최적화된 폰트 크기 및 라인 높이
3. **아이콘 통합**: Lucide 아이콘 라이브러리를 통한 일관된 아이콘 시스템
4. **확장성**: 향후 추가 폰트 및 아이콘 요구사항에 유연하게 대응

## 1. 폰트 시스템 설계

### 1.1 폰트 패밀리 구조

```css
:root {
  /* Sans-serif (UI 기본) */
  --font-sans: 'Pretendard Variable', 'Pretendard', 
               'Noto Sans KR', 'Malgun Gothic', 
               -apple-system, BlinkMacSystemFont, sans-serif;
  
  /* Monospace (코드, 데이터) */
  --font-mono: 'JetBrains Mono', 'Fira Code', 
               'Consolas', monospace;
  
  /* Barcode (바코드 전용) */
  --font-barcode: 'Libre Barcode 39', 'Code 39', monospace;
}
```

### 1.2 폰트 로딩 전략

#### CDN 사용 금지 제약사항 대응
- 로컬 폰트 파일 다운로드 및 프로젝트 내 포함
- `public/fonts/` 디렉토리에 폰트 파일 저장
- CSS `@font-face` 규칙을 통한 폰트 로딩

#### 폰트 파일 구조
```
public/fonts/
├── pretendard/
│   ├── Pretendard-Regular.woff2
│   ├── Pretendard-Medium.woff2
│   ├── Pretendard-SemiBold.woff2
│   └── Pretendard-Bold.woff2
├── jetbrains-mono/
│   ├── JetBrainsMono-Regular.woff2
│   ├── JetBrainsMono-Medium.woff2
│   └── JetBrainsMono-Bold.woff2
└── barcode/
    └── LibreBarcode39-Regular.woff2
```

### 1.3 폰트 크기 체계

#### 기본 크기 스케일 (16px 기준)
```css
:root {
  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px - 캡션, 라벨 */
  --text-sm: 0.875rem;   /* 14px - 작은 텍스트, 버튼 */
  --text-base: 1rem;     /* 16px - 기본 텍스트 */
  --text-lg: 1.125rem;   /* 18px - 강조 텍스트 */
  --text-xl: 1.25rem;    /* 20px - 소제목 */
  --text-2xl: 1.5rem;    /* 24px - 제목 */
  --text-3xl: 1.875rem;  /* 30px - 큰 제목 */
  
  /* Line Heights */
  --leading-tight: 1.25;   /* 제목용 */
  --leading-normal: 1.5;   /* 본문용 */
  --leading-relaxed: 1.625; /* 긴 텍스트용 */
}
```

#### MES 특화 사용 가이드
- **데이터 테이블**: `--text-sm` (14px) - 많은 정보를 효율적으로 표시
- **폼 라벨**: `--text-sm` (14px) - 명확한 구분
- **버튼 텍스트**: `--text-sm` (14px) - 적절한 클릭 영역
- **본문 텍스트**: `--text-base` (16px) - 기본 가독성
- **섹션 제목**: `--text-xl` (20px) - 계층 구조 표현

### 1.4 폰트 가중치 시스템

```css
:root {
  /* Font Weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

## 2. 아이콘 시스템 설계

### 2.1 Lucide 아이콘 라이브러리 선택 이유

1. **일관된 디자인**: 24x24px 그리드 기반의 통일된 스타일
2. **가벼운 용량**: SVG 기반으로 최적화된 파일 크기
3. **Vue 3 호환성**: 공식 Vue 3 지원
4. **확장성**: 1000+ 아이콘으로 다양한 요구사항 대응
5. **커스터마이징**: stroke-width, 색상 등 자유로운 조정

### 2.2 아이콘 크기 체계

```css
:root {
  /* Icon Sizes */
  --icon-xs: 0.75rem;    /* 12px - 인라인 아이콘 */
  --icon-sm: 1rem;       /* 16px - 버튼 내 아이콘 */
  --icon-md: 1.25rem;    /* 20px - 일반 아이콘 */
  --icon-lg: 1.5rem;     /* 24px - 기본 크기 */
  --icon-xl: 2rem;       /* 32px - 큰 아이콘 */
  --icon-2xl: 2.5rem;    /* 40px - 툴바 아이콘 */
}
```

### 2.3 MES 특화 아이콘 매핑

#### 대단위 업무 아이콘
```typescript
const businessIcons = {
  home: 'Home',
  production: 'Factory',
  quality: 'ShieldCheck',
  equipment: 'Settings',
  inventory: 'Package',
  planning: 'Calendar',
  reporting: 'BarChart3',
  maintenance: 'Wrench',
  logistics: 'Truck'
};
```

#### 네비게이션 아이콘
```typescript
const navigationIcons = {
  menu: 'Menu',
  search: 'Search',
  expand: 'ChevronDown',
  collapse: 'ChevronUp',
  close: 'X',
  back: 'ArrowLeft',
  forward: 'ArrowRight',
  refresh: 'RefreshCw'
};
```

#### 액션 아이콘
```typescript
const actionIcons = {
  add: 'Plus',
  edit: 'Pencil',
  delete: 'Trash2',
  save: 'Save',
  copy: 'Copy',
  download: 'Download',
  upload: 'Upload',
  print: 'Printer'
};
```

#### 상태 아이콘
```typescript
const statusIcons = {
  success: 'CheckCircle',
  warning: 'AlertTriangle',
  error: 'XCircle',
  info: 'Info',
  loading: 'Loader2',
  online: 'Wifi',
  offline: 'WifiOff'
};
```

### 2.4 아이콘 컴포넌트 설계

#### 기본 아이콘 컴포넌트
```vue
<template>
  <component 
    :is="iconComponent"
    :size="iconSize"
    :stroke-width="strokeWidth"
    :class="iconClasses"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
interface Props {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  strokeWidth?: number;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'lg',
  strokeWidth: 1.5
});
</script>
```

## 3. 구현 계획

### 3.1 폰트 시스템 구현 단계

#### Step 1: 폰트 파일 준비
1. Pretendard 폰트 다운로드 (woff2 형식)
2. JetBrains Mono 폰트 다운로드 (woff2 형식)
3. `public/fonts/` 디렉토리 구조 생성
4. 폰트 파일 배치

#### Step 2: CSS 폰트 정의
1. `src/styles/fonts.css` 파일 생성
2. `@font-face` 규칙 정의
3. CSS 변수 시스템 구축
4. 폰트 로딩 최적화

#### Step 3: 타이포그래피 유틸리티 클래스
1. `src/styles/typography.css` 파일 생성
2. 폰트 크기별 유틸리티 클래스 정의
3. 라인 높이 및 가중치 클래스 정의
4. 반응형 타이포그래피 지원

### 3.2 아이콘 시스템 구현 단계

#### Step 1: Lucide Vue 설치 및 설정
1. `lucide-vue-next` 패키지 설치
2. Vue 앱에 아이콘 라이브러리 등록
3. 기본 아이콘 컴포넌트 생성

#### Step 2: MES 아이콘 매핑 시스템
1. `src/composables/useIcons.ts` 생성
2. 아이콘 매핑 객체 정의
3. 아이콘 검색 및 사용 유틸리티 함수

#### Step 3: 아이콘 컴포넌트 통합
1. 기본 아이콘 컴포넌트 완성
2. 크기별 아이콘 변형 지원
3. 테마 색상 연동
4. 접근성 속성 추가

### 3.3 테스트 계획

#### 폰트 시스템 테스트
1. 폰트 로딩 성공 여부 확인
2. 다양한 브라우저에서 폰트 렌더링 테스트
3. 폰트 크기 및 라인 높이 정확성 검증
4. 성능 영향 측정

#### 아이콘 시스템 테스트
1. 아이콘 렌더링 정확성 확인
2. 크기별 아이콘 표시 테스트
3. 색상 및 테마 연동 확인
4. 접근성 속성 검증

## 4. 파일 구조

```
src/
├── styles/
│   ├── fonts.css           # 폰트 정의
│   ├── typography.css      # 타이포그래피 유틸리티
│   └── icons.css          # 아이콘 스타일
├── components/
│   └── ui/
│       └── MesIcon.vue    # 기본 아이콘 컴포넌트
├── composables/
│   └── useIcons.ts        # 아이콘 매핑 및 유틸리티
└── types/
    └── icons.ts           # 아이콘 타입 정의

public/
└── fonts/
    ├── pretendard/        # Pretendard 폰트 파일
    ├── jetbrains-mono/    # JetBrains Mono 폰트 파일
    └── barcode/           # 바코드 폰트 파일
```

## 5. 성능 고려사항

### 5.1 폰트 로딩 최적화
- `font-display: swap` 사용으로 FOUT 방지
- 중요한 폰트 가중치만 선택적 로딩
- 폰트 프리로딩 적용

### 5.2 아이콘 최적화
- Tree-shaking을 통한 사용하지 않는 아이콘 제거
- SVG 아이콘의 인라인 렌더링으로 HTTP 요청 최소화
- 아이콘 캐싱 전략 적용

## 6. 접근성 고려사항

### 6.1 폰트 접근성
- 최소 16px 기본 폰트 크기 유지
- 충분한 라인 높이로 가독성 확보
- 고대비 모드 지원

### 6.2 아이콘 접근성
- 모든 아이콘에 적절한 `aria-label` 제공
- 장식용 아이콘에 `aria-hidden="true"` 적용
- 스크린 리더 호환성 확보

## 7. 브라우저 호환성

### 7.1 폰트 호환성
- WOFF2 형식 우선 사용 (Chrome, Edge 지원)
- 폰트 폴백 체인으로 호환성 확보

### 7.2 아이콘 호환성
- SVG 기반으로 모든 모던 브라우저 지원
- IE 미지원으로 폴리필 불필요

## 8. 마이그레이션 계획

### 8.1 기존 시스템과의 호환성
- 기존 폰트 시스템과 점진적 교체
- CSS 변수를 통한 하위 호환성 유지

### 8.2 단계적 적용
1. 새로운 컴포넌트부터 적용
2. 기존 컴포넌트 점진적 업데이트
3. 전체 시스템 일관성 확보

이 설계서를 바탕으로 타이포그래피 및 아이콘 시스템을 체계적으로 구현하여 일관되고 사용자 친화적인 MES UI 프레임워크를 완성하겠습니다.