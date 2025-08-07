import { ref, computed, onMounted, onUnmounted, readonly, watch, getCurrentInstance } from 'vue'
import type { Ref, ComputedRef } from 'vue'

/**
 * 브레이크포인트 타입
 */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop'

/**
 * 브레이크포인트 설정 인터페이스
 */
export interface BreakpointConfig {
  mobile: number
  tablet: number
  desktop: number
}

/**
 * useBreakpoint 옵션
 */
export interface UseBreakpointOptions {
  /**
   * 커스텀 브레이크포인트 설정
   */
  breakpoints?: Partial<BreakpointConfig>
  
  /**
   * 디바운스 지연시간 (ms)
   */
  debounceMs?: number
  
  /**
   * 브레이크포인트 변경시 호출되는 콜백
   */
  onChange?: (newBreakpoint: Breakpoint, oldBreakpoint: Breakpoint) => void
}

/**
 * useBreakpoint 반환 타입
 */
export interface UseBreakpointReturn {
  /**
   * 현재 브레이크포인트 (읽기 전용)
   */
  breakpoint: Readonly<Ref<Breakpoint>>
  
  /**
   * 모바일 여부
   */
  isMobile: ComputedRef<boolean>
  
  /**
   * 태블릿 여부
   */
  isTablet: ComputedRef<boolean>
  
  /**
   * 데스크톱 여부
   */
  isDesktop: ComputedRef<boolean>
  
  /**
   * 현재 화면 너비
   */
  width: Readonly<Ref<number>>
  
  /**
   * 현재 화면 높이
   */
  height: Readonly<Ref<number>>
  
  /**
   * 수동 업데이트 함수
   */
  update: () => void
  
  /**
   * 정리 함수
   */
  cleanup: () => void
}

/**
 * 기본 브레이크포인트 설정
 */
const DEFAULT_BREAKPOINTS: BreakpointConfig = {
  mobile: 768,   // 768px 이하
  tablet: 1024,  // 769px ~ 1024px
  desktop: 1025  // 1025px 이상
}

/**
 * 디바운스 유틸리티 함수
 */
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * 반응형 브레이크포인트 감지 컴포저블
 * 
 * @param options - 설정 옵션
 * @returns 브레이크포인트 관련 반응형 상태와 유틸리티
 */
