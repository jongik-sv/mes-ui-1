<template>
  <div class="menu-tree-wrapper">
    <!-- 빈 상태 -->
    <div v-if="!treeNodes.length" class="empty-tree" data-testid="empty-tree">
      <i class="pi pi-search empty-icon"></i>
      <h3 class="empty-title">메뉴가 없습니다</h3>
      <p class="empty-description">
        {{ getEmptyMessage() }}
      </p>
    </div>

    <!-- 트리 메뉴 -->
    <Tree
      v-else
      :value="treeNodes"
      :expandedKeys="expandedKeys"
      :selectionKeys="selectionKeys"
      selectionMode="single"
      class="menu-tree"
      @node-expand="handleNodeExpand"
      @node-collapse="handleNodeCollapse"
      @node-select="handleNodeSelect"
    >
      <template #default="{ node }">
        <div class="tree-node-content">
          <!-- 메뉴 아이콘 -->
          <i 
            v-if="node.icon" 
            :class="node.icon"
            class="node-icon"
          />
          <i 
            v-else-if="node.level === 1"
            class="pi pi-folder node-icon"
          />
          <i 
            v-else-if="node.level === 2"
            class="pi pi-folder-open node-icon"
          />
          <i 
            v-else
            class="pi pi-file node-icon"
          />
          
          <!-- 메뉴 텍스트 -->
          <span 
            class="node-label"
            :class="{ 
              'node-label--leaf': node.leaf,
              'node-label--has-url': node.url
            }"
            @click="handleMenuClick(node)"
          >
            {{ highlightSearchText(node.label) }}
          </span>
          
          <!-- 즐겨찾기 버튼 -->
          <Button
            v-if="node.leaf"
            :icon="isFavorite(node.key) ? 'pi pi-star-fill' : 'pi pi-star'"
            text
            rounded
            size="small"
            class="favorite-button"
            :class="{ 'favorite-button--active': isFavorite(node.key) }"
            @click.stop="handleFavoriteToggle(node.key)"
            :title="isFavorite(node.key) ? '즐겨찾기 제거' : '즐겨찾기 추가'"
          />
        </div>
      </template>
    </Tree>

    <!-- 로딩 오버레이 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <i class="pi pi-spin pi-spinner loading-icon"></i>
        <span class="loading-text">메뉴를 불러오는 중...</span>
      </div>
    </div>

    <!-- 스크린 리더용 안내 -->
    <div 
      aria-live="polite" 
      aria-atomic="true" 
      class="sr-only"
    >
      {{ screenReaderAnnouncement }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import Tree from 'primevue/tree'
import Button from 'primevue/button'
import type { MenuItem } from '@/types/menu'

interface TreeNode {
  key: string
  label: string
  level: number
  children?: TreeNode[]
  leaf?: boolean
  icon?: string
  url?: string
  data?: MenuItem
}

interface Props {
  /** 메뉴 아이템 목록 */
  items: MenuItem[]
  /** 검색 쿼리 */
  searchQuery: string
  /** 검색 모드 */
  searchMode: 'text' | 'column'
  /** 확장된 노드 키들 */
  expandedNodes: Set<string>
  /** 즐겨찾기 노드 키들 */
  favorites: Set<string>
  /** 검색 하이라이팅 여부 */
  highlightSearch?: boolean
  /** 로딩 상태 */
  loading?: boolean
}

interface Emits {
  (e: 'node-expand', nodeId: string): void
  (e: 'node-collapse', nodeId: string): void
  (e: 'toggle-favorite', nodeId: string): void
  (e: 'menu-select', menu: MenuItem): void
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  searchQuery: '',
  searchMode: 'text',
  expandedNodes: () => new Set(),
  favorites: () => new Set(),
  highlightSearch: true,
  loading: false
})

const emit = defineEmits<Emits>()

// 내부 상태
const screenReaderAnnouncement = ref('')
const selectionKeys = ref<Record<string, boolean>>({})

// PrimeVue Tree용 확장 키 객체
const expandedKeys = computed(() => {
  const keys: Record<string, boolean> = {}
  props.expandedNodes.forEach(nodeId => {
    keys[nodeId] = true
  })
  return keys
})

// MenuItem을 TreeNode로 변환
const treeNodes = computed<TreeNode[]>(() => {
  return convertMenuItemsToTreeNodes(props.items)
})

