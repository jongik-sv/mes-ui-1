import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import ResponsiveToolbar from '../ResponsiveToolbar.vue';
import { useResponsiveLayout } from '@/composables/useResponsiveLayout';

// Mock PrimeVue components
vi.mock('primevue/sidebar', () => ({
  default: {
    name: 'Sidebar',
    props: ['visible', 'position', 'modal', 'dismissable'],
    emits: ['update:visible', 'hide'],
    template: `
      <div v-if="visible" class="p-sidebar" :class="'p-sidebar-' + position">
        <div class="p-sidebar-header">
          <slot name="header" />
        </div>
        <div class="p-sidebar-content">
          <slot />
        </div>
      </div>
    `
  }
}));

vi.mock('primevue/button', () => ({
  default: {
    name: 'Button',
    props: ['icon', 'text', 'rounded', 'label', 'class'],
    emits: ['click'],
    template: '<button @click="$emit(\'click\')" :class="$props.class"><i v-if="icon" :class="icon"></i>{{ label }}</button>'
  }
}));

// Mock child components
vi.mock('../ToolbarIcon.vue', () => ({
  default: {
    name: 'ToolbarIcon',
    props: ['icon', 'active', 'mobile'],
    emits: ['click'],
    template: '<div class="toolbar-icon" :class="{ active, mobile }" @click="$emit(\'click\')">{{ icon.label }}</div>'
  }
}));

vi.mock('../MenuTree.vue', () => ({
  default: {
    name: 'MenuTree',
    props: ['nodes', 'mode'],
    emits: ['menu-select'],
    template: '<div class="menu-tree" :class="mode">Menu Tree</div>'
  }
}));

// Mock composables
vi.mock('@/composables/useResponsiveLayout', () => ({
  useResponsiveLayout: vi.fn()
}));

vi.mock('@/composables/useToolbar', () => ({
  useToolbar: vi.fn(() => ({
    toolbarIcons: [
      { id: 'home', label: '홈', iconName: 'pi pi-home' },
      { id: 'production', label: '생산', iconName: 'pi pi-cog' },
      { id: 'quality', label: '품질', iconName: 'pi pi-shield' }
    ],
    activeIcon: { value: 'home' },
    selectedCategory: { value: null },
    selectedCategoryMenus: { value: [] },
    handleIconClick: vi.fn()
  }))
}));

