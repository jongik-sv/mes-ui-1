import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import UserInfoDropdown from '../UserInfoDropdown.vue';

// Mock PrimeVue components
vi.mock('primevue/button', () => ({
  default: {
    name: 'Button',
    template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
    props: ['text', 'role'],
    emits: ['click']
  }
}));

vi.mock('primevue/divider', () => ({
  default: {
    name: 'Divider',
    template: '<hr />'
  }
}));

describe('UserInfoDropdown', () => {
  const mockUser = {
    id: '1',
    name: '장종익',
    department: '냉연생산SM팀',
    email: 'jang@dongkuk.com'
  };

  beforeEach(() => {
    // Mock document.addEventListener
    vi.spyOn(document, 'addEventListener');
    vi.spyOn(document, 'removeEventListener');
  });

  it('should display user information', () => {
    const wrapper = mount(UserInfoDropdown, {
      props: { user: mockUser }
    });
    
    expect(wrapper.text()).toContain('장종익');
    expect(wrapper.text()).toContain('냉연생산SM팀');
  });

  it('should show user avatar initial when no avatar provided', () => {
    const wrapper = mount(UserInfoDropdown, {
      props: { user: mockUser }
    });
    
    const avatarInitial = wrapper.find('.avatar-initial');
    expect(avatarInitial.exists()).toBe(true);
    expect(avatarInitial.text()).toBe('장');
  });

  it('should show avatar image when provided', () => {
    const userWithAvatar = {
      ...mockUser,
      avatar: 'https://example.com/avatar.jpg'
    };
    
    const wrapper = mount(UserInfoDropdown, {
      props: { user: userWithAvatar }
    });
    
    const avatarImg = wrapper.find('.user-avatar img');
    expect(avatarImg.exists()).toBe(true);
    expect(avatarImg.attributes('src')).toBe('https://example.com/avatar.jpg');
  });

  it('should toggle dropdown when clicked', async () => {
    const wrapper = mount(UserInfoDropdown, {
      props: { user: mockUser }
    });
    
    const trigger = wrapper.find('[data-testid="user-info-button"]');
    
    // 초기 상태: 드롭다운 닫힘
    expect(wrapper.find('[data-testid="user-dropdown-menu"]').exists()).toBe(false);
    
    // 클릭 후: 드롭다운 열림
    await trigger.trigger('click');
    await nextTick();
    
    expect(wrapper.find('[data-testid="user-dropdown-menu"]').exists()).toBe(true);
  });

  it('should emit settings event when settings clicked', async () => {
    const wrapper = mount(UserInfoDropdown, {
      props: { user: mockUser }
    });
    
    // 드롭다운 열기
    await wrapper.find('[data-testid="user-info-button"]').trigger('click');
    await nextTick();
    
    // 설정 버튼 클릭
    const settingsButton = wrapper.findAll('.dropdown-item')[0];
    await settingsButton.trigger('click');
    
    expect(wrapper.emitted('settings')).toBeTruthy();
  });

  it('should emit messages event when messages clicked', async () => {
    const wrapper = mount(UserInfoDropdown, {
      props: { user: mockUser }
    });
    
    // 드롭다운 열기
    await wrapper.find('[data-testid="user-info-button"]').trigger('click');
    await nextTick();
    
    // 메시지함 버튼 클릭
    const messagesButton = wrapper.findAll('.dropdown-item')[1];
    await messagesButton.trigger('click');
    
    expect(wrapper.emitted('messages')).toBeTruthy();
  });

  it('should emit logout event when logout clicked', async () => {
    const wrapper = mount(UserInfoDropdown, {
      props: { user: mockUser }
    });
    
    // 드롭다운 열기
    await wrapper.find('[data-testid="user-info-button"]').trigger('click');
    await nextTick();
    
    // 로그아웃 버튼 클릭
    const logoutButton = wrapper.find('.dropdown-item--danger');
    await logoutButton.trigger('click');
    
    expect(wrapper.emitted('logout')).toBeTruthy();
  });

  it('should close dropdown after menu item click', async () => {
    const wrapper = mount(UserInfoDropdown, {
      props: { user: mockUser }
    });
    
    // 드롭다운 열기
    await wrapper.find('[data-testid="user-info-button"]').trigger('click');
    await nextTick();
    
    expect(wrapper.find('[data-testid="user-dropdown-menu"]').exists()).toBe(true);
    
    // 설정 버튼 클릭
    const settingsButton = wrapper.findAll('.dropdown-item')[0];
    await settingsButton.trigger('click');
    await nextTick();
    
    expect(wrapper.find('[data-testid="user-dropdown-menu"]').exists()).toBe(false);
  });

  it('should have correct aria attributes', () => {
    const wrapper = mount(UserInfoDropdown, {
      props: { user: mockUser }
    });
    
    const trigger = wrapper.find('[data-testid="user-info-button"]');
    expect(trigger.attributes('aria-haspopup')).toBe('true');
    expect(trigger.attributes('aria-expanded')).toBe('false');
  });

  it('should update aria-expanded when dropdown opens', async () => {
    const wrapper = mount(UserInfoDropdown, {
      props: { user: mockUser }
    });
    
    const trigger = wrapper.find('[data-testid="user-info-button"]');
    
    await trigger.trigger('click');
    await nextTick();
    
    expect(trigger.attributes('aria-expanded')).toBe('true');
  });

  it('should add click outside listener on mount', () => {
    mount(UserInfoDropdown, {
      props: { user: mockUser }
    });
    
    expect(document.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
  });

  it('should remove click outside listener on unmount', () => {
    const wrapper = mount(UserInfoDropdown, {
      props: { user: mockUser }
    });
    
    wrapper.unmount();
    
    expect(document.removeEventListener).toHaveBeenCalledWith('click', expect.any(Function));
  });
});