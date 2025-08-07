import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

/**
 * 브레이크포인트 타입 정의
 */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop'

/**
 * 레이아웃 상태 관리 스토어
 * 툴바, 사이드바, 브레이크포인트 등 레이아웃 관련 상태를 관리
 */
export const useLayoutStore = defineStore('layout', () => {
  // ========== State ==========
  
  /**
   * 툴바 축소 상태
   */
  const toolbarCollapsed = ref<boolean>(false)
  
  /**
   * 사이드바 열림 상태 (모바일)
   */
  const sidebarOpen = ref<boolean>(false)
  
  /**
   * 현재 브레이크포인트
   */
  const breakpoint = ref<Breakpoint>('desktop')

  // ========== Getters ==========
  
  /**
   * 툴바 표시 여부 계산
   * 모바일에서는 항상 숨김, 그 외에는 collapsed 상태에 따름
   */
  const shouldShowToolbar = computed<boolean>(() => 
    breakpoint.value !== 'mobile' && !toolbarCollapsed.value
  )
  
  /**
   * 레이아웃 관련 CSS 클래스들
   */
  const layoutClasses = computed(() => ({
    'layout-mobile': breakpoint.value === 'mobile',
    'layout-tablet': breakpoint.value === 'tablet', 
    'layout-desktop': breakpoint.value === 'desktop',
    'toolbar-collapsed': toolbarCollapsed.value,
    'sidebar-open': sidebarOpen.value
  }))

  /**
   * 현재 브레이크포인트의 모바일 여부
   */
  const isMobile = computed<boolean>(() => breakpoint.value === 'mobile')

  /**
   * 현재 브레이크포인트의 태블릿 여부
   */
  const isTablet = computed<boolean>(() => breakpoint.value === 'tablet')

  /**
   * 현재 브레이크포인트의 데스크톱 여부
   */
  const isDesktop = computed<boolean>(() => breakpoint.value === 'desktop')

  // ========== Actions ==========
  
  /**
   * 툴바 토글
   */
  const toggleToolbar = (): void => {
    toolbarCollapsed.value = !toolbarCollapsed.value
    saveState()
  }
  
  /**
   * 사이드바 토글
   */
  const toggleSidebar = (): void => {
    sidebarOpen.value = !sidebarOpen.value
    
    // 모바일에서 사이드바를 열면 body 스크롤 잠금
    if (typeof document !== 'undefined') {
      if (sidebarOpen.value && isMobile.value) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  }
  
  /**
   * 브레이크포인트 설정
   * @param bp - 설정할 브레이크포인트
   */
  const setBreakpoint = (bp: Breakpoint): void => {
    if (!['mobile', 'tablet', 'desktop'].includes(bp)) {
      console.warn(`Invalid breakpoint: ${bp}`)
      return
    }

    const previousBreakpoint = breakpoint.value
    breakpoint.value = bp
    
    // 모바일에서는 툴바 자동 숨김
    if (bp === 'mobile') {
      toolbarCollapsed.value = true
      // 사이드바가 열려있으면 닫기
      if (sidebarOpen.value) {
        toggleSidebar()
      }
    }

    // 데스크톱으로 변경시 사이드바 자동 닫기
    if (bp === 'desktop' && sidebarOpen.value) {
      toggleSidebar()
    }

    // 브레이크포인트 변경 이벤트 발생
    emitBreakpointChange(previousBreakpoint, bp)
  }

  /**
   * 사이드바 강제 닫기
   */
  const closeSidebar = (): void => {
    if (sidebarOpen.value) {
      sidebarOpen.value = false
      
      if (typeof document !== 'undefined') {
        document.body.style.overflow = ''
      }
    }
  }

  /**
   * ESC 키 핸들러
   */
  const handleEscape = (): void => {
    if (sidebarOpen.value) {
      closeSidebar()
    }
  }

  // ========== Persistence (영속화) ==========

  /**
   * localStorage 키들
   */
  const STORAGE_KEYS = {
    toolbarCollapsed: 'mes-layout-toolbar-collapsed',
    breakpoint: 'mes-layout-breakpoint'
  } as const

  /**
   * 상태를 localStorage에 저장
   */
  const saveState = (): void => {
    if (typeof localStorage === 'undefined') return

    try {
      localStorage.setItem(
        STORAGE_KEYS.toolbarCollapsed, 
        JSON.stringify(toolbarCollapsed.value)
      )
      localStorage.setItem(
        STORAGE_KEYS.breakpoint,
        breakpoint.value
      )
    } catch (error) {
      console.warn('Failed to save layout state to localStorage:', error)
    }
  }

  /**
   * localStorage에서 상태 복원
   */
  const loadState = (): void => {
    if (typeof localStorage === 'undefined') return

    try {
      // 툴바 상태 복원
      const savedToolbarState = localStorage.getItem(STORAGE_KEYS.toolbarCollapsed)
      if (savedToolbarState !== null) {
        const parsed = JSON.parse(savedToolbarState)
        if (typeof parsed === 'boolean') {
          toolbarCollapsed.value = parsed
        }
      }

      // 브레이크포인트는 실제 화면 크기로 결정되므로 복원하지 않음
    } catch (error) {
      console.warn('Failed to load layout state from localStorage:', error)
    }
  }

  // ========== Events ==========

  /**
   * 브레이크포인트 변경 이벤트 발생
   */
  const emitBreakpointChange = (from: Breakpoint, to: Breakpoint): void => {
    if (typeof window === 'undefined') return

    try {
      const event = new CustomEvent('layout-breakpoint-change', {
        detail: { from, to }
      })
      window.dispatchEvent(event)
    } catch (error) {
      console.warn('Failed to emit breakpoint change event:', error)
    }
  }

  // ========== Watchers ==========

  // 툴바 상태 변경시 저장
  watch(toolbarCollapsed, () => {
    saveState()
  })

  // ========== Initialization ==========

  /**
   * 스토어 초기화
   */
  const initialize = (): void => {
    loadState()
    
    // ESC 키 이벤트 리스너 등록
    if (typeof document !== 'undefined') {
      const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          handleEscape()
        }
        
        // Alt + T: 툴바 토글 (데스크톱/태블릿만)
        if (event.altKey && event.key === 't' && !isMobile.value) {
          event.preventDefault()
          toggleToolbar()
        }
        
        // Alt + M: 메뉴 토글 (모바일만)
        if (event.altKey && event.key === 'm' && isMobile.value) {
          event.preventDefault()
          toggleSidebar()
        }
      }
      
      document.addEventListener('keydown', handleKeydown)
      
      // 정리 함수를 위한 이벤트 리스너 저장
      ;(initialize as any)._cleanup = () => {
        document.removeEventListener('keydown', handleKeydown)
      }
    }
  }

  /**
   * 스토어 정리
   */
  const cleanup = (): void => {
    if (typeof (initialize as any)._cleanup === 'function') {
      ;(initialize as any)._cleanup()
    }
    
    // body 스타일 복원
    if (typeof document !== 'undefined') {
      document.body.style.overflow = ''
    }
  }

  // 초기화 실행
  initialize()

  // ========== Return ==========
  
  return {
    // State
    toolbarCollapsed,
    sidebarOpen,
    breakpoint,
    
    // Getters
    shouldShowToolbar,
    layoutClasses,
    isMobile,
    isTablet,
    isDesktop,
    
    // Actions
    toggleToolbar,
    toggleSidebar,
    setBreakpoint,
    closeSidebar,
    handleEscape,
    
    // Persistence
    saveState,
    loadState,
    
    // Cleanup
    cleanup
  }
})

/**
 * 레이아웃 스토어 타입 추론
 */
export type LayoutStore = ReturnType<typeof useLayoutStore>