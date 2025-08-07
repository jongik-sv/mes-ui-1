# Phase 3-1 메인 레이아웃 컴포넌트 설계서

## 개요

본 문서는 MES UI 프레임워크의 3.1 작업 "메인 레이아웃 컴포넌트 생성"에 대한 설계서입니다. CSS Grid 기반으로 전체 레이아웃 구조를 구현하고, 헤더, 툴바, 메뉴, 콘텐츠 영역의 기본 틀을 작성하며, 반응형 브레이크포인트를 설정합니다.

## 요구사항 (tasks.md 기준)
- CSS Grid 기반 전체 레이아웃 구조 구현
- 헤더, 툴바, 메뉴, 콘텐츠 영역 기본 틀 작성
- 반응형 브레이크포인트 설정 및 테스트
- 요구사항: 2.1, 2.2, 8.1, 8.2, 8.3

## 설계 목표

### 기능적 목표
1. **CSS Grid 기반 레이아웃**: 유연하고 반응형인 레이아웃 시스템 구축
2. **영역 구분**: 헤더, 툴바, 메뉴, 콘텐츠 영역의 명확한 분리
3. **반응형 지원**: 데스크톱/태블릿/모바일 화면에 최적화된 레이아웃
4. **상태 관리**: 메뉴 접힘/펼침, 툴바 표시/숨김 상태 처리

### 비기능적 목표
1. **성능**: 레이아웃 변경 시 60fps 유지
2. **접근성**: 키보드 네비게이션 및 스크린 리더 지원
3. **유지보수성**: 컴포넌트별 독립적 관리 가능
4. **확장성**: 향후 새로운 영역 추가 시 유연한 대응

## 레이아웃 구조 설계

### 1. 전체 레이아웃 구조
```
┌─────────────────────────────────────────────────────────────┐
│                        Header (헤더 영역)                    │ 60px
├──┬──────────────────────────────────────────────────────────┤
│T │                                                         │
│o │                    Main Content Area                    │ auto
│o │               (메뉴 트리 + 탭 시스템 + 콘텐츠)              │
│l │                                                         │
│b │                                                         │
│a │                                                         │
│r │                                                         │
└──┴──────────────────────────────────────────────────────────┘
 80px                                                      auto
```

### 2. CSS Grid 정의
```css
.main-layout {
  display: grid;
  grid-template-areas: 
    "header header"
    "toolbar main";
  grid-template-columns: 80px 1fr;
  grid-template-rows: 60px 1fr;
  height: 100vh;
  width: 100vw;
}
```

### 3. 영역별 스타일
```css
.layout-header {
  grid-area: header;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--surface-2);
  z-index: 100;
}

.layout-toolbar {
  grid-area: toolbar;
  background: var(--bg-secondary);
  border-right: 1px solid var(--surface-2);
  z-index: 90;
}

.layout-main {
  grid-area: main;
  background: var(--bg-primary);
  overflow: hidden;
  position: relative;
}
```

## 반응형 설계

### 브레이크포인트 정의
```css
/* 모바일: 768px 이하 */
@media (max-width: 768px) {
  .main-layout {
    grid-template-areas: 
      "header"
      "main";
    grid-template-columns: 1fr;
    grid-template-rows: 56px 1fr;
  }
  
  .layout-toolbar {
    display: none; /* 햄버거 메뉴로 대체 */
  }
}

/* 태블릿: 769px ~ 1024px */
@media (min-width: 769px) and (max-width: 1024px) {
  .main-layout {
    grid-template-columns: 60px 1fr;
  }
}

/* 데스크톱: 1025px 이상 */
@media (min-width: 1025px) {
  .main-layout {
    grid-template-columns: 80px 1fr;
  }
}
```

### 반응형 동작
1. **데스크톱 (1025px+)**: 전체 레이아웃 표시
2. **태블릿 (769-1024px)**: 툴바 축소 (60px)
3. **모바일 (768px-)**: 툴바 숨김, 헤더 높이 축소

