# Phase 3-2: 반응형 레이아웃 동작 구현 설계서

## 개요

본 문서는 MES UI 프레임워크의 반응형 레이아웃 동작 구현을 위한 상세 설계서입니다. 데스크톱, 태블릿, 모바일 화면별 레이아웃 변경 로직과 툴바 햄버거 메뉴 전환 기능, 메뉴 트리 오버레이/전체화면 모드를 구현합니다.

## 설계 목표

### 주요 목표
1. **다양한 화면 크기 지원**: 데스크톱, 태블릿, 모바일에서 최적화된 사용자 경험 제공
2. **일관된 네비게이션**: 화면 크기에 관계없이 직관적인 메뉴 접근성 보장
3. **성능 최적화**: 반응형 전환 시 부드러운 애니메이션과 빠른 응답성
4. **접근성 준수**: 모든 디바이스에서 키보드 네비게이션 및 스크린 리더 지원

### 기술적 목표
- CSS Grid와 Flexbox를 활용한 유연한 레이아웃 시스템
- Vue 3 Composition API를 통한 반응형 상태 관리
- PrimeVue 컴포넌트와의 완벽한 통합
- 터치 인터페이스 최적화

## 반응형 브레이크포인트 정의

### 브레이크포인트 체계
```typescript
interface BreakpointConfig {
  mobile: 0,      // 0px ~ 768px
  tablet: 769,    // 769px ~ 1024px
  desktop: 1025,  // 1025px ~ 1439px
  large: 1440     // 1440px 이상
}
```

### 화면별 레이아웃 동작
| 화면 크기 | 툴바 | 메뉴 트리 | 탭 바 | 헤더 |
|----------|------|-----------|-------|------|
| 모바일 (~768px) | 햄버거 메뉴 | 전체화면 오버레이 | 수평 스크롤 | 축소 |
| 태블릿 (769px~1024px) | 햄버거 메뉴 | 오버레이 | 수평 스크롤 | 표준 |
| 데스크톱 (1025px~) | 고정 표시 | 사이드바 | 수평 배치 | 표준 |

## 컴포넌트 설계

### 1. 반응형 레이아웃 관리자 (ResponsiveLayoutManager)

#### 인터페이스 정의
```typescript
interface ResponsiveLayoutManager {
  // 현재 브레이크포인트
  currentBreakpoint: Ref<'mobile' | 'tablet' | 'desktop' | 'large'>;
  
  // 화면 크기 정보
  screenSize: Ref<{
    width: number;
    height: number;
  }>;
  
  // 레이아웃 상태
  layoutState: Ref<{
    toolbarVisible: boolean;
    menuTreeMode: 'sidebar' | 'overlay' | 'fullscreen';
    headerCompact: boolean;
  }>;
  
  // 메서드
  updateLayout(): void;
  toggleMobileMenu(): void;
  closeMobileMenu(): void;
}
```

#### 구현 로직
```typescript
// composables/useResponsiveLayout.ts
import { ref, computed, onMounted, onUnmounted } from 'vue';

export function useResponsiveLayout() {
  const screenSize = ref({ width: 0, height: 0 });
  const mobileMenuOpen = ref(false);
  
  // 브레이크포인트 계산
  const currentBreakpoint = computed(() => {
    const width = screenSize.value.width;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    if (width <= 1439) return 'desktop';
    return 'large';
  });
  
  // 레이아웃 상태 계산
  const layoutState = computed(() => ({
    toolbarVisible: currentBreakpoint.value === 'desktop' || currentBreakpoint.value === 'large',
    menuTreeMode: currentBreakpoint.value === 'mobile' ? 'fullscreen' : 
                  currentBreakpoint.value === 'tablet' ? 'overlay' : 'sidebar',
    headerCompact: currentBreakpoint.value === 'mobile'
  }));
  
  // 화면 크기 업데이트
  const updateScreenSize = () => {
    screenSize.value = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  };
  
  // 모바일 메뉴 토글
  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
  };
  
  const closeMobileMenu = () => {
    mobileMenuOpen.value = false;
  };
  
  // 이벤트 리스너 등록
  onMounted(() => {
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
  });
  
  onUnmounted(() => {
    window.removeEventListener('resize', updateScreenSize);
  });
  
  return {
    screenSize: readonly(screenSize),
    currentBreakpoint,
    layoutState,
    mobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu
  };
}
```

### 2. 반응형 헤더 컴포넌트