export function useBreakpoint(options: UseBreakpointOptions = {}): UseBreakpointReturn {
  const {
    breakpoints: customBreakpoints = {},
    debounceMs = 100,
    onChange
  } = options

  // 브레이크포인트 설정 병합
  const breakpoints: BreakpointConfig = {
    ...DEFAULT_BREAKPOINTS,
    ...customBreakpoints
  }

  // 반응형 상태
  const breakpoint = ref<Breakpoint>('desktop')
  const width = ref<number>(0)
  const height = ref<number>(0)

  // 계산된 속성들
  const isMobile = computed<boolean>(() => breakpoint.value === 'mobile')
  const isTablet = computed<boolean>(() => breakpoint.value === 'tablet')  
  const isDesktop = computed<boolean>(() => breakpoint.value === 'desktop')

  /**
   * 현재 화면 크기를 기반으로 브레이크포인트 계산
   */
  const calculateBreakpoint = (windowWidth: number): Breakpoint => {
    if (windowWidth <= breakpoints.mobile) {
      return 'mobile'
    } else if (windowWidth <= breakpoints.tablet) {
      return 'tablet'
    } else {
      return 'desktop'
    }
  }

  /**
   * 화면 크기 및 브레이크포인트 업데이트
   */
  const updateBreakpoint = (): void => {
    if (typeof window === 'undefined') {
      // SSR 환경에서는 기본값 사용
      width.value = 1920
      height.value = 1080
      breakpoint.value = 'desktop'
      return
    }

    const newWidth = window.innerWidth
    const newHeight = window.innerHeight
    const newBreakpoint = calculateBreakpoint(newWidth)
    const oldBreakpoint = breakpoint.value

    width.value = newWidth
    height.value = newHeight

    if (newBreakpoint !== oldBreakpoint) {
      breakpoint.value = newBreakpoint
      
      // 콜백 호출
      if (onChange) {
        try {
          onChange(newBreakpoint, oldBreakpoint)
        } catch (error) {
          console.warn('Error in breakpoint change callback:', error)
        }
      }
    }
  }

  /**
   * 디바운스된 업데이트 함수
   */
  const debouncedUpdate = debounce(updateBreakpoint, debounceMs)

  /**
   * 리사이즈 이벤트 핸들러
   */
  let resizeHandler: (() => void) | null = null

  /**
   * 이벤트 리스너 설정
   */
  const setupListeners = (): void => {
    if (typeof window === 'undefined') return

    resizeHandler = debouncedUpdate
    window.addEventListener('resize', resizeHandler, { passive: true })
  }

  /**
   * 이벤트 리스너 정리
   */
  const cleanupListeners = (): void => {
    if (typeof window === 'undefined' || !resizeHandler) return

    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }

  /**
   * 정리 함수
   */
  const cleanup = (): void => {
    cleanupListeners()
  }

  /**
   * 수동 업데이트 함수
   */
  const update = (): void => {
    updateBreakpoint()
  }

  // 브레이크포인트 변경 감지 (디버깅용)
  if (process.env.NODE_ENV === 'development') {
    watch(breakpoint, (newVal, oldVal) => {
      console.debug(`Breakpoint changed: ${oldVal} -> ${newVal}`)
    })
  }

  // Vue 컴포넌트 컨텍스트에서만 라이프사이클 훅 사용
  const instance = getCurrentInstance()
  if (instance) {
    onMounted(() => {
      updateBreakpoint()
      setupListeners()
    })

    onUnmounted(() => {
      cleanup()
    })
  } else {
    // 컴포넌트 외부에서 호출된 경우 즉시 초기화
    updateBreakpoint()
    setupListeners()
  }

  // 즉시 실행 (SSR 대응)
  if (!instance) {
    updateBreakpoint()
  }

  return {
    breakpoint: readonly(breakpoint),
    isMobile,
    isTablet,
    isDesktop,
    width: readonly(width),
    height: readonly(height),
    update,
    cleanup
  }
}

/**
 * 미디어 쿼리 기반 브레이크포인트 감지 (대안 구현)
 */
export function useMediaQuery(query: string): Ref<boolean> {
  const matches = ref<boolean>(false)
  let mediaQuery: MediaQueryList | null = null
  let listener: ((e: MediaQueryListEvent) => void) | null = null

  const updateMatches = (mq: MediaQueryList) => {
    matches.value = mq.matches
  }

  const setup = () => {
    if (typeof window === 'undefined') return

    try {
      mediaQuery = window.matchMedia(query)
      matches.value = mediaQuery.matches

      listener = (e: MediaQueryListEvent) => {
        matches.value = e.matches
      }

      // 현대 브라우저
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', listener)
      }
      // 구형 브라우저
      else if (mediaQuery.addListener) {
        mediaQuery.addListener(listener)
      }
    } catch (error) {
      console.warn('Failed to setup media query:', error)
    }
  }

  const cleanup = () => {
    if (!mediaQuery || !listener) return

    try {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', listener)
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(listener)
      }
    } catch (error) {
      console.warn('Failed to cleanup media query:', error)
    }

    mediaQuery = null
    listener = null
  }

  onMounted(setup)
  onUnmounted(cleanup)

  return matches
}

/**
 * 편의를 위한 사전 정의된 미디어 쿼리들
 */
export const useBreakpoints = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
  const isDesktop = useMediaQuery('(min-width: 1025px)')
  const isLargeDesktop = useMediaQuery('(min-width: 1920px)')
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop
  }
}

export default useBreakpoint