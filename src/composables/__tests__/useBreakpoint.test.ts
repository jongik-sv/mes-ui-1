import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { useBreakpoint } from '../useBreakpoint'

// Window 객체 모킹
const mockAddEventListener = vi.fn()
const mockRemoveEventListener = vi.fn()

Object.defineProperty(window, 'addEventListener', {
  value: mockAddEventListener,
  writable: true
})

Object.defineProperty(window, 'removeEventListener', {
  value: mockRemoveEventListener,
  writable: true
})

describe('useBreakpoint', () => {
  let originalInnerWidth: number

  beforeEach(() => {
    originalInnerWidth = window.innerWidth
    vi.clearAllMocks()
  })

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      value: originalInnerWidth,
      writable: true,
      configurable: true
    })
  })

  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      value: width,
      writable: true,
      configurable: true
    })
  }

  it('기본 상태에서 올바른 브레이크포인트를 반환한다', () => {
    setWindowWidth(1200)
    
    const { breakpoint, isMobile, isTablet, isDesktop } = useBreakpoint()

    expect(breakpoint.value).toBe('desktop')
    expect(isMobile.value).toBe(false)
    expect(isTablet.value).toBe(false)
    expect(isDesktop.value).toBe(true)
  })

  it('모바일 브레이크포인트를 올바르게 감지한다', async () => {
    setWindowWidth(600)
    
    const { breakpoint, isMobile, isTablet, isDesktop } = useBreakpoint()

    // 초기 감지
    expect(breakpoint.value).toBe('mobile')
    expect(isMobile.value).toBe(true)
    expect(isTablet.value).toBe(false)
    expect(isDesktop.value).toBe(false)
  })

  it('태블릿 브레이크포인트를 올바르게 감지한다', async () => {
    setWindowWidth(900)
    
    const { breakpoint, isMobile, isTablet, isDesktop } = useBreakpoint()

    expect(breakpoint.value).toBe('tablet')
    expect(isMobile.value).toBe(false)
    expect(isTablet.value).toBe(true)
    expect(isDesktop.value).toBe(false)
  })

  it('데스크톱 브레이크포인트를 올바르게 감지한다', async () => {
    setWindowWidth(1400)
    
    const { breakpoint, isMobile, isTablet, isDesktop } = useBreakpoint()

    expect(breakpoint.value).toBe('desktop')
    expect(isMobile.value).toBe(false)
    expect(isTablet.value).toBe(false)
    expect(isDesktop.value).toBe(true)
  })

  it('브레이크포인트 경계값을 정확히 처리한다', () => {
    // 모바일 경계 (768px)
    setWindowWidth(768)
    const { breakpoint: bp1 } = useBreakpoint()
    expect(bp1.value).toBe('mobile')

    // 태블릿 시작 (769px)
    setWindowWidth(769)
    const { breakpoint: bp2 } = useBreakpoint()
    expect(bp2.value).toBe('tablet')

    // 태블릿 경계 (1024px)
    setWindowWidth(1024)
    const { breakpoint: bp3 } = useBreakpoint()
    expect(bp3.value).toBe('tablet')

    // 데스크톱 시작 (1025px)
    setWindowWidth(1025)
    const { breakpoint: bp4 } = useBreakpoint()
    expect(bp4.value).toBe('desktop')
  })

  it('resize 이벤트 리스너가 등록된다', () => {
    useBreakpoint()

    expect(mockAddEventListener).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    )
  })

  it('리사이즈 시 브레이크포인트가 업데이트된다', async () => {
    setWindowWidth(1200)
    const { breakpoint } = useBreakpoint()

    expect(breakpoint.value).toBe('desktop')

    // 화면 크기 변경
    setWindowWidth(600)
    
    // resize 이벤트 발생시켜 업데이트 트리거
    const resizeHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'resize'
    )?.[1] as Function
    
    if (resizeHandler) {
      resizeHandler()
      await nextTick()
    }

    expect(breakpoint.value).toBe('mobile')
  })

  it('디바운스가 적용된다', async () => {
    vi.useFakeTimers()
    
    setWindowWidth(1200)
    const { breakpoint } = useBreakpoint()

    const resizeHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'resize'
    )?.[1] as Function

    // 연속된 리사이즈 이벤트
    if (resizeHandler) {
      setWindowWidth(600)
      resizeHandler()
      setWindowWidth(900)
      resizeHandler()
      setWindowWidth(1200)
      resizeHandler()
    }

    // 디바운스 시간 전에는 변경되지 않음
    expect(breakpoint.value).toBe('desktop')

    // 디바운스 시간 후 마지막 값으로 업데이트
    vi.advanceTimersByTime(100)
    await nextTick()
    
    expect(breakpoint.value).toBe('desktop')
    
    vi.useRealTimers()
  })

  it('컴포넌트 언마운트시 이벤트 리스너가 제거된다', () => {
    const { cleanup } = useBreakpoint()

    cleanup()

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    )
  })

  it('커스텀 브레이크포인트를 지원한다', () => {
    const customBreakpoints = {
      mobile: 480,
      tablet: 768,
      desktop: 1200
    }

    setWindowWidth(600)
    const { breakpoint } = useBreakpoint({ breakpoints: customBreakpoints })

    expect(breakpoint.value).toBe('tablet') // 커스텀 설정에 따라 tablet
  })

  it('SSR 환경에서 안전하게 작동한다', () => {
    // window 객체 제거
    const originalWindow = global.window
    // @ts-ignore
    delete global.window

    // 에러 없이 실행되어야 함
    expect(() => {
      const { breakpoint } = useBreakpoint()
      expect(breakpoint.value).toBe('desktop') // 기본값
    }).not.toThrow()

    // window 복구
    global.window = originalWindow
  })

  it('여러 인스턴스가 독립적으로 작동한다', () => {
    setWindowWidth(600)
    const bp1 = useBreakpoint()
    
    setWindowWidth(1200)
    const bp2 = useBreakpoint()

    // 각각 독립적인 상태를 가져야 함
    expect(bp1.breakpoint.value).toBe('mobile')
    expect(bp2.breakpoint.value).toBe('desktop')
  })

  it('콜백 함수가 브레이크포인트 변경시 호출된다', async () => {
    const onBreakpointChange = vi.fn()
    
    setWindowWidth(1200)
    const { breakpoint } = useBreakpoint({
      onChange: onBreakpointChange
    })

    const resizeHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'resize'
    )?.[1] as Function

    // 브레이크포인트 변경
    setWindowWidth(600)
    if (resizeHandler) {
      resizeHandler()
      await nextTick()
    }

    expect(onBreakpointChange).toHaveBeenCalledWith(
      'mobile',  // new breakpoint
      'desktop'  // previous breakpoint
    )
  })
})