#### 설계 요구사항
- 모바일에서 햄버거 메뉴 버튼 표시
- 화면 크기에 따른 요소 배치 조정
- 터치 친화적 버튼 크기 (최소 44px)

#### 컴포넌트 구조
```vue
<!-- components/layout/ResponsiveHeader.vue -->
<template>
  <header 
    class="mes-header"
    :class="{
      'header-compact': layoutState.headerCompact
    }"
  >
    <div class="header-left">
      <!-- 모바일/태블릿: 햄버거 메뉴 -->
      <Button
        v-if="!layoutState.toolbarVisible"
        icon="pi pi-bars"
        text
        rounded
        @click="toggleMobileMenu"
        class="hamburger-menu-btn"
        aria-label="메뉴 열기"
      />
      
      <!-- 데스크톱: 전체 메뉴 아이콘 -->
      <Button
        v-else
        icon="pi pi-th-large"
        text
        rounded
        @click="toggleGlobalMenu"
        class="global-menu-btn"
        aria-label="전체 메뉴"
      />
      
      <!-- 회사 로고 -->
      <div class="company-logo">
        <span class="logo-text">DONGKUK CM</span>
      </div>
    </div>
    
    <div class="header-right">
      <!-- 사용자 정보 (반응형 조정) -->
      <UserInfoMenu :compact="layoutState.headerCompact" />
      
      <!-- 연락처 (태블릿 이상에서만 표시) -->
      <ContactList v-if="currentBreakpoint !== 'mobile'" />
      
      <!-- 원격 지원 -->
      <RemoteSupport />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useResponsiveLayout } from '@/composables/useResponsiveLayout';

const { 
  currentBreakpoint, 
  layoutState, 
  toggleMobileMenu 
} = useResponsiveLayout();

// 전체 메뉴 토글 (데스크톱용)
const toggleGlobalMenu = () => {
  // 전체 메뉴 모달 표시 로직
};
</script>

<style lang="scss">
.mes-header {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-4);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--surface-2);
  transition: all var(--transition-normal);
  
  &.header-compact {
    height: 56px;
    padding: 0 var(--space-3);
    
    .logo-text {
      font-size: var(--text-sm);
    }
  }
}

.hamburger-menu-btn,
.global-menu-btn {
  min-width: 44px;
  min-height: 44px;
}

@media (max-width: 768px) {
  .mes-header {
    height: 56px;
    padding: 0 var(--space-3);
  }
}
</style>
```

### 3. 반응형 툴바 시스템

#### 설계 요구사항
- 데스크톱: 고정 사이드바로 표시
- 태블릿/모바일: 햄버거 메뉴로 변환
- 부드러운 전환 애니메이션

#### 컴포넌트 구조
```vue
<!-- components/layout/ResponsiveToolbar.vue -->
<template>
  <!-- 데스크톱: 고정 툴바 -->
  <aside
    v-if="layoutState.toolbarVisible"
    class="toolbar-sidebar"
    role="navigation"
    aria-label="주요 메뉴"
  >
    <div class="toolbar-icons">
      <ToolbarIcon
        v-for="icon in toolbarIcons"
        :key="icon.id"
        :icon="icon"
        :active="activeIcon === icon.id"
        @click="handleIconClick(icon)"
      />
    </div>
  </aside>
  
  <!-- 모바일/태블릿: 햄버거 메뉴 -->
  <Drawer
    v-else
    v-model:visible="mobileMenuOpen"
    position="left"
    class="mobile-toolbar-drawer"
    :modal="true"
    :dismissable-mask="true"
    @hide="closeMobileMenu"
  >
    <template #header>
      <h3>메뉴</h3>
    </template>
    
    <div class="mobile-toolbar-content">
      <!-- 툴바 아이콘들 (세로 배치) -->
      <div class="mobile-toolbar-icons">
        <ToolbarIcon
          v-for="icon in toolbarIcons"
          :key="icon.id"
          :icon="icon"
          :active="activeIcon === icon.id"
          :mobile="true"
          @click="handleMobileIconClick(icon)"
        />
      </div>
      
      <!-- 메뉴 트리 (선택된 카테고리) -->
      <div v-if="selectedCategory" class="mobile-menu-tree">
        <MenuTree
          :nodes="selectedCategoryMenus"
          :mode="layoutState.menuTreeMode"
          @menu-select="handleMenuSelect"
        />
      </div>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useResponsiveLayout } from '@/composables/useResponsiveLayout';
import { useToolbar } from '@/composables/useToolbar';

const { 
  layoutState, 
  mobileMenuOpen, 
  closeMobileMenu 
} = useResponsiveLayout();

const {
  toolbarIcons,
  activeIcon,
  selectedCategory,
  selectedCategoryMenus,
  handleIconClick
} = useToolbar();

// 모바일에서 아이콘 클릭 시 메뉴 트리 표시
const handleMobileIconClick = (icon: ToolbarIcon) => {
  handleIconClick(icon);
  // 모바일에서는 메뉴를 닫지 않고 트리를 표시
};

const handleMenuSelect = (menu: MenuItem) => {
  // 메뉴 선택 시 모바일 메뉴 닫기
  closeMobileMenu();
  // 탭 생성 로직
};
</script>

<style lang="scss">
.toolbar-sidebar {
  width: var(--toolbar-width);
  height: calc(100vh - var(--header-height));
  background: var(--bg-secondary);
  border-right: 1px solid var(--surface-2);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: var(--header-height);
  z-index: 100;
}

.toolbar-icons {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
}

.mobile-toolbar-drawer {
  .p-drawer-content {
    width: 280px;
  }
}

.mobile-toolbar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.mobile-toolbar-icons {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
  border-bottom: 1px solid var(--surface-2);
}

.mobile-menu-tree {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4);
}

@media (max-width: 768px) {
  .mobile-toolbar-drawer .p-drawer-content {
    width: 100vw;
  }
}
</style>
```

