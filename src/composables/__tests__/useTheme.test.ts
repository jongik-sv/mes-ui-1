import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { useTheme, resetThemeInstance } from '../useTheme'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

// Mock matchMedia
const matchMediaMock = vi.fn()

describe('useTheme', () => {
  beforeEach(() => {
    // Reset theme instance
    resetThemeInstance()
    
    // Reset mocks
    vi.clearAllMocks()
    
    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    })
    
    // Setup matchMedia mock
    Object.defineProperty(window, 'matchMedia', {
      value: matchMediaMock,
      writable: true,
    })
    
    // Default matchMedia implementation
    matchMediaMock.mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    
    // Reset document attributes
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.className = ''
  })

  afterEach(() => {
    resetThemeInstance()
    vi.restoreAllMocks()
  })

  describe('초기화', () => {
    it('기본값으로 다크 테마를 설정해야 한다', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const { currentTheme, themeMode } = useTheme()
      
      expect(currentTheme.value).toBe('dark')
      expect(themeMode.value).toBe('dark')
    })

    it('localStorage에서 저장된 테마를 불러와야 한다', () => {
      localStorageMock.getItem.mockReturnValue('light')
      
      const { currentTheme, themeMode } = useTheme()
      
      expect(currentTheme.value).toBe('light')
      expect(themeMode.value).toBe('light')
      expect(localStorageMock.getItem).toHaveBeenCalledWith('mes-theme-mode')
    })

    it('auto 모드일 때 시스템 테마를 감지해야 한다', () => {
      localStorageMock.getItem.mockReturnValue('auto')
      matchMediaMock.mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)' ? true : false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
      
      const { currentTheme, themeMode, isSystemDark } = useTheme()
      
      expect(themeMode.value).toBe('auto')
      expect(isSystemDark.value).toBe(true)
      expect(currentTheme.value).toBe('dark')
    })
  })

  describe('테마 설정', () => {
    it('setTheme으로 테마를 변경할 수 있어야 한다', async () => {
      const { setTheme, currentTheme, themeMode } = useTheme()
      
      setTheme('light')
      await nextTick()
      
      expect(currentTheme.value).toBe('light')
      expect(themeMode.value).toBe('light')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('mes-theme-mode', 'light')
      expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    })

    it('toggleTheme으로 테마를 토글할 수 있어야 한다', async () => {
      const { toggleTheme, currentTheme } = useTheme()
      
      // 초기값이 dark이므로 light로 변경되어야 함
      toggleTheme()
      await nextTick()
      
      expect(currentTheme.value).toBe('light')
      
      // 다시 토글하면 dark로 변경되어야 함
      toggleTheme()
      await nextTick()
      
      expect(currentTheme.value).toBe('dark')
    })

    it('auto 모드에서는 시스템 테마에 따라 결정되어야 한다', async () => {
      const { setTheme, currentTheme } = useTheme()
      
      // 시스템이 라이트 모드인 경우
      matchMediaMock.mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)' ? false : true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
      
      setTheme('auto')
      await nextTick()
      
      expect(currentTheme.value).toBe('light')
    })
  })

  describe('computed 속성', () => {
    it('isDark가 올바르게 계산되어야 한다', () => {
      const { isDark, setTheme } = useTheme()
      
      setTheme('dark')
      expect(isDark.value).toBe(true)
      
      setTheme('light')
      expect(isDark.value).toBe(false)
    })

    it('isLight가 올바르게 계산되어야 한다', () => {
      const { isLight, setTheme } = useTheme()
      
      setTheme('light')
      expect(isLight.value).toBe(true)
      
      setTheme('dark')
      expect(isLight.value).toBe(false)
    })

    it('themeClasses가 올바른 클래스를 반환해야 한다', () => {
      const { themeClasses, setTheme } = useTheme()
      
      setTheme('dark')
      expect(themeClasses.value).toContain('theme-dark')
      expect(themeClasses.value).toContain('dark')
      
      setTheme('light')
      expect(themeClasses.value).toContain('theme-light')
      expect(themeClasses.value).toContain('light')
    })
  })

  describe('시스템 테마 변경 감지', () => {
    it('시스템 테마 변경 시 auto 모드에서 테마가 업데이트되어야 한다', async () => {
      let mediaQueryCallback: ((e: MediaQueryListEvent) => void) | null = null
      
      matchMediaMock.mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)' ? false : true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((event: string, callback: (e: MediaQueryListEvent) => void) => {
          if (event === 'change') {
            mediaQueryCallback = callback
          }
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
      
      const { setTheme, currentTheme } = useTheme()
      
      setTheme('auto')
      await nextTick()
      
      expect(currentTheme.value).toBe('light')
      
      // 시스템 테마가 다크로 변경됨을 시뮬레이션
      if (mediaQueryCallback) {
        mediaQueryCallback({ matches: true } as MediaQueryListEvent)
        await nextTick()
        
        expect(currentTheme.value).toBe('dark')
      }
    })
  })

  describe('DOM 업데이트', () => {
    it('테마 변경 시 document.documentElement에 data-theme 속성이 설정되어야 한다', async () => {
      const { setTheme, currentTheme } = useTheme()
      
      // 초기 테마 확인
      await nextTick()
      expect(document.documentElement.getAttribute('data-theme')).toBe(currentTheme.value)
      
      setTheme('light')
      await nextTick()
      
      expect(document.documentElement.getAttribute('data-theme')).toBe('light')
      
      setTheme('dark')
      await nextTick()
      
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    })
  })

  describe('에러 처리', () => {
    it('localStorage 접근 실패 시에도 정상 동작해야 한다', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage not available')
      })
      
      const { currentTheme } = useTheme()
      expect(currentTheme.value).toBe('dark') // 기본값으로 폴백
    })

    it('잘못된 테마 값이 저장되어 있을 때 기본값으로 폴백해야 한다', () => {
      localStorageMock.getItem.mockReturnValue('invalid-theme')
      
      const { currentTheme } = useTheme()
      
      expect(currentTheme.value).toBe('dark') // 기본값으로 폴백
    })
  })
})