## 컴포넌트 구조

### 1. MainLayout.vue 컴포넌트 구조
```vue
<template>
  <div class="main-layout" :class="layoutClasses">
    <!-- 헤더 영역 -->
    <header class="layout-header" role="banner">
      <slot name="header">
        <!-- HeaderComponent가 여기에 삽입됨 -->
      </slot>
    </header>
    
    <!-- 툴바 영역 -->
    <aside 
      class="layout-toolbar" 
      role="navigation"
      :class="{ 'toolbar-hidden': isToolbarHidden }"
      aria-label="주요 업무 메뉴"
    >
      <slot name="toolbar">
        <!-- ToolbarComponent가 여기에 삽입됨 -->
      </slot>
    </aside>
    
    <!-- 메인 콘텐츠 영역 -->
    <main class="layout-main" role="main">
      <slot name="main">
        <!-- TabSystem과 ContentArea가 여기에 삽입됨 -->
      </slot>
    </main>
  </div>
</template>
```

### 2. Props 및 State 정의
```typescript
interface MainLayoutProps {
  toolbarCollapsed?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
}

interface MainLayoutState {
  breakpoint: 'mobile' | 'tablet' | 'desktop';
  toolbarVisible: boolean;
  sidebarOpen: boolean;
}
```

### 3. 반응형 훅
```typescript
// composables/useBreakpoint.ts
export function useBreakpoint() {
  const breakpoint = ref<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  const updateBreakpoint = () => {
    const width = window.innerWidth;
    if (width <= 768) {
      breakpoint.value = 'mobile';
    } else if (width <= 1024) {
      breakpoint.value = 'tablet';
    } else {
      breakpoint.value = 'desktop';
    }
  };
  
  onMounted(() => {
    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
  });
  
  onUnmounted(() => {
    window.removeEventListener('resize', updateBreakpoint);
  });
  
  return {
    breakpoint: readonly(breakpoint),
    isMobile: computed(() => breakpoint.value === 'mobile'),
    isTablet: computed(() => breakpoint.value === 'tablet'),
    isDesktop: computed(() => breakpoint.value === 'desktop')
  };
}
```

## 상태 관리 설계

### Layout Store (Pinia)
```typescript
// stores/layoutStore.ts
export const useLayoutStore = defineStore('layout', () => {
  // State
  const toolbarCollapsed = ref(false);
  const sidebarOpen = ref(false);
  const breakpoint = ref<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  // Getters
  const shouldShowToolbar = computed(() => 
    breakpoint.value !== 'mobile' && !toolbarCollapsed.value
  );
  
  const layoutClasses = computed(() => ({
    'layout-mobile': breakpoint.value === 'mobile',
    'layout-tablet': breakpoint.value === 'tablet',
    'layout-desktop': breakpoint.value === 'desktop',
    'toolbar-collapsed': toolbarCollapsed.value,
    'sidebar-open': sidebarOpen.value
  }));
  
  // Actions
  const toggleToolbar = () => {
    toolbarCollapsed.value = !toolbarCollapsed.value;
  };
  
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
  };
  
  const setBreakpoint = (bp: 'mobile' | 'tablet' | 'desktop') => {
    breakpoint.value = bp;
    
    // 모바일에서는 툴바 자동 숨김
    if (bp === 'mobile') {
      toolbarCollapsed.value = true;
    }
  };
  
  return {
    toolbarCollapsed,
    sidebarOpen,
    breakpoint,
    shouldShowToolbar,
    layoutClasses,
    toggleToolbar,
    toggleSidebar,
    setBreakpoint
  };
});
```

## 스타일 시스템

### 1. CSS 변수 활용
```css
:root {
  /* Layout Dimensions */
  --header-height: 60px;
  --toolbar-width: 80px;
  --toolbar-width-collapsed: 60px;
  --sidebar-width: 280px;
  
  /* Breakpoints */
  --mobile-breakpoint: 768px;
  --tablet-breakpoint: 1024px;
  
  /* Z-index */
  --z-header: 100;
  --z-toolbar: 90;
  --z-sidebar: 95;
  --z-main: 1;
}
```