### 4. 반응형 메뉴 트리 시스템

#### 설계 요구사항
- 데스크톱: 사이드바 모드
- 태블릿: 오버레이 모드
- 모바일: 전체화면 모드

#### 컴포넌트 구조
```vue
<!-- components/layout/ResponsiveMenuTree.vue -->
<template>
  <!-- 데스크톱: 사이드바 메뉴 트리 -->
  <aside
    v-if="visible && mode === 'sidebar'"
    class="menu-tree-sidebar"
    :class="{ 'menu-tree-visible': menuTreeVisible }"
  >
    <MenuTreeContent
      :nodes="menuNodes"
      :search-query="searchQuery"
      @menu-select="handleMenuSelect"
    />
  </aside>
  
  <!-- 태블릿: 오버레이 메뉴 트리 -->
  <div
    v-else-if="visible && mode === 'overlay'"
    class="menu-tree-overlay"
    @click="closeMenuTree"
  >
    <div class="menu-tree-panel" @click.stop>
      <div class="menu-tree-header">
        <h3>메뉴</h3>
        <Button
          icon="pi pi-times"
          text
          rounded
          @click="closeMenuTree"
          aria-label="메뉴 닫기"
        />
      </div>
      <MenuTreeContent
        :nodes="menuNodes"
        :search-query="searchQuery"
        @menu-select="handleMenuSelect"
      />
    </div>
  </div>
  
  <!-- 모바일: 전체화면 메뉴 트리 (햄버거 메뉴 내부에 포함) -->
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useResponsiveLayout } from '@/composables/useResponsiveLayout';
import { useMenuTree } from '@/composables/useMenuTree';

interface Props {
  visible: boolean;
  mode: 'sidebar' | 'overlay' | 'fullscreen';
}

const props = defineProps<Props>();

const { layoutState } = useResponsiveLayout();
const {
  menuNodes,
  searchQuery,
  menuTreeVisible,
  closeMenuTree,
  handleMenuSelect
} = useMenuTree();
</script>

<style lang="scss">
.menu-tree-sidebar {
  width: var(--menu-tree-width);
  height: calc(100vh - var(--header-height));
  background: var(--bg-secondary);
  border-right: 1px solid var(--surface-2);
  position: fixed;
  left: var(--toolbar-width);
  top: var(--header-height);
  transform: translateX(-100%);
  transition: transform var(--transition-slow);
  z-index: 90;
  
  &.menu-tree-visible {
    transform: translateX(0);
  }
}

.menu-tree-overlay {
  position: fixed;
  top: var(--header-height);
  left: 0;
  width: 100vw;
  height: calc(100vh - var(--header-height));
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.menu-tree-panel {
  width: var(--menu-tree-width);
  height: 100%;
  background: var(--bg-secondary);
  border-right: 1px solid var(--surface-2);
  display: flex;
  flex-direction: column;
  animation: slideInLeft 0.3s ease;
}

.menu-tree-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  border-bottom: 1px solid var(--surface-2);
  
  h3 {
    margin: 0;
    font-size: var(--text-lg);
    color: var(--text-primary);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

@media (max-width: 768px) {
  .menu-tree-panel {
    width: 100vw;
  }
}
</style>
```

