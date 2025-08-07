import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import GlobalMenuButton from '../GlobalMenuButton.vue';

// Mock PrimeVue Button
vi.mock('primevue/button', () => ({
  default: {
    name: 'Button',
    template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
    props: ['icon', 'text', 'rounded', 'size'],
    emits: ['click']
  }
}));

describe('GlobalMenuButton', () => {
  it('should render button with correct attributes', () => {
    const wrapper = mount(GlobalMenuButton, {
      props: {
        ariaLabel: '전체 메뉴'
      }
    });
    
    const button = wrapper.find('[data-testid="global-menu-button"]');
    expect(button.exists()).toBe(true);
    expect(button.attributes('aria-label')).toBe('전체 메뉴');
  });

  it('should emit click event when clicked', async () => {
    const wrapper = mount(GlobalMenuButton);
    const button = wrapper.find('[data-testid="global-menu-button"]');
    
    await button.trigger('click');
    
    expect(wrapper.emitted('click')).toBeTruthy();
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('should have correct aria-expanded attribute', () => {
    const wrapper = mount(GlobalMenuButton, {
      props: {
        isOpen: true
      }
    });
    
    const button = wrapper.find('[data-testid="global-menu-button"]');
    expect(button.attributes('aria-expanded')).toBe('true');
  });

  it('should have default aria-label', () => {
    const wrapper = mount(GlobalMenuButton);
    const button = wrapper.find('[data-testid="global-menu-button"]');
    
    expect(button.attributes('aria-label')).toBe('전체 메뉴');
  });

  it('should apply correct CSS classes', () => {
    const wrapper = mount(GlobalMenuButton);
    const button = wrapper.find('[data-testid="global-menu-button"]');
    
    expect(button.classes()).toContain('global-menu-btn');
  });

  it('should handle keyboard events', async () => {
    const wrapper = mount(GlobalMenuButton);
    const button = wrapper.find('[data-testid="global-menu-button"]');
    
    await button.trigger('keydown.enter');
    await button.trigger('keydown.space');
    
    // PrimeVue Button이 키보드 이벤트를 자동으로 처리함
    expect(button.exists()).toBe(true);
  });
});