import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { useResponsiveLayout } from '../useResponsiveLayout';

// Mock window.innerWidth and window.innerHeight
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

// Mock addEventListener and removeEventListener
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

Object.defineProperty(window, 'addEventListener', {
  writable: true,
  configurable: true,
  value: mockAddEventListener,
});

Object.defineProperty(window, 'removeEventListener', {
  writable: true,
  configurable: true,
  value: mockRemoveEventListener,
});

// 테스트용 컴포넌트 생성
const createTestComponent = (width: number, height: number) => {
  return defineComponent({
    setup() {
      // 화면 크기 설정
      window.innerWidth = width;
      window.innerHeight = height;
      
      const responsive = useResponsiveLayout();
      return { responsive };
    },
    template: '<div></div>'
  });
};

describe('useResponsiveLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('브레이크포인트 감지', () => {
    it('모바일 화면 크기에서 mobile 브레이크포인트를 반환한다', async () => {
      // Given: 모바일 화면 크기 설정
      const TestComponent = createTestComponent(375, 667);
      
      // When: 컴포넌트 마운트
      const wrapper = mount(TestComponent);
      const { currentBreakpoint, screenSize } = wrapper.vm.responsive;

      // Then: mobile 브레이크포인트 반환
      expect(currentBreakpoint.value).toBe('mobile');
      expect(screenSize.value.width).toBe(375);
      expect(screenSize.value.height).toBe(667);
    });

    it('태블릿 화면 크기에서 tablet 브레이크포인트를 반환한다', async () => {
      // Given: 태블릿 화면 크기 설정
      const TestComponent = createTestComponent(900, 1024);
      
      // When: 컴포넌트 마운트
      const wrapper = mount(TestComponent);
      const { currentBreakpoint, screenSize } = wrapper.vm.responsive;

      // Then: tablet 브레이크포인트 반환
      expect(currentBreakpoint.value).toBe('tablet');
      expect(screenSize.value.width).toBe(900);
      expect(screenSize.value.height).toBe(1024);
    });

    it('데스크톱 화면 크기에서 desktop 브레이크포인트를 반환한다', async () => {
      // Given: 데스크톱 화면 크기 설정
      const TestComponent = createTestComponent(1200, 900);
      
      // When: 컴포넌트 마운트
      const wrapper = mount(TestComponent);
      const { currentBreakpoint, screenSize } = wrapper.vm.responsive;

      // Then: desktop 브레이크포인트 반환
      expect(currentBreakpoint.value).toBe('desktop');
      expect(screenSize.value.width).toBe(1200);
      expect(screenSize.value.height).toBe(900);
    });

    it('대형 화면 크기에서 large 브레이크포인트를 반환한다', async () => {
      // Given: 대형 화면 크기 설정
      const TestComponent = createTestComponent(1920, 1080);
      
      // When: 컴포넌트 마운트
      const wrapper = mount(TestComponent);
      const { currentBreakpoint, screenSize } = wrapper.vm.responsive;

      // Then: large 브레이크포인트 반환
      expect(currentBreakpoint.value).toBe('large');
      expect(screenSize.value.width).toBe(1920);
      expect(screenSize.value.height).toBe(1080);
    });
  });

  describe('레이아웃 상태 계산', () => {
    it('데스크톱에서 툴바가 표시되고 메뉴 트리가 사이드바 모드이다', async () => {
      // Given: 데스크톱 화면 크기
      const TestComponent = createTestComponent(1200, 900);
      
      // When: 컴포넌트 마운트
      const wrapper = mount(TestComponent);
      const { layoutState } = wrapper.vm.responsive;

      // Then: 데스크톱 레이아웃 상태
      expect(layoutState.value.toolbarVisible).toBe(true);
      expect(layoutState.value.menuTreeMode).toBe('sidebar');
      expect(layoutState.value.headerCompact).toBe(false);
    });

    it('태블릿에서 툴바가 숨겨지고 메뉴 트리가 오버레이 모드이다', async () => {
      // Given: 태블릿 화면 크기
      const TestComponent = createTestComponent(900, 1024);
      
      // When: 컴포넌트 마운트
      const wrapper = mount(TestComponent);
      const { layoutState } = wrapper.vm.responsive;

      // Then: 태블릿 레이아웃 상태
      expect(layoutState.value.toolbarVisible).toBe(false);
      expect(layoutState.value.menuTreeMode).toBe('overlay');
      expect(layoutState.value.headerCompact).toBe(false);
    });

    it('모바일에서 툴바가 숨겨지고 메뉴 트리가 전체화면 모드이며 헤더가 컴팩트하다', async () => {
      // Given: 모바일 화면 크기
      const TestComponent = createTestComponent(375, 667);
      
      // When: 컴포넌트 마운트
      const wrapper = mount(TestComponent);
      const { layoutState } = wrapper.vm.responsive;

      // Then: 모바일 레이아웃 상태
      expect(layoutState.value.toolbarVisible).toBe(false);
      expect(layoutState.value.menuTreeMode).toBe('fullscreen');
      expect(layoutState.value.headerCompact).toBe(true);
    });
  });

  describe('모바일 메뉴 관리', () => {
    it('초기 상태에서 모바일 메뉴가 닫혀있다', () => {
      // When: 컴포넌트 마운트
      const TestComponent = createTestComponent(375, 667);
      const wrapper = mount(TestComponent);
      const { mobileMenuOpen } = wrapper.vm.responsive;

      // Then: 모바일 메뉴가 닫혀있음
      expect(mobileMenuOpen.value).toBe(false);
    });

    it('toggleMobileMenu 호출 시 모바일 메뉴 상태가 토글된다', async () => {
      // Given: 컴포넌트 마운트
      const TestComponent = createTestComponent(375, 667);
      const wrapper = mount(TestComponent);
      const { mobileMenuOpen, toggleMobileMenu } = wrapper.vm.responsive;

      // When: 모바일 메뉴 토글
      toggleMobileMenu();
      await nextTick();

      // Then: 모바일 메뉴가 열림
      expect(mobileMenuOpen.value).toBe(true);

      // When: 다시 토글
      toggleMobileMenu();
      await nextTick();

      // Then: 모바일 메뉴가 닫힘
      expect(mobileMenuOpen.value).toBe(false);
    });

    it('closeMobileMenu 호출 시 모바일 메뉴가 닫힌다', async () => {
      // Given: 모바일 메뉴가 열린 상태
      const TestComponent = createTestComponent(375, 667);
      const wrapper = mount(TestComponent);
      const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = wrapper.vm.responsive;
      
      toggleMobileMenu();
      await nextTick();
      expect(mobileMenuOpen.value).toBe(true);

      // When: 모바일 메뉴 닫기
      closeMobileMenu();
      await nextTick();

      // Then: 모바일 메뉴가 닫힘
      expect(mobileMenuOpen.value).toBe(false);
    });
  });

  describe('이벤트 리스너 관리', () => {
    it('컴포넌트 마운트 시 resize 이벤트 리스너가 등록된다', () => {
      // When: 컴포넌트 마운트
      const TestComponent = createTestComponent(1200, 900);
      mount(TestComponent);

      // Then: resize 이벤트 리스너 등록
      expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    // Note: unmount 테스트는 실제 컴포넌트에서 테스트해야 함
  });

  describe('화면 크기 변경 반응', () => {
    it('화면 크기 변경 시 브레이크포인트가 업데이트된다', async () => {
      // Given: 초기 데스크톱 크기
      const TestComponent = createTestComponent(1200, 900);
      const wrapper = mount(TestComponent);
      const { currentBreakpoint } = wrapper.vm.responsive;
      expect(currentBreakpoint.value).toBe('desktop');

      // When: 모바일 크기로 변경하고 실제 이벤트 핸들러 호출
      window.innerWidth = 375;
      window.innerHeight = 667;
      
      // 실제 등록된 이벤트 핸들러를 찾아서 호출
      const resizeHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'resize'
      )?.[1];
      
      if (resizeHandler) {
        resizeHandler();
      }
      
      await nextTick();

      // Then: 브레이크포인트가 모바일로 변경
      expect(currentBreakpoint.value).toBe('mobile');
    });
  });
});