const convertMenuItemsToTreeNodes = (items: MenuItem[]): TreeNode[] => {
  return items.map(item => {
    const node: TreeNode = {
      key: item.id,
      label: item.text,
      level: item.level,
      leaf: !item.hasItems || !item.items || item.items.length === 0,
      icon: item.icon,
      url: item.url,
      data: item
    }
    
    if (item.items && item.items.length > 0) {
      node.children = convertMenuItemsToTreeNodes(item.items)
    }
    
    return node
  })
}

// 빈 상태 메시지
const getEmptyMessage = (): string => {
  if (props.searchQuery) {
    return `'${props.searchQuery}'와 일치하는 메뉴가 없습니다`
  }
  
  return '표시할 메뉴가 없습니다'
}

// 즐겨찾기 확인
const isFavorite = (nodeKey: string): boolean => {
  return props.favorites.has(nodeKey)
}

// 검색 텍스트 하이라이팅
const highlightSearchText = (text: string) => {
  if (!props.searchQuery || !props.highlightSearch) {
    return text
  }
  
  const query = props.searchQuery.trim()
  if (!query) return text
  
  // Vue 템플릿에서 v-html을 사용하지 않고 단순 텍스트로 반환
  return text
}

// 이벤트 핸들러
const handleNodeExpand = (node: TreeNode) => {
  emit('node-expand', node.key)
}

const handleNodeCollapse = (node: TreeNode) => {
  emit('node-collapse', node.key)
}

const handleNodeSelect = (node: TreeNode) => {
  if (node.leaf && node.data) {
    emit('menu-select', node.data)
    screenReaderAnnouncement.value = `${node.label} 메뉴가 선택되었습니다`
  }
}

const handleMenuClick = (node: TreeNode) => {
  if (node.leaf && node.data) {
    emit('menu-select', node.data)
  }
}

const handleFavoriteToggle = (nodeKey: string) => {
  emit('toggle-favorite', nodeKey)
  
  // 메뉴 제목 찾기
  const findNodeLabel = (nodes: TreeNode[], key: string): string | null => {
    for (const node of nodes) {
      if (node.key === key) {
        return node.label
      }
      if (node.children) {
        const found = findNodeLabel(node.children, key)
        if (found) return found
      }
    }
    return null
  }
  
  const nodeLabel = findNodeLabel(treeNodes.value, nodeKey)
  if (nodeLabel) {
    const action = props.favorites.has(nodeKey) ? '제거' : '추가'
    screenReaderAnnouncement.value = `${nodeLabel}이(가) 즐겨찾기에서 ${action}되었습니다`
  }
}

// 컴포넌트 마운트 시 초기화
onMounted(() => {
  // 초기 안내 메시지
  if (props.items.length > 0) {
    const menuCount = countTotalMenus(props.items)
    screenReaderAnnouncement.value = `총 ${menuCount}개의 메뉴가 있습니다`
  }
})

// 총 메뉴 개수 계산 (재귀)
const countTotalMenus = (items: MenuItem[]): number => {
  let count = 0
  items.forEach(item => {
    count++
    if (item.items) {
      count += countTotalMenus(item.items)
    }
  })
  return count
}
</script>

<style lang="scss" scoped>
.menu-tree-wrapper {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

// 빈 상태
.empty-tree {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-4);
  text-align: center;
  flex: 1;
  min-height: 200px;
  
  .empty-icon {
    font-size: 4rem;
    color: var(--text-muted);
    margin-bottom: var(--space-6);
    opacity: 0.5;
  }
  
  .empty-title {
    color: var(--text-secondary);
    font-size: var(--text-lg);
    font-weight: 600;
    margin-bottom: var(--space-3);
  }
  
  .empty-description {
    color: var(--text-muted);
    font-size: var(--text-sm);
    max-width: 300px;
    line-height: 1.5;
    margin: 0;
  }
}

// 메뉴 트리 스타일링
.menu-tree {
  height: 100%;
  
  :deep(.p-tree) {
    background: transparent;
    border: none;
    padding: 0;
  }
  
  :deep(.p-treenode) {
    .p-treenode-content {
      padding: var(--space-2) var(--space-3);
      border-radius: var(--border-radius-md);
      transition: var(--transition-normal);
      
      &:hover {
        background: var(--bg-tertiary);
      }
      
      &.p-highlight {
        background: var(--primary-50);
        color: var(--primary-700);
      }
    }
    
    .p-treenode-children {
      padding-left: var(--space-4);
      border-left: 1px solid var(--surface-2);
      margin-left: var(--space-3);
    }
  }
  
  :deep(.p-tree-toggler) {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--text-secondary);
    
    &:hover {
      background: var(--bg-tertiary);
      color: var(--text-primary);
    }
  }
}

