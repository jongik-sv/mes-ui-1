import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useLayoutStore } from '../layoutStore'

describe('useLayoutStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('기본 상태가 올바르게 초기화된다', () => {
    const store = useLayoutStore()

    expect(store.toolbarCollapsed).toBe(false)
    expect(store.sidebarOpen).toBe(false)
    expect(store.breakpoint).toBe('desktop')
  })

  describe('getters', () => {
    it('shouldShowToolbar가 올바르게 계산된다', () => {
      const store = useLayoutStore()

      // 데스크톱에서 툴바 표시
      store.setBreakpoint('desktop')
      store.toolbarCollapsed = false
      expect(store.shouldShowToolbar).toBe(true)

      // 데스크톱에서 툴바 숨김
      store.toolbarCollapsed = true
      expect(store.shouldShowToolbar).toBe(false)

      // 모바일에서는 항상 숨김
      store.setBreakpoint('mobile')
      store.toolbarCollapsed = false
      expect(store.shouldShowToolbar).toBe(false)
    })

    it('layoutClasses가 올바르게 계산된다', () => {
      const store = useLayoutStore()

      // 기본 상태
      expect(store.layoutClasses).toEqual({
        'layout-mobile': false,
        'layout-tablet': false,
        'layout-desktop': true,
        'toolbar-collapsed': false,
        'sidebar-open': false
      })

      // 모바일 상태
      store.setBreakpoint('mobile')
      expect(store.layoutClasses['layout-mobile']).toBe(true)
      expect(store.layoutClasses['layout-desktop']).toBe(false)

      // 툴바 축소 상태
      store.toggleToolbar()
      expect(store.layoutClasses['toolbar-collapsed']).toBe(true)

      // 사이드바 열림 상태
      store.toggleSidebar()
      expect(store.layoutClasses['sidebar-open']).toBe(true)
    })
  })

  describe('actions', () => {
    it('toggleToolbar가 정상 동작한다', () => {
      const store = useLayoutStore()

      expect(store.toolbarCollapsed).toBe(false)

      store.toggleToolbar()
      expect(store.toolbarCollapsed).toBe(true)

      store.toggleToolbar()
      expect(store.toolbarCollapsed).toBe(false)
    })

    it('toggleSidebar가 정상 동작한다', () => {
      const store = useLayoutStore()

      expect(store.sidebarOpen).toBe(false)

      store.toggleSidebar()
      expect(store.sidebarOpen).toBe(true)

      store.toggleSidebar()
      expect(store.sidebarOpen).toBe(false)
    })

    it('setBreakpoint가 정상 동작한다', () => {
      const store = useLayoutStore()

      // 태블릿으로 변경
      store.setBreakpoint('tablet')
      expect(store.breakpoint).toBe('tablet')

      // 모바일로 변경
      store.setBreakpoint('mobile')
      expect(store.breakpoint).toBe('mobile')
      expect(store.toolbarCollapsed).toBe(true) // 모바일에서 자동 숨김

      // 데스크톱으로 변경
      store.setBreakpoint('desktop')
      expect(store.breakpoint).toBe('desktop')
    })

    it('모바일 브레이크포인트에서 툴바가 자동으로 숨겨진다', () => {
      const store = useLayoutStore()

      // 데스크톱에서 툴바 표시
      store.setBreakpoint('desktop')
      store.toolbarCollapsed = false

      // 모바일로 변경하면 툴바 자동 숨김
      store.setBreakpoint('mobile')
      expect(store.toolbarCollapsed).toBe(true)
    })

    it('잘못된 브레이크포인트를 무시한다', () => {
      const store = useLayoutStore()
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      // @ts-ignore - 의도적으로 잘못된 타입 전달
      store.setBreakpoint('invalid' as any)

      expect(store.breakpoint).toBe('desktop') // 변경되지 않아야 함
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('반응형 동작', () => {
    it('브레이크포인트별 툴바 상태가 올바르게 관리된다', () => {
      const store = useLayoutStore()

      // 데스크톱: 툴바 표시 가능
      store.setBreakpoint('desktop')
      store.toolbarCollapsed = false
      expect(store.shouldShowToolbar).toBe(true)

      // 태블릿: 툴바 표시 가능
      store.setBreakpoint('tablet')
      store.toolbarCollapsed = false
      expect(store.shouldShowToolbar).toBe(true)

      // 모바일: 툴바 항상 숨김
      store.setBreakpoint('mobile')
      expect(store.shouldShowToolbar).toBe(false)
    })

    it('화면 크기별 레이아웃 클래스가 배타적으로 적용된다', () => {
      const store = useLayoutStore()

      // 하나의 브레이크포인트만 active
      store.setBreakpoint('tablet')
      const classes = store.layoutClasses

      let activeBreakpoints = 0
      if (classes['layout-mobile']) activeBreakpoints++
      if (classes['layout-tablet']) activeBreakpoints++  
      if (classes['layout-desktop']) activeBreakpoints++

      expect(activeBreakpoints).toBe(1)
      expect(classes['layout-tablet']).toBe(true)
    })
  })

  describe('상태 영속성', () => {
    it('툴바 상태가 로컬스토리지에 저장된다', () => {
      const mockSetItem = vi.fn()
      const mockGetItem = vi.fn()
      
      Object.defineProperty(window, 'localStorage', {
        value: {
          setItem: mockSetItem,
          getItem: mockGetItem,
          removeItem: vi.fn(),
          clear: vi.fn(),
        },
        writable: true,
      })

      const store = useLayoutStore()
      
      store.toggleToolbar()
      
      expect(mockSetItem).toHaveBeenCalledWith('mes-layout-toolbar-collapsed', 'true')
    })

    it('로컬스토리지에서 툴바 상태를 복원한다', () => {
      const mockGetItem = vi.fn().mockReturnValue('true')
      
      Object.defineProperty(window, 'localStorage', {
        value: {
          setItem: vi.fn(),
          getItem: mockGetItem,
          removeItem: vi.fn(),
          clear: vi.fn(),
        },
        writable: true,
      })

      const store = useLayoutStore()
      store.loadState()
      
      expect(store.toolbarCollapsed).toBe(true)
      expect(mockGetItem).toHaveBeenCalledWith('mes-layout-toolbar-collapsed')
    })

    it('잘못된 로컬스토리지 값을 무시한다', () => {
      const mockGetItem = vi.fn().mockReturnValue('invalid')
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      Object.defineProperty(window, 'localStorage', {
        value: {
          setItem: vi.fn(),
          getItem: mockGetItem,
          removeItem: vi.fn(),
          clear: vi.fn(),
        },
        writable: true,
      })

      const store = useLayoutStore()
      store.loadState()
      
      expect(store.toolbarCollapsed).toBe(false) // 기본값 유지
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })
})