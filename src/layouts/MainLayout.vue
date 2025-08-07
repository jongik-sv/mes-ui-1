<template>
  <div 
    class="main-layout"
    :class="layoutClasses"
    role="application"
    :aria-label="$t?.('app.title') || 'MES UI Framework'"
  >
    <!-- 건너뛰기 링크 (접근성) -->
    <a 
      href="#main-content" 
      class="skip-link"
      @click="focusMainContent"
    >
      메인 콘텐츠로 건너뛰기
    </a>

    <!-- 헤더 영역 -->
    <header 
      class="layout-header" 
      role="banner"
      aria-label="주요 네비게이션"
    >
      <slot name="header">
        <!-- 기본 헤더 컨텐츠 -->
        <div class="header-placeholder">
          <div class="header-left">
            <button
              class="menu-toggle-btn"
              :class="{ 'active': sidebarOpen }"
              @click="toggleSidebar"
              :aria-label="sidebarOpen ? '메뉴 닫기' : '메뉴 열기'"
              :aria-expanded="sidebarOpen"
            >
              <span class="menu-icon">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
            <div class="company-logo">
              DONGKUK CM
            </div>
          </div>
          <div class="header-right">
            <div class="user-info">사용자 정보</div>
          </div>
        </div>
      </slot>
    </header>

    <!-- 툴바 영역 -->
    <aside 
      class="layout-toolbar" 
      role="navigation"
      :class="{ 
        'toolbar-hidden': !shouldShowToolbar,
        'toolbar-collapsed': toolbarCollapsed 
      }"
      aria-label="업무 메뉴"
      :aria-hidden="!shouldShowToolbar"
    >
      <slot name="toolbar">
        <!-- 기본 툴바 컨텐츠 -->
        <div class="toolbar-placeholder">
          <div class="toolbar-icon" v-for="i in 6" :key="i">
            <div class="icon-placeholder">{{ i }}</div>
          </div>
        </div>
      </slot>
    </aside>

    <!-- 모바일 사이드바 오버레이 -->
    <div
      v-if="isMobile && sidebarOpen"
      class="sidebar-overlay"
      @click="closeSidebar"
      aria-hidden="true"
    ></div>

    <!-- 모바일 사이드바 -->
    <aside
      v-if="isMobile"
      class="layout-sidebar"
      :class="{ 'sidebar-open': sidebarOpen }"
      role="navigation"
      aria-label="메인 메뉴"
      :aria-hidden="!sidebarOpen"
    >
      <slot name="sidebar">
        <!-- 기본 사이드바 컨텐츠 -->
        <div class="sidebar-placeholder">
          <div class="sidebar-header">
            <h2>메뉴</h2>
            <button
              class="sidebar-close-btn"
              @click="closeSidebar"
              aria-label="메뉴 닫기"
            >
              ✕
            </button>
          </div>
          <nav class="sidebar-nav">
            <div class="nav-item" v-for="i in 10" :key="i">
              메뉴 아이템 {{ i }}
            </div>
          </nav>
        </div>
      </slot>
    </aside>

    <!-- 메인 콘텐츠 영역 -->
    <main 
      id="main-content"
      class="layout-main" 
      role="main"
      tabindex="-1"
      ref="mainContentRef"
    >
      <slot name="main">
        <!-- 기본 메인 컨텐츠 -->
        <div class="main-placeholder">
          <h1>메인 콘텐츠 영역</h1>
          <p>여기에 탭 시스템과 페이지 콘텐츠가 들어갑니다.</p>
        </div>
      </slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/stores/layoutStore'
import { useBreakpoint } from '@/composables/useBreakpoint'

// ========== Stores ==========
const layoutStore = useLayoutStore()
const { 
  toolbarCollapsed, 
  sidebarOpen, 
  shouldShowToolbar, 
  layoutClasses,
  isMobile,
  isTablet, 
  isDesktop 
} = storeToRefs(layoutStore)

