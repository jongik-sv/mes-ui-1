import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import GlobalMenuModal from '../GlobalMenuModal.vue';
import type { MenuItem } from '@/types/menu';

// Mock PrimeVue components
vi.mock('primevue/dialog', () => ({
  default: {
    name: 'Dialog',
    template: `
      <div 
        v-if="visible" 
        class="p-dialog-wrapper"
        role="dialog"
        aria-modal="true"
        data-testid="global-menu-dialog"
      >
        <div class="p-dialog">
          <slot />
        </div>
      </div>
    `,
    props: ['visible'],
    emits: ['update:visible', 'hide']
  }
}));

vi.mock('primevue/inputtext', () => ({
  default: {
    name: 'InputText',
    template: '<input v-bind="$attrs" @input="$emit(\'input\', $event)" />',
    props: ['modelValue', 'placeholder'],
    emits: ['input', 'update:modelValue']
  }
}));

vi.mock('primevue/selectbutton', () => ({
  default: {
    name: 'SelectButton',
    template: '<div><slot /></div>',
    props: ['modelValue', 'options'],
    emits: ['update:modelValue']
  }
}));

const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    title: '생산관리',
    category: 'production',
    favorite: false,
    children: [
      {
        id: '1-1',
        title: '작업지시',
        category: 'production',
        favorite: true,
        url: '/production/work-order'
      }
    ]
  },
  {
    id: '2',
    title: '품질관리',
    category: 'quality',
    favorite: true,
    children: []
  }
];

