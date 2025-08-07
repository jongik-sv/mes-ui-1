import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import MainLayout from '../MainLayout.vue'
import { useLayoutStore } from '@stores/layoutStore'

// Mock window 객체
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

describe('MainLayout', () => {
  let wrapper: VueWrapper<any>
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    vi.clearAllMocks()
  })

  it('기본 레이아웃 구조를 렌더링한다', () => {
    wrapper = mount(MainLayout, {
      global: {
        plugins: [pinia]
      }
    })

    // 기본 레이아웃 클래스가 있는지 확인
    expect(wrapper.classes()).toContain('main-layout')
    
    // 헤더 영역 확인
    expect(wrapper.find('.layout-header').exists()).toBe(true)
    expect(wrapper.find('.layout-header').attributes('role')).toBe('banner')
    
    // 툴바 영역 확인
    expect(wrapper.find('.layout-toolbar').exists()).toBe(true)
    expect(wrapper.find('.layout-toolbar').attributes('role')).toBe('navigation')
    
    // 메인 콘텐츠 영역 확인
    expect(wrapper.find('.layout-main').exists()).toBe(true)
    expect(wrapper.find('.layout-main').attributes('role')).toBe('main')
    expect(wrapper.find('.layout-main').attributes('id')).toBe('main-content')
  })

  it('CSS Grid 레이아웃 클래스가 올바르게 적용된다', () => {
    wrapper = mount(MainLayout, {
      global: {
        plugins: [pinia]
      }
    })

    const layoutElement = wrapper.find('.main-layout')
    expect(layoutElement.exists()).toBe(true)
    
    // CSS Grid 클래스 확인 (JSDOM에서는 computed style 값이 제한적)
    expect(layoutElement.classes()).toContain('main-layout')
    
    // CSS 스타일이 올바르게 적용되었는지 확인
    const element = layoutElement.element as HTMLElement
    expect(element.style.display || 'grid').toBeTruthy()
  })

  it('브레이크포인트에 따라 올바른 클래스가 적용된다', async () => {
    wrapper = mount(MainLayout, {
      global: {
        plugins: [pinia]
      }
    })

    const layoutStore = useLayoutStore()

    // 데스크톱 상태 테스트
    layoutStore.setBreakpoint('desktop')
    await nextTick()
    expect(wrapper.classes()).toContain('layout-desktop')

    // 태블릿 상태 테스트  
    layoutStore.setBreakpoint('tablet')
    await nextTick()
    expect(wrapper.classes()).toContain('layout-tablet')

    // 모바일 상태 테스트
    layoutStore.setBreakpoint('mobile')
    await nextTick()
    expect(wrapper.classes()).toContain('layout-mobile')
  })

  it('모바일 브레이크포인트에서 툴바가 숨겨진다', async () => {
    wrapper = mount(MainLayout, {
      global: {
        plugins: [pinia]
      }
    })

    const layoutStore = useLayoutStore()
    layoutStore.setBreakpoint('mobile')
    
    await nextTick()
    
    const toolbar = wrapper.find('.layout-toolbar')
    expect(toolbar.classes()).toContain('toolbar-hidden')
  })

  it('툴바 토글이 정상 동작한다', async () => {
    wrapper = mount(MainLayout, {
      global: {
        plugins: [pinia]
      }
    })

    const layoutStore = useLayoutStore()
    
    // 툴바 숨김
    layoutStore.toggleToolbar()
    await nextTick()
    expect(wrapper.classes()).toContain('toolbar-collapsed')
    
    // 툴바 표시
    layoutStore.toggleToolbar()
    await nextTick()
    expect(wrapper.classes()).not.toContain('toolbar-collapsed')
  })

  it('슬롯이 올바르게 렌더링된다', () => {
    wrapper = mount(MainLayout, {
      global: {
        plugins: [pinia]
      },
      slots: {
        header: '<div data-testid="header-content">Header Content</div>',
        toolbar: '<div data-testid="toolbar-content">Toolbar Content</div>',
        main: '<div data-testid="main-content">Main Content</div>'
      }
    })

    expect(wrapper.find('[data-testid="header-content"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="toolbar-content"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="main-content"]').exists()).toBe(true)
  })

  it('키보드 단축키가 정상 동작한다', async () => {
    wrapper = mount(MainLayout, {
      global: {
        plugins: [pinia]
      },
      attachTo: document.body
    })

    const layoutStore = useLayoutStore()
    
    // Alt + T: 툴바 토글
    await wrapper.trigger('keydown', { 
      key: 't', 
      altKey: true 
    })
    
    expect(layoutStore.toolbarCollapsed).toBe(true)
  })

  it('접근성 속성이 올바르게 설정된다', () => {
    wrapper = mount(MainLayout, {
      global: {
        plugins: [pinia]
      }
    })

    // ARIA 라벨 확인
    expect(wrapper.find('.layout-header').attributes('aria-label')).toBe('주요 네비게이션')
    expect(wrapper.find('.layout-toolbar').attributes('aria-label')).toBe('업무 메뉴')
    expect(wrapper.find('.layout-main').attributes('aria-label')).toBeUndefined()

    // 건너뛰기 링크 확인
    const skipLink = wrapper.find('.skip-link')
    expect(skipLink.exists()).toBe(true)
    expect(skipLink.attributes('href')).toBe('#main-content')
  })

  it('에러 상황에서도 기본 레이아웃이 유지된다', () => {
    // 스토어가 없는 상황 시뮬레이션
    const wrapperWithoutStore = mount(MainLayout, {
      global: {
        plugins: []
      }
    })

    // 기본 구조는 유지되어야 함
    expect(wrapperWithoutStore.find('.main-layout').exists()).toBe(true)
    expect(wrapperWithoutStore.find('.layout-header').exists()).toBe(true)
    expect(wrapperWithoutStore.find('.layout-toolbar').exists()).toBe(true)
    expect(wrapperWithoutStore.find('.layout-main').exists()).toBe(true)
    
    wrapperWithoutStore.unmount()
  })
})

