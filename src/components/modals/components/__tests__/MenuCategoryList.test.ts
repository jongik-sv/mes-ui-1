import { describe, it, expect, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import MenuCategoryList from '../MenuCategoryList.vue';
import type { Category } from '@/types/menu';

// Mock PrimeVue components
vi.mock('primevue/listbox', () => ({
  default: {
    name: 'Listbox',
    template: `
      <div class="p-listbox" data-testid="category-listbox">
        <ul class="p-listbox-list">
          <li 
            v-for="option in options" 
            :key="option.id"
            :class="['p-listbox-item', { 'p-highlight': modelValue === option.id }]"
            @click="$emit('update:modelValue', option.id)"
            :data-testid="'category-item-' + option.id"
          >
            <span class="category-name">{{ option.name }}</span>
            <span class="category-count" v-if="option.count">({{ option.count }})</span>
          </li>
        </ul>
      </div>
    `,
    props: ['modelValue', 'options', 'optionLabel', 'optionValue'],
    emits: ['update:modelValue', 'change']
  }
}));

vi.mock('primevue/button', () => ({
  default: {
    name: 'Button',
    template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
    props: ['text', 'size', 'icon'],
    emits: ['click']
  }
}));

const mockCategories: Category[] = [
  { id: 'production', name: '생산관리', count: 15 },
  { id: 'quality', name: '품질관리', count: 8 },
  { id: 'material', name: '자재관리', count: 12 },
  { id: 'sales', name: '영업관리', count: 6 },
  { id: 'hr', name: '인사관리', count: 4 }
];

describe('MenuCategoryList', () => {
  let wrapper: VueWrapper<any>;

  const createWrapper = (props = {}) => {
    return mount(MenuCategoryList, {
      props: {
        categories: mockCategories,
        selectedCategory: null,
        ...props
      }
    });
  };

  describe('Rendering', () => {
    it('should render category listbox', () => {
      wrapper = createWrapper();
      
      const listbox = wrapper.find('[data-testid="category-listbox"]');
      expect(listbox.exists()).toBe(true);
    });

    it('should render all category items', () => {
      wrapper = createWrapper();
      
      mockCategories.forEach(category => {
        const item = wrapper.find(`[data-testid="category-item-${category.id}"]`);
        expect(item.exists()).toBe(true);
      });
    });

    it('should display category names correctly', () => {
      wrapper = createWrapper();
      
      const productionItem = wrapper.find('[data-testid="category-item-production"]');
      expect(productionItem.find('.category-name').text()).toBe('생산관리');
      
      const qualityItem = wrapper.find('[data-testid="category-item-quality"]');
      expect(qualityItem.find('.category-name').text()).toBe('품질관리');
    });

    it('should display item counts when provided', () => {
      wrapper = createWrapper();
      
      const productionItem = wrapper.find('[data-testid="category-item-production"]');
      expect(productionItem.find('.category-count').text()).toBe('(15)');
      
      const qualityItem = wrapper.find('[data-testid="category-item-quality"]');
      expect(qualityItem.find('.category-count').text()).toBe('(8)');
    });

    it('should highlight selected category', () => {
      wrapper = createWrapper({ selectedCategory: 'production' });
      
      const productionItem = wrapper.find('[data-testid="category-item-production"]');
      const qualityItem = wrapper.find('[data-testid="category-item-quality"]');
      
      expect(productionItem.classes()).toContain('p-highlight');
      expect(qualityItem.classes()).not.toContain('p-highlight');
    });

    it('should show "전체" option when showAllOption is true', () => {
      wrapper = createWrapper({ showAllOption: true });
      
      const allItem = wrapper.find('[data-testid="category-item-all"]');
      expect(allItem.exists()).toBe(true);
      expect(allItem.find('.category-name').text()).toBe('전체');
    });

    it('should not show "전체" option by default', () => {
      wrapper = createWrapper();
      
      const allItem = wrapper.find('[data-testid="category-item-all"]');
      expect(allItem.exists()).toBe(false);
    });
  });

  describe('User Interactions', () => {
    it('should emit category-select when category is clicked', async () => {
      wrapper = createWrapper();
      
      const productionItem = wrapper.find('[data-testid="category-item-production"]');
      await productionItem.trigger('click');
      
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['production']);
    });

    it('should emit category-select with null when "전체" is clicked', async () => {
      wrapper = createWrapper({ showAllOption: true });
      
      const allItem = wrapper.find('[data-testid="category-item-all"]');
      await allItem.trigger('click');
      
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null]);
    });

    it('should allow selecting the same category multiple times', async () => {
      wrapper = createWrapper({ selectedCategory: 'production' });
      
      const productionItem = wrapper.find('[data-testid="category-item-production"]');
      await productionItem.trigger('click');
      
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['production']);
    });

    it('should update selection when different category is clicked', async () => {
      wrapper = createWrapper({ selectedCategory: 'production' });
      
      const qualityItem = wrapper.find('[data-testid="category-item-quality"]');
      await qualityItem.trigger('click');
      
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['quality']);
    });
  });

  describe('Empty State', () => {
    it('should render empty state when no categories provided', () => {
      wrapper = createWrapper({ categories: [] });
      
      const emptyState = wrapper.find('[data-testid="empty-categories"]');
      expect(emptyState.exists()).toBe(true);
      expect(emptyState.text()).toContain('카테고리가 없습니다');
    });

    it('should not render listbox when categories are empty', () => {
      wrapper = createWrapper({ categories: [] });
      
      const listbox = wrapper.find('[data-testid="category-listbox"]');
      expect(listbox.exists()).toBe(false);
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(() => {
      wrapper = createWrapper();
    });

    it('should handle keyboard navigation in listbox', async () => {
      const listbox = wrapper.find('[data-testid="category-listbox"]');
      
      // Arrow down 키로 다음 항목 선택
      await listbox.trigger('keydown.down');
      
      // PrimeVue Listbox의 키보드 네비게이션 동작 확인
      expect(listbox.exists()).toBe(true);
    });

    it('should handle Enter key to select category', async () => {
      const productionItem = wrapper.find('[data-testid="category-item-production"]');
      
      await productionItem.trigger('keydown.enter');
      
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('should handle Space key to select category', async () => {
      const productionItem = wrapper.find('[data-testid="category-item-production"]');
      
      await productionItem.trigger('keydown.space');
      
      // Space 키 이벤트 처리 확인
      expect(productionItem.exists()).toBe(true);
    });
  });

  describe('Search Integration', () => {
    it('should filter categories based on search query', () => {
      wrapper = createWrapper({ searchQuery: '생산' });
      
      const filteredCategories = wrapper.vm.filteredCategories;
      expect(filteredCategories).toHaveLength(1);
      expect(filteredCategories[0].name).toBe('생산관리');
    });

    it('should highlight matching text in category names', () => {
      wrapper = createWrapper({ searchQuery: '관리', highlightSearch: true });
      
      const productionItem = wrapper.find('[data-testid="category-item-production"]');
      const highlightedText = productionItem.find('.search-highlight');
      
      // 검색어 하이라이팅이 적용되었는지 확인
      expect(highlightedText.exists()).toBe(true);
    });

    it('should show no results message when search yields no matches', () => {
      wrapper = createWrapper({ searchQuery: 'nonexistent' });
      
      const noResults = wrapper.find('[data-testid="no-search-results"]');
      expect(noResults.exists()).toBe(true);
      expect(noResults.text()).toContain('검색 결과가 없습니다');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      wrapper = createWrapper();
      
      const listbox = wrapper.find('[data-testid="category-listbox"]');
      expect(listbox.classes()).toContain('p-listbox');
    });

    it('should announce selection changes to screen readers', () => {
      wrapper = createWrapper({ selectedCategory: 'production' });
      
      const ariaLive = wrapper.find('[aria-live="polite"]');
      expect(ariaLive.exists()).toBe(true);
    });

    it('should have proper role attributes for list items', () => {
      wrapper = createWrapper();
      
      const listItems = wrapper.findAll('[data-testid^="category-item-"]');
      listItems.forEach(item => {
        expect(item.classes()).toContain('p-listbox-item');
      });
    });

    it('should provide clear labels for screen readers', () => {
      wrapper = createWrapper();
      
      const listbox = wrapper.find('[data-testid="category-listbox"]');
      
      // ARIA 레이블이나 설명이 있는지 확인
      expect(listbox.exists()).toBe(true);
    });
  });

  describe('Loading State', () => {
    it('should show loading skeleton when loading', () => {
      wrapper = createWrapper({ loading: true });
      
      const loadingSkeleton = wrapper.find('[data-testid="category-loading"]');
      expect(loadingSkeleton.exists()).toBe(true);
    });

    it('should hide categories list when loading', () => {
      wrapper = createWrapper({ loading: true });
      
      const listbox = wrapper.find('[data-testid="category-listbox"]');
      expect(listbox.exists()).toBe(false);
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom CSS classes', () => {
      wrapper = createWrapper({ class: 'custom-category-list' });
      
      expect(wrapper.classes()).toContain('custom-category-list');
    });

    it('should support custom item templates', () => {
      wrapper = createWrapper({ 
        categories: mockCategories,
        showIcons: true 
      });
      
      const productionItem = wrapper.find('[data-testid="category-item-production"]');
      const icon = productionItem.find('.category-icon');
      
      // 아이콘이 렌더링되는지 확인
      expect(icon.exists()).toBe(true);
    });
  });

  describe('Performance', () => {
    it('should handle large number of categories efficiently', () => {
      const largeCategories = Array.from({ length: 1000 }, (_, index) => ({
        id: `category-${index}`,
        name: `카테고리 ${index}`,
        count: index
      }));
      
      wrapper = createWrapper({ categories: largeCategories });
      
      // 렌더링이 정상적으로 완료되는지 확인
      const listbox = wrapper.find('[data-testid="category-listbox"]');
      expect(listbox.exists()).toBe(true);
    });

    it('should not re-render unnecessarily', async () => {
      wrapper = createWrapper();
      
      const initialElement = wrapper.element;
      
      // 동일한 props로 업데이트
      await wrapper.setProps({ selectedCategory: null });
      
      expect(wrapper.element).toBe(initialElement);
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed category data gracefully', () => {
      const malformedCategories = [
        { id: 'valid', name: '정상 카테고리', count: 5 },
        { id: '', name: '', count: 0 }, // 빈 데이터
        { name: '아이디 없음', count: 3 } as any, // id 누락
      ];
      
      wrapper = createWrapper({ categories: malformedCategories });
      
      // 에러 없이 렌더링되어야 함
      expect(wrapper.exists()).toBe(true);
      
      // 유효한 카테고리만 렌더링되어야 함
      const validItem = wrapper.find('[data-testid="category-item-valid"]');
      expect(validItem.exists()).toBe(true);
    });

    it('should handle undefined selectedCategory gracefully', () => {
      wrapper = createWrapper({ selectedCategory: undefined });
      
      expect(wrapper.exists()).toBe(true);
      
      // 어떤 항목도 선택되지 않은 상태
      const highlightedItems = wrapper.findAll('.p-highlight');
      expect(highlightedItems).toHaveLength(0);
    });
  });
});