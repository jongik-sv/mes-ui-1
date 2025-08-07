# MES UI 테마 및 디자인 시스템 가이드

> 현대적이고 일관성 있는 MES 사용자 인터페이스를 위한 완전한 디자인 시스템

## 🎨 디자인 철학

### 핵심 원칙
1. **명확성 (Clarity)**: 정보 전달이 명확하고 직관적
2. **효율성 (Efficiency)**: 빠르고 정확한 업무 처리 지원
3. **일관성 (Consistency)**: 모든 화면에서 통일된 경험
4. **접근성 (Accessibility)**: 모든 사용자가 쉽게 접근 가능
5. **확장성 (Scalability)**: 미래 요구사항에 유연하게 대응

### MES 특화 고려사항
- **장시간 사용**: 눈의 피로를 최소화하는 다크 테마
- **데이터 중심**: 정보 가독성을 최우선으로 하는 레이아웃
- **정밀 작업**: 정확한 클릭과 입력을 위한 충분한 타겟 크기
- **실시간 모니터링**: 상태 변화를 즉시 인지할 수 있는 시각적 피드백

---

## 🌙 다크 테마 색상 시스템

### 기본 색상 팔레트

#### Background Colors (배경색)
```css
:root {
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

#### Text Colors (텍스트 색상)
```css
:root {
  /* Text Hierarchy */
  --text-primary: #f8fafc;    /* 주요 텍스트 */
  --text-secondary: #e2e8f0;  /* 보조 텍스트 */
  --text-tertiary: #cbd5e1;   /* 캡션, 라벨 */
  --text-muted: #94a3b8;      /* 비활성, 플레이스홀더 */
}
```

#### Brand Colors (브랜드 색상)
```css
:root {
  /* Primary Brand */
  --primary: #3b82f6;         /* 메인 브랜드 색상 */
  --primary-hover: #2563eb;   /* 호버 상태 */
  --primary-light: #93c5fd;   /* 연한 톤 */
  
  /* Secondary */
  --secondary: #64748b;       /* 보조 브랜드 */
  --accent: #f59e0b;          /* 강조색 */
  
  /* Status Colors */
  --success: #10b981;         /* 성공 */
  --warning: #f59e0b;         /* 경고 */
  --error: #ef4444;           /* 에러 */
  --info: #06b6d4;            /* 정보 */
}
```

### 💡 라이트 테마 (선택적 지원)
```css
[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --text-primary: #0f172a;
  --text-secondary: #334155;
}
```

---

## 📝 타이포그래피 시스템

### 폰트 패밀리
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

### 폰트 크기 체계
```css
:root {
  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px - 캡션 */
  --text-sm: 0.875rem;   /* 14px - 작은 텍스트 */
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

---

## 🎯 간격 및 레이아웃 시스템

### Spacing Scale (4px 기준)
```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */
  
  /* Semantic Spacing */
  --gap-sm: var(--space-2);
  --gap-md: var(--space-4);
  --gap-lg: var(--space-6);
}
```

### Layout Grid
```css
:root {
  /* Component Sizes */
  --header-height: 60px;
  --toolbar-width: 70px;
  --menu-tree-width: 280px;
  --tab-height: 45px;
}
```

### 반응형 브레이크포인트
```css
/* 모바일 */
@media (max-width: 768px) {
  :root {
    --toolbar-width: 0;
    --menu-tree-width: 100vw;
    --header-height: 56px;
  }
}

/* 태블릿 */
@media (min-width: 769px) and (max-width: 1024px) {
  :root {
    --toolbar-width: 60px;
    --menu-tree-width: 240px;
  }
}
```

---

## 🔘 컴포넌트 스타일

### 버튼 시스템
```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--gap-sm);
  padding: var(--space-2) var(--space-4);
  border-radius: 0.375rem;
  border: 1px solid transparent;
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:focus {
    outline: 2px solid var(--primary-light);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn-primary {
  background: var(--primary);
  color: white;
  
  &:hover {
    background: var(--primary-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
}

.btn-secondary {
  background: var(--secondary);
  color: var(--text-primary);
  
  &:hover {
    background: var(--surface-2);
  }
}
```

### 입력 필드 시스템
```css
.input {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  background: var(--surface-1);
  border: 1px solid var(--surface-2);
  border-radius: 0.375rem;
  color: var(--text-primary);
  font-size: var(--text-sm);
  transition: all 0.2s ease;
  
  &::placeholder {
    color: var(--text-muted);
  }
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &:disabled {
    background: var(--surface-3);
    color: var(--text-muted);
    cursor: not-allowed;
  }
}
```

### 카드 시스템
```css
.card {
  background: var(--bg-secondary);
  border: 1px solid var(--surface-2);
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--primary);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
}

.card-header {
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--surface-2);
  background: var(--bg-tertiary);
}

.card-body {
  padding: var(--space-6);
}
```

---

## 🎭 아이콘 시스템

### 추천 아이콘 라이브러리
1. **Lucide React** ⭐ (1순위)
   - 스타일: 깔끔한 outline 스타일
   - 크기: 24x24px 기본
   - 라이선스: ISC License

2. **Heroicons** (2순위)
   - 스타일: outline과 solid 버전
   - 크기: 24x24px, 20x20px
   - 라이선스: MIT License

### 아이콘 크기 체계
```css
:root {
  --icon-xs: 0.75rem;    /* 12px */
  --icon-sm: 1rem;       /* 16px */
  --icon-md: 1.25rem;    /* 20px */
  --icon-lg: 1.5rem;     /* 24px */
  --icon-xl: 2rem;       /* 32px */
}

.icon {
  width: var(--icon-lg);
  height: var(--icon-lg);
  stroke: currentColor;
  fill: none;
  stroke-width: 1.5;
  transition: all 0.2s ease;
}
```

### MES 특화 아이콘 매핑
```javascript
const mesIcons = {
  // 대단위 업무
  home: 'Home',
  production: 'Factory',
  quality: 'Shield-check',
  equipment: 'Settings',
  inventory: 'Package',
  planning: 'Calendar',
  reporting: 'Bar-chart-3',
  
  // 네비게이션
  menu: 'Menu',
  search: 'Search',
  expand: 'Chevron-down',
  close: 'X',
  
  // 액션
  add: 'Plus',
  edit: 'Pencil',
  delete: 'Trash-2',
  save: 'Save',
  
  // 상태
  success: 'Check-circle',
  warning: 'Alert-triangle',
  error: 'X-circle',
  info: 'Info'
};
```

---

## ✨ 애니메이션 및 전환

### 전환 시스템
```css
:root {
  /* Transition Durations */
  --transition-fast: 150ms;
  --transition-normal: 200ms;
  --transition-slow: 300ms;
  
  /* Easing Functions */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* 기본 전환 효과 */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 툴바 아이콘 애니메이션 (90도 회전) */
.toolbar-icon {
  transition: transform var(--transition-normal) var(--ease-in-out);
}

.toolbar-icon:hover {
  transform: rotate(90deg);
}

/* 호버 효과 */
.interactive {
  transition: var(--transition-normal);
}

.interactive:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
```

---

## 📐 그림자 시스템

```css
:root {
  /* Shadow Levels */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
  
  /* Colored Shadows */
  --shadow-primary: 0 4px 14px rgba(59, 130, 246, 0.15);
  --shadow-success: 0 4px 14px rgba(16, 185, 129, 0.15);
  --shadow-error: 0 4px 14px rgba(239, 68, 68, 0.15);
}
```

---

## 🌈 테마 전환 시스템

### 테마 관리자
```javascript
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('mes-theme') || 'dark';
    this.applyTheme(this.currentTheme);
  }
  
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mes-theme', theme);
    this.currentTheme = theme;
  }
  
  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }
  
  // 시스템 테마 자동 감지
  detectSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' : 'light';
  }
}

// 초기화
const themeManager = new ThemeManager();
```

---

## 🎪 MES 특화 컴포넌트

### 상태 인디케이터
```css
.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: var(--gap-sm);
  padding: var(--space-1) var(--space-2);
  border-radius: 9999px;
  font-size: var(--text-xs);
  font-weight: 500;
  text-transform: uppercase;
}

.status-indicator::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-online {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-400);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.status-online::before {
  background: var(--success);
  box-shadow: 0 0 6px var(--success);
}
```

### 진행률 바
```css
.progress {
  width: 100%;
  height: 8px;
  background: var(--surface-1);
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--primary);
  border-radius: 9999px;
  transition: width var(--transition-slow);
}
```

### 뱃지 시스템
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-2);
  border-radius: 0.375rem;
  font-size: var(--text-xs);
  font-weight: 500;
  text-transform: uppercase;
}