### 5. 반응형 탭 시스템

#### 설계 요구사항
- 모든 화면 크기에서 수평 스크롤 지원
- 모바일에서 스와이프 제스처 지원
- 탭 오버플로우 시 좌우 화살표 버튼

#### 컴포넌트 구조
```vue
<!-- components/layout/ResponsiveTabSystem.vue -->
<template>
  <div class="responsive-tab-system">
    <div class="tab-bar" ref="tabBarRef">
      <!-- 좌측 스크롤 버튼 -->
      <Button
        v-if="showScrollButtons && canScrollLeft"
        icon="pi pi-chevron-left"
        text
        rounded
        size="small"
        @click="scrollLeft"
        class="tab-scroll-btn tab-scroll-left"
        aria-label="이전 탭들 보기"
      />
      
      <!-- 탭 컨테이너 -->
      <div 
        class="tab-container"
        ref="tabContainerRef"
        @scroll="handleScroll"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <div class="tab-list" :style="{ transform: `translateX(${scrollOffset}px)` }">
          <div
            v-for="tab in tabs"
            :key="tab.id"
            class="tab-item"
            :class="{
              'tab-active': tab.id === activeTabId,
              'tab-closable': tab.closable
            }"
            @click="activateTab(tab.id)"
          >
            <span class="tab-title">{{ tab.title }}</span>
            <Button
              v-if="tab.closable"
              icon="pi pi-times"
              text
              rounded
              size="small"
              @click.stop="closeTab(tab.id)"
              class="tab-close-btn"
              aria-label="탭 닫기"
            />
          </div>
        </div>
      </div>
      
      <!-- 우측 스크롤 버튼 -->
      <Button
        v-if="showScrollButtons && canScrollRight"
        icon="pi pi-chevron-right"
        text
        rounded
        size="small"
        @click="scrollRight"
        class="tab-scroll-btn tab-scroll-right"
        aria-label="다음 탭들 보기"
      />
    </div>
    
    <!-- 탭 콘텐츠 -->
    <div class="tab-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useResponsiveLayout } from '@/composables/useResponsiveLayout';
import { useTabSystem } from '@/composables/useTabSystem';

const { currentBreakpoint } = useResponsiveLayout();
const {
  tabs,
  activeTabId,
  activateTab,
  closeTab
} = useTabSystem();

// 스크롤 관련 상태
const tabBarRef = ref<HTMLElement>();
const tabContainerRef = ref<HTMLElement>();
const scrollOffset = ref(0);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

// 터치 제스처 상태
const touchStartX = ref(0);
const touchCurrentX = ref(0);
const isSwiping = ref(false);

// 스크롤 버튼 표시 여부
const showScrollButtons = computed(() => 
  currentBreakpoint.value === 'desktop' || currentBreakpoint.value === 'large'
);

// 스크롤 처리
const handleScroll = () => {
  if (!tabContainerRef.value) return;
  
  const container = tabContainerRef.value;
  canScrollLeft.value = container.scrollLeft > 0;
  canScrollRight.value = 
    container.scrollLeft < container.scrollWidth - container.clientWidth;
};

const scrollLeft = () => {
  if (!tabContainerRef.value) return;
  tabContainerRef.value.scrollBy({ left: -200, behavior: 'smooth' });
};

const scrollRight = () => {
  if (!tabContainerRef.value) return;
  tabContainerRef.value.scrollBy({ left: 200, behavior: 'smooth' });
};

// 터치 제스처 처리 (모바일)
const handleTouchStart = (e: TouchEvent) => {
  if (currentBreakpoint.value !== 'mobile') return;
  
  touchStartX.value = e.touches[0].clientX;
  isSwiping.value = true;
};

const handleTouchMove = (e: TouchEvent) => {
  if (!isSwiping.value) return;
  
  touchCurrentX.value = e.touches[0].clientX;
  const deltaX = touchCurrentX.value - touchStartX.value;
  
  // 스와이프 거리가 충분하면 탭 전환
  if (Math.abs(deltaX) > 50) {
    if (deltaX > 0) {
      // 오른쪽 스와이프 - 이전 탭
      switchToPreviousTab();
    } else {
      // 왼쪽 스와이프 - 다음 탭
      switchToNextTab();
    }
    isSwiping.value = false;
  }
};

const handleTouchEnd = () => {
  isSwiping.value = false;
};

// 탭 전환 헬퍼
const switchToPreviousTab = () => {
  const currentIndex = tabs.value.findIndex(tab => tab.id === activeTabId.value);
  if (currentIndex > 0) {
    activateTab(tabs.value[currentIndex - 1].id);
  }
};

const switchToNextTab = () => {
  const currentIndex = tabs.value.findIndex(tab => tab.id === activeTabId.value);
  if (currentIndex < tabs.value.length - 1) {
    activateTab(tabs.value[currentIndex + 1].id);
  }
};

onMounted(() => {
  nextTick(() => {
    handleScroll();
  });
});
</script>

<style lang="scss">
.responsive-tab-system {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tab-bar {
  display: flex;
  align-items: center;
  height: var(--tab-height);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--surface-2);
  position: relative;
}

.tab-container {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.tab-list {
  display: flex;
  min-width: 100%;
  transition: transform var(--transition-normal);
}

.tab-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-right: 1px solid var(--surface-2);
  cursor: pointer;
  white-space: nowrap;
  min-width: max-content;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--bg-tertiary);
  }
  
  &.tab-active {
    background: var(--primary);
    color: white;
    border-bottom: 2px solid var(--primary-hover);
  }
}

.tab-title {
  font-size: var(--text-sm);
  font-weight: 500;
}

.tab-close-btn {
  width: 20px;
  height: 20px;
  min-width: 20px;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.2);
  }
}

.tab-scroll-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: var(--bg-secondary);
  border: 1px solid var(--surface-2);
  
  &.tab-scroll-left {
    left: 0;
  }
  
  &.tab-scroll-right {
    right: 0;
  }
}

.tab-content {
  flex: 1;
  overflow: hidden;
}

// 모바일 최적화
@media (max-width: 768px) {
  .tab-item {
    min-height: 44px;
    padding: var(--space-3) var(--space-4);
  }
  
  .tab-close-btn {
    width: 24px;
    height: 24px;
    min-width: 24px;
  }
}
</style>
```