### 2. 반응형 스타일
```scss
.main-layout {
  display: grid;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  
  // 기본 데스크톱 레이아웃
  grid-template-areas: 
    "header header"
    "toolbar main";
  grid-template-columns: var(--toolbar-width) 1fr;
  grid-template-rows: var(--header-height) 1fr;
  
  // 툴바 숨김 상태
  &.toolbar-collapsed {
    grid-template-columns: 0 1fr;
    
    .layout-toolbar {
      width: 0;
      overflow: hidden;
    }
  }
  
  // 모바일 레이아웃
  &.layout-mobile {
    grid-template-areas: 
      "header"
      "main";
    grid-template-columns: 1fr;
    grid-template-rows: 56px 1fr;
    
    .layout-toolbar {
      display: none;
    }
  }
  
  // 태블릿 레이아웃
  &.layout-tablet {
    grid-template-columns: var(--toolbar-width-collapsed) 1fr;
  }
}
```

### 3. 애니메이션
```css
.layout-toolbar {
  transition: width var(--transition-slow) ease;
}

.layout-main {
  transition: margin-left var(--transition-slow) ease;
}

/* 사이드바 슬라이드 애니메이션 */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform var(--transition-slow) ease;
}

.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(-100%);
}
```

## 접근성 고려사항

### 1. ARIA 속성
```vue
<template>
  <div 
    class="main-layout" 
    role="application"
    :aria-label="$t('app.title')"
  >
    <header 
      class="layout-header" 
      role="banner"
      aria-label="주요 네비게이션"
    >
      <!-- 건너뛰기 링크 -->
      <a href="#main-content" class="skip-link">
        메인 콘텐츠로 건너뛰기
      </a>
    </header>
    
    <aside 
      class="layout-toolbar" 
      role="navigation"
      aria-label="업무 메뉴"
      :aria-hidden="!shouldShowToolbar"
    >
    </aside>
    
    <main 
      id="main-content"
      class="layout-main" 
      role="main"
      :aria-label="activeTabTitle"
    >
    </main>
  </div>
</template>
```

### 2. 키보드 네비게이션
```typescript
// 키보드 단축키 처리
const handleKeydown = (event: KeyboardEvent) => {
  // Alt + T: 툴바 토글
  if (event.altKey && event.key === 't') {
    event.preventDefault();
    layoutStore.toggleToolbar();
  }
  
  // Alt + M: 메뉴 토글 (모바일)
  if (event.altKey && event.key === 'm' && isMobile.value) {
    event.preventDefault();
    layoutStore.toggleSidebar();
  }
  
  // Esc: 모든 오버레이 닫기
  if (event.key === 'Escape') {
    if (layoutStore.sidebarOpen) {
      layoutStore.toggleSidebar();
    }
  }
};
```

## 테스트 전략

### 1. 단위 테스트 (Vitest)
```typescript
// tests/MainLayout.test.ts
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import MainLayout from '@/layouts/MainLayout.vue';
import { useLayoutStore } from '@/stores/layoutStore';

describe('MainLayout', () => {
  let pinia: ReturnType<typeof createPinia>;
  
  beforeEach(() => {
    pinia = createPinia();
  });
  
  it('기본 레이아웃 구조를 렌더링한다', () => {
    const wrapper = mount(MainLayout, {
      global: { plugins: [pinia] }
    });
    
    expect(wrapper.find('.layout-header').exists()).toBe(true);
    expect(wrapper.find('.layout-toolbar').exists()).toBe(true);
    expect(wrapper.find('.layout-main').exists()).toBe(true);
  });
  
  it('모바일 브레이크포인트에서 툴바가 숨겨진다', async () => {
    const wrapper = mount(MainLayout, {
      global: { plugins: [pinia] }
    });
    
    const layoutStore = useLayoutStore();
    layoutStore.setBreakpoint('mobile');
    
    await wrapper.vm.$nextTick();
    
    expect(wrapper.classes()).toContain('layout-mobile');
    expect(wrapper.find('.layout-toolbar').isVisible()).toBe(false);
  });
  
  it('툴바 토글이 정상 동작한다', async () => {
    const wrapper = mount(MainLayout, {
      global: { plugins: [pinia] }
    });
    
    const layoutStore = useLayoutStore();
    layoutStore.toggleToolbar();
    
    await wrapper.vm.$nextTick();
    
    expect(wrapper.classes()).toContain('toolbar-collapsed');
  });
});
```