// ========== Composables ==========
const { breakpoint } = useBreakpoint({
  onChange: (newBreakpoint) => {
    layoutStore.setBreakpoint(newBreakpoint)
  }
})

// ========== Template Refs ==========
const mainContentRef = ref<HTMLElement>()

// ========== Methods ==========

/**
 * 사이드바 토글
 */
const toggleSidebar = () => {
  layoutStore.toggleSidebar()
}

/**
 * 사이드바 닫기
 */
const closeSidebar = () => {
  layoutStore.closeSidebar()
}

/**
 * 메인 콘텐츠로 포커스 이동
 */
const focusMainContent = () => {
  mainContentRef.value?.focus()
}

/**
 * 키보드 이벤트 핸들러
 */
const handleKeydown = (event: KeyboardEvent) => {
  // ESC: 사이드바 닫기
  if (event.key === 'Escape') {
    layoutStore.handleEscape()
    return
  }

  // Alt + T: 툴바 토글 (데스크톱/태블릿만)
  if (event.altKey && event.key === 't' && !isMobile.value) {
    event.preventDefault()
    layoutStore.toggleToolbar()
    return
  }
  
  // Alt + M: 메뉴 토글 (모바일만)  
  if (event.altKey && event.key === 'm' && isMobile.value) {
    event.preventDefault()
    toggleSidebar()
    return
  }
}

// ========== Lifecycle ==========

onMounted(() => {
  // 키보드 이벤트 리스너 등록
  document.addEventListener('keydown', handleKeydown)
  
  // 초기 브레이크포인트 설정
  layoutStore.setBreakpoint(breakpoint.value)
})

onUnmounted(() => {
  // 이벤트 리스너 정리
  document.removeEventListener('keydown', handleKeydown)
  
  // 스토어 정리
  layoutStore.cleanup()
})
</script>

<style lang="css" scoped>
/* ========== Layout Grid ========== */
.main-layout {
  display: grid;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: var(--bg-primary);
  
  /* 기본 데스크톱 레이아웃 */
  grid-template-areas: 
    "header header"
    "toolbar main";
  grid-template-columns: var(--toolbar-width) 1fr;
  grid-template-rows: var(--header-height) 1fr;
  
  /* CSS 변수 */
  --header-height: 60px;
  --toolbar-width: 80px;
  --sidebar-width: 280px;
  --transition-layout: 0.3s ease;
}

/* ========== Header ========== */
.layout-header {
  grid-area: header;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 0 var(--padding-lg);
}

.header-placeholder {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--gap-lg);
}

.menu-toggle-btn {
  display: none; /* 모바일에서만 표시 */
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 8px;
  border-radius: var(--radius-md);
  transition: background-color var(--transition-colors);
}

.menu-toggle-btn:hover {
  background: var(--hover-overlay);
}

.menu-icon {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-icon span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--text-primary);
  border-radius: 1px;
  transition: all var(--transition-layout);
}

.menu-toggle-btn.active .menu-icon span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.menu-toggle-btn.active .menu-icon span:nth-child(2) {
  opacity: 0;
}

.menu-toggle-btn.active .menu-icon span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

.company-logo {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--gap-md);
}

/* ========== Toolbar ========== */
.layout-toolbar {
  grid-area: toolbar;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-primary);
  z-index: 90;
  transition: width var(--transition-layout);
  overflow: hidden;
}

.toolbar-placeholder {
  display: flex;
  flex-direction: column;
  padding: var(--padding-md) var(--padding-sm);
  gap: var(--gap-sm);
}

.toolbar-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--surface-1);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-colors);
}

.toolbar-icon:hover {
  background: var(--surface-2);
  color: var(--text-primary);
  transform: rotate(90deg);
}

.icon-placeholder {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

/* ========== Sidebar (Mobile) ========== */
.layout-sidebar {
  position: fixed;
  top: var(--header-height);
  left: 0;
  width: var(--sidebar-width);
  height: calc(100vh - var(--header-height));
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-primary);
  z-index: 120;
  transform: translateX(-100%);
  transition: transform var(--transition-layout);
  overflow-y: auto;
}

