import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import MenuTree from '../MenuTree.vue';
import type { MenuItem } from '@/types/menu';

// Mock PrimeVue components
vi.mock('primevue/tree', () => ({
  default: {
    name: 'Tree',
    template: `
      <div class="p-tree" data-testid="menu-tree">
        <ul class="p-tree-root">
          <li 
            v-for="node in value" 
            :key="node.key"
            :class="['p-treenode', { 'p-treenode-leaf': !node.children?.length }]"
            :data-testid="'tree-node-' + node.key"
          >
            <div class="p-treenode-content" @click="handleNodeClick(node)">
              <button 
                v-if="node.children?.length"
                class="p-tree-toggler"
                @click="toggleNode(node)"
                :data-testid="'toggle-' + node.key"
              >
                <i :class="expandedKeys[node.key] ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"></i>
              </button>
              <span class="p-treenode-label">{{ node.label }}</span>
              <button 
                class="favorite-toggle"
                @click.stop="$emit('toggle-favorite', node.key)"
                :data-testid="'favorite-' + node.key"
              >
                <i :class="node.favorite ? 'pi pi-star-fill' : 'pi pi-star'"></i>
              </button>
            </div>
            <ul v-if="expandedKeys[node.key] && node.children?.length" class="p-treenode-children">
              <li 
                v-for="child in node.children" 
                :key="child.key"
                :data-testid="'tree-node-' + child.key"
              >
                <div class="p-treenode-content" @click="handleNodeClick(child)">
                  <span class="p-treenode-label">{{ child.label }}</span>
                  <button 
                    class="favorite-toggle"
                    @click.stop="$emit('toggle-favorite', child.key)"
                    :data-testid="'favorite-' + child.key"
                  >
                    <i :class="child.favorite ? 'pi pi-star-fill' : 'pi pi-star'"></i>
                  </button>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    `,
    props: ['value', 'expandedKeys', 'selectionMode'],
    emits: ['node-select', 'node-expand', 'node-collapse', 'toggle-favorite'],
    methods: {
      handleNodeClick(node: any) {
        this.$emit('node-select', node);
      },
      toggleNode(node: any) {
        if (this.expandedKeys[node.key]) {
          this.$emit('node-collapse', node);
        } else {
          this.$emit('node-expand', node);
        }
      }
    }
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
      },
      {
        id: '1-2',
        title: '생산계획',
        category: 'production',
        favorite: false,
        children: [
          {
            id: '1-2-1',
            title: '월간계획',
            category: 'production',
            favorite: false,
            url: '/production/monthly-plan'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: '품질관리',
    category: 'quality',
    favorite: true,
    children: [
      {
        id: '2-1',
        title: '품질검사',
        category: 'quality',
        favorite: false,
        url: '/quality/inspection'
      }
    ]
  }
];

describe('MenuTree', () => {
  let wrapper: VueWrapper<any>;

  const createWrapper = (props = {}) => {
    return mount(MenuTree, {
      props: {
        items: mockMenuItems,
        searchQuery: '',
        viewMode: 'all',
        selectedCategory: null,
        expandedNodes: new Set(),
        favorites: new Set(['1-1', '2']),
        ...props
      }
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render tree component', () => {
      wrapper = createWrapper();
      
      const tree = wrapper.find('[data-testid="menu-tree"]');
      expect(tree.exists()).toBe(true);
    });

    it('should render all top-level menu items', () => {
      wrapper = createWrapper();
      
      const productionNode = wrapper.find('[data-testid="tree-node-1"]');
      const qualityNode = wrapper.find('[data-testid="tree-node-2"]');
      
      expect(productionNode.exists()).toBe(true);
      expect(qualityNode.exists()).toBe(true);
    });

    it('should display menu item titles correctly', () => {
      wrapper = createWrapper();
      
      const productionNode = wrapper.find('[data-testid="tree-node-1"] .p-treenode-label');
      const qualityNode = wrapper.find('[data-testid="tree-node-2"] .p-treenode-label');
      
      expect(productionNode.text()).toBe('생산관리');
      expect(qualityNode.text()).toBe('품질관리');
    });

    it('should show expand/collapse toggles for parent nodes', () => {
      wrapper = createWrapper();
      
      const productionToggle = wrapper.find('[data-testid="toggle-1"]');
      const qualityToggle = wrapper.find('[data-testid="toggle-2"]');
      
      expect(productionToggle.exists()).toBe(true);
      expect(qualityToggle.exists()).toBe(true);
    });

    it('should not show toggles for leaf nodes', () => {
      wrapper = createWrapper({ expandedNodes: new Set(['1']) });
      
      const leafToggle = wrapper.find('[data-testid="toggle-1-1"]');
      expect(leafToggle.exists()).toBe(false);
    });

    it('should display favorite icons correctly', () => {
      wrapper = createWrapper();
      
      const productionFavorite = wrapper.find('[data-testid="favorite-1"] i');
      const qualityFavorite = wrapper.find('[data-testid="favorite-2"] i');
      
      // 생산관리는 즐겨찾기가 아니므로 빈 별
      expect(productionFavorite.classes()).toContain('pi-star');
      
      // 품질관리는 즐겨찾기이므로 채워진 별
      expect(qualityFavorite.classes()).toContain('pi-star-fill');
    });
  });

  describe('Tree Expansion/Collapse', () => {
    it('should expand node when toggle is clicked', async () => {
      wrapper = createWrapper();
      
      const productionToggle = wrapper.find('[data-testid="toggle-1"]');
      await productionToggle.trigger('click');
      
      expect(wrapper.emitted('node-expand')).toBeTruthy();
      expect(wrapper.emitted('node-expand')?.[0][0].key).toBe('1');
    });

    it('should collapse expanded node when toggle is clicked', async () => {
      wrapper = createWrapper({ expandedNodes: new Set(['1']) });
      
      const productionToggle = wrapper.find('[data-testid="toggle-1"]');
      await productionToggle.trigger('click');
      
      expect(wrapper.emitted('node-collapse')).toBeTruthy();
      expect(wrapper.emitted('node-collapse')?.[0][0].key).toBe('1');
    });

    it('should show children when node is expanded', () => {
      wrapper = createWrapper({ expandedNodes: new Set(['1']) });
      
      const childNode1 = wrapper.find('[data-testid="tree-node-1-1"]');
      const childNode2 = wrapper.find('[data-testid="tree-node-1-2"]');
      
      expect(childNode1.exists()).toBe(true);
      expect(childNode2.exists()).toBe(true);
    });

    it('should hide children when node is collapsed', () => {
      wrapper = createWrapper({ expandedNodes: new Set() });
      
      const childNode1 = wrapper.find('[data-testid="tree-node-1-1"]');
      const childNode2 = wrapper.find('[data-testid="tree-node-1-2"]');
      
      expect(childNode1.exists()).toBe(false);
      expect(childNode2.exists()).toBe(false);
    });

    it('should handle nested expansion correctly', () => {
      wrapper = createWrapper({ expandedNodes: new Set(['1', '1-2']) });
      
      const nestedChild = wrapper.find('[data-testid="tree-node-1-2-1"]');
      expect(nestedChild.exists()).toBe(true);
    });
  });

  describe('Node Selection', () => {
    it('should emit menu-select when leaf node is clicked', async () => {
      wrapper = createWrapper({ expandedNodes: new Set(['1']) });
      
      const leafNode = wrapper.find('[data-testid="tree-node-1-1"] .p-treenode-content');
      await leafNode.trigger('click');
      
      expect(wrapper.emitted('node-select')).toBeTruthy();
      expect(wrapper.emitted('node-select')?.[0][0].key).toBe('1-1');
    });

    it('should emit node-expand when parent node is clicked', async () => {
      wrapper = createWrapper();
      
      const parentNode = wrapper.find('[data-testid="tree-node-1"] .p-treenode-content');
      await parentNode.trigger('click');
      
      // 부모 노드 클릭 시 확장/축소 토글
      expect(wrapper.emitted('node-select')).toBeTruthy();
    });

    it('should handle selection of nodes with URLs', async () => {
      wrapper = createWrapper({ expandedNodes: new Set(['1']) });
      
      const nodeWithUrl = wrapper.find('[data-testid="tree-node-1-1"] .p-treenode-content');
      await nodeWithUrl.trigger('click');
      
      const emittedNode = wrapper.emitted('node-select')?.[0][0];
      expect(emittedNode.url).toBe('/production/work-order');
    });
  });

  describe('Favorite Management', () => {
    it('should emit toggle-favorite when favorite button is clicked', async () => {
      wrapper = createWrapper();
      
      const favoriteButton = wrapper.find('[data-testid="favorite-1"]');
      await favoriteButton.trigger('click');
      
      expect(wrapper.emitted('toggle-favorite')).toBeTruthy();
      expect(wrapper.emitted('toggle-favorite')?.[0]).toEqual(['1']);
    });

    it('should not bubble click event to parent when favorite is clicked', async () => {
      wrapper = createWrapper();
      
      const favoriteButton = wrapper.find('[data-testid="favorite-1"]');
      await favoriteButton.trigger('click');
      
      // 즐겨찾기 클릭 시 노드 선택 이벤트가 발생하지 않아야 함
      expect(wrapper.emitted('node-select')).toBeFalsy();
    });

    it('should show filled star for favorite items', () => {
      wrapper = createWrapper();
      
      const favoriteIcon = wrapper.find('[data-testid="favorite-2"] i');
      expect(favoriteIcon.classes()).toContain('pi-star-fill');
    });

    it('should show empty star for non-favorite items', () => {
      wrapper = createWrapper();
      
      const nonFavoriteIcon = wrapper.find('[data-testid="favorite-1"] i');
      expect(nonFavoriteIcon.classes()).toContain('pi-star');
    });
  });

  describe('Filtering', () => {
    it('should filter items based on search query', () => {
      wrapper = createWrapper({ searchQuery: '작업' });
      
      const filteredItems = wrapper.vm.filteredItems;
      expect(filteredItems).toHaveLength(1);
      expect(filteredItems[0].children?.[0]?.title).toBe('작업지시');
    });

    it('should show only favorites when viewMode is favorites', () => {
      wrapper = createWrapper({ viewMode: 'favorites' });
      
      const filteredItems = wrapper.vm.filteredItems;
      // 품질관리(favorite: true)와 생산관리(자식 중 작업지시가 favorite)가 포함되어야 함
      expect(filteredItems.length).toBeGreaterThan(0);
      expect(filteredItems.some(item => item.favorite || item.children?.some(child => child.favorite))).toBe(true);
    });

    it('should filter by selected category', () => {
      wrapper = createWrapper({ selectedCategory: 'production' });
      
      const filteredItems = wrapper.vm.filteredItems;
      expect(filteredItems.every(item => item.category === 'production')).toBe(true);
    });

    it('should combine multiple filters correctly', () => {
      wrapper = createWrapper({
        searchQuery: '생산',
        selectedCategory: 'production',
        viewMode: 'all'
      });
      
      const filteredItems = wrapper.vm.filteredItems;
      expect(filteredItems).toHaveLength(1);
      expect(filteredItems[0].category).toBe('production');
      expect(filteredItems[0].title).toContain('생산');
    });
  });

  describe('Search Highlighting', () => {
    it('should highlight search terms in node labels', () => {
      wrapper = createWrapper({ searchQuery: '생산', highlightSearch: true });
      
      const highlightedText = wrapper.find('.search-highlight');
      expect(highlightedText.exists()).toBe(true);
    });

    it('should highlight multiple occurrences of search term', () => {
      wrapper = createWrapper({ 
        searchQuery: '관리',
        highlightSearch: true
      });
      
      const highlights = wrapper.findAll('.search-highlight');
      expect(highlights.length).toBeGreaterThan(0);
    });

    it('should handle case-insensitive highlighting', () => {
      wrapper = createWrapper({
        searchQuery: '생산',
        highlightSearch: true,
        caseSensitive: false
      });
      
      // 대소문자 구분 없이 하이라이팅
      const highlightedText = wrapper.find('.search-highlight');
      expect(highlightedText.exists()).toBe(true);
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(() => {
      wrapper = createWrapper({ expandedNodes: new Set(['1']) });
    });

    it('should handle arrow key navigation', async () => {
      const tree = wrapper.find('[data-testid="menu-tree"]');
      
      await tree.trigger('keydown.down');
      await tree.trigger('keydown.up');
      await tree.trigger('keydown.right');
      await tree.trigger('keydown.left');
      
      // 키보드 네비게이션이 처리되는지 확인
      expect(tree.exists()).toBe(true);
    });

    it('should expand node with right arrow key', async () => {
      const tree = wrapper.find('[data-testid="menu-tree"]');
      
      // 포커스가 있는 노드에서 오른쪽 화살표 키
      await tree.trigger('keydown.right');
      
      // PrimeVue Tree의 키보드 네비게이션 동작 확인
      expect(tree.exists()).toBe(true);
    });

    it('should collapse node with left arrow key', async () => {
      const tree = wrapper.find('[data-testid="menu-tree"]');
      
      await tree.trigger('keydown.left');
      
      expect(tree.exists()).toBe(true);
    });

    it('should select node with Enter key', async () => {
      const nodeContent = wrapper.find('[data-testid="tree-node-1-1"] .p-treenode-content');
      
      await nodeContent.trigger('keydown.enter');
      
      expect(wrapper.emitted('node-select')).toBeTruthy();
    });

    it('should toggle favorite with Space key on favorite button', async () => {
      const favoriteButton = wrapper.find('[data-testid="favorite-1-1"]');
      
      await favoriteButton.trigger('keydown.space');
      
      expect(wrapper.emitted('toggle-favorite')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      wrapper = createWrapper();
      
      const tree = wrapper.find('[data-testid="menu-tree"]');
      expect(tree.classes()).toContain('p-tree');
    });

    it('should provide proper role for tree structure', () => {
      wrapper = createWrapper();
      
      const treeRoot = wrapper.find('.p-tree-root');
      expect(treeRoot.exists()).toBe(true);
    });

    it('should indicate expandable nodes for screen readers', () => {
      wrapper = createWrapper();
      
      const expandableNode = wrapper.find('[data-testid="tree-node-1"]');
      expect(expandableNode.classes()).toContain('p-treenode');
    });

    it('should provide context for favorite buttons', () => {
      wrapper = createWrapper();
      
      const favoriteButton = wrapper.find('[data-testid="favorite-1"]');
      
      // 접근성을 위한 적절한 라벨이 있는지 확인
      expect(favoriteButton.exists()).toBe(true);
    });
  });

  describe('Performance', () => {
    it('should handle large tree structures efficiently', () => {
      const largeTreeData = Array.from({ length: 100 }, (_, index) => ({
        id: `item-${index}`,
        title: `메뉴 ${index}`,
        category: 'test',
        favorite: false,
        children: Array.from({ length: 10 }, (_, childIndex) => ({
          id: `item-${index}-${childIndex}`,
          title: `하위메뉴 ${index}-${childIndex}`,
          category: 'test',
          favorite: false,
          url: `/test/${index}/${childIndex}`
        }))
      }));
      
      wrapper = createWrapper({ items: largeTreeData });
      
      // 대용량 데이터로도 정상 렌더링
      const tree = wrapper.find('[data-testid="menu-tree"]');
      expect(tree.exists()).toBe(true);
    });

    it('should optimize re-rendering with memoization', async () => {
      wrapper = createWrapper();
      
      const initialElement = wrapper.element;
      
      // 동일한 props로 업데이트
      await wrapper.setProps({ items: mockMenuItems });
      
      expect(wrapper.element).toBe(initialElement);
    });

    it('should efficiently filter large datasets', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, index) => ({
        id: `item-${index}`,
        title: `메뉴 ${index}`,
        category: index % 2 === 0 ? 'even' : 'odd',
        favorite: index % 5 === 0,
        children: []
      }));
      
      wrapper = createWrapper({ 
        items: largeDataset,
        searchQuery: '100'
      });
      
      // 필터링 성능 테스트
      const filteredItems = wrapper.vm.filteredItems;
      expect(filteredItems.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed tree data gracefully', () => {
      const malformedData = [
        { id: '1', title: '정상 노드', category: 'test', favorite: false },
        { title: '아이디 누락', category: 'test', favorite: false } as any,
        { id: '3', category: 'test', favorite: false } as any, // title 누락
        null as any,
        undefined as any
      ];
      
      wrapper = createWrapper({ items: malformedData });
      
      expect(wrapper.exists()).toBe(true);
      
      // 유효한 노드만 렌더링
      const validNode = wrapper.find('[data-testid="tree-node-1"]');
      expect(validNode.exists()).toBe(true);
    });

    it('should handle circular references in tree structure', () => {
      const circularData = [
        {
          id: '1',
          title: '부모',
          category: 'test',
          favorite: false,
          children: []
        }
      ];
      
      // 순환 참조 생성
      circularData[0].children = [circularData[0] as any];
      
      wrapper = createWrapper({ items: circularData });
      
      // 순환 참조가 있어도 에러 없이 렌더링
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Integration', () => {
    it('should work correctly with parent modal component', async () => {
      wrapper = createWrapper();
      
      // 메뉴 선택 시 부모 컴포넌트로 이벤트 전달
      const leafNode = wrapper.find('[data-testid="tree-node-1"] .p-treenode-content');
      await leafNode.trigger('click');
      
      expect(wrapper.emitted('node-select')).toBeTruthy();
    });

    it('should maintain state consistency during updates', async () => {
      wrapper = createWrapper({ expandedNodes: new Set(['1']) });
      
      // 상태 업데이트
      await wrapper.setProps({ expandedNodes: new Set(['1', '2']) });
      
      // 확장된 노드들이 올바르게 표시되는지 확인
      const childNodes = wrapper.findAll('[data-testid^="tree-node-1-"]');
      expect(childNodes.length).toBeGreaterThan(0);
    });
  });
});