// 트리 노드 콘텐츠
.tree-node-content {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  min-width: 0;
  
  .node-icon {
    color: var(--text-secondary);
    font-size: var(--text-base);
    flex-shrink: 0;
    
    &.default-icon {
      opacity: 0.7;
    }
  }
  
  .node-label {
    flex: 1;
    color: var(--text-primary);
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
    
    &--leaf {
      font-weight: 400;
    }
    
    &--has-url {
      cursor: pointer;
      
      &:hover {
        color: var(--primary);
        text-decoration: underline;
      }
    }
    
    // 검색 하이라이팅
    :deep(.search-highlight) {
      background: var(--warning);
      color: var(--bg-primary);
      padding: 1px 3px;
      border-radius: 3px;
      font-weight: 600;
    }
  }
  
  .favorite-button {
    opacity: 0;
    transition: var(--transition-normal);
    color: var(--text-muted);
    flex-shrink: 0;
    
    &--active {
      opacity: 1;
      color: var(--warning);
    }
    
    &:hover {
      background: var(--bg-tertiary);
      color: var(--warning);
    }
  }
  
  .external-icon {
    color: var(--text-muted);
    font-size: var(--text-sm);
    flex-shrink: 0;
  }
  
  // 호버 시 즐겨찾기 버튼 표시
  &:hover .favorite-button {
    opacity: 1;
  }
}

// 로딩 오버레이
.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(var(--bg-primary-rgb), 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
  z-index: 10;
  
  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
    
    .pi-spinner {
      font-size: 2rem;
      color: var(--primary);
    }
    
    .loading-text {
      color: var(--text-secondary);
      font-size: var(--text-sm);
    }
  }
}

// 스크롤바 스타일링
.menu-tree {
  scrollbar-width: thin;
  scrollbar-color: var(--surface-3) transparent;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--surface-3);
    border-radius: 4px;
    
    &:hover {
      background: var(--surface-2);
    }
  }
}

// 접근성을 위한 숨김 텍스트
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

// 반응형 디자인
@media (max-width: 768px) {
  .tree-node-content {
    padding: var(--space-2);
    gap: var(--space-1);
    
    .node-icon {
      font-size: var(--text-sm);
    }
    
    .node-label {
      font-size: var(--text-sm);
    }
    
    .favorite-button {
      opacity: 1; // 모바일에서는 항상 표시
    }
  }
  
  :deep(.p-treenode .p-treenode-content) {
    padding: var(--space-2);
  }
  
  :deep(.p-treenode-children .p-treenode) {
    margin-left: var(--space-3);
    
    &::before {
      left: calc(-1 * var(--space-3) + var(--space-1));
    }
    
    .p-treenode-content::before {
      left: calc(-1 * var(--space-3) + var(--space-1));
      width: var(--space-2);
    }
  }
  
  .empty-tree {
    padding: var(--space-6) var(--space-3);
    min-height: 150px;
    
    .empty-icon {
      font-size: 2.5rem;
      margin-bottom: var(--space-4);
    }
    
    .empty-title {
      font-size: var(--text-base);
      margin-bottom: var(--space-2);
    }
    
    .empty-description {
      font-size: var(--text-xs);
    }
  }
}

// 고대비 모드 지원
@media (prefers-contrast: high) {
  :deep(.p-treenode .p-treenode-content) {
    border: 1px solid var(--surface-2);
    
    &.p-highlight {
      border-color: var(--primary);
      outline: 2px solid var(--primary);
      outline-offset: 1px;
    }
  }
  
  .favorite-button {
    border: 1px solid var(--surface-2);
    
    &--active {
      border-color: var(--warning);
    }
  }
}

// 모션 감소 선호 시
@media (prefers-reduced-motion: reduce) {
  :deep(.p-treenode .p-treenode-content),
  .favorite-button,
  .tree-node-content {
    transition: none;
  }
  
  .loading-overlay .pi-spinner {
    animation: none;
  }
}

// 인쇄 스타일
@media print {
  .favorite-button,
  .loading-overlay {
    display: none;
  }
  
  .tree-node-content {
    .node-label--has-url::after {
      content: ' (' attr(href) ')';
      font-size: smaller;
      color: var(--text-muted);
    }
  }
}</style>