.layout-sidebar.sidebar-open {
  transform: translateX(0);
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 110;
  backdrop-filter: blur(4px);
}

.sidebar-placeholder {
  padding: var(--padding-lg);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--margin-lg);
  padding-bottom: var(--padding-md);
  border-bottom: 1px solid var(--border-muted);
}

.sidebar-header h2 {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
}

.sidebar-close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--transition-colors);
}

.sidebar-close-btn:hover {
  background: var(--hover-overlay);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: var(--gap-xs);
}

.nav-item {
  padding: var(--padding-sm) var(--padding-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--transition-colors);
}

.nav-item:hover {
  background: var(--hover-overlay);
}

/* ========== Main Content ========== */
.layout-main {
  grid-area: main;
  background: var(--bg-primary);
  overflow: auto;
  position: relative;
}

.layout-main:focus {
  outline: none;
}

.main-placeholder {
  padding: var(--padding-xl);
}

.main-placeholder h1 {
  margin-bottom: var(--margin-lg);
  color: var(--text-primary);
}

.main-placeholder p {
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}

/* ========== Skip Link ========== */
.skip-link {
  position: absolute;
  top: -100px;
  left: var(--space-4);
  z-index: 1000;
  padding: var(--padding-sm) var(--padding-md);
  background: var(--primary);
  color: var(--text-inverse);
  text-decoration: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
  transition: top var(--transition-fast);
}

.skip-link:focus {
  top: var(--space-4);
}

/* ========== Layout States ========== */

/* 툴바 축소 상태 */
.layout-desktop.toolbar-collapsed,
.layout-tablet.toolbar-collapsed {
  grid-template-columns: 0 1fr;
}

.layout-desktop.toolbar-collapsed .layout-toolbar,
.layout-tablet.toolbar-collapsed .layout-toolbar {
  width: 0;
  min-width: 0;
}

/* ========== Responsive Breakpoints ========== */

/* 태블릿 (769px ~ 1024px) */
.layout-tablet {
  --toolbar-width: 60px;
}

.layout-tablet .toolbar-icon {
  width: 40px;
  height: 40px;
}

/* 모바일 (768px 이하) */
.layout-mobile {
  grid-template-areas: 
    "header"
    "main";
  grid-template-columns: 1fr;
  grid-template-rows: 56px 1fr;
  
  --header-height: 56px;
}

.layout-mobile .layout-toolbar {
  display: none;
}

.layout-mobile .menu-toggle-btn {
  display: flex;
}

.layout-mobile .layout-header {
  padding: 0 var(--padding-md);
}

/* ========== CSS Grid 지원 확인 ========== */
@supports not (display: grid) {
  .main-layout {
    display: flex;
    flex-direction: column;
  }
  
  .layout-header {
    flex: 0 0 auto;
  }
  
  .layout-main {
    flex: 1;
  }
  
  .layout-toolbar {
    display: none;
  }
}

/* ========== 애니메이션 최적화 ========== */
.main-layout,
.layout-toolbar,
.layout-sidebar {
  will-change: transform;
}

/* ========== 접근성 개선 ========== */
@media (prefers-reduced-motion: reduce) {
  .main-layout,
  .layout-toolbar,
  .layout-sidebar,
  .menu-icon span,
  .toolbar-icon {
    transition: none;
  }
}

/* ========== 고대비 모드 ========== */
@media (prefers-contrast: high) {
  .layout-header,
  .layout-toolbar,
  .layout-sidebar {
    border-width: 2px;
  }
  
  .toolbar-icon,
  .nav-item {
    border: 1px solid var(--border-primary);
  }
}

/* ========== 인쇄 스타일 ========== */
@media print {
  .layout-header,
  .layout-toolbar,
  .layout-sidebar,
  .sidebar-overlay,
  .skip-link {
    display: none !important;
  }
  
  .main-layout {
    grid-template-areas: "main";
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }
  
  .layout-main {
    overflow: visible;
  }
}
</style>