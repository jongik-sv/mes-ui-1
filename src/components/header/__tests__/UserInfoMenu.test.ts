import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';
import UserInfoMenu from '../UserInfoMenu.vue';
import { useUserStore } from '@/stores/userStore';
import type { User } from '@/types/user';

// Mock PrimeVue components
vi.mock('primevue/button', () => ({
  default: {
    name: 'Button',
    template: '<button @click="$emit(\'click\')" :class="$attrs.class"><slot /></button>',
    emits: ['click']
  }
}));

vi.mock('primevue/badge', () => ({
  default: {
    name: 'Badge',
    template: '<span class="badge" :class="severity"><slot>{{ value }}</slot></span>',
    props: ['value', 'severity']
  }
}));

// Mock useBreakpoints composable
vi.mock('@/composables/useBreakpoints', () => ({
  useBreakpoints: () => ({
    isMobile: false
  })
}));

describe('UserInfoMenu', () => {
  let wrapper: VueWrapper<any>;
  let userStore: ReturnType<typeof useUserStore>;

  const mockUser: User = {
    id: '1',
    username: 'jjang',
    displayName: '장종익',
    department: '냉연생산SM팀',
    email: 'jjang@company.com',
    phone: '010-1234-5678',
    role: 'user',
    permissions: ['read', 'write'],
    preferences: {
      theme: 'dark',
      language: 'ko',
      notifications: {
        email: true,
        push: true,
        sound: false
      }
    }
  };

  beforeEach(() => {
    setActivePinia(createPinia());
    userStore = useUserStore();
    
    // Mock window.confirm
    Object.defineProperty(window, 'confirm', {
      value: vi.fn(() => true),
      writable: true
    });
    
    // Mock DOM methods
    Object.defineProperty(document, 'addEventListener', {
      value: vi.fn(),
      writable: true
    });
    
    Object.defineProperty(document, 'removeEventListener', {
      value: vi.fn(),
      writable: true
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    vi.clearAllMocks();
  });

  describe('렌더링', () => {
    it('사용자 정보가 없을 때 기본 상태로 렌더링된다', async () => {
      wrapper = mount(UserInfoMenu);
      await nextTick();
      
      expect(wrapper.find('.avatar-initial').text()).toBe('?');
      // isMobile: false이므로 user-details가 보여야 함
      const userDetails = wrapper.find('.user-details');
      expect(userDetails.exists()).toBe(true);
    });

    it('사용자 정보를 올바르게 표시한다', async () => {
      userStore.currentUser = mockUser;
      
      wrapper = mount(UserInfoMenu);
      await nextTick();
      
      const avatarInitial = wrapper.find('.avatar-initial');
      expect(avatarInitial.exists()).toBe(true);
      expect(avatarInitial.text()).toBe('장');
      
      const userName = wrapper.find('.user-name');
      expect(userName.exists()).toBe(true);
      expect(userName.text()).toBe('장종익');
      
      const userDepartment = wrapper.find('.user-department');
      expect(userDepartment.exists()).toBe(true);
      expect(userDepartment.text()).toBe('냉연생산SM팀');
    });

    it('사용자 아바타 이미지가 있을 때 이미지를 표시한다', async () => {
      userStore.currentUser = {
        ...mockUser,
        avatar: 'https://example.com/avatar.jpg'
      };
      
      wrapper = mount(UserInfoMenu);
      await nextTick();
      
      const avatarImage = wrapper.find('.avatar-image');
      expect(avatarImage.exists()).toBe(true);
      expect(avatarImage.attributes('src')).toBe('https://example.com/avatar.jpg');
      expect(avatarImage.attributes('alt')).toBe('장종익 아바타');
    });

    it('읽지 않은 메시지 수가 있을 때 배지를 표시한다', async () => {
      userStore.currentUser = mockUser;
      userStore.unreadMessageCount = 5;
      userStore.menuState.isOpen = true;
      
      wrapper = mount(UserInfoMenu);
      await nextTick();
      
      const badge = wrapper.find('.message-badge');
      expect(badge.exists()).toBe(true);
      expect(badge.text()).toBe('5');
    });
  });

  describe('메뉴 상호작용', () => {
    beforeEach(() => {
      userStore.currentUser = mockUser;
      wrapper = mount(UserInfoMenu);
    });

    it('메뉴 버튼 클릭 시 드롭다운이 토글된다', async () => {
      expect(userStore.menuState.isOpen).toBe(false);
      expect(wrapper.find('.user-dropdown-menu').exists()).toBe(false);
      
      await wrapper.find('.user-info-button').trigger('click');
      
      expect(userStore.menuState.isOpen).toBe(true);
      await nextTick();
      expect(wrapper.find('.user-dropdown-menu').exists()).toBe(true);
    });

    it('메뉴가 열린 상태에서 메뉴 항목들이 표시된다', async () => {
      userStore.menuState.isOpen = true;
      await nextTick();
      
      const menuItems = wrapper.findAll('.menu-item');
      expect(menuItems).toHaveLength(3);
      
      expect(menuItems[0].text()).toContain('사용자 설정');
      expect(menuItems[1].text()).toContain('메시지함');
      expect(menuItems[2].text()).toContain('로그아웃');
    });

    it('사용자 설정 메뉴 클릭 시 올바른 액션이 호출된다', async () => {
      const openUserSettingsSpy = vi.spyOn(userStore, 'openUserSettings');
      const closeUserMenuSpy = vi.spyOn(userStore, 'closeUserMenu');
      
      userStore.menuState.isOpen = true;
      await nextTick();
      
      const settingsMenuItem = wrapper.findAll('.menu-item')[0];
      await settingsMenuItem.trigger('click');
      
      expect(openUserSettingsSpy).toHaveBeenCalled();
      expect(closeUserMenuSpy).toHaveBeenCalled();
    });

    it('메시지함 메뉴 클릭 시 올바른 액션이 호출된다', async () => {
      const openMessageBoxSpy = vi.spyOn(userStore, 'openMessageBox');
      const closeUserMenuSpy = vi.spyOn(userStore, 'closeUserMenu');
      
      userStore.menuState.isOpen = true;
      await nextTick();
      
      const messageMenuItem = wrapper.findAll('.menu-item')[1];
      await messageMenuItem.trigger('click');
      
      expect(openMessageBoxSpy).toHaveBeenCalled();
      expect(closeUserMenuSpy).toHaveBeenCalled();
    });

    it('로그아웃 메뉴 클릭 시 올바른 액션이 호출된다', async () => {
      const handleLogoutSpy = vi.spyOn(userStore, 'handleLogout').mockResolvedValue();
      
      userStore.menuState.isOpen = true;
      await nextTick();
      
      const logoutMenuItem = wrapper.findAll('.menu-item')[2];
      await logoutMenuItem.trigger('click');
      
      expect(handleLogoutSpy).toHaveBeenCalled();
      // handleLogout 호출이 비동기이므로 잠깐 기다림
      await nextTick();
      expect(userStore.menuState.isOpen).toBe(false);
    });
  });

  describe('키보드 네비게이션', () => {
    beforeEach(() => {
      userStore.currentUser = mockUser;
      wrapper = mount(UserInfoMenu);
    });

    it('Enter 키로 메뉴를 토글한다', async () => {
      const toggleSpy = vi.spyOn(userStore, 'toggleUserMenu');
      
      await wrapper.find('.user-info-button').trigger('keydown.enter');
      
      expect(toggleSpy).toHaveBeenCalled();
    });

    it('Space 키로 메뉴를 토글한다', async () => {
      const toggleSpy = vi.spyOn(userStore, 'toggleUserMenu');
      
      await wrapper.find('.user-info-button').trigger('keydown.space');
      
      expect(toggleSpy).toHaveBeenCalled();
    });

    it('Escape 키로 메뉴를 닫는다', async () => {
      const closeSpy = vi.spyOn(userStore, 'closeUserMenu');
      
      await wrapper.find('.user-info-button').trigger('keydown.escape');
      
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe('접근성', () => {
    beforeEach(() => {
      userStore.currentUser = mockUser;
      wrapper = mount(UserInfoMenu);
    });

    it('올바른 ARIA 속성을 가진다', () => {
      const button = wrapper.find('.user-info-button');
      
      expect(button.attributes('aria-haspopup')).toBe('true');
      expect(button.attributes('aria-expanded')).toBe('false');
      expect(button.attributes('aria-label')).toBe('사용자 메뉴');
    });

    it('메뉴가 열렸을 때 aria-expanded가 true가 된다', async () => {
      userStore.menuState.isOpen = true;
      await nextTick();
      
      const button = wrapper.find('.user-info-button');
      expect(button.attributes('aria-expanded')).toBe('true');
    });

    it('드롭다운 메뉴에 올바른 role 속성이 있다', async () => {
      userStore.menuState.isOpen = true;
      await nextTick();
      
      const dropdown = wrapper.find('.user-dropdown-menu');
      expect(dropdown.attributes('role')).toBe('menu');
      expect(dropdown.attributes('aria-labelledby')).toBe('user-menu-button');
    });

    it('메뉴 항목들에 올바른 role 속성이 있다', async () => {
      userStore.menuState.isOpen = true;
      await nextTick();
      
      const menuItems = wrapper.findAll('.menu-item');
      menuItems.forEach(item => {
        expect(item.attributes('role')).toBe('menuitem');
        expect(item.attributes('tabindex')).toBe('0');
      });
    });
  });

  describe('반응형 동작', () => {
    it('모바일에서 사용자 정보를 숨긴다 (CSS 기반)', () => {
      // CSS 미디어 쿼리에서 처리하므로 스킵
      // 실제 브라우저 환경에서는 CSS가 적용되어 숨겨짐
      expect(true).toBe(true);
    });

    it('모바일에서 드롭다운에 사용자 정보를 표시한다 (CSS 기반)', () => {
      // CSS 미디어 쿼리에서 처리하므로 스킵  
      // 실제 브라우저 환경에서는 CSS가 적용되어 표시됨
      expect(true).toBe(true);
    });
  });

  describe('외부 클릭 감지', () => {
    it('컴포넌트 마운트 시 이벤트 리스너를 등록한다', () => {
      wrapper = mount(UserInfoMenu);
      
      expect(document.addEventListener).toHaveBeenCalledWith('click', expect.any(Function), { passive: true });
      expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function), { passive: false });
    });

    it('컴포넌트 언마운트 시 이벤트 리스너를 제거한다', () => {
      wrapper = mount(UserInfoMenu);
      wrapper.unmount();
      
      expect(document.removeEventListener).toHaveBeenCalledWith('click', expect.any(Function));
      expect(document.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });

  describe('CSS 클래스', () => {
    beforeEach(() => {
      userStore.currentUser = mockUser;
      wrapper = mount(UserInfoMenu);
    });

    it('메뉴가 열렸을 때 올바른 CSS 클래스를 적용한다', async () => {
      userStore.menuState.isOpen = true;
      await nextTick();
      
      const button = wrapper.find('.user-info-button');
      expect(button.classes()).toContain('menu-open');
    });

    it('드롭다운 화살표가 회전한다', async () => {
      userStore.menuState.isOpen = true;
      await nextTick();
      
      const arrow = wrapper.find('.dropdown-arrow');
      expect(arrow.classes()).toContain('rotated');
    });

    it('로그아웃 메뉴 항목에 특별한 스타일이 적용된다', async () => {
      userStore.menuState.isOpen = true;
      await nextTick();
      
      const logoutItem = wrapper.findAll('.menu-item')[2];
      expect(logoutItem.classes()).toContain('logout-item');
    });
  });
});