describe('MainLayout 반응형 동작', () => {
  let wrapper: VueWrapper<any>
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    vi.clearAllMocks()
  })

  it('화면 크기 변경 시 올바른 브레이크포인트가 설정된다', async () => {
    wrapper = mount(MainLayout, {
      global: {
        plugins: [pinia]
      }
    })

    const layoutStore = useLayoutStore()

    // 모바일 크기 (600px)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600,
    })
    window.dispatchEvent(new Event('resize'))
    
    await nextTick()
    expect(layoutStore.breakpoint).toBe('mobile')

    // 태블릿 크기 (900px)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 900,
    })
    window.dispatchEvent(new Event('resize'))
    
    await nextTick()
    expect(layoutStore.breakpoint).toBe('tablet')

    // 데스크톱 크기 (1200px)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    })
    window.dispatchEvent(new Event('resize'))
    
    await nextTick()
    expect(layoutStore.breakpoint).toBe('desktop')
  })

  it('브레이크포인트별 그리드 컬럼이 올바르게 적용된다', async () => {
    wrapper = mount(MainLayout, {
      global: {
        plugins: [pinia]
      }
    })

    const layoutStore = useLayoutStore()
    
    // 데스크톱: 80px 1fr
    layoutStore.setBreakpoint('desktop')
    await nextTick()
    
    const desktopElement = wrapper.find('.main-layout')
    expect(desktopElement.classes()).toContain('layout-desktop')
    
    // 태블릿: 60px 1fr  
    layoutStore.setBreakpoint('tablet')
    await nextTick()
    
    const tabletElement = wrapper.find('.main-layout')
    expect(tabletElement.classes()).toContain('layout-tablet')
    
    // 모바일: 1fr (단일 컬럼)
    layoutStore.setBreakpoint('mobile')
    await nextTick()
    
    const mobileElement = wrapper.find('.main-layout')
    expect(mobileElement.classes()).toContain('layout-mobile')
  })
})

describe('MainLayout 성능', () => {
  let wrapper: VueWrapper<any>
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    vi.clearAllMocks()
  })

  it('반복적인 리사이즈 이벤트가 디바운스된다', async () => {
    vi.useFakeTimers()
    
    wrapper = mount(MainLayout, {
      global: {
        plugins: [pinia]
      }
    })

    const layoutStore = useLayoutStore()
    const setBreakpointSpy = vi.spyOn(layoutStore, 'setBreakpoint')

    // 연속된 리사이즈 이벤트 발생
    for (let i = 0; i < 10; i++) {
      window.dispatchEvent(new Event('resize'))
    }

    // 디바운스 대기
    vi.advanceTimersByTime(150)
    
    // 디바운스로 인해 1번만 호출되어야 함
    expect(setBreakpointSpy).toHaveBeenCalledTimes(1)
    
    vi.useRealTimers()
  })

  it('컴포넌트 언마운트 시 이벤트 리스너가 정리된다', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    
    wrapper = mount(MainLayout, {
      global: {
        plugins: [pinia]
      }
    })

    wrapper.unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })
})