.badge-primary {
  background: var(--primary);
  color: white;
}

.badge-success {
  background: var(--success);
  color: white;
}
```

---

## 📱 반응형 가이드라인

### 모바일 최적화
```css
/* 모바일 퍼스트 접근법 */
@media (max-width: 639px) {
  /* 헤더 조정 */
  .header {
    height: 56px;
    padding: 0 var(--space-4);
  }
  
  /* 툴바 숨김 */
  .toolbar {
    display: none;
  }
  
  /* 메뉴 트리 풀스크린 */
  .menu-tree {
    position: fixed;
    top: 56px;
    left: 0;
    width: 100vw;
    height: calc(100vh - 56px);
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform var(--transition-slow);
  }
  
  .menu-tree.open {
    transform: translateX(0);
  }
  
  /* 터치 타겟 최소 크기 */
  .btn, .input, .select {
    min-height: 44px;
  }
}
```

### 터치 인터페이스 최적화
```css
/* 터치 친화적 스타일 */
@media (hover: none) and (pointer: coarse) {
  /* 호버 효과 제거 */
  .interactive:hover {
    transform: none;
  }
  
  /* 터치 피드백 */
  .interactive:active {
    transform: scale(0.98);
    opacity: 0.8;
  }
  
  /* 터치 타겟 크기 */
  .btn, .tab, .tree-node, .toolbar-icon {
    min-height: 44px;
    min-width: 44px;
  }
}
```

---

## ♿ 접근성 가이드라인

### WCAG 2.1 AA 준수
```css
/* 포커스 표시 */
*:focus {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* 키보드 네비게이션 강화 */
*:focus-visible {
  outline: 2px solid var(--primary);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

/* 고대비 모드 지원 */
@media (prefers-contrast: high) {
  :root {
    --text-primary: #ffffff;
    --bg-primary: #000000;
    --primary: #66ccff;
  }
}

/* 움직임 감소 선호 지원 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* 스크린 리더 전용 텍스트 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}
```

---

## 🎁 구현 예시

### 테마 적용 HTML 템플릿
```html
<!DOCTYPE html>
<html lang="ko" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MES UI Framework</title>
  <link rel="stylesheet" href="mes-theme.css">
</head>
<body>
  <!-- 건너뛰기 링크 -->
  <a href="#main-content" class="sr-only">메인 콘텐츠로 건너뛰기</a>
  
  <!-- 헤더 -->
  <header class="header" role="banner">
    <div class="header-left">
      <button class="menu-icon" aria-label="전체 메뉴">
        <svg class="icon"><!-- Menu icon --></svg>
      </button>
      <div class="company-logo">DONGKUK CM</div>
    </div>
    
    <div class="header-right">
      <div class="user-info">
        <div class="avatar">장</div>
        <span>냉연생산SM팀 장종익</span>
      </div>
      <button class="contact-btn">담당자</button>
      <button class="remote-btn">원격</button>
      <button id="theme-toggle" class="theme-toggle" aria-label="테마 전환">
        <svg class="icon"><!-- Theme icon --></svg>
      </button>
    </div>
  </header>
  
  <!-- 메인 콘텐츠 -->
  <main id="main-content" class="content-area" role="main">
    <!-- 컨텐츠 영역 -->
  </main>
  
  <script src="theme-manager.js"></script>
</body>
</html>
```

### CSS 변수 활용 예시
```css
/* 컴포넌트별 커스터마이징 */
.custom-button {
  background: var(--primary);
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: 0.375rem;
  font-size: var(--text-sm);
  transition: var(--transition-normal);
  box-shadow: var(--shadow-sm);
}

.custom-button:hover {
  background: var(--primary-hover);
  box-shadow: var(--shadow-primary);
  transform: translateY(-1px);
}

/* 다크/라이트 테마 대응 */
.status-card {
  background: var(--bg-secondary);
  border: 1px solid var(--surface-2);
  color: var(--text-primary);
  border-radius: 0.5rem;
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
}
```

---

## 📋 체크리스트

### 구현 체크리스트
- [ ] 색상 변수 시스템 구축
- [ ] 타이포그래피 시스템 적용
- [ ] 컴포넌트 기본 스타일 완성
- [ ] 다크/라이트 테마 전환 기능
- [ ] 반응형 브레이크포인트 설정
- [ ] 애니메이션 및 전환 효과
- [ ] 접근성 가이드라인 준수
- [ ] 아이콘 시스템 구축

### 품질 체크리스트
- [ ] WCAG 2.1 AA 준수 확인
- [ ] 색상 대비 4.5:1 이상 확보
- [ ] 키보드 네비게이션 지원
- [ ] 스크린 리더 호환성
- [ ] 다양한 디바이스 테스트
- [ ] 브라우저 호환성 확인

---

## 🔗 참고 자료

### 디자인 시스템 참고
- [Material Design 3](https://m3.material.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chakra UI](https://chakra-ui.com/)

### 색상 도구
- [Coolors.co](https://coolors.co/) - 색상 팔레트 생성
- [Contrast Ratio](https://contrast-ratio.com/) - 색상 대비 검사

### 폰트 리소스
- [Pretendard](https://github.com/orioncactus/pretendard)
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/)

### 아이콘 라이브러리
- [Lucide](https://lucide.dev/)
- [Heroicons](https://heroicons.com/)
- [Tabler Icons](https://tabler-icons.io/)

### 접근성 도구
- [WAVE](https://wave.webaim.org/) - 웹 접근성 평가
- [axe DevTools](https://www.deque.com/axe/devtools/) - 접근성 테스트

---

**문서 버전**: v1.0  
**최종 수정일**: 2025-08-07  
**작성자**: MES UI 디자인팀