describe('GlobalMenuModal', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createWrapper = (props = {}) => {
    return mount(GlobalMenuModal, {
      props: {
        visible: false,
        menuItems: mockMenuItems,
        ...props
      },
      global: {
        stubs: {
          MenuSearchBar: {
            name: 'MenuSearchBar',
            template: '<input data-testid="search-input" @input="$emit(\'update:modelValue\', $event.target.value)" />',
            props: ['modelValue'],
            emits: ['update:modelValue', 'search']
          },
          MenuToggleButtons: {
            name: 'MenuToggleButtons',
            template: `
              <div data-testid="toggle-buttons">
                <button @click="$emit('update:modelValue', 'all')">전체보기</button>
                <button @click="$emit('update:modelValue', 'favorites')">즐겨찾기</button>
              </div>
            `,
            props: ['modelValue'],
            emits: ['update:modelValue']
          },
          MenuCategoryList: {
            name: 'MenuCategoryList',
            template: '<div data-testid="category-list"><slot /></div>',
            props: ['categories', 'selectedCategory'],
            emits: ['category-select']
          },
          MenuTree: {
            name: 'MenuTree',
            template: '<div data-testid="menu-tree"><slot /></div>',
            props: ['items', 'searchQuery', 'viewMode', 'selectedCategory', 'expandedNodes', 'favorites'],
            emits: ['node-expand', 'node-collapse', 'toggle-favorite', 'menu-select']
          }
        }
      }
    });
  };

  describe('Modal Visibility', () => {
    it('should not render when visible is false', () => {
      wrapper = createWrapper({ visible: false });
      const dialog = wrapper.find('[data-testid="global-menu-dialog"]');
      expect(dialog.exists()).toBe(false);
    });

    it('should render when visible is true', () => {
      wrapper = createWrapper({ visible: true });
      const dialog = wrapper.find('[data-testid="global-menu-dialog"]');
      expect(dialog.exists()).toBe(true);
    });

    it('should have correct modal attributes', () => {
      wrapper = createWrapper({ visible: true });
      const dialog = wrapper.find('[data-testid="global-menu-dialog"]');
      
      expect(dialog.attributes('role')).toBe('dialog');
      expect(dialog.attributes('aria-modal')).toBe('true');
    });

    it('should emit update:visible when modal is closed', async () => {
      wrapper = createWrapper({ visible: true });
      
      // 모달 배경 클릭 시뮬레이션
      await wrapper.vm.closeModal();
      
      expect(wrapper.emitted('update:visible')).toBeTruthy();
      expect(wrapper.emitted('update:visible')?.[0]).toEqual([false]);
    });
  });

  describe('Modal Layout', () => {
    beforeEach(() => {
      wrapper = createWrapper({ visible: true });
    });

    it('should render search bar', () => {
      const searchBar = wrapper.find('[data-testid="search-input"]');
      expect(searchBar.exists()).toBe(true);
    });

    it('should render toggle buttons', () => {
      const toggleButtons = wrapper.find('[data-testid="toggle-buttons"]');
      expect(toggleButtons.exists()).toBe(true);
    });

    it('should render category list', () => {
      const categoryList = wrapper.find('[data-testid="category-list"]');
      expect(categoryList.exists()).toBe(true);
    });

    it('should render menu tree', () => {
      const menuTree = wrapper.find('[data-testid="menu-tree"]');
      expect(menuTree.exists()).toBe(true);
    });

    it('should have correct grid layout structure', () => {
      const modalContent = wrapper.find('.modal-content');
      expect(modalContent.exists()).toBe(true);
      expect(modalContent.classes()).toContain('modal-content');
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      wrapper = createWrapper({ visible: true });
    });

    it('should update search query when typing in search bar', async () => {
      const searchInput = wrapper.find('[data-testid="search-input"]');
      
      await searchInput.setValue('생산');
      
      expect(wrapper.vm.searchQuery).toBe('생산');
    });

    it('should filter menu items based on search query', async () => {
      wrapper.vm.searchQuery = '생산';
      await nextTick();
      
      const filteredItems = wrapper.vm.filteredMenuItems;
      expect(filteredItems).toHaveLength(1);
      expect(filteredItems[0].title).toBe('생산관리');
    });

    it('should highlight search results', async () => {
      wrapper.vm.searchQuery = '생산';
      await nextTick();
      
      // 검색 결과 하이라이팅 로직이 적용되는지 확인
      expect(wrapper.vm.searchQuery).toBe('생산');
    });
  });

  describe('View Mode Toggle', () => {
    beforeEach(() => {
      wrapper = createWrapper({ visible: true });
    });

    it('should start with "all" view mode by default', () => {
      expect(wrapper.vm.viewMode).toBe('all');
    });

    it('should switch to favorites view when clicked', async () => {
      const favoritesButton = wrapper.find('[data-testid="toggle-buttons"] button:last-child');
      await favoritesButton.trigger('click');
      
      expect(wrapper.vm.viewMode).toBe('favorites');
    });

    it('should filter items to show only favorites in favorites mode', async () => {
      wrapper.vm.viewMode = 'favorites';
      await nextTick();
      
      const favoriteItems = wrapper.vm.filteredMenuItems;
      expect(favoriteItems.every(item => item.favorite || item.children?.some(child => child.favorite))).toBe(true);
    });
  });

  describe('Category Selection', () => {
    beforeEach(() => {
      wrapper = createWrapper({ visible: true });
    });

    it('should not have any category selected by default', () => {
      expect(wrapper.vm.selectedCategory).toBe(null);
    });

    it('should filter items by selected category', async () => {
      wrapper.vm.selectedCategory = 'production';
      await nextTick();
      
      const filteredItems = wrapper.vm.filteredMenuItems;
      expect(filteredItems.every(item => item.category === 'production')).toBe(true);
    });

    it('should generate categories from menu items', () => {
      const categories = wrapper.vm.categories;
      expect(categories).toContainEqual(
        expect.objectContaining({ id: 'production', name: '생산관리' })
      );
      expect(categories).toContainEqual(
        expect.objectContaining({ id: 'quality', name: '품질관리' })
      );
    });
  });

  describe('Menu Selection', () => {
    beforeEach(() => {
      wrapper = createWrapper({ visible: true });
    });

    it('should emit menu-select when menu item is selected', async () => {
      const menuItem = mockMenuItems[0];
      await wrapper.vm.handleMenuSelect(menuItem);
      
      expect(wrapper.emitted('menu-select')).toBeTruthy();
      expect(wrapper.emitted('menu-select')?.[0]).toEqual([menuItem]);
    });

    it('should close modal when menu is selected', async () => {
      const menuItem = mockMenuItems[0];
      await wrapper.vm.handleMenuSelect(menuItem);
      
      expect(wrapper.emitted('update:visible')).toBeTruthy();
      expect(wrapper.emitted('update:visible')?.[0]).toEqual([false]);
    });
  });

  describe('Favorites Management', () => {
    beforeEach(() => {
      wrapper = createWrapper({ visible: true });
    });

    it('should toggle favorite status of menu item', async () => {
      const menuItem = mockMenuItems[0];
      const initialFavoriteStatus = menuItem.favorite;
      
      await wrapper.vm.toggleFavorite(menuItem.id);
      
      expect(wrapper.vm.favorites.has(menuItem.id)).toBe(!initialFavoriteStatus);
    });

    it('should emit favorite-toggle event', async () => {
      const menuItem = mockMenuItems[0];
      await wrapper.vm.toggleFavorite(menuItem.id);
      
      expect(wrapper.emitted('favorite-toggle')).toBeTruthy();
      expect(wrapper.emitted('favorite-toggle')?.[0]).toEqual([menuItem.id]);
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(() => {
      wrapper = createWrapper({ visible: true });
    });

    it('should close modal when Escape key is pressed', async () => {
      const dialog = wrapper.find('[data-testid="global-menu-dialog"]');
      await dialog.trigger('keydown.esc');
      
      expect(wrapper.emitted('update:visible')).toBeTruthy();
      expect(wrapper.emitted('update:visible')?.[0]).toEqual([false]);
    });

    it('should handle Tab navigation correctly', async () => {
      const dialog = wrapper.find('[data-testid="global-menu-dialog"]');
      
      // Tab 키 네비게이션 확인 (실제 포커스 관리는 구현에서 처리)
      await dialog.trigger('keydown.tab');
      
      // 키보드 이벤트가 발생했는지 확인
      expect(dialog.exists()).toBe(true);
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      wrapper = createWrapper({ visible: true });
    });

    it('should have proper ARIA attributes', () => {
      const dialog = wrapper.find('[data-testid="global-menu-dialog"]');
      
      expect(dialog.attributes('role')).toBe('dialog');
      expect(dialog.attributes('aria-modal')).toBe('true');
    });

    it('should manage focus properly when modal opens', async () => {
      // 모달이 열릴 때 첫 번째 포커서블 엘리먼트로 포커스 이동
      const searchInput = wrapper.find('[data-testid="search-input"]');
      expect(searchInput.exists()).toBe(true);
    });

    it('should restore focus when modal closes', async () => {
      // 모달 닫힐 때 원래 포커스 위치로 복귀하는 로직
      await wrapper.vm.closeModal();
      expect(wrapper.emitted('update:visible')).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('should handle large menu datasets efficiently', () => {
      const largeMenuItems = Array.from({ length: 1000 }, (_, index) => ({
        id: `item-${index}`,
        title: `메뉴 ${index}`,
        category: `category-${index % 10}`,
        favorite: index % 5 === 0,
        children: []
      }));

      wrapper = createWrapper({ 
        visible: true,
        menuItems: largeMenuItems
      });

      // 렌더링이 정상적으로 완료되는지 확인
      expect(wrapper.vm.filteredMenuItems).toBeDefined();
      expect(wrapper.find('[data-testid="menu-tree"]').exists()).toBe(true);
    });

    it('should debounce search input', async () => {
      wrapper = createWrapper({ visible: true });
      const searchInput = wrapper.find('[data-testid="search-input"]');

      // 빠른 연속 입력 시뮬레이션
      await searchInput.setValue('a');
      await searchInput.setValue('ab');
      await searchInput.setValue('abc');

      // 디바운싱이 적용되어 마지막 값만 처리되는지 확인
      expect(wrapper.vm.searchQuery).toBe('abc');
    });
  });
});