## CSS 미디어 쿼리 시스템

### 기본 미디어 쿼리
```scss
// styles/responsive.scss

// 브레이크포인트 변수
$mobile-max: 768px;
$tablet-min: 769px;
$tablet-max: 1024px;
$desktop-min: 1025px;
$large-min: 1440px;

// 믹스인 정의
@mixin mobile {
  @media (max-width: $mobile-max) {
    @content;
  }
}

@mixin tablet {
  @media (min-width: $tablet-min) and (max-width: $tablet-max) {
    @content;
  }
}

@mixin tablet-up {
  @media (min-width: $tablet-min) {
    @content;
  }
}

@mixin desktop {
  @media (min-width: $desktop-min) {
    @content;
  }
}

@mixin large {
  @media (min-width: $large-min) {
    @content;
  }
}

// 터치 디바이스 감지
@mixin touch {
  @media (hover: none) and (pointer: coarse) {
    @content;
  }
}

// 호버 지원 디바이스
@mixin hover {
  @media (hover: hover) and (pointer: fine) {
    @content;
  }
}
```

### 레이아웃 CSS 변수
```scss
// styles/layout-variables.scss

:root {
  // 기본 레이아웃 크기
  --header-height: 60px;
  --toolbar-width: 70px;
  --menu-tree-width: 280px;
  --tab-height: 45px;
  
  // 반응형 조정
  @include mobile {
    --header-height: 56px;
    --toolbar-width: 0px;
    --menu-tree-width: 100vw;
    --tab-height: 48px;
  }
  
  @include tablet {
    --toolbar-width: 0px;
    --menu-tree-width: 320px;
  }
}
```

## 상태 관리 설계

