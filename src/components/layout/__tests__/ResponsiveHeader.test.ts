import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import ResponsiveHeader from '../ResponsiveHeader.vue';
import { useResponsiveLayout } from '@/composables/useResponsiveLayout';

// Mock PrimeVue Button component
vi.mock('primevue/button', () => ({
  default: {
    name: 'Button',
    props: ['icon', 'text', 'rounded', 'label', 'class'],
    emits: ['click'],
    template: '<button @click="$emit(\'click\')" :class="$props.class"><i v-if="icon" :class="icon"></i>{{ label }}</button>'
  }
}));

// Mock child components
vi.mock('../UserInfoMenu.vue', () => ({
  default: {
    name: 'UserInfoMenu',
    props: ['compact'],
    template: '<div class="user-info-menu">User Info</div>'
  }
}));

vi.mock('../ContactList.vue', () => ({
  default: {
    name: 'ContactList',
    template: '<div class="contact-list">Contact List</div>'
  }
}));

vi.mock('../RemoteSupport.vue', () => ({
  default: {
    name: 'RemoteSupport',
    template: '<div class="remote-support">Remote Support</div>'
  }
}));

// Mock useResponsiveLayout composable
vi.mock('@/composables/useResponsiveLayout', () => ({
  useResponsiveLayout: vi.fn()
}));

