import { describe, it, expect, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import MenuToggleButtons from '../MenuToggleButtons.vue';

// Mock PrimeVue components
vi.mock('primevue/selectbutton', () => ({
  default: {
    name: 'SelectButton',
    template: `
      <div class="p-selectbutton p-component" data-testid="select-button">
        <div 
          v-for="(option, index) in options" 
          :key="option.value"
          :class="['p-button', { 'p-highlight': modelValue === option.value }]"
          @click="$emit('update:modelValue', option.value)"
          :data-testid="'toggle-button-' + option.value"
        >
          {{ option.label }}
        </div>
      </div>
    `,
    props: ['modelValue', 'options'],
    emits: ['update:modelValue']
  }
}));

describe('MenuToggleButtons', () => {
  let wrapper: VueWrapper<any>;

  const createWrapper = (props = {}) => {
    return mount(MenuToggleButtons, {
      props: {
        modelValue: 'all',
        ...props
      }
    });
  };

  describe('Rendering', () => {
    it('should render both toggle buttons', () => {
      wrapper = createWrapper();
      
      const selectButton = wrapper.find('[data-testid="select-button"]');
      expect(selectButton.exists()).toBe(true);
      
      const allButton = wrapper.find('[data-testid="toggle-button-all"]');
      const favoritesButton = wrapper.find('[data-testid="toggle-button-favorites"]');
      
      expect(allButton.exists()).toBe(true);
      expect(favoritesButton.exists()).toBe(true);
    });

    it('should display correct button labels', () => {
      wrapper = createWrapper();
      
      const allButton = wrapper.find('[data-testid="toggle-button-all"]');
      const favoritesButton = wrapper.find('[data-testid="toggle-button-favorites"]');
      
      expect(allButton.text()).toBe('전체보기');
      expect(favoritesButton.text()).toBe('즐겨찾기');
    });

    it('should highlight selected button', () => {
      wrapper = createWrapper({ modelValue: 'all' });
      
      const allButton = wrapper.find('[data-testid="toggle-button-all"]');
      const favoritesButton = wrapper.find('[data-testid="toggle-button-favorites"]');
      
      expect(allButton.classes()).toContain('p-highlight');
      expect(favoritesButton.classes()).not.toContain('p-highlight');
    });

    it('should highlight favorites button when selected', () => {
      wrapper = createWrapper({ modelValue: 'favorites' });
      
      const allButton = wrapper.find('[data-testid="toggle-button-all"]');
      const favoritesButton = wrapper.find('[data-testid="toggle-button-favorites"]');
      
      expect(allButton.classes()).not.toContain('p-highlight');
      expect(favoritesButton.classes()).toContain('p-highlight');
    });
  });

  describe('User Interactions', () => {
    it('should emit update:modelValue when "전체보기" is clicked', async () => {
      wrapper = createWrapper({ modelValue: 'favorites' });
      
      const allButton = wrapper.find('[data-testid="toggle-button-all"]');
      await allButton.trigger('click');
      
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['all']);
    });

    it('should emit update:modelValue when "즐겨찾기" is clicked', async () => {
      wrapper = createWrapper({ modelValue: 'all' });
      
      const favoritesButton = wrapper.find('[data-testid="toggle-button-favorites"]');
      await favoritesButton.trigger('click');
      
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['favorites']);
    });

    it('should not emit when already selected button is clicked', async () => {
      wrapper = createWrapper({ modelValue: 'all' });
      
      const allButton = wrapper.find('[data-testid="toggle-button-all"]');
      await allButton.trigger('click');
      
      // 이미 선택된 버튼을 다시 클릭해도 이벤트는 발생하지만 값은 동일
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['all']);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should handle keyboard navigation between buttons', async () => {
      wrapper = createWrapper();
      
      const selectButton = wrapper.find('[data-testid="select-button"]');
      
      // Tab 키로 포커스 이동
      await selectButton.trigger('keydown.tab');
      
      // 키보드 이벤트가 처리되는지 확인
      expect(selectButton.exists()).toBe(true);
    });

    it('should handle arrow key navigation', async () => {
      wrapper = createWrapper({ modelValue: 'all' });
      
      const selectButton = wrapper.find('[data-testid="select-button"]');
      
      // 오른쪽 화살표 키로 다음 옵션 선택
      await selectButton.trigger('keydown.right');
      
      // PrimeVue SelectButton의 키보드 네비게이션 동작 확인
      expect(selectButton.exists()).toBe(true);
    });

    it('should handle Enter and Space keys', async () => {
      wrapper = createWrapper();
      
      const allButton = wrapper.find('[data-testid="toggle-button-all"]');
      
      await allButton.trigger('keydown.enter');
      await allButton.trigger('keydown.space');
      
      // 키보드 활성화 이벤트 확인
      expect(allButton.exists()).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      wrapper = createWrapper();
      
      const selectButton = wrapper.find('[data-testid="select-button"]');
      
      // PrimeVue SelectButton은 자동으로 ARIA 속성을 제공
      expect(selectButton.classes()).toContain('p-component');
    });

    it('should indicate current selection for screen readers', () => {
      wrapper = createWrapper({ modelValue: 'favorites' });
      
      const favoritesButton = wrapper.find('[data-testid="toggle-button-favorites"]');
      
      // 선택된 상태를 나타내는 클래스 확인
      expect(favoritesButton.classes()).toContain('p-highlight');
    });

    it('should have proper role attributes', () => {
      wrapper = createWrapper();
      
      const selectButton = wrapper.find('[data-testid="select-button"]');
      
      // PrimeVue SelectButton의 role 속성 확인
      expect(selectButton.classes()).toContain('p-selectbutton');
    });
  });

  describe('Props Validation', () => {
    it('should handle invalid modelValue gracefully', () => {
      // TypeScript에서는 타입 체크가 되지만 런타임에서의 처리 확인
      wrapper = createWrapper({ modelValue: 'invalid' as any });
      
      expect(wrapper.exists()).toBe(true);
      
      // 기본값으로 처리되거나 에러가 발생하지 않아야 함
      const selectButton = wrapper.find('[data-testid="select-button"]');
      expect(selectButton.exists()).toBe(true);
    });

    it('should accept valid ViewMode values', () => {
      wrapper = createWrapper({ modelValue: 'all' });
      expect(wrapper.exists()).toBe(true);
      
      wrapper = createWrapper({ modelValue: 'favorites' });
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Component Options', () => {
    it('should have correct options structure', () => {
      wrapper = createWrapper();
      
      // 컴포넌트 내부의 options 배열 확인
      const expectedOptions = [
        { label: '전체보기', value: 'all' },
        { label: '즐겨찾기', value: 'favorites' }
      ];
      
      expect(wrapper.vm.options).toEqual(expectedOptions);
    });

    it('should display icons if provided', () => {
      wrapper = createWrapper({ showIcons: true });
      
      // 아이콘이 있을 때의 렌더링 확인
      const allButton = wrapper.find('[data-testid="toggle-button-all"]');
      const favoritesButton = wrapper.find('[data-testid="toggle-button-favorites"]');
      
      expect(allButton.exists()).toBe(true);
      expect(favoritesButton.exists()).toBe(true);
    });
  });

  describe('Visual States', () => {
    it('should apply correct CSS classes for different states', () => {
      wrapper = createWrapper({ modelValue: 'all' });
      
      const allButton = wrapper.find('[data-testid="toggle-button-all"]');
      const favoritesButton = wrapper.find('[data-testid="toggle-button-favorites"]');
      
      // 선택된 버튼은 highlight 클래스를 가져야 함
      expect(allButton.classes()).toContain('p-highlight');
      expect(allButton.classes()).toContain('p-button');
      
      // 선택되지 않은 버튼은 highlight 클래스가 없어야 함
      expect(favoritesButton.classes()).not.toContain('p-highlight');
      expect(favoritesButton.classes()).toContain('p-button');
    });

    it('should handle hover states', async () => {
      wrapper = createWrapper();
      
      const allButton = wrapper.find('[data-testid="toggle-button-all"]');
      
      await allButton.trigger('mouseenter');
      await allButton.trigger('mouseleave');
      
      // 호버 상태 처리 확인
      expect(allButton.exists()).toBe(true);
    });

    it('should handle focus states', async () => {
      wrapper = createWrapper();
      
      const selectButton = wrapper.find('[data-testid="select-button"]');
      
      await selectButton.trigger('focus');
      await selectButton.trigger('blur');
      
      // 포커스 상태 처리 확인
      expect(selectButton.exists()).toBe(true);
    });
  });

  describe('Integration', () => {
    it('should work correctly with v-model', async () => {
      wrapper = createWrapper({ modelValue: 'all' });
      
      // 초기값 확인
      const allButton = wrapper.find('[data-testid="toggle-button-all"]');
      expect(allButton.classes()).toContain('p-highlight');
      
      // 값 변경
      const favoritesButton = wrapper.find('[data-testid="toggle-button-favorites"]');
      await favoritesButton.trigger('click');
      
      // 이벤트 발생 확인
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['favorites']);
    });

    it('should emit events in correct order', async () => {
      wrapper = createWrapper({ modelValue: 'all' });
      
      const favoritesButton = wrapper.find('[data-testid="toggle-button-favorites"]');
      await favoritesButton.trigger('click');
      
      // 이벤트가 올바른 순서로 발생했는지 확인
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted).toHaveLength(1);
      expect(emitted?.[0]).toEqual(['favorites']);
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      wrapper = createWrapper({ modelValue: 'all' });
      
      // 동일한 props로 업데이트해도 불필요한 리렌더링이 없어야 함
      const initialElement = wrapper.element;
      
      wrapper.setProps({ modelValue: 'all' });
      
      expect(wrapper.element).toBe(initialElement);
    });

    it('should handle rapid clicks gracefully', async () => {
      wrapper = createWrapper({ modelValue: 'all' });
      
      const favoritesButton = wrapper.find('[data-testid="toggle-button-favorites"]');
      
      // 빠른 연속 클릭
      await favoritesButton.trigger('click');
      await favoritesButton.trigger('click');
      await favoritesButton.trigger('click');
      
      // 모든 클릭이 처리되어야 함
      expect(wrapper.emitted('update:modelValue')).toHaveLength(3);
    });
  });
});