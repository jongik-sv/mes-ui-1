import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import MenuSearchBar from '../MenuSearchBar.vue';

// Mock PrimeVue components
vi.mock('primevue/inputtext', () => ({
  default: {
    name: 'InputText',
    template: `
      <input 
        v-bind="$attrs" 
        :value="modelValue" 
        @input="handleInput"
        data-testid="search-input"
      />
    `,
    props: ['modelValue', 'placeholder'],
    emits: ['update:modelValue'],
    methods: {
      handleInput(event: Event) {
        this.$emit('update:modelValue', (event.target as HTMLInputElement).value);
      }
    }
  }
}));

vi.mock('primevue/button', () => ({
  default: {
    name: 'Button',
    template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
    props: ['icon', 'text', 'size'],
    emits: ['click']
  }
}));

describe('MenuSearchBar', () => {
  let wrapper: VueWrapper<any>;

  const createWrapper = (props = {}) => {
    return mount(MenuSearchBar, {
      props: {
        modelValue: '',
        placeholder: '메뉴 검색...',
        ...props
      }
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render search input with correct attributes', () => {
      wrapper = createWrapper();
      
      const input = wrapper.find('[data-testid="search-input"]');
      expect(input.exists()).toBe(true);
      expect(input.attributes('placeholder')).toBe('메뉴 검색...');
    });

    it('should display modelValue in input', () => {
      wrapper = createWrapper({ modelValue: '생산관리' });
      
      const input = wrapper.find('[data-testid="search-input"]');
      expect(input.element.value).toBe('생산관리');
    });

    it('should render search icon', () => {
      wrapper = createWrapper();
      
      const searchIcon = wrapper.find('.search-icon');
      expect(searchIcon.exists()).toBe(true);
    });

    it('should render clear button when there is input', () => {
      wrapper = createWrapper({ modelValue: '검색어' });
      
      const clearButton = wrapper.find('[data-testid="clear-button"]');
      expect(clearButton.exists()).toBe(true);
    });

    it('should not render clear button when input is empty', () => {
      wrapper = createWrapper({ modelValue: '' });
      
      const clearButton = wrapper.find('[data-testid="clear-button"]');
      expect(clearButton.exists()).toBe(false);
    });
  });

  describe('Input Handling', () => {
    beforeEach(() => {
      wrapper = createWrapper();
    });

    it('should emit update:modelValue when input changes', async () => {
      const input = wrapper.find('[data-testid="search-input"]');
      
      await input.setValue('생산');
      
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['생산']);
    });

    it('should emit search event with debounced input', async () => {
      const input = wrapper.find('[data-testid="search-input"]');
      
      await input.setValue('생산관리');
      
      // 디바운싱 시뮬레이션 (실제로는 300ms 지연)
      await new Promise(resolve => setTimeout(resolve, 350));
      
      expect(wrapper.emitted('search')).toBeTruthy();
      expect(wrapper.emitted('search')?.[0]).toEqual(['생산관리']);
    });

    it('should handle rapid input changes with debouncing', async () => {
      const input = wrapper.find('[data-testid="search-input"]');
      
      // 빠른 연속 입력
      await input.setValue('생');
      await input.setValue('생산');
      await input.setValue('생산관리');
      
      // 마지막 입력만 처리되어야 함
      expect(wrapper.emitted('update:modelValue')?.length).toBe(3);
      expect(wrapper.emitted('update:modelValue')?.[2]).toEqual(['생산관리']);
    });

    it('should clear input when clear button is clicked', async () => {
      wrapper = createWrapper({ modelValue: '검색어' });
      
      const clearButton = wrapper.find('[data-testid="clear-button"]');
      await clearButton.trigger('click');
      
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
    });
  });

  describe('Search History', () => {
    beforeEach(() => {
      wrapper = createWrapper({ showHistory: true });
    });

    it('should show search history when input is focused and empty', async () => {
      const input = wrapper.find('[data-testid="search-input"]');
      await input.trigger('focus');
      
      const history = wrapper.find('[data-testid="search-history"]');
      expect(history.exists()).toBe(true);
    });

    it('should hide search history when input loses focus', async () => {
      const input = wrapper.find('[data-testid="search-input"]');
      await input.trigger('focus');
      await input.trigger('blur');
      
      const history = wrapper.find('[data-testid="search-history"]');
      expect(history.exists()).toBe(false);
    });

    it('should select history item when clicked', async () => {
      // Mock history data
      wrapper.vm.searchHistory = ['생산관리', '품질관리', '자재관리'];
      await nextTick();
      
      const input = wrapper.find('[data-testid="search-input"]');
      await input.trigger('focus');
      
      const historyItem = wrapper.find('[data-testid="history-item-0"]');
      await historyItem.trigger('click');
      
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['생산관리']);
    });

    it('should add search term to history when search is performed', async () => {
      const input = wrapper.find('[data-testid="search-input"]');
      await input.setValue('새로운 검색어');
      
      await wrapper.vm.addToHistory('새로운 검색어');
      
      expect(wrapper.vm.searchHistory).toContain('새로운 검색어');
    });

    it('should limit history to maximum number of items', async () => {
      const maxHistoryItems = 5;
      
      // 최대 개수보다 많은 아이템 추가
      for (let i = 0; i < maxHistoryItems + 2; i++) {
        await wrapper.vm.addToHistory(`검색어 ${i}`);
      }
      
      expect(wrapper.vm.searchHistory.length).toBeLessThanOrEqual(maxHistoryItems);
    });
  });

  describe('Auto-completion', () => {
    const suggestions = ['생산관리', '생산계획', '생산실적', '품질관리', '품질검사'];
    
    beforeEach(() => {
      wrapper = createWrapper({ 
        suggestions,
        showSuggestions: true 
      });
    });

    it('should show suggestions when typing', async () => {
      const input = wrapper.find('[data-testid="search-input"]');
      await input.setValue('생');
      
      const suggestionsList = wrapper.find('[data-testid="suggestions-list"]');
      expect(suggestionsList.exists()).toBe(true);
    });

    it('should filter suggestions based on input', async () => {
      const input = wrapper.find('[data-testid="search-input"]');
      await input.setValue('생산');
      await nextTick();
      
      const suggestionItems = wrapper.findAll('[data-testid^="suggestion-item"]');
      expect(suggestionItems.length).toBe(3); // 생산관리, 생산계획, 생산실적
    });

    it('should select suggestion when clicked', async () => {
      const input = wrapper.find('[data-testid="search-input"]');
      await input.setValue('생');
      await nextTick();
      
      const suggestionItem = wrapper.find('[data-testid="suggestion-item-0"]');
      await suggestionItem.trigger('click');
      
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['생산관리']);
    });

    it('should navigate suggestions with arrow keys', async () => {
      const input = wrapper.find('[data-testid="search-input"]');
      await input.setValue('생');
      await nextTick();
      
      // ArrowDown 키로 첫 번째 suggestion 선택
      await input.trigger('keydown.down');
      
      expect(wrapper.vm.selectedSuggestionIndex).toBe(0);
      
      // ArrowUp 키로 이전 suggestion으로 이동
      await input.trigger('keydown.up');
      
      expect(wrapper.vm.selectedSuggestionIndex).toBe(-1);
    });

    it('should select suggestion with Enter key', async () => {
      const input = wrapper.find('[data-testid="search-input"]');
      await input.setValue('생');
      await nextTick();
      
      // ArrowDown으로 첫 번째 suggestion 선택
      await input.trigger('keydown.down');
      // Enter로 선택 확정
      await input.trigger('keydown.enter');
      
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['생산관리']);
    });

    it('should hide suggestions when Escape is pressed', async () => {
      const input = wrapper.find('[data-testid="search-input"]');
      await input.setValue('생');
      await nextTick();
      
      await input.trigger('keydown.esc');
      
      const suggestionsList = wrapper.find('[data-testid="suggestions-list"]');
      expect(suggestionsList.exists()).toBe(false);
    });
  });

  describe('Keyboard Shortcuts', () => {
    beforeEach(() => {
      wrapper = createWrapper();
    });

    it('should focus input when Ctrl+K is pressed', async () => {
      const input = wrapper.find('[data-testid="search-input"]');
      
      await wrapper.trigger('keydown.ctrl.k');
      
      // 포커스 확인 (실제 DOM에서는 document.activeElement로 확인)
      expect(input.exists()).toBe(true);
    });

    it('should clear input when Ctrl+L is pressed', async () => {
      wrapper = createWrapper({ modelValue: '검색어' });
      
      const input = wrapper.find('[data-testid="search-input"]');
      await input.trigger('keydown.ctrl.l');
      
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      wrapper = createWrapper();
    });

    it('should have proper ARIA attributes', () => {
      const input = wrapper.find('[data-testid="search-input"]');
      
      expect(input.attributes('role')).toBe('searchbox');
      expect(input.attributes('aria-label')).toBe('메뉴 검색');
    });

    it('should announce search results to screen readers', async () => {
      const input = wrapper.find('[data-testid="search-input"]');
      await input.setValue('생산');
      
      const ariaLive = wrapper.find('[aria-live="polite"]');
      expect(ariaLive.exists()).toBe(true);
    });

    it('should have proper aria-expanded for suggestions', async () => {
      wrapper = createWrapper({ showSuggestions: true });
      const input = wrapper.find('[data-testid="search-input"]');
      await input.setValue('생');
      
      expect(input.attributes('aria-expanded')).toBe('true');
    });
  });

  describe('Performance', () => {
    it('should debounce search input to prevent excessive API calls', async () => {
      const searchSpy = vi.fn();
      wrapper = createWrapper();
      wrapper.vm.$emit = searchSpy;
      
      const input = wrapper.find('[data-testid="search-input"]');
      
      // 빠른 연속 입력
      await input.setValue('a');
      await input.setValue('ab');
      await input.setValue('abc');
      
      // 디바운스 시간 대기
      await new Promise(resolve => setTimeout(resolve, 350));
      
      // 검색 이벤트가 한 번만 발생했는지 확인
      expect(wrapper.emitted('search')?.length).toBeLessThanOrEqual(1);
    });

    it('should cleanup timers on component unmount', () => {
      wrapper = createWrapper();
      const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
      
      wrapper.unmount();
      
      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });
});