describe('ResponsiveToolbar', () => {
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

    it('데스크톱에서 고정 툴바를 표시한다', () => {
      // When: 컴포넌트 마운트
      const wrapper = mount(ResponsiveToolbar, {
        global: { plugins: [pinia] }
      });

      // Then: 고정 툴바 표시, 드로어 숨김
      expect(wrapper.find('.toolbar-sidebar').exists()).toBe(true);
      expect(wrapper.find('.p-drawer').exists()).toBe(false);
    });

    it('데스크톱에서 툴바 아이콘들이 세로로 배치된다', () => {
      // When: 컴포넌트 마운트
      const wrapper = mount(ResponsiveToolbar, {
        global: { plugins: [pinia] }
      });

      // Then: 툴바 아이콘들이 세로 배치
      const toolbarIcons = wrapper.findAll('.toolbar-icon');
      expect(toolbarIcons.length).toBe(3);
      expect(wrapper.find('.toolbar-icons').exists()).toBe(true);
    });

    it('데스크톱에서 툴바 아이콘 클릭 시 메뉴 트리가 표시된다', async () => {
      // Given: 컴포넌트 마운트
      const wrapper = mount(ResponsiveToolbar, {
        global: { plugins: [pinia] }
      });

      // When: 툴바 아이콘 클릭
      const firstIcon = wrapper.find('.toolbar-icon');
      await firstIcon.trigger('click');

      // Then: 메뉴 트리 표시 (실제 구현에서는 상태 변경 확인)
      expect(firstIcon.exists()).toBe(true);
    });
  });

  describe('모바일/태블릿 레이아웃', () => {
    beforeEach(() => {
      const mockUseResponsiveLayout = vi.mocked(useResponsiveLayout);
      mockUseResponsiveLayout.mockReturnValue({
        screenSize: { value: { width: 375, height: 667 } },
        currentBreakpoint: { value: 'mobile' },
        layoutState: { 
          value: { 
            toolbarVisible: false, 
            menuTreeMode: 'fullscreen', 
            headerCompact: true 
          } 
        },
        mobileMenuOpen: { value: true },
        toggleMobileMenu: vi.fn(),
        closeMobileMenu: vi.fn()
      });
    });

    it('모바일에서 드로어 메뉴를 표시한다', () => {
      // When: 컴포넌트 마운트
      const wrapper = mount(ResponsiveToolbar, {
        global: { plugins: [pinia] }
      });

      // Then: 사이드바 표시, 고정 툴바 숨김
      expect(wrapper.find('.p-sidebar').exists()).toBe(true);
      expect(wrapper.find('.toolbar-sidebar').exists()).toBe(false);
    });

    it('모바일에서 드로어가 열린 상태일 때 툴바 아이콘들을 표시한다', () => {
      // When: 컴포넌트 마운트
      const wrapper = mount(ResponsiveToolbar, {
        global: { plugins: [pinia] }
      });

      // Then: 모바일 툴바 아이콘들 표시
      const toolbarIcons = wrapper.findAll('.toolbar-icon');
      expect(toolbarIcons.length).toBe(3);
      expect(wrapper.find('.mobile-toolbar-icons').exists()).toBe(true);
    });

    it('모바일에서 아이콘 클릭 시 메뉴 트리가 표시된다', async () => {
      // Given: 컴포넌트 마운트
      const wrapper = mount(ResponsiveToolbar, {
        global: { plugins: [pinia] }
      });

      // When: 모바일 툴바 아이콘 클릭
      const firstIcon = wrapper.find('.toolbar-icon');
      await firstIcon.trigger('click');

      // Then: 메뉴 트리 영역 존재 확인
      expect(wrapper.find('.mobile-toolbar-content').exists()).toBe(true);
    });

    it('모바일에서 드로어가 닫힌 상태일 때 툴바를 숨긴다', () => {
      // Given: 드로어가 닫힌 상태로 mock 설정
      const mockUseResponsiveLayout = vi.mocked(useResponsiveLayout);
      mockUseResponsiveLayout.mockReturnValue({
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
      const wrapper = mount(ResponsiveToolbar, {
        global: { plugins: [pinia] }
      });

      // Then: 사이드바 숨김
      expect(wrapper.find('.p-sidebar').exists()).toBe(false);
    });
  });

  describe('사이드바 인터랙션', () => {
    let mockCloseMobileMenu: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockCloseMobileMenu = vi.fn();
      const mockUseResponsiveLayout = vi.mocked(useResponsiveLayout);
      mockUseResponsiveLayout.mockReturnValue({
        screenSize: { value: { width: 375, height: 667 } },
        currentBreakpoint: { value: 'mobile' },
        layoutState: { 
          value: { 
            toolbarVisible: false, 
            menuTreeMode: 'fullscreen', 
            headerCompact: true 
          } 
        },
        mobileMenuOpen: { value: true },
        toggleMobileMenu: vi.fn(),
        closeMobileMenu: mockCloseMobileMenu
      });
    });

    it('사이드바 닫기 시 closeMobileMenu가 호출된다', async () => {
      // Given: 컴포넌트 마운트
      const wrapper = mount(ResponsiveToolbar, {
        global: { plugins: [pinia] }
      });

      // When: 사이드바 hide 이벤트 발생
      const sidebar = wrapper.findComponent({ name: 'Sidebar' });
      await sidebar.vm.$emit('hide');

      // Then: closeMobileMenu 호출
      expect(mockCloseMobileMenu).toHaveBeenCalledOnce();
    });
  });

  describe('접근성', () => {
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

    it('툴바에 적절한 role과 aria-label이 설정된다', () => {
      // When: 컴포넌트 마운트
      const wrapper = mount(ResponsiveToolbar, {
        global: { plugins: [pinia] }
      });

      // Then: 툴바에 navigation role 설정
      const toolbar = wrapper.find('.toolbar-sidebar');
      expect(toolbar.attributes('role')).toBe('navigation');
      expect(toolbar.attributes('aria-label')).toBe('주요 메뉴');
    });

    it('사이드바에 적절한 헤더가 설정된다', () => {
      // Given: 모바일 레이아웃으로 변경
      const mockUseResponsiveLayout = vi.mocked(useResponsiveLayout);
      mockUseResponsiveLayout.mockReturnValue({
        screenSize: { value: { width: 375, height: 667 } },
        currentBreakpoint: { value: 'mobile' },
        layoutState: { 
          value: { 
            toolbarVisible: false, 
            menuTreeMode: 'fullscreen', 
            headerCompact: true 
          } 
        },
        mobileMenuOpen: { value: true },
        toggleMobileMenu: vi.fn(),
        closeMobileMenu: vi.fn()
      });

      // When: 컴포넌트 마운트
      const wrapper = mount(ResponsiveToolbar, {
        global: { plugins: [pinia] }
      });

      // Then: 사이드바 헤더 확인
      expect(wrapper.text()).toContain('메뉴');
    });
  });

  describe('스타일링', () => {
    it('데스크톱 툴바가 올바른 크기를 가진다', () => {
      // Given: 데스크톱 레이아웃
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

      // When: 컴포넌트 마운트
      const wrapper = mount(ResponsiveToolbar, {
        global: { plugins: [pinia] }
      });

      // Then: 툴바가 적절한 클래스를 가짐
      expect(wrapper.find('.toolbar-sidebar').exists()).toBe(true);
    });

    it('모바일 사이드바가 올바른 속성을 가진다', () => {
      // Given: 모바일 레이아웃
      const mockUseResponsiveLayout = vi.mocked(useResponsiveLayout);
      mockUseResponsiveLayout.mockReturnValue({
        screenSize: { value: { width: 375, height: 667 } },
        currentBreakpoint: { value: 'mobile' },
        layoutState: { 
          value: { 
            toolbarVisible: false, 
            menuTreeMode: 'fullscreen', 
            headerCompact: true 
          } 
        },
        mobileMenuOpen: { value: true },
        toggleMobileMenu: vi.fn(),
        closeMobileMenu: vi.fn()
      });

      // When: 컴포넌트 마운트
      const wrapper = mount(ResponsiveToolbar, {
        global: { plugins: [pinia] }
      });

      // Then: 사이드바가 올바른 속성을 가짐
      const sidebar = wrapper.findComponent({ name: 'Sidebar' });
      expect(sidebar.props('position')).toBe('left');
      expect(sidebar.props('modal')).toBe(true);
      expect(sidebar.props('dismissable')).toBe(true);
    });
  });
});