### 2. 반응형 테스트
```typescript
describe('MainLayout Responsive', () => {
  const resizeWindow = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    window.dispatchEvent(new Event('resize'));
  };
  
  it('화면 크기 변경 시 올바른 브레이크포인트가 설정된다', async () => {
    const { breakpoint, setBreakpoint } = useBreakpoint();
    
    // 모바일 크기
    resizeWindow(600);
    await nextTick();
    expect(breakpoint.value).toBe('mobile');
    
    // 태블릿 크기
    resizeWindow(900);
    await nextTick();
    expect(breakpoint.value).toBe('tablet');
    
    // 데스크톱 크기
    resizeWindow(1200);
    await nextTick();
    expect(breakpoint.value).toBe('desktop');
  });
});
```

## 성능 최적화

### 1. CSS Grid 최적화
```css
.main-layout {
  /* GPU 가속 활용 */
  transform: translateZ(0);
  will-change: grid-template-columns;
}

/* 레이아웃 변경 시 부드러운 전환 */
.layout-toolbar,
.layout-main {
  will-change: transform, width;
}
```

### 2. 리사이즈 이벤트 디바운스
```typescript
// utils/debounce.ts
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// useBreakpoint에서 활용
const debouncedUpdate = debounce(updateBreakpoint, 100);
window.addEventListener('resize', debouncedUpdate);
```

## 에러 처리

### 1. Layout Error Boundary
```vue
<!-- components/LayoutErrorBoundary.vue -->
<template>
  <div v-if="hasError" class="layout-error">
    <div class="error-content">
      <h2>레이아웃 오류가 발생했습니다</h2>
      <p>{{ errorMessage }}</p>
      <button @click="resetError" class="btn-primary">
        다시 시도
      </button>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
const hasError = ref(false);
const errorMessage = ref('');

onErrorCaptured((error: Error) => {
  hasError.value = true;
  errorMessage.value = error.message;
  console.error('Layout Error:', error);
  return false;
});

const resetError = () => {
  hasError.value = false;
  errorMessage.value = '';
};
</script>
```

## 구현 우선순위

### Phase 1: 기본 레이아웃
1. CSS Grid 기반 레이아웃 구조 생성
2. 기본 영역 구분 (Header, Toolbar, Main)
3. 기본 스타일 적용

### Phase 2: 반응형 구현
1. 브레이크포인트 감지 로직
2. 반응형 CSS 규칙
3. 모바일/태블릿 최적화

### Phase 3: 상태 관리
1. Layout Store 구현
2. 툴바 토글 기능
3. 사이드바 관리

### Phase 4: 최적화 및 테스트
1. 성능 최적화
2. 접근성 개선
3. 단위 테스트 작성

## 결론

본 설계서는 MES UI 프레임워크의 메인 레이아웃 컴포넌트를 CSS Grid 기반으로 구현하기 위한 종합적인 가이드를 제공합니다. 반응형 디자인, 접근성, 성능 최적화를 모두 고려한 현대적이고 유지보수 가능한 레이아웃 시스템을 구축할 수 있을 것입니다.

## 참고 문서
- `design.md`: 전체 시스템 아키텍처
- `ui-requirements.md`: 상세 기능 요구사항
- `theme-guide.md`: 디자인 시스템 가이드라인