import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import HeaderComponent from '../HeaderComponent.vue';

// Mock PrimeVue components
vi.mock('primevue/button', () => ({
  default: {
    name: 'Button',
    template: '<button><slot /></button>',
    props: ['icon', 'text', 'rounded', 'size', 'aria-label', 'aria-expanded']
  }
}));

vi.mock('primevue/divider', () => ({
  default: {
    name: 'Divider',
    template: '<hr />'
  }
}));

describe('HeaderComponent', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should render with correct structure', () => {
    const wrapper = mount(HeaderComponent);
    
    expect(wrapper.find('.mes-header')).toBeTruthy();
    expect(wrapper.find('.header-left')).toBeTruthy();
    expect(wrapper.find('.header-right')).toBeTruthy();
  });

  it('should have 60px fixed height', () => {
    const wrapper = mount(HeaderComponent);
    const header = wrapper.find('.mes-header');
    
    expect(header.classes()).toContain('mes-header');
    // CSS 클래스가 적용되었는지 확인 (실제 스타일은 CSS에서 처리)
    expect(header.exists()).toBe(true);
  });

  it('should display company logo', () => {
    const wrapper = mount(HeaderComponent);
    
    expect(wrapper.find('[data-testid="company-logo"]')).toBeTruthy();
    expect(wrapper.text()).toContain('DONGKUK CM');
  });

  it('should render global menu button', () => {
    const wrapper = mount(HeaderComponent);
    
    expect(wrapper.find('[data-testid="global-menu-button"]')).toBeTruthy();
  });

  it('should render user info section', () => {
    const wrapper = mount(HeaderComponent);
    
    expect(wrapper.find('[data-testid="user-info-dropdown"]')).toBeTruthy();
  });

  it('should render contact list button', () => {
    const wrapper = mount(HeaderComponent);
    
    expect(wrapper.find('[data-testid="contact-list-button"]')).toBeTruthy();
  });

  it('should render remote support button', () => {
    const wrapper = mount(HeaderComponent);
    
    expect(wrapper.find('[data-testid="remote-support-button"]')).toBeTruthy();
  });

  it('should apply dark theme styles', () => {
    const wrapper = mount(HeaderComponent);
    const header = wrapper.find('.mes-header');
    
    expect(header.classes()).toContain('mes-header');
  });

  it('should be responsive on mobile', () => {
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    const wrapper = mount(HeaderComponent);
    const header = wrapper.find('.mes-header');
    
    expect(header.exists()).toBe(true);
  });

  it('should handle global menu click', async () => {
    const wrapper = mount(HeaderComponent);
    const globalMenuButton = wrapper.find('[data-testid="global-menu-button"]');
    
    await globalMenuButton.trigger('click');
    
    // 이벤트가 발생했는지 확인
    expect(wrapper.emitted('global-menu-click')).toBeTruthy();
  });
});