describe('ResponsiveHeader', () => {
  let pinia: ReturnType<typeof createPinia>;
  
  beforeEach(() => {
    pinia = createPinia();
    vi.clearAllMocks();
  });

  describe('데스크톱 레이아웃', () => {
    beforeEach(() => {
      const mockUseResponsiveLayout = vi.mocked(useResponsiveLayout);
      mockUseResponsiveLayout.mockReturnValue({
        screenSize: { value: { width: 1440, height: 900 } },
        currentBreakpoint: { value: 'desktop' },
        layoutState: { 
          value: { 
            toolbarVisible: true, 
            menuTreeMode: 'sidebar', 
            headerCompact: false 
          } 
        },
        mobileMenuOpen: { value: false },
        toggleMobileMenu: vi.fn(),
        closeMobileMenu: vi.fn()
      });
    });

    it('데스크톱에서 전체 메뉴 버튼을 표시한다', () => {
      // When: 컴포넌트 마운트
      const wrapper = mount(ResponsiveHeader, {
        global: { plugins: [pinia] }
      });

      // Then: 전체 메뉴 버튼 표시, 햄버거 메뉴 버튼 숨김
      expect(wrapper.find('.global-menu-btn').exists()).toBe(true);
      expect(wrapper.find('.hamburger-menu-btn').exists()).toBe(false);
    });

    it('데스크톱에서 헤더가 컴팩트 모드가 아니다', () => {
      // When: 컴포넌트 마운트
      const wrapper = mount(ResponsiveHeader, {
        global: { plugins: [pinia] }
      });

      // Then: 헤더가 컴팩트 클래스를 가지지 않음
      expect(wrapper.find('.mes-header').classes()).not.toContain('header-compact');
    });

    it('데스크톱에서 모든 헤더 요소가 표시된다', () => {
      // When: 컴포넌트 마운트
      const wrapper = mount(ResponsiveHeader, {
        global: { plugins: [pinia] }
      });

      // Then: 모든 헤더 요소 표시
      expect(wrapper.find('.company-logo').exists()).toBe(true);
      expect(wrapper.find('.user-info-menu').exists()).toBe(true);
      expect(wrapper.find('.contact-list').exists()).toBe(true);
      expect(wrapper.find('.remote-support').exists()).toBe(true);
    });
  });

  describe('태블릿 레이아웃', () => {
    beforeEach(() => {
      const mockUseResponsiveLayout = vi.mocked(useResponsiveLayout);
      mockUseResponsiveLayout.mockReturnValue({
        screenSize: { value: { width: 768, height: 1024 } },
        currentBreakpoint: { value: 'tablet' },
        layoutState: { 
          value: { 
            toolbarVisible: false, 
            menuTreeMode: 'overlay', 
            headerCompact: false 
          } 
        },
        mobileMenuOpen: { value: false },
        toggleMobileMenu: vi.fn(),
        closeMobileMenu: vi.fn()
      });
    });

    it('태블릿에서 햄버거 메뉴 버튼을 표시한다', () => {
      // When: 컴포넌트 마운트
      const wrapper = mount(ResponsiveHeader, {
        global: { plugins: [pinia] }
      });

      // Then: 햄버거 메뉴 버튼 표시, 전체 메뉴 버튼 숨김
      expect(wrapper.find('.hamburger-menu-btn').exists()).toBe(true);
      expect(wrapper.find('.global-menu-btn').exists()).toBe(false);
    });

    it('태블릿에서 연락처 목록이 표시된다', () => {
      // When: 컴포넌트 마운트
      const wrapper = mount(ResponsiveHeader, {
        global: { plugins: [pinia] }
      });

      // Then: 연락처 목록 표시
      expect(wrapper.find('.contact-list').exists()).toBe(true);
    });
  });

  describe('모바일 레이아웃', () => {
    beforeEach(() => {
      vi.mocked(useResponsiveLayout).mockReturnValue({
        screenSize: { value: { width: 375, height: 667 } },
        currentBreakpoint: { value: 'mobile' },
        layoutState: { 
          value: { 
            toolbarVisible: false, 
            menuTreeMode: 'fullscreen', 
            headerCompact: true 
          } 
        },
        mobileMenuOpen: { value: false },
        toggleMobileMenu: vi.fn(),
        closeMobileMenu: vi.fn()
      });
    });

    it('모바일에서 햄버거 메뉴 버튼을 표시한다', () => {
      // When: 컴포넌트 마운트
      const wrapper = mount(ResponsiveHeader, {
        global: { plugins: [pinia] }
      });

      // Then: 햄버거 메뉴 버튼 표시, 전체 메뉴 버튼 숨김
      expect(wrapper.find('.hamburger-menu-btn').exists()).toBe(true);
      expect(wrapper.find('.global-menu-btn').exists()).toBe(false);
    });

    it('모바일에서 헤더가 컴팩트 모드이다', () => {
      // When: 컴포넌트 마운트
      const wrapper = mount(ResponsiveHeader, {
        global: { plugins: [pinia] }
      });

      // Then: 헤더가 컴팩트 클래스를 가짐
      expect(wrapper.find('.mes-header').classes()).toContain('header-compact');
    });

    it('모바일에서 연락처 목록이 숨겨진다', () => {
      // When: 컴포넌트 마운트
      const wrapper = mount(ResponsiveHeader, {
        global: { plugins: [pinia] }
      });

      // Then: 연락처 목록 숨김
      expect(wrapper.find('.contact-list').exists()).toBe(false);
    });

    it('모바일에서 사용자 정보가 컴팩트 모드로 표시된다', () => {
      // When: 컴포넌트 마운트
      const wrapper = mount(ResponsiveHeader, {
        global: { plugins: [pinia] }
      });

      // Then: 사용자 정보가 컴팩트 prop을 받음
      const userInfoMenu = wrapper.findComponent({ name: 'UserInfoMenu' });
      expect(userInfoMenu.props('compact')).toBe(true);
    });
  });

  describe('인터랙션', () => {
    let mockToggleMobileMenu: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockToggleMobileMenu = vi.fn();
      vi.mocked(useResponsiveLayout).mockReturnValue({
        screenSize: { value: { width: 375, height: 667 } },
        currentBreakpoint: { value: 'mobile' },
        layoutState: { 
          value: { 
            toolbarVisible: false, 
            menuTreeMode: 'fullscreen', 
            headerCompact: true 
          } 
        },
        mobileMenuOpen: { value: false },
        toggleMobileMenu: mockToggleMobileMenu,
        closeMobileMenu: vi.fn()
      });
    });

    it('햄버거 메뉴 버튼 클릭 시 모바일 메뉴가 토글된다', async () => {
      // Given: 컴포넌트 마운트
      const wrapper = mount(ResponsiveHeader, {
        global: { plugins: [pinia] }
      });

      // When: 햄버거 메뉴 버튼 클릭
      await wrapper.find('.hamburger-menu-btn').trigger('click');

      // Then: toggleMobileMenu 호출
      expect(mockToggleMobileMenu).toHaveBeenCalledOnce();
    });
  });

  describe('접근성', () => {
    beforeEach(() => {
      vi.mocked(useResponsiveLayout).mockReturnValue({
        screenSize: { value: { width: 375, height: 667 } },
        currentBreakpoint: { value: 'mobile' },
        layoutState: { 
          value: { 
            toolbarVisible: false, 
            menuTreeMode: 'fullscreen', 
            headerCompact: true 
          } 
        },
        mobileMenuOpen: { value: false },
        toggleMobileMenu: vi.fn(),
        closeMobileMenu: vi.fn()
      });
    });

    it('헤더에 적절한 role과 aria-label이 설정된다', () => {
      // When: 컴포넌트 마운트
      const wrapper = mount(ResponsiveHeader, {
        global: { plugins: [pinia] }
      });

      // Then: 헤더에 banner role 설정
      const header = wrapper.find('header');
      expect(header.attributes('role')).toBe('banner');
    });

    it('햄버거 메뉴 버튼에 적절한 aria-label이 설정된다', () => {
      // When: 컴포넌트 마운트
      const wrapper = mount(ResponsiveHeader, {
        global: { plugins: [pinia] }
      });

      // Then: 햄버거 메뉴 버튼에 aria-label 설정
      const hamburgerBtn = wrapper.find('.hamburger-menu-btn');
      expect(hamburgerBtn.attributes('aria-label')).toBe('메뉴 열기');
    });

    it('버튼들이 터치 친화적 크기를 가진다', () => {
      // When: 컴포넌트 마운트
      const wrapper = mount(ResponsiveHeader, {
        global: { plugins: [pinia] }
      });

      // Then: 버튼들이 최소 44px 크기 클래스를 가짐
      const hamburgerBtn = wrapper.find('.hamburger-menu-btn');
      expect(hamburgerBtn.classes()).toContain('touch-friendly');
    });
  });

  describe('스타일링', () => {
    it('헤더가 기본 높이를 가진다', () => {
      // Given: 데스크톱 레이아웃
      vi.mocked(useResponsiveLayout).mockReturnValue({
        screenSize: { value: { width: 1440, height: 900 } },
        currentBreakpoint: { value: 'desktop' },
        layoutState: { 
          value: { 
            toolbarVisible: true, 
            menuTreeMode: 'sidebar', 
            headerCompact: false 
          } 
        },
        mobileMenuOpen: { value: false },
        toggleMobileMenu: vi.fn(),
        closeMobileMenu: vi.fn()
      });

      // When: 컴포넌트 마운트
      const wrapper = mount(ResponsiveHeader, {
        global: { plugins: [pinia] }
      });

      // Then: 헤더가 기본 스타일 클래스를 가짐
      expect(wrapper.find('.mes-header').exists()).toBe(true);
    });

    it('컴팩트 모드에서 적절한 클래스가 적용된다', () => {
      // Given: 모바일 레이아웃
      vi.mocked(useResponsiveLayout).mockReturnValue({
        screenSize: { value: { width: 375, height: 667 } },
        currentBreakpoint: { value: 'mobile' },
        layoutState: { 
          value: { 
            toolbarVisible: false, 
            menuTreeMode: 'fullscreen', 
            headerCompact: true 
          } 
        },
        mobileMenuOpen: { value: false },
        toggleMobileMenu: vi.fn(),
        closeMobileMenu: vi.fn()
      });

      // When: 컴포넌트 마운트
      const wrapper = mount(ResponsiveHeader, {
        global: { plugins: [pinia] }
      });

      // Then: 컴팩트 클래스 적용
      expect(wrapper.find('.mes-header').classes()).toContain('header-compact');
    });
  });
});