### Pinia 스토어 구조
```typescript
// stores/responsive.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useResponsiveStore = defineStore('responsive', () => {
  // 상태
  const screenSize = ref({ width: 0, height: 0 });
  const mobileMenuOpen = ref(false);
  const menuTreeVisible = ref(false);
  const activeToolbarIcon = ref<string | null>(null);
  
  // 계산된 속성
  const currentBreakpoint = computed(() => {
    const width = screenSize.value.width;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    if (width <= 1439) return 'desktop';
    return 'large';
  });
  
  const isMobile = computed(() => currentBreakpoint.value === 'mobile');
  const isTablet = computed(() => currentBreakpoint.value === 'tablet');
  const isDesktop = computed(() => 
    currentBreakpoint.value === 'desktop' || currentBreakpoint.value === 'large'
  );
  
  const layoutConfig = computed(() => ({
    showToolbar: isDesktop.value,
    showHamburgerMenu: !isDesktop.value,
    menuTreeMode: isMobile.value ? 'fullscreen' : 
                  isTablet.value ? 'overlay' : 'sidebar',
    headerCompact: isMobile.value
  }));
  
  // 액션
  const updateScreenSize = (width: number, height: number) => {
    screenSize.value = { width, height };
  };
  
  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
  };
  
  const closeMobileMenu = () => {
    mobileMenuOpen.value = false;
  };
  
  const toggleMenuTree = (iconId?: string) => {
    if (iconId) {
      activeToolbarIcon.value = iconId;
    }
    menuTreeVisible.value = !menuTreeVisible.value;
  };
  
  const closeMenuTree = () => {
    menuTreeVisible.value = false;
  };
  
  return {
    // 상태
    screenSize,
    mobileMenuOpen,
    menuTreeVisible,
    activeToolbarIcon,
    
    // 계산된 속성
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    layoutConfig,
    
    // 액션
    updateScreenSize,
    toggleMobileMenu,
    closeMobileMenu,
    toggleMenuTree,
    closeMenuTree
  };
});
```

## 애니메이션 및 전환 효과

### CSS 애니메이션 정의
```scss
// styles/animations.scss

// 기본 전환 효과
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-normal);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 슬라이드 효과
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform var(--transition-slow);
}

.slide-left-enter-from {
  transform: translateX(-100%);
}

.slide-left-leave-to {
  transform: translateX(-100%);
}

// 모바일 메뉴 애니메이션
.mobile-menu-enter-active {
  transition: all var(--transition-slow);
}

.mobile-menu-leave-active {
  transition: all var(--transition-normal);
}

.mobile-menu-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.mobile-menu-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

// 오버레이 배경 애니메이션
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity var(--transition-normal);
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
```

## 접근성 고려사항

### 키보드 네비게이션
```typescript
// composables/useKeyboardNavigation.ts
import { onMounted, onUnmounted } from 'vue';

export function useKeyboardNavigation() {
  const handleKeyDown = (event: KeyboardEvent) => {
    // ESC 키로 모바일 메뉴 닫기
    if (event.key === 'Escape') {
      const responsiveStore = useResponsiveStore();
      responsiveStore.closeMobileMenu();
      responsiveStore.closeMenuTree();
    }
    
    // Tab 키 트래핑 (모달 내부)
    if (event.key === 'Tab') {
      // 포커스 트래핑 로직
    }
  };
  
  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown);
  });
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });
}
```

### ARIA 속성 및 시맨틱 HTML
```vue
<template>
  <!-- 메인 네비게이션 -->
  <nav role="navigation" aria-label="주요 메뉴">
    <button
      :aria-expanded="mobileMenuOpen"
      aria-controls="mobile-menu"
      aria-label="메뉴 열기"
    >
      메뉴
    </button>
  </nav>
  
  <!-- 모바일 메뉴 -->
  <div
    id="mobile-menu"
    role="dialog"
    aria-modal="true"
    aria-labelledby="mobile-menu-title"
    :aria-hidden="!mobileMenuOpen"
  >
    <h2 id="mobile-menu-title">메뉴</h2>
    <!-- 메뉴 내용 -->
  </div>
</template>
```

## 성능 최적화

### 지연 로딩 및 코드 스플리팅
```typescript
// 컴포넌트 지연 로딩
const ResponsiveMenuTree = defineAsyncComponent(() => 
  import('@/components/layout/ResponsiveMenuTree.vue')
);

// 조건부 로딩
const MobileToolbar = defineAsyncComponent({
  loader: () => import('@/components/layout/MobileToolbar.vue'),
  loadingComponent: LoadingSpinner,
  delay: 200
});
```

### 디바운싱 및 쓰로틀링
```typescript
// composables/useResponsiveLayout.ts
import { debounce } from 'lodash-es';

export function useResponsiveLayout() {
  // 리사이즈 이벤트 디바운싱
  const debouncedUpdateScreenSize = debounce(updateScreenSize, 150);
  
  onMounted(() => {
    window.addEventListener('resize', debouncedUpdateScreenSize);
  });
}
```

## 테스트 전략

### 단위 테스트
```typescript
// tests/components/ResponsiveHeader.test.ts
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import ResponsiveHeader from '@/components/layout/ResponsiveHeader.vue';

describe('ResponsiveHeader', () => {
  let wrapper: any;
  let pinia: any;
  
  beforeEach(() => {
    pinia = createPinia();
    wrapper = mount(ResponsiveHeader, {
      global: {
        plugins: [pinia]
      }
    });
  });
  
  it('모바일에서 햄버거 메뉴 버튼을 표시한다', async () => {
    // 화면 크기를 모바일로 설정
    const responsiveStore = useResponsiveStore();
    responsiveStore.updateScreenSize(375, 667);
    
    await wrapper.vm.$nextTick();
    
    expect(wrapper.find('.hamburger-menu-btn').exists()).toBe(true);
    expect(wrapper.find('.global-menu-btn').exists()).toBe(false);
  });
  
  it('데스크톱에서 전체 메뉴 버튼을 표시한다', async () => {
    const responsiveStore = useResponsiveStore();
    responsiveStore.updateScreenSize(1440, 900);
    
    await wrapper.vm.$nextTick();
    
    expect(wrapper.find('.global-menu-btn').exists()).toBe(true);
    expect(wrapper.find('.hamburger-menu-btn').exists()).toBe(false);
  });
});
```

### E2E 테스트
```typescript
// tests/e2e/responsive-layout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('반응형 레이아웃', () => {
  test('모바일에서 햄버거 메뉴가 동작한다', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // 햄버거 메뉴 버튼 클릭
    await page.click('.hamburger-menu-btn');
    
    // 모바일 메뉴가 표시되는지 확인
    await expect(page.locator('.mobile-toolbar-drawer')).toBeVisible();
    
    // 메뉴 항목 클릭
    await page.click('.mobile-toolbar-icons .toolbar-icon:first-child');
    
    // 메뉴 트리가 표시되는지 확인
    await expect(page.locator('.mobile-menu-tree')).toBeVisible();
  });
  
  test('태블릿에서 오버레이 메뉴가 동작한다', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // 햄버거 메뉴 버튼 클릭
    await page.click('.hamburger-menu-btn');
    
    // 오버레이 메뉴가 표시되는지 확인
    await expect(page.locator('.menu-tree-overlay')).toBeVisible();
  });
});
```

## 구현 체크리스트

### Phase 1: 기본 반응형 시스템
- [ ] 브레이크포인트 시스템 구축
- [ ] 반응형 레이아웃 컴포저블 구현
- [ ] Pinia 스토어 설정
- [ ] CSS 미디어 쿼리 시스템

### Phase 2: 헤더 반응형 구현
- [ ] 반응형 헤더 컴포넌트 구현
- [ ] 햄버거 메뉴 버튼 추가
- [ ] 모바일 최적화 스타일링
- [ ] 접근성 속성 추가

### Phase 3: 툴바 반응형 구현
- [ ] 데스크톱 고정 툴바 구현
- [ ] 모바일 햄버거 메뉴 구현
- [ ] 전환 애니메이션 추가
- [ ] 터치 인터페이스 최적화

### Phase 4: 메뉴 트리 반응형 구현
- [ ] 사이드바 모드 구현
- [ ] 오버레이 모드 구현
- [ ] 전체화면 모드 구현
- [ ] 모드 간 전환 로직

### Phase 5: 탭 시스템 반응형 구현
- [ ] 수평 스크롤 구현
- [ ] 스와이프 제스처 지원
- [ ] 오버플로우 처리
- [ ] 모바일 최적화

### Phase 6: 테스트 및 최적화
- [ ] 단위 테스트 작성
- [ ] E2E 테스트 작성
- [ ] 성능 최적화
- [ ] 접근성 검증

## 결론

본 설계서는 MES UI 프레임워크의 반응형 레이아웃 동작 구현을 위한 종합적인 가이드를 제공합니다. 다양한 화면 크기에서 최적화된 사용자 경험을 제공하면서도 일관된 네비게이션과 접근성을 보장하는 시스템을 구축할 수 있습니다.

각 컴포넌트의 반응형 동작과 상태 관리, 애니메이션 효과를 통해 현대적이고 사용자 친화적인 인터페이스를 완